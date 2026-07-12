import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      name,
      email,
      phone,
      whatsapp: whatsapp_number,
      intent,
      property_type,
      budget_min: min_budget,
      budget_max: max_budget,
      bedrooms,
      preferred_locations,
      timeline: normalizedTimeline,
      source,
      notes,
    } = body

    // Require at least one contact channel: email or WhatsApp number
    if (!email && !whatsapp_number) {
      return NextResponse.json(
        { error: "Email or WhatsApp number is required" },
        { status: 400 }
      )
    }

    // Validate email format when provided
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (email && !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // WhatsApp-only leads get a synthetic unique email to satisfy the
    // NOT NULL/unique constraint while remaining identifiable
    const effectiveEmail = (email || `wa-${String(whatsapp_number).replace(/\D/g, "")}@leads.dwellot.com`).toLowerCase().trim()

    // Normalize timeline to the values allowed by the leads table CHECK constraint
    const TIMELINE_MAP: Record<string, string> = {
      "Immediately": "immediately",
      "Within 1 month": "1-3_months",
      "1-3 months": "1-3_months",
      "3-6 months": "3-6_months",
      "6-12 months": "6-12_months",
      "Just browsing": "just_browsing",
    }
    const normalizedTimeline = timeline ? TIMELINE_MAP[timeline] || null : null

    const supabase = createAdminClient()

    // Check if lead already exists with this email
    const { data: existingLead } = await supabase
      .from("leads")
      .select("id, email, name")
      .eq("email", effectiveEmail)
      .single()

    if (existingLead) {
      // Update existing lead with new preferences
      const { data, error } = await supabase
        .from("leads")
        .update({
          name: name || existingLead.name,
          phone,
          whatsapp: whatsapp_number,
          intent,
          property_type,
          budget_min: min_budget,
          budget_max: max_budget,
          bedrooms,
          preferred_locations,
          timeline: normalizedTimeline,
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
        email: effectiveEmail,
        phone,
        whatsapp: whatsapp_number,
        intent,
        property_type,
        budget_min: min_budget,
        budget_max: max_budget,
        bedrooms,
        preferred_locations,
        timeline: normalizedTimeline,
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
