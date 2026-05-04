import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    optimizeFonts: false,
    // Security: suppress "X-Powered-By: Next.js" response header
    poweredByHeader: false,
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
          contentDispositionType: "attachment",
          contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    experimental: {},
}

export default nextConfig
