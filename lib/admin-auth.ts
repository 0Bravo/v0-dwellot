import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function getAdminUser() {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Check if user has admin role in profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, email, phone, avatar_url")
    .eq("id", user.id)
    .single()

  if (!profile || profile.role !== "admin") {
    return null
  }

  return {
    id: user.id,
    email: user.email!,
    role: profile.role,
    full_name: profile.full_name,
    phone: profile.phone,
    avatar_url: profile.avatar_url,
  }
}

export async function requireAdmin() {
  const admin = await getAdminUser()
  
  if (!admin) {
    throw new Error("Unauthorized: Admin access required")
  }
  
  return admin
}
