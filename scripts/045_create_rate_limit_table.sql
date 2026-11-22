-- A rate limit that actually holds.
--
-- The one in app/api/finance-assistant/route.ts lives in a Map inside a
-- serverless instance. Twelve requests in a row from one address all returned
-- 200 in a live test, because each landed on a different instance and every
-- instance thought it was seeing the first request. That is not a rate limit,
-- it is a speed bump for a single-threaded caller.
--
-- Cloudflare would be the natural layer for this, but the free plan allows one
-- rate limiting rule and the leaked-credential check already holds it. Paying
-- for a plan to protect a small API budget is the wrong trade, so the counter
-- goes where there is already shared state: here.

CREATE TABLE IF NOT EXISTS rate_limit_counters (
  bucket       TEXT PRIMARY KEY,
  hits         INTEGER     NOT NULL DEFAULT 0,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Nothing but the service role ever touches this. RLS on with no policy means
-- anon and authenticated get nothing, and the service role bypasses RLS.
ALTER TABLE rate_limit_counters ENABLE ROW LEVEL SECURITY;

-- Claims one request against a bucket. Returns true if it is allowed.
--
-- The whole thing is a single INSERT ... ON CONFLICT so the read, the compare
-- and the write happen under one row lock. Two instances arriving together
-- serialise rather than both reading the same count.
CREATE OR REPLACE FUNCTION claim_rate_limit(
  p_bucket         TEXT,
  p_limit          INTEGER,
  p_window_seconds INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
  v_hits INTEGER;
BEGIN
  INSERT INTO rate_limit_counters AS r (bucket, hits, window_start)
  VALUES (p_bucket, 1, now())
  ON CONFLICT (bucket) DO UPDATE
    SET hits = CASE
          WHEN r.window_start < now() - make_interval(secs => p_window_seconds)
          THEN 1
          ELSE r.hits + 1
        END,
        window_start = CASE
          WHEN r.window_start < now() - make_interval(secs => p_window_seconds)
          THEN now()
          ELSE r.window_start
        END
  RETURNING r.hits INTO v_hits;

  -- One row per address adds up over months. Sweep occasionally rather than on
  -- every call, so the cost lands on roughly one request in two hundred.
  IF random() < 0.005 THEN
    DELETE FROM rate_limit_counters WHERE window_start < now() - INTERVAL '1 day';
  END IF;

  RETURN v_hits <= p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- The browser must never be able to call this: a visitor who can invoke it
-- directly can burn another visitor's allowance.
REVOKE ALL ON FUNCTION claim_rate_limit(TEXT, INTEGER, INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION claim_rate_limit(TEXT, INTEGER, INTEGER) FROM anon;
REVOKE ALL ON FUNCTION claim_rate_limit(TEXT, INTEGER, INTEGER) FROM authenticated;
GRANT EXECUTE ON FUNCTION claim_rate_limit(TEXT, INTEGER, INTEGER) TO service_role;
