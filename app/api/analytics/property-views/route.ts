import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = createClient()

    // Get top viewed properties
    const { data: topViewed, error } = await supabase
      .from("properties")
      .select("id, title, location, price, images, view_count")
      .order("view_count", { ascending: false })
      .limit(10)

    if (error) throw error

    // Get view statistics
    const { data: stats } = await supabase.rpc("get_view_statistics")

    return NextResponse.json({
      topViewed: topViewed || [],
      stats: stats || {},
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
