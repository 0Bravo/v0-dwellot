import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      name,
      email,
      phone,
      whatsapp_number,
      intent,
      property_type,
      min_budget,
      max_budget,
      bedrooms,
      preferred_locations,
      timeline,
      source,
      notes,
    } = body

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Check if lead already exists with this email
    const { data: existingLead } = await supabase
      .from("leads")
      .select("id, email")
      .eq("email", email.toLowerCase().trim())
      .single()

    if (existingLead) {
      // Update existing lead with new preferences
      const { data, error } = await supabase
        .from("leads")
        .update({
          name: name || existingLead.name,
          phone,
          whatsapp_number,
          intent,
          property_type,
          min_budget,
          max_budget,
          bedrooms,
          preferred_locations,
          timeline,
          notes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingLead.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating lead:", error)
        return NextResponse.json(
          { error: "Failed to update lead" },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: "Your preferences have been updated!",
        lead: data,
        isUpdate: true,
      })
    }

    // Create new lead
    const { data, error } = await supabase
      .from("leads")
      .insert({
        name,
        email: email.toLowerCase().trim(),
        phone,
        whatsapp_number,
        intent,
        property_type,
        min_budget,
        max_budget,
        bedrooms,
        preferred_locations,
        timeline,
        source: source || "website_modal",
        notes,
        status: "new",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating lead:", error)
      return NextResponse.json(
        { error: "Failed to create lead" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! We'll match you with perfect properties.",
      lead: data,
      isUpdate: false,
    })
  } catch (error) {
    console.error("Lead submission error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
