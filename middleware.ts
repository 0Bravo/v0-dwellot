import { updateSession } from "@/lib/supabase/middleware"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Allow ALL API routes - they handle their own auth
  if (pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  // Public pages that don't need auth
  const publicPages = [
    "/about",
    "/contact",
    "/blog",
    "/help",
    "/faq",
    "/privacy",
    "/terms",
    "/cookies",
    "/properties",
    "/rent",
    "/sell",
    "/agents",
    "/pricing",
    "/compare",
  ]

  // Skip auth for public pages
  if (publicPages.some(page => pathname.startsWith(page))) {
    return NextResponse.next()
  }

  try {
    return await updateSession(request)
  } catch {
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\.ico|favicon\.svg|api/|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|js|css|xml|txt|webmanifest|map|woff|woff2|ttf|eot)$).*)",
  ],
}
