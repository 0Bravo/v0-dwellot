import type { Metadata } from "next"
import { createClient } from "@supabase/supabase-js"
import PropertiesClient from "./PropertiesClient"

export const revalidate = 60

const SELECT_FIELDS =
  "id, title, location, price, currency, property_type, listing_type, bedrooms, bathrooms, area, parking, description, images, agent, phone, view_count, created_at"

/** The canonical URL for a filtered listings page. */
function canonicalFor(filters: {
  property_type?: string
  listing_type?: string
  location?: string
}): string {
  /* encodeURIComponent, not URLSearchParams: the sitemap encodes a space as
     %20 and URLSearchParams as +. Both parse the same, but they are different
     strings to a crawler, and a canonical that does not match the submitted
     URL character for character is the bug this function exists to fix. */
  const pairs: string[] = []
  if (filters.property_type) pairs.push(`property_type=${encodeURIComponent(filters.property_type)}`)
  if (filters.listing_type) pairs.push(`listing_type=${encodeURIComponent(filters.listing_type)}`)
  if (filters.location) pairs.push(`location=${encodeURIComponent(filters.location)}`)
  return `https://dwellot.com/properties${pairs.length ? `?${pairs.join("&")}` : ""}`
}

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
  /* Without a property type this started at "for Sale & Rent", so the title
     read "for Sale & Rent in Cantonments Ghana" — a sentence with its subject
     missing, which is what a searcher saw in the result. */
  parts.push(property_type ? property_type.charAt(0).toUpperCase() + property_type.slice(1) + "s" : "Properties")
  if (listing_type === "sale") parts.push("for Sale")
  else if (listing_type === "rent") parts.push("for Rent")
  else parts.push("for Sale & Rent")
  if (location) parts.push(`in ${location}`)
  parts.push("Ghana")

  /* No brand here: the layout template appends it, and spelling it out made
     every one of these titles end "| Dwellot | Dwellot Ghana". */
  const title = parts.join(" ")
  const description = `Browse properties ${parts.join(" ").toLowerCase()}. Filter by location, price, bedrooms. Houses, apartments, land, and commercial properties on Dwellot.`

  return {
    title,
    description,
    /* Self-referential for the filters we submit in the sitemap. This was
       pinned to /properties for every filtered URL, so the sitemap asked
       Google to index 36 filtered pages while each one told Google to index
       something else instead. They could never rank. Only the three filters
       that change the page's subject are kept, in a fixed order, so sorting
       and paging still fold into the filtered page rather than spawning
       endless variants. */
    alternates: { canonical: canonicalFor({ property_type, listing_type, location }) },
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
      `title.ilike.%${params.search}%,description.ilike.%${params.search}%,location.ilike.%${params.search}%,developer.ilike.%${params.search}%,estate_name.ilike.%${params.search}%`
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
