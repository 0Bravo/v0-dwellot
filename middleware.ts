// middleware.ts

import { updateSession } from "@/lib/supabase/middleware"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // This middleware will now ONLY run for routes defined in `config.matcher`.
  // Public pages and static assets will completely bypass this function.
  try {
    return await updateSession(request)
  } catch {
    // If updateSession itself throws an unexpected error, we still want to proceed
    // without blocking the user.
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    // These are the routes that require session handling (authentication).
    // The middleware (and thus updateSession) will run ONLY for these.
    // All other routes (like /properties, /about, /blog, /rent, /sell) will completely bypass.
    '/dashboard/:path*', // Matches /dashboard and any subpaths
    '/profile/:path*',   // Matches /profile and any subpaths
    '/admin/:path*',     // Matches /admin and any subpaths
    '/favorites/:path*', // Matches /favorites and any subpaths
    '/auth/:path*',      // Matches /auth and any subpaths
    
    // Explicitly allow API routes to be handled by their own handlers, not middleware.
    // The previous negative lookahead was covering it, but by being explicit here
    // we ensure the middleware only runs for paths that need `updateSession`.
    // However, if we list only protected routes, then /api will also bypass.
    // So if Supabase auth is used for API routes too, they should be covered by separate means
    // or added here if `updateSession` is relevant.
    // For now, let's assume /api routes handle auth themselves and don't need middleware.
  ],
}
