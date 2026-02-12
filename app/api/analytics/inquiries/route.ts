import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "7" // days

    const supabase = createClient()

    // Get inquiry statistics
    const { data: inquiries, error } = await supabase
      .from("inquiries")
      .select("id, property_id, created_at, status")
      .gte("created_at", new Date(Date.now() - Number(period) * 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false })

    if (error) throw error

    // Count by status
    const statusCounts = inquiries?.reduce(
      (acc, inquiry) => {
        acc[inquiry.status] = (acc[inquiry.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Count by day
    const dailyCounts = inquiries?.reduce(
      (acc, inquiry) => {
        const date = new Date(inquiry.created_at).toISOString().split("T")[0]
        acc[date] = (acc[date] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return NextResponse.json({
      total: inquiries?.length || 0,
      byStatus: statusCounts || {},
      byDay: dailyCounts || {},
    })
  } catch (error) {
    console.error("Error fetching inquiry analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
