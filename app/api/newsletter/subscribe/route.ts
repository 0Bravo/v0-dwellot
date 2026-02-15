import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const { email, name, source } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }

    // Get IP address from headers
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || 
               headersList.get("x-real-ip") || 
               null

    const supabase = await createClient()

    // Save to newsletter subscribers table
    const { error } = await supabase.from("newsletter_subscribers").insert([
      {
        email: email.toLowerCase().trim(),
        name: name || null,
        source: source || "footer",
        ip_address: ip,
        subscribed_at: new Date().toISOString(),
        status: "active",
      },
    ])

    if (error) {
      console.error("[v0] Newsletter subscription database error:", error)
      if (error.code === "23505") {
        return NextResponse.json({ error: "This email is already subscribed" }, { status: 400 })
      }
      throw error
    }

    // Send notification email to admin (non-blocking, graceful failure)
    try {
      if (process.env.RESEND_API_KEY) {
        const { Resend } = await import("resend")
        const resend = new Resend(process.env.RESEND_API_KEY)

        const fromAddress = process.env.RESEND_FROM_EMAIL || "Dwellot <onboarding@resend.dev>"
        const adminEmail = process.env.ADMIN_EMAIL || "support@dwellot.com"

        // Admin notification
        await resend.emails.send({
          from: fromAddress,
          to: adminEmail,
          subject: `New Newsletter Subscriber: ${email}`,
          html: `
            <h2>New Newsletter Subscription</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Name:</strong> ${name || "Not provided"}</p>
            <p><strong>Source:</strong> ${source || "footer"}</p>
            <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          `,
        })

        // Welcome email to subscriber
        await resend.emails.send({
          from: fromAddress,
          to: email,
          subject: "Welcome to Dwellot - Ghana Property Alerts",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #0d9488, #059669); padding: 32px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to Dwellot!</h1>
              </div>
              <div style="padding: 32px; background: #ffffff;">
                <p style="font-size: 16px; color: #374151;">Hi ${name || "there"},</p>
                <p style="font-size: 16px; color: #374151;">Thank you for subscribing to the Dwellot newsletter! You'll now receive:</p>
                <ul style="font-size: 16px; color: #374151;">
                  <li>New property listings in your preferred areas</li>
                  <li>Price drop alerts on properties you might like</li>
                  <li>Market insights and investment tips</li>
                  <li>Exclusive early access to premium listings</li>
                </ul>
                <p style="font-size: 16px; color: #374151;">Start exploring properties now:</p>
                <a href="https://dwellot.com/properties" style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Browse Properties</a>
              </div>
              <div style="padding: 16px; text-align: center; color: #9ca3af; font-size: 12px;">
                <p>Dwellot - Your trusted partner in Ghana property</p>
                <p>You can unsubscribe at any time by replying to this email.</p>
              </div>
            </div>
          `,
        })
      }
    } catch (emailError) {
      // Email sending is non-critical - log and continue
      console.error("[v0] Email sending failed (non-critical):", emailError)
    }

    return NextResponse.json({ success: true, message: "Successfully subscribed to newsletter" })
  } catch (error) {
    console.error("[v0] Newsletter subscription error:", error)
    return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 })
  }
}
