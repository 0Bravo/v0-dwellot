import { createClient } from "@supabase/supabase-js"
import RentClient from "./RentClient"

export const revalidate = 60

const SELECT_FIELDS =
  "id, title, location, price, property_type, listing_type, bedrooms, bathrooms, area, parking, description, images, agent, phone, view_count, created_at"

async function getRentalProperties(params: Record<string, string | undefined>) {
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
    .eq("listing_type", "rent")

  if (params.property_type) {
    query = query.ilike("property_type", params.property_type)
  }
  if (params.bedrooms) {
    const beds = parseInt(params.bedrooms)
    if (beds >= 5) {
      query = query.gte("bedrooms", 5)
    } else if (beds > 0) {
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

  const sort = params.sort || "newest"
  if (sort === "price_asc") {
    query = query.order("price", { ascending: true })
  } else if (sort === "price_desc") {
    query = query.order("price", { ascending: false })
  } else {
    query = query.order("created_at", { ascending: false })
  }

  query = query.range(0, 23)

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching rental properties:", error)
    return { properties: [], total: 0 }
  }

  return { properties: data || [], total: count || 0 }
}

export default async function RentPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const params = await searchParams
  const { properties, total } = await getRentalProperties(params)

  return (
    <RentClient
      initialProperties={properties}
      initialTotal={total}
      initialFilters={{
        search: params.search || "",
        location: params.location || "",
        property_type: params.property_type || "",
        bedrooms: params.bedrooms || "",
        min_price: params.min_price || "",
        max_price: params.max_price || "",
        sort: params.sort || "newest",
      }}
    />
  )
}
