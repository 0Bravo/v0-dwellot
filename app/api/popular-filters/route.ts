import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"
export const revalidate = 300

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase credentials")
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: properties, error } = await supabase
      .from("properties")
      .select("price, bedrooms, location")
      .eq("status", "active")
      .ilike("location", "%appolonia%")
      .limit(100)

    if (error) throw error

    if (!properties || properties.length === 0) {
      return NextResponse.json({
        priceRange: "Under $500K",
        bedrooms: "3",
        location: "Appolonia City",
        locationCount: 0,
      })
    }

    const priceRanges: Record<string, number> = {}
    properties.forEach((p) => {
      const price = Number(p.price)
      let range = "Over $1M"
      if (price < 100000) range = "Under $100K"
      else if (price < 250000) range = "Under $250K"
      else if (price < 500000) range = "Under $500K"
      else if (price < 1000000) range = "Under $1M"

      priceRanges[range] = (priceRanges[range] || 0) + 1
    })

    const topPriceRange = Object.entries(priceRanges).sort(([, a], [, b]) => b - a)[0]

    const bedroomCounts: Record<number, number> = {}
    properties.forEach((p) => {
      if (p.bedrooms) {
        bedroomCounts[p.bedrooms] = (bedroomCounts[p.bedrooms] || 0) + 1
      }
    })

    const topBedrooms = Object.entries(bedroomCounts).sort(([, a], [, b]) => b - a)[0]

    const locationCounts: Record<string, number> = {}
    properties.forEach((p) => {
      if (p.location) {
        locationCounts[p.location] = (locationCounts[p.location] || 0) + 1
      }
    })

    const topLocation = Object.entries(locationCounts).sort(([, a], [, b]) => b - a)[0]

    return NextResponse.json(
      {
        priceRange: topPriceRange?.[0] || "Under $500K",
        bedrooms: topBedrooms?.[0] || "3",
        location: topLocation?.[0] || "Appolonia City",
        locationCount: topLocation?.[1] || 0,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    )
  } catch (error) {
    console.error("Error fetching popular filters:", error)
    return NextResponse.json(
      {
        priceRange: "Under $500K",
        bedrooms: "3",
        location: "Appolonia City",
        locationCount: 13,
      },
      { status: 200 },
    )
  }
}
