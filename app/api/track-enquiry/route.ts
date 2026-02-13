import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { property_id, enquiry_type, source_page, visitor_name, visitor_email, visitor_phone } = body

    if (!property_id || !enquiry_type) {
      return NextResponse.json({ error: "property_id and enquiry_type are required" }, { status: 400 })
    }

    const validTypes = ["whatsapp", "phone_call", "email", "contact_form", "schedule_viewing"]
    if (!validTypes.includes(enquiry_type)) {
      return NextResponse.json({ error: `Invalid enquiry_type. Must be one of: ${validTypes.join(", ")}` }, { status: 400 })
    }

    const { error } = await supabase.from("property_enquiries").insert({
      property_id: Number(property_id),
      enquiry_type,
      source_page: source_page || "unknown",
      visitor_name: visitor_name || null,
      visitor_email: visitor_email || null,
      visitor_phone: visitor_phone || null,
    })

    if (error) {
      console.error("[track-enquiry] Insert error:", error)
      return NextResponse.json({ error: "Failed to track enquiry" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[track-enquiry] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
