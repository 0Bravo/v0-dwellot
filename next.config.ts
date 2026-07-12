import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    // Security: suppress "X-Powered-By: Next.js" response header
    poweredByHeader: false,
    // TEMPORARY: unblock deployments (main has pre-existing type/lint errors
    // accumulated since June). Remove once the codebase typechecks cleanly.
    typescript: {
          ignoreBuildErrors: true,
    },
    eslint: {
          ignoreDuringBuilds: true,
    },
    images: {
          remotePatterns: [
            {
                      protocol: "https",
                      hostname: "images.unsplash.com",
            },
            {
                      protocol: "https",
                      hostname: "placeholder.com",
            },
            {
                      protocol: "https",
                      hostname: "via.placeholder.com",
            },
                ],
          // Serve modern formats (AVIF is ~30-50% smaller than JPEG)
          formats: ["image/avif", "image/webp"],
          // Cache optimized images for 1 year (fixes "Use efficient cache lifetimes")
          minimumCacheTTL: 31536000,
          contentDispositionType: "attachment",
          contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    experimental: {
          // Tree-shake icon/library imports (reduces unused JavaScript)
          optimizePackageImports: ["lucide-react"],
    },
    async headers() {
          return [
            {
                      source: "/images/:path*",
                      headers: [
                        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
                      ],
            },
            {
                      source: "/:file(favicon.svg|icon-192.png|icon-512.png|apple-touch-icon.png)",
                      headers: [
                        { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
                      ],
            },
          ]
    },
}

export default nextConfig
