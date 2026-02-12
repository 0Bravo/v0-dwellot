import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const { data: properties } = await supabase
    .from("properties")
    .select("id, updated_at, location")
    .eq("status", "active")

  const propertyUrls =
    properties?.map((property) => ({
      url: `https://dwellot.com/properties/${property.id}`,
      lastModified: new Date(property.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) || []

  const locations = [
    "Accra",
    "East Legon",
    "Airport Hills",
    "Kumasi",
    "Tema",
    "Appolonia City",
    "Cantonments",
    "Labone",
    "Osu",
    "Ridge",
    "Roman Ridge",
    "Dzorwulu",
    "Abelemkpe",
    "Legon",
    "Achimota",
    "Dansoman",
    "Teshie",
    "Nungua",
    "Spintex",
    "Sakumono",
    "Dawhenya",
    "Devtraco Woodlands",
  ]
  const locationUrls = locations.map((location) => ({
    url: `https://dwellot.com/properties?location=${encodeURIComponent(location)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }))

  const propertyTypes = ["House", "Apartment", "Land", "Commercial", "Townhouse"]
  const propertyTypeUrls = propertyTypes.map((type) => ({
    url: `https://dwellot.com/properties?property_type=${encodeURIComponent(type)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.85,
  }))

  return [
    {
      url: "https://dwellot.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://dwellot.com/properties",
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.95,
    },
    {
      url: "https://dwellot.com/properties?listing_type=sale",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://dwellot.com/properties?listing_type=rent",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...locationUrls,
    ...propertyTypeUrls,
    {
      url: "https://dwellot.com/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://dwellot.com/blog/buying-property-ghana-2026",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: "https://dwellot.com/agents",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://dwellot.com/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://dwellot.com/contact",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://dwellot.com/faq",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...propertyUrls,
  ]
}
