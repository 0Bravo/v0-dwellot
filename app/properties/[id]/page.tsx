import type { Metadata } from "next"
import {
  generateEnhancedPropertyMetadata,
  generateEnhancedStructuredData,
  generateBreadcrumbSchema,
} from "@/lib/seo"
import { createAdminClient } from "@/lib/supabase/admin"
import PropertyDetailsClient from "./PropertyDetailsClient"

export const revalidate = 60

async function getProperty(id: string) {
  try {
    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from("properties")
      .select("id, title, description, price, location, property_type, listing_type, bedrooms, bathrooms, area, parking, images, amenities, featured, status, agent, phone, view_count, created_at, updated_at")
      .eq("id", Number.parseInt(id))
      .single()

    if (error || !data) return null
    return data
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const property = await getProperty(id)

  if (!property) {
    return {
      title: "Property Not Found | Dwellot Ghana",
      description: "The property you're looking for could not be found. Browse other properties in Ghana.",
    }
  }

  return generateEnhancedPropertyMetadata(property)
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const property = await getProperty(id)

  // Build JSON-LD structured data from server-fetched property
  const structuredData = property
    ? generateEnhancedStructuredData(property)
    : null

  const breadcrumbData = property
    ? generateBreadcrumbSchema([
        { name: "Home", url: "https://dwellot.com" },
        { name: "Properties", url: "https://dwellot.com/properties" },
        { name: property.location, url: `https://dwellot.com/properties?location=${encodeURIComponent(property.location)}` },
        { name: property.title, url: `https://dwellot.com/properties/${property.id}` },
      ])
    : null

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      {breadcrumbData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
        />
      )}
      <PropertyDetailsClient />
    </>
  )
}
