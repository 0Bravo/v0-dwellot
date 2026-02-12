import { createClient } from "@supabase/supabase-js"

/**
 * Create a Supabase admin client using the service role key.
 * This bypasses Row Level Security (RLS) and should only be used
 * for server-side operations that need unrestricted access, such as
 * reading/writing property view counts across RLS boundaries.
 *
 * IMPORTANT: Never expose this client to the browser.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase admin environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
