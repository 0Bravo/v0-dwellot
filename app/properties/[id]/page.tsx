import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  generateEnhancedPropertyMetadata,
  generateEnhancedStructuredData,
  generateBreadcrumbSchema,
} from "@/lib/seo"
import { createAdminClient } from "@/lib/supabase/admin"
import PropertyDetailsClient from "./PropertyDetailsClient"
import { mapPropertyRow, type PropertyAgent } from "@/lib/properties/detail"

export const revalidate = 60

async function getProperty(id: string) {
  try {
    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from("properties")
      .select("*")
      .eq("id", Number.parseInt(id))
      .single()

    if (error || !data) return null

    // Join the agent so the server-rendered page carries the same contact
    // details the client API would have returned.
    let agent: PropertyAgent | null = null
    if (data.agent_id) {
      const { data: agentData } = await adminClient
        .from("users")
        .select("id, name, email, phone")
        .eq("id", data.agent_id)
        .single()
      agent = (agentData as PropertyAgent) ?? null
    }

    return { row: data, detail: mapPropertyRow(data, agent) }
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const result = await getProperty(id)

  if (!result) {
    return {
      title: "Property Not Found",
      description: "The property you're looking for could not be found. Browse other properties in Ghana.",
    }
  }

  return generateEnhancedPropertyMetadata(result.row)
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getProperty(id)

  if (!result) {
    notFound()
  }

  const property = result.row

  // Build JSON-LD structured data from server-fetched property
  const structuredData = generateEnhancedStructuredData(property)

  const breadcrumbData = generateBreadcrumbSchema([
    { name: "Home", url: "https://dwellot.com" },
    { name: "Properties", url: "https://dwellot.com/properties" },
    { name: property.location, url: `https://dwellot.com/properties?location=${encodeURIComponent(property.location)}` },
    { name: property.title, url: `https://dwellot.com/properties/${property.id}` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <PropertyDetailsClient initialProperty={result.detail} />
    </>
  )
}
