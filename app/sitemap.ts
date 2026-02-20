import type { MetadataRoute } from "next"
import { createAdminClient } from "@/lib/supabase/admin"

export const revalidate = 3600 // Regenerate sitemap every hour

const BASE_URL = "https://dwellot.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/properties`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${BASE_URL}/properties?listing_type=sale`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/properties?listing_type=rent`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/sell`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/rent`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/agents`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/help`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/brand`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ]

  // Property type filter pages
  const propertyTypes = ["house", "apartment", "land", "commercial", "townhouse"]
  const propertyTypeUrls: MetadataRoute.Sitemap = propertyTypes.map((type) => ({
    url: `${BASE_URL}/properties?property_type=${encodeURIComponent(type)}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.85,
  }))

  // Dynamic pages from Supabase
  let propertyUrls: MetadataRoute.Sitemap = []
  let locationUrls: MetadataRoute.Sitemap = []
  let locationComboUrls: MetadataRoute.Sitemap = []

  try {
    const adminClient = createAdminClient()

    const { data: properties, error } = await adminClient
      .from("properties")
      .select("id, updated_at, location, listing_type")
      .eq("status", "active")
      .order("updated_at", { ascending: false })

    if (!error && properties) {
      // Individual property pages
      propertyUrls = properties.map((property) => ({
        url: `${BASE_URL}/properties/${property.id}`,
        lastModified: property.updated_at ? new Date(property.updated_at) : now,
        changeFrequency: "daily" as const,
        priority: 0.8,
      }))

      // Unique location pages
      const uniqueLocations = [...new Set(
        properties.map((p) => p.location).filter(Boolean)
      )]
      locationUrls = uniqueLocations.map((location) => ({
        url: `${BASE_URL}/properties?location=${encodeURIComponent(location)}`,
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.9,
      }))

      // Location + listing type combos (e.g. "for sale in East Legon", "for rent in Cantonments")
      const locationListingCombos = new Set<string>()
      for (const p of properties) {
        if (p.location && p.listing_type) {
          locationListingCombos.add(`${p.location}::${p.listing_type}`)
        }
      }
      locationComboUrls = [...locationListingCombos].map((combo) => {
        const [location, listingType] = combo.split("::")
        return {
          url: `${BASE_URL}/properties?location=${encodeURIComponent(location)}&listing_type=${listingType}`,
          lastModified: now,
          changeFrequency: "daily" as const,
          priority: 0.85,
        }
      })
    }
  } catch (error) {
    console.error("[Sitemap] Error fetching properties:", error)
  }

  return [
    ...staticPages,
    ...locationUrls,
    ...locationComboUrls,
    ...propertyTypeUrls,
    ...propertyUrls,
  ]
}
