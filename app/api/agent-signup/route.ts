import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { full_name, email, phone, company, license_number, experience, areas, bio } = body

    if (!full_name || !email || !phone) {
      return NextResponse.json({ error: "Name, email, and phone are required" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Check for duplicate email
    const { data: existing } = await supabase
      .from("agent_applications")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: "An application with this email already exists. We'll be in touch soon!" },
        { status: 409 },
      )
    }

    const { error } = await supabase.from("agent_applications").insert({
      full_name: full_name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      company: company?.trim() || null,
      license_number: license_number?.trim() || null,
      experience: experience || null,
      areas: areas || [],
      bio: bio?.trim() || null,
      status: "pending",
    })

    if (error) {
      console.error("Agent signup error:", error)
      return NextResponse.json({ error: "Failed to submit application. Please try again." }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Application submitted successfully!" })
  } catch (error) {
    console.error("Agent signup error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
