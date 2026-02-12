import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Use admin client to bypass RLS for accurate view data
    const adminClient = createAdminClient()

    // Get top viewed properties ordered by view_count
    const { data: topViewed, error } = await adminClient
      .from("properties")
      .select("id, title, location, price, images, view_count")
      .order("view_count", { ascending: false })
      .limit(10)

    if (error) throw error

    // Compute view statistics inline from property_views table
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const [totalResult, todayResult] = await Promise.all([
      adminClient
        .from("property_views")
        .select("*", { count: "exact", head: true }),
      adminClient
        .from("property_views")
        .select("*", { count: "exact", head: true })
        .gte("viewed_at", todayStart.toISOString()),
    ])

    const stats = {
      total_views: totalResult.count || 0,
      views_today: todayResult.count || 0,
    }

    return NextResponse.json({
      topViewed: topViewed || [],
      stats,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
