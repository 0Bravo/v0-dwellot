import type { MetadataRoute } from "next"
import { createAdminClient } from "@/lib/supabase/admin"

const BASE_URL = "https://dwellot.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/properties`, lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
    { url: `${BASE_URL}/properties?listing_type=sale`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/properties?listing_type=rent`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/sell`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/rent`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/agents`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/blog/buying-property-ghana-2026`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/help`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/brand`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/cookies`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ]

  // Property type filter pages
  const propertyTypes = ["House", "Apartment", "Land", "Commercial", "Townhouse"]
  const propertyTypeUrls: MetadataRoute.Sitemap = propertyTypes.map((type) => ({
    url: `${BASE_URL}/properties?property_type=${encodeURIComponent(type)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.85,
  }))

  // Dynamic pages from Supabase
  let propertyUrls: MetadataRoute.Sitemap = []
  let locationUrls: MetadataRoute.Sitemap = []

  try {
    // Use admin client to bypass RLS -- sitemap runs without a user session
    const adminClient = createAdminClient()

    const { data: properties, error } = await adminClient
      .from("properties")
      .select("id, updated_at, location")
      .eq("status", "active")
      .order("updated_at", { ascending: false })

    if (!error && properties) {
      // Individual property pages
      propertyUrls = properties.map((property) => ({
        url: `${BASE_URL}/properties/${property.id}`,
        lastModified: property.updated_at ? new Date(property.updated_at) : new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      }))

      // Unique location pages derived from actual property data
      const uniqueLocations = [...new Set(
        properties.map((p) => p.location).filter(Boolean)
      )]
      locationUrls = uniqueLocations.map((location) => ({
        url: `${BASE_URL}/properties?location=${encodeURIComponent(location)}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      }))
    }
  } catch (error) {
    // If Supabase query fails, return sitemap with only static pages
    console.error("[Sitemap] Error fetching properties:", error)
  }

  return [...staticPages, ...locationUrls, ...propertyTypeUrls, ...propertyUrls]
}
