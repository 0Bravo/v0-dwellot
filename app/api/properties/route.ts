import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"
export const revalidate = 60

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const featuredParam = searchParams.get("featured")
    const limitParam = searchParams.get("limit")
    const offsetParam = searchParams.get("offset")
    const locationParam = searchParams.get("location")
    const searchQuery = searchParams.get("search") || searchParams.get("query")
    const agentParam = searchParams.get("agent")

    const isFeaturedFilter = featuredParam === "true"
    const limit = limitParam ? Number.parseInt(limitParam) : 20
    const offset = offsetParam ? Number.parseInt(offsetParam) : 0

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Missing Supabase credentials" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    let query = supabase
      .from("properties")
      .select(
        "id, title, location, price, property_type, listing_type, bedrooms, bathrooms, area, parking, description, images, featured, status, agent, phone, view_count, created_at",
        { count: "exact" },
      )
      .eq("status", "active")

    if (isFeaturedFilter) {
      query = query.eq("featured", true)
    }

    if (locationParam) {
      query = query.ilike("location", `%${locationParam}%`)
    }

    if (agentParam) {
      query = query.ilike("agent", `%${agentParam}%`)
    }

    if (searchQuery && searchQuery.trim()) {
      query = query.or(
        `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`,
      )
    }

    query = query.range(offset, offset + limit - 1).order("created_at", { ascending: false })

    const { data, error, count } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Database query failed" }, { status: 500 })
    }

    return NextResponse.json(
      {
        success: true,
        properties: data || [],
        count: data?.length || 0,
        total: count || 0,
        hasMore: count ? offset + limit < count : false,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      },
    )
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}
