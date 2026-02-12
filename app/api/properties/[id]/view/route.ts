import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const adminClient = createAdminClient()
    const propertyId = Number.parseInt(id)

    // Get user agent and IP for tracking unique views
    const userAgent = request.headers.get("user-agent") || "unknown"
    const forwardedFor = request.headers.get("x-forwarded-for")
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown"

    // Get current user if logged in
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Check if this IP/user has viewed this property in the last hour
    // Use admin client to bypass RLS (property_views SELECT is agent-only)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

    const { data: existingView } = await adminClient
      .from("property_views")
      .select("id")
      .eq("property_id", propertyId)
      .eq("ip_address", ipAddress)
      .gte("viewed_at", oneHourAgo)
      .limit(1)
      .single()

    // Only count as new view if not viewed in last hour
    if (!existingView) {
      // Insert view record (RLS allows inserts for anyone)
      await adminClient.from("property_views").insert({
        property_id: propertyId,
        user_id: user?.id || null,
        ip_address: ipAddress,
        user_agent: userAgent,
        viewed_at: new Date().toISOString(),
      })
    }

    // Get the true total from property_views table (source of truth)
    // Use admin client to bypass RLS for accurate counts
    const { count: totalViews } = await adminClient
      .from("property_views")
      .select("*", { count: "exact", head: true })
      .eq("property_id", propertyId)

    // Sync the view_count column on properties table to match the true count
    await adminClient
      .from("properties")
      .update({ view_count: totalViews || 0 })
      .eq("id", propertyId)

    // Get today's views
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const { count: viewsToday } = await adminClient
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
