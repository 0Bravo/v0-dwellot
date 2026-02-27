// middleware.ts

import { updateSession } from "@/lib/supabase/middleware"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const url = request.nextUrl
  
  // Enforce non-www canonical: redirect www.dwellot.com to dwellot.com
  if (url.hostname === "www.dwellot.com") {
    const newUrl = new URL(url.toString())
    newUrl.hostname = "dwellot.com"
    return NextResponse.redirect(newUrl, 301)
  }
  
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
    // Match all paths for www to non-www redirect and protected routes
    // Exclude static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|txt|xml)$).*)',
  ],
}
