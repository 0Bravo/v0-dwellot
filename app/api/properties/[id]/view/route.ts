import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get user agent and IP for tracking unique views
    const userAgent = request.headers.get("user-agent") || "unknown"
    const forwardedFor = request.headers.get("x-forwarded-for")
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown"

    // Get current user if logged in
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Check if this IP/user has viewed this property in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

    const { data: existingView } = await supabase
      .from("property_views")
      .select("id")
      .eq("property_id", Number.parseInt(id))
      .eq("ip_address", ipAddress)
      .gte("viewed_at", oneHourAgo)
      .limit(1)
      .single()

    const propertyId = Number.parseInt(id)

    // Only count as new view if not viewed in last hour
    if (!existingView) {
      // Insert view record
      await supabase.from("property_views").insert({
        property_id: propertyId,
        user_id: user?.id || null,
        ip_address: ipAddress,
        user_agent: userAgent,
        viewed_at: new Date().toISOString(),
      })
    }

    // Always get the true total from property_views table (source of truth)
    const { count: totalViews } = await supabase
      .from("property_views")
      .select("*", { count: "exact", head: true })
      .eq("property_id", propertyId)

    // Sync the view_count column on properties table to match the true count
    await supabase
      .from("properties")
      .update({ view_count: totalViews || 0 })
      .eq("id", propertyId)

    // Get today's views
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const { count: viewsToday } = await supabase
      .from("property_views")
      .select("*", { count: "exact", head: true })
      .eq("property_id", propertyId)
      .gte("viewed_at", todayStart.toISOString())

    return NextResponse.json({
      success: true,
      view_count: totalViews || 0,
      views_today: viewsToday || 0,
    })
  } catch (error) {
    console.error("Error tracking view:", error)
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 })
  }
}
