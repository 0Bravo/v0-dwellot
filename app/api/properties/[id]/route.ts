import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Await the params Promise
    const params = await context.params
    const propertyId = params.id

    console.log("Fetching property ID:", propertyId)

    // Check environment variables
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Database configuration missing" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Try to fetch property by ID (handle both string and number IDs)
    const { data: property, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", propertyId)
      .eq("status", "active")
      .single()

    if (error || !property) {
      console.error("Property not found:", error?.message || "No data returned")
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Fetch agent info if available
    let agent = null
    if (property.agent_id) {
      const { data: agentData } = await supabase
        .from("users")
        .select("id, name, email, phone")
        .eq("id", property.agent_id)
        .single()

      agent = agentData
    }

    // Format response
    const response = {
      id: property.id.toString(),
      title: property.title || "",
      location: property.location || "",
      price: property.price || 0,
      listing_type: property.listing_type || "sale",
      property_type: property.property_type || "House",
      bedrooms: property.bedrooms || 0,
      bathrooms: property.bathrooms || 0,
      area: property.area || 0,
      parking: property.parking || 0,
      description: property.description || "",
      images: property.images || ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"],
      features: property.features || [],
      featured: property.featured || false,
      status: property.status || "active",
      users: agent || {
        id: "default",
        name: property.agent || "Dwellot Estates",
        email: "support@dwellot.com",
        phone: property.phone || "0302 000000",
      },
      view_count: property.view_count || 0,
      created_at: property.created_at || new Date().toISOString(),
      updated_at: property.updated_at || new Date().toISOString(),
    }

    return NextResponse.json({ property: response })
  } catch (err) {
    console.error("API Error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
