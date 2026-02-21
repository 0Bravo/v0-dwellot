import type { MetadataRoute } from "next"
import { createAdminClient } from "@/lib/supabase/admin"

export const revalidate = 3600

const BASE_URL = "https://dwellot.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Static pages -- only real, crawlable routes (no query-string filter pages)
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/properties`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/sell`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/rent`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/agents`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/help`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/brand`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ]

  // Dynamic property pages from Supabase
  let propertyPages: MetadataRoute.Sitemap = []

  try {
    const adminClient = createAdminClient()

    const { data: properties, error } = await adminClient
      .from("properties")
      .select("id, updated_at")
      .eq("status", "active")
      .not("id", "is", null)
      .order("updated_at", { ascending: false })

    if (!error && properties) {
      // Deduplicate by ID to prevent duplicate URLs
      const unique = [...new Map(properties.map((p) => [p.id, p])).values()]

      propertyPages = unique.map((p) => ({
        url: `${BASE_URL}/properties/${p.id}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error("[Sitemap] Error fetching properties:", error)
  }

  const allPages = [...staticPages, ...propertyPages]

  console.log(
    `[Sitemap] Generated ${allPages.length} URLs (${propertyPages.length} properties + ${staticPages.length} static)`
  )

  return allPages
}
