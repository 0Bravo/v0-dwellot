import { updateSession } from "@/lib/supabase/middleware"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    try {
          return await updateSession(request)
    } catch {
          // On auth error, redirect to login instead of passing through unauthenticated
      return NextResponse.redirect(new URL("/auth", request.url))
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
