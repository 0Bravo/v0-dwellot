import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { full_name, email, phone, property_type, budget_range, message } = body

    if (!full_name || !email || !phone || !property_type || !budget_range) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase.from("leads").insert([
      {
        name: full_name,
        email,
        phone,
        source: "buy-property-ghana-campaign",
        notes: `Property Type: ${property_type}\nBudget: ${budget_range}${message ? `\nMessage: ${message}` : ""}`,
        status: "new",
      },
    ])

    if (error) {
      console.error("Campaign inquiry DB error:", error)
      return NextResponse.json({ error: "Failed to save enquiry" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Campaign inquiry error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
