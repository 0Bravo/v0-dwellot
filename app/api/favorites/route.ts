import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: favorites, error: favoritesError } = await supabase
      .from("favorites")
      .select(`
        *,
        properties (
          id,
          title,
          location,
          price,
          bedrooms,
          bathrooms,
          area,
          property_type,
          listing_type,
          images,
          status
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (favoritesError) {
      return NextResponse.json({ error: favoritesError.message }, { status: 500 })
    }

    return NextResponse.json({ favorites })
  } catch (error) {
    console.error("Favorites fetch error:", error)
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
    const { property_id } = body

    if (!property_id) {
      return NextResponse.json({ error: "Property ID is required" }, { status: 400 })
    }

    // Check if already favorited
    const { data: existing } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("property_id", property_id)
      .single()

    if (existing) {
      return NextResponse.json({ error: "Property already in favorites" }, { status: 400 })
    }

    const { data: favorite, error: createError } = await supabase
      .from("favorites")
      .insert([
        {
          user_id: user.id,
          property_id,
        },
      ])
      .select()
      .single()

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }

    return NextResponse.json({ favorite })
  } catch (error) {
    console.error("Favorite creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const property_id = searchParams.get("property_id")

    if (!property_id) {
      return NextResponse.json({ error: "Property ID is required" }, { status: 400 })
    }

    const { error: deleteError } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("property_id", property_id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Favorite deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
