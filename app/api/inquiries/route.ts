import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { sendInquiryNotification, sendInquiryConfirmation } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { property_id, name, email, phone, message } = body

    if (!property_id || !name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get the current user if authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data: property } = await supabase
      .from("properties")
      .select("id, title, agent, email as agent_email, users(name, email)")
      .eq("id", property_id)
      .single()

    const { data: inquiry, error: createError } = await supabase
      .from("inquiries")
      .insert([
        {
          property_id,
          user_id: user?.id || null,
          name,
          email,
          phone,
          message,
          status: "pending",
        },
      ])
      .select()
      .single()

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }

    if (property) {
      const agentEmail = property.agent_email || property.users?.email || "support@dwellot.com"
      const agentName = property.agent || property.users?.name || "Agent"

      // Send notification to agent
      sendInquiryNotification({
        agentEmail,
        agentName,
        propertyTitle: property.title,
        propertyId: property.id,
        inquirerName: name,
        inquirerEmail: email,
        inquirerPhone: phone,
        message,
      }).catch((error) => console.error("Failed to send agent notification:", error))

      // Send confirmation to user
      sendInquiryConfirmation({
        userEmail: email,
        userName: name,
        propertyTitle: property.title,
        propertyId: property.id,
        agentName,
      }).catch((error) => console.error("Failed to send user confirmation:", error))
    }

    return NextResponse.json({ inquiry })
  } catch (error) {
    console.error("Inquiry creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's profile to check role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    // Get inquiries based on role
    let query = supabase
      .from("inquiries")
      .select(`
        *,
        properties (
          id,
          title,
          location,
          price
        )
      `)
      .order("created_at", { ascending: false })

    // If agent, only show inquiries for their properties
    if (profile?.role === "agent") {
      const { data: agentProperties } = await supabase.from("properties").select("id").eq("agent_id", user.id)

      const propertyIds = agentProperties?.map((p) => p.id) || []
      query = query.in("property_id", propertyIds)
    }

    const { data: inquiries, error: inquiriesError } = await query

    if (inquiriesError) {
      return NextResponse.json({ error: inquiriesError.message }, { status: 500 })
    }

    return NextResponse.json({ inquiries })
  } catch (error) {
    console.error("Inquiries fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
