import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"
export const revalidate = 600

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase credentials")
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch all active properties with relevant fields
    const { data: properties, error } = await supabase
      .from("properties")
      .select("location, developer, property_type, estate_name, title")
      .eq("status", "active")
      .limit(1000)

    if (error) throw error
    if (!properties || properties.length === 0) {
      return NextResponse.json({ suggestions: [] })
    }

    // Collect unique values with counts
    const locationCounts: Record<string, number> = {}
    const developerCounts: Record<string, number> = {}
    const typeCounts: Record<string, number> = {}
    const estateCounts: Record<string, number> = {}

    properties.forEach((p) => {
      if (p.location) {
        locationCounts[p.location] = (locationCounts[p.location] || 0) + 1
      }
      if (p.developer) {
        developerCounts[p.developer] = (developerCounts[p.developer] || 0) + 1
      }
      if (p.property_type) {
        // Normalize to title case
        const normalized = p.property_type.charAt(0).toUpperCase() + p.property_type.slice(1).toLowerCase()
        typeCounts[normalized] = (typeCounts[normalized] || 0) + 1
      }
      if (p.estate_name) {
        estateCounts[p.estate_name] = (estateCounts[p.estate_name] || 0) + 1
      }
    })

    type Suggestion = {
      label: string
      type: "location" | "developer" | "property_type" | "estate"
      count: number
    }

    const suggestions: Suggestion[] = []

    // Add locations sorted by count
    Object.entries(locationCounts)
      .sort(([, a], [, b]) => b - a)
      .forEach(([label, count]) => {
        suggestions.push({ label, type: "location", count })
      })

    // Add developers sorted by count
    Object.entries(developerCounts)
      .sort(([, a], [, b]) => b - a)
      .forEach(([label, count]) => {
        suggestions.push({ label, type: "developer", count })
      })

    // Add property types sorted by count
    Object.entries(typeCounts)
      .sort(([, a], [, b]) => b - a)
      .forEach(([label, count]) => {
        suggestions.push({ label, type: "property_type", count })
      })

    // Add estate names sorted by count (deduplicate with developers)
    Object.entries(estateCounts)
      .sort(([, a], [, b]) => b - a)
      .forEach(([label, count]) => {
        // Avoid duplicate if estate name is same as developer name
        if (!developerCounts[label]) {
          suggestions.push({ label, type: "estate", count })
        }
      })

    return NextResponse.json(
      { suggestions },
      {
        headers: {
          "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
        },
      },
    )
  } catch (error) {
    console.error("Error fetching search suggestions:", error)
    return NextResponse.json({ suggestions: [] }, { status: 200 })
  }
}
