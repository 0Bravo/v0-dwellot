import type { NextConfig } from "next"

const nextConfig: NextConfig = {
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
            {
                      protocol: "https",
                      hostname: "*.public.blob.vercel-storage.com",
            },
            {
                      protocol: "https",
                      hostname: "*.vercel-storage.com",
            },
            {
                      protocol: "https",
                      hostname: "blob.vercel-storage.com",
            },
            {
                      protocol: "https",
                      hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
            },
                ],
          contentDispositionType: "attachment",
          contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
}

export default nextConfig
