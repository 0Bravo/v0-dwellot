import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: searches, error } = await supabase
      .from("saved_searches")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ searches })
  } catch (error) {
    console.error("Error fetching saved searches:", error)
    return NextResponse.json({ error: "Failed to fetch saved searches" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, filters, emailAlerts = true, alertFrequency = "daily" } = body

    const { data: search, error } = await supabase
      .from("saved_searches")
      .insert({
        user_id: user.id,
        name,
        search_query: filters.search || null,
        location: filters.location || null,
        min_price: filters.minPrice ? Number.parseFloat(filters.minPrice) : null,
        max_price: filters.maxPrice ? Number.parseFloat(filters.maxPrice) : null,
        bedrooms: filters.bedrooms ? Number.parseInt(filters.bedrooms) : null,
        bathrooms: filters.bathrooms ? Number.parseInt(filters.bathrooms) : null,
        property_type: filters.propertyType || null,
        listing_type: filters.listingType || "all",
        email_alerts: emailAlerts,
        alert_frequency: alertFrequency,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ search }, { status: 201 })
  } catch (error) {
    console.error("Error creating saved search:", error)
    return NextResponse.json({ error: "Failed to create saved search" }, { status: 500 })
  }
}
