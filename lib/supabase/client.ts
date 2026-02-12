import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"

let supabaseClient: ReturnType<typeof createSupabaseBrowserClient> | null = null

export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Return null if environment variables are not configured
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[v0] Supabase environment variables not configured")
    return null
  }

  // Use singleton pattern to prevent multiple client instances
  if (!supabaseClient) {
    supabaseClient = createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey)
  }

  return supabaseClient
}

// Alias for backward compatibility
export const createClient = createBrowserClient
