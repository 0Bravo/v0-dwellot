import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Properties for Sale & Rent in Ghana | Browse All Listings | Dwellot",
  description: "Browse verified properties for sale and rent across Ghana. Filter by location, price, bedrooms. Houses, apartments, land, and commercial properties in Accra, Kumasi, and beyond.",
  alternates: { canonical: "https://dwellot.com/properties" },
}
import PropertiesClient from "./PropertiesClient"
import { createClient } from "@supabase/supabase-js"

async function getInitialProperties(searchQuery?: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseKey) {
    return { properties: [], total: 0 }
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  let query = supabase
    .from("properties")
    .select(
      "id, title, location, price, property_type, listing_type, bedrooms, bathrooms, area, parking, description, images, agent, phone",
      { count: "exact" },
    )
    .eq("status", "active")

  if (searchQuery && searchQuery.trim()) {
    query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`)
  } else {
    query = query.ilike("location", "%appolonia%")
  }

  query = query.order("created_at", { ascending: false }).range(0, 19)

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
  searchParams: { search?: string; query?: string }
}) {
  const searchQuery = searchParams.search || searchParams.query
  const { properties, total } = await getInitialProperties(searchQuery)

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <PropertiesClient initialProperties={properties} initialTotal={total} />
    </Suspense>
  )
}
