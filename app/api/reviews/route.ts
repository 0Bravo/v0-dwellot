import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const property_id = searchParams.get("property_id")

    if (!property_id) {
      return NextResponse.json({ error: "Property ID is required" }, { status: 400 })
    }

    const { data: reviews, error: reviewsError } = await supabase
      .from("reviews")
      .select(`
        *,
        profiles (
          full_name,
          avatar_url
        )
      `)
      .eq("property_id", property_id)
      .order("created_at", { ascending: false })

    if (reviewsError) {
      return NextResponse.json({ error: reviewsError.message }, { status: 500 })
    }

    // Calculate average rating
    const avgRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

    return NextResponse.json({
      reviews,
      averageRating: avgRating,
      totalReviews: reviews.length,
    })
  } catch (error) {
    console.error("Reviews fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { property_id, rating, comment } = body

    if (!property_id || !rating) {
      return NextResponse.json({ error: "Property ID and rating are required" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Check if user already reviewed this property
    const { data: existing } = await supabase
      .from("reviews")
      .select("id")
      .eq("user_id", user.id)
      .eq("property_id", property_id)
      .single()

    if (existing) {
      return NextResponse.json({ error: "You have already reviewed this property" }, { status: 400 })
    }

    const { data: review, error: createError } = await supabase
      .from("reviews")
      .insert([
        {
          user_id: user.id,
          property_id,
          rating,
          comment,
        },
      ])
      .select()
      .single()

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }

    return NextResponse.json({ review })
  } catch (error) {
    console.error("Review creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
