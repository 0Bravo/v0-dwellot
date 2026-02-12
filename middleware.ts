import { updateSession } from "@/lib/supabase/middleware"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  console.log("[v0] [Middleware] Processing:", pathname)

  try {
    const response = await updateSession(request)
    console.log("[v0] [Middleware] updateSession completed for:", pathname, "status:", response.status)
    return response
  } catch (error) {
    // If middleware fails for any reason, allow the request through
    // rather than blocking with an error response
    console.error("[v0] [Middleware] Error on", pathname, "- allowing through:", error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Only match routes that need auth session handling.
     * Exclude:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, favicon.svg
     * - Static assets (.svg, .png, .jpg, .jpeg, .gif, .webp, .ico, .json, .js, .css, .xml, .txt, .webmanifest)
     * - API routes (handle their own auth)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|favicon\\.svg|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|js|css|xml|txt|webmanifest|map|woff|woff2|ttf|eot)$).*)",
  ],
}
