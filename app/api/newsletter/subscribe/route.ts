import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Save to newsletter subscribers table
    const { error } = await supabase.from("newsletter_subscribers").insert([
      {
        email,
        name: name || null,
        subscribed_at: new Date().toISOString(),
        status: "active",
      },
    ])

    if (error) {
      console.error("[v0] Newsletter subscription database error:", error)
      // Check if already subscribed
      if (error.code === "23505") {
        return NextResponse.json({ error: "Email already subscribed" }, { status: 400 })
      }
      throw error
    }

    // Send welcome email (optional)
    // await sendWelcomeEmail({ email, name: name || 'there' })

    return NextResponse.json({ success: true, message: "Successfully subscribed to newsletter" })
  } catch (error) {
    console.error("[v0] Newsletter subscription error:", error)
    return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 })
  }
}
