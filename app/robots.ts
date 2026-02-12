import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/dashboard/",
          "/auth/",
          "/api/",
          "/profile/",
          "/favorites/",
          "/test-connection/",
        ],
      },
    ],
    sitemap: "https://dwellot.com/sitemap.xml",
  }
}
