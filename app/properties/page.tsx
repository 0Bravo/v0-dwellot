import type { Metadata } from "next"
import { createClient } from "@supabase/supabase-js"
import PropertiesClient from "./PropertiesClient"

export const dynamic = "force-dynamic"
export const revalidate = 60

const SELECT_FIELDS =
  "id, title, location, price, property_type, listing_type, bedrooms, bathrooms, area, parking, description, images, agent, phone, view_count, created_at"

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}): Promise<Metadata> {
  const params = await searchParams
  const location = params.location
  const listing_type = params.listing_type
  const property_type = params.property_type

  const parts: string[] = []
  if (property_type) parts.push(property_type.charAt(0).toUpperCase() + property_type.slice(1) + "s")
  if (listing_type === "sale") parts.push("for Sale")
  else if (listing_type === "rent") parts.push("for Rent")
  else parts.push("for Sale & Rent")
  if (location) parts.push(`in ${location}`)
  parts.push("Ghana")

  const title = parts.length > 1 ? `${parts.join(" ")} | Dwellot` : "Properties for Sale & Rent in Ghana | Dwellot"
  const description = `Browse verified properties ${parts.join(" ").toLowerCase()}. Filter by location, price, bedrooms. Houses, apartments, land, and commercial properties on Dwellot.`

  return {
    title,
    description,
    alternates: { canonical: "https://dwellot.com/properties" },
  }
}

async function getInitialProperties(params: Record<string, string | undefined>) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return { properties: [], total: 0 }
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  let query = supabase
    .from("properties")
    .select(SELECT_FIELDS, { count: "exact" })
    .eq("status", "active")

  // Apply filters from URL search params
  if (params.listing_type && params.listing_type !== "all") {
    query = query.eq("listing_type", params.listing_type)
  }
  if (params.property_type) {
    query = query.ilike("property_type", params.property_type)
  }
  if (params.bedrooms !== undefined && params.bedrooms !== "") {
    const beds = parseInt(params.bedrooms)
    if (beds >= 5) {
      query = query.gte("bedrooms", 5)
    } else {
      query = query.eq("bedrooms", beds)
    }
  }
  if (params.min_price) {
    query = query.gte("price", parseInt(params.min_price))
  }
  if (params.max_price) {
    query = query.lte("price", parseInt(params.max_price))
  }
  if (params.location) {
    query = query.ilike("location", `%${params.location}%`)
  }
  if (params.search) {
    query = query.or(
      `title.ilike.%${params.search}%,description.ilike.%${params.search}%,location.ilike.%${params.search}%`
    )
  }

  // Sort
  const sort = params.sort || "newest"
  if (sort === "price_asc") {
    query = query.order("price", { ascending: true })
  } else if (sort === "price_desc") {
    query = query.order("price", { ascending: false })
  } else {
    query = query.order("created_at", { ascending: false })
  }

  // Initial page of 24
  query = query.range(0, 23)

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching properties:", error)
    return { properties: [], total: 0 }
  }

  return { properties: data || [], total: count || 0 }
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const params = await searchParams
  const { properties, total } = await getInitialProperties(params)

  return (
    <PropertiesClient
      initialProperties={properties}
      initialTotal={total}
      initialFilters={{
        search: params.search || "",
        location: params.location || "",
        listing_type: params.listing_type || "all",
        property_type: params.property_type || "",
        bedrooms: params.bedrooms || "",
        min_price: params.min_price || "",
        max_price: params.max_price || "",
        sort: params.sort || "newest",
      }}
    />
  )
}
