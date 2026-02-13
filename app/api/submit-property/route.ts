import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      title,
      property_type,
      listing_type,
      price,
      location,
      description,
      bedrooms,
      bathrooms,
      area,
      amenities,
      images,
      agent,
      phone,
      email,
      submitter_type,
    } = body

    // Validate required fields
    if (!title || !property_type || !listing_type || !price || !location || !description) {
      return NextResponse.json(
        { error: "Missing required fields: title, property_type, listing_type, price, location, description" },
        { status: 400 },
      )
    }

    if (!agent || !phone || !email) {
      return NextResponse.json(
        { error: "Missing contact information: name, phone, email" },
        { status: 400 },
      )
    }

    if (description.length < 50) {
      return NextResponse.json(
        { error: "Description must be at least 50 characters" },
        { status: 400 },
      )
    }

    // Use service role to bypass RLS (properties_insert_agents policy)
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    const { data, error } = await supabaseAdmin
      .from("properties")
      .insert({
        title,
        property_type,
        listing_type,
        price: parseFloat(price),
        location,
        description,
        bedrooms: bedrooms || 0,
        bathrooms: bathrooms || 0,
        area: area || null,
        amenities: amenities || [],
        images: images || [],
        status: "pending",
        agent: `${agent} (${submitter_type || "Owner"})`,
        phone,
        featured: false,
        view_count: 0,
      })
      .select("id")
      .single()

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json(
        { error: "Failed to submit property. Please try again." },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      id: data.id,
      message: "Property submitted successfully! Our team will review and publish within 24 hours.",
    })
  } catch (error) {
    console.error("Submit property error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    )
  }
}
