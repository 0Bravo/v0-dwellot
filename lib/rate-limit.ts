import { createAdminClient } from "@/lib/supabase/admin"

/**
 * A rate limit shared across serverless instances.
 *
 * The in-memory version it replaces counted per instance, so twelve requests
 * in a row from one address all got through: each landed somewhere that
 * thought it was seeing the first one.
 *
 * Two gates, cheapest first. The in-memory one catches a caller hammering a
 * warm instance without touching the database. The database one catches
 * everything else, including a caller spread across instances.
 *
 * It fails OPEN. A Supabase hiccup should not take the feature down, and the
 * spend cap on the API account is what actually bounds the damage — this
 * bounds how fast someone can reach it.
 */

interface LocalEntry {
  count: number
  resetAt: number
}

const local = new Map<string, LocalEntry>()

function localAllows(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = local.get(key)
  if (!entry || now > entry.resetAt) {
    local.set(key, { count: 1, resetAt: now + windowMs })
    if (local.size > 5000) local.clear()
    return true
  }
  entry.count += 1
  return entry.count <= limit
}

export async function allowRequest(
  bucket: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  if (!localAllows(bucket, limit, windowSeconds * 1000)) return false

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.rpc("claim_rate_limit", {
      p_bucket: bucket,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    })
    if (error) {
      /* Until 045_create_rate_limit_table.sql is applied this is where we
         land, every request. Loud enough to notice, quiet enough to ship. */
      console.warn("[rate-limit] shared counter unavailable:", error.message)
      return true
    }
    return data !== false
  } catch (err) {
    console.warn("[rate-limit] shared counter threw:", err)
    return true
  }
}
