import type { Metadata } from "next"
import { generateEnhancedPropertyMetadata } from "@/lib/seo"
import PropertyDetailsClient from "./PropertyDetailsClient"

interface Property {
  id: string
  title: string
  location: string
  price: number
  listing_type: string
  property_type: string
  bedrooms: number
  bathrooms: number
  area: number
  parking: number
  description: string
  images: string[]
  features: string[]
  featured: boolean
  status: string
  users: {
    id: string
    name: string
    email: string
    phone: string
  }
  created_at: string
  updated_at: string
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/properties/${id}`,
      {
        cache: "no-store",
      },
    )

    if (!response.ok) {
      return {
        title: "Property Not Found | Dwellot Ghana",
        description: "The property you're looking for could not be found. Browse other properties in Ghana.",
      }
    }

    const property = await response.json()
    return generateEnhancedPropertyMetadata(property)
  } catch (error) {
    return {
      title: "Property | Dwellot Ghana",
      description: "View property details on Dwellot - Ghana's #1 property marketplace",
    }
  }
}

export default function PropertyDetailPage() {
  return <PropertyDetailsClient />
}
