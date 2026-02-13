import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase is not configured, allow request to proceed without auth
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  try {
    // Create a new Supabase client for each request
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    })

    // IMPORTANT: Do not run code between createServerClient and supabase.auth.getUser()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Admin dashboard - check for admin role
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      console.log("[v0] [Middleware] Dashboard access attempt", { hasUser: !!user, path: request.nextUrl.pathname })
      
      if (!user) {
        console.log("[v0] [Middleware] No user - redirecting to /")
        const url = request.nextUrl.clone()
        url.pathname = "/"
        return NextResponse.redirect(url)
      }
      
      // Check admin role from profiles table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()
      
      console.log("[v0] [Middleware] Profile check", { 
        userId: user.id, 
        profile, 
        profileError,
        role: profile?.role 
      })
      
      if (!profile || profile.role !== "admin") {
        console.log("[v0] [Middleware] Not admin - redirecting to /")
        const url = request.nextUrl.clone()
        url.pathname = "/"
        return NextResponse.redirect(url)
      }
      
      console.log("[v0] [Middleware] Admin access granted")
    }

    // Protected routes - redirect to login if not authenticated
    const protectedPaths = ["/profile", "/favorites"]
    const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

    if (isProtectedPath && !user) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      url.searchParams.set("redirectTo", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    // Redirect authenticated users away from auth pages
    if (user && request.nextUrl.pathname.startsWith("/auth/")) {
      // Check if user is admin first
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()
      
      const url = request.nextUrl.clone()
      // Redirect admins to dashboard, others to homepage
      url.pathname = profile?.role === "admin" ? "/dashboard" : "/"
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (error) {
    console.error("[Middleware] Auth error:", error)
    return supabaseResponse
  }
}
