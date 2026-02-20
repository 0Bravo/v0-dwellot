-- Add indexes for property_views dedup lookups
-- The view API checks: property_id + ip_hash + viewed_at > (now - 24h)

CREATE INDEX IF NOT EXISTS idx_property_views_dedup
  ON property_views (property_id, ip_hash, viewed_at DESC);

CREATE INDEX IF NOT EXISTS idx_property_views_property_id
  ON property_views (property_id);
