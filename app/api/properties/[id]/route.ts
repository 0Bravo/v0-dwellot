import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { mapPropertyRow } from "@/lib/properties/detail"

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

    const response = mapPropertyRow(property, agent)

    return NextResponse.json({ property: response })
  } catch (err) {
    console.error("API Error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
