/**
 * Shared shape and mapping for a single property.
 *
 * Used by the property detail API route and by the property page's server
 * component, so the HTML rendered on the server matches exactly what the
 * client would have fetched. Keeping one mapper here stops the two drifting.
 */

export interface PropertyAgent {
  id: string
  name: string
  email: string
  phone: string
}

export interface PropertyDetail {
  id: string
  title: string
  location: string
  price: number
  currency?: string | null
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
  users: PropertyAgent
  view_count: number
  enquiry_count?: number
  created_at: string
  updated_at: string
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"

/** Map a raw `properties` row (plus any joined agent) to the client shape. */
export function mapPropertyRow(
  row: Record<string, unknown>,
  agent?: PropertyAgent | null,
): PropertyDetail {
  const value = <T,>(key: string, fallback: T): T => (row[key] as T) ?? fallback

  return {
    id: String(row.id ?? ""),
    title: value("title", ""),
    location: value("location", ""),
    price: value("price", 0),
    currency: (row.currency as string | null) ?? null,
    listing_type: value("listing_type", "sale"),
    property_type: value("property_type", "House"),
    bedrooms: value("bedrooms", 0),
    bathrooms: value("bathrooms", 0),
    area: value("area", 0),
    parking: value("parking", 0),
    description: value("description", ""),
    images: value<string[]>("images", []).length ? value<string[]>("images", []) : [FALLBACK_IMAGE],
    features: value<string[]>("features", []),
    featured: value("featured", false),
    status: value("status", "active"),
    users: agent || {
      id: "default",
      name: (row.agent as string) || "Dwellot Estates",
      email: "support@dwellot.com",
      phone: (row.phone as string) || "0302 000000",
    },
    view_count: value("view_count", 0),
    enquiry_count: value("enquiry_count", 0),
    created_at: value("created_at", new Date().toISOString()),
    updated_at: value("updated_at", new Date().toISOString()),
  }
}
