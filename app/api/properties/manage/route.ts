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

    // Get user's profile to check role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    // Only agents and admins can manage properties
    if (!profile || !["agent", "admin"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden - Only agents and admins can manage properties" }, { status: 403 })
    }

    // Get properties for this agent (or all if admin)
    let query = supabase.from("properties").select("*").order("created_at", { ascending: false })

    if (profile.role === "agent") {
      query = query.eq("agent_id", user.id)
    }

    const { data: properties, error: propertiesError } = await query

    if (propertiesError) {
      return NextResponse.json({ error: propertiesError.message }, { status: 500 })
    }

    return NextResponse.json({ properties })
  } catch (error) {
    console.error("Properties fetch error:", error)
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

    // Get user's profile to check role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || !["agent", "admin"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden - Only agents and admins can create properties" }, { status: 403 })
    }

    const body = await request.json()

    const { data: property, error: createError } = await supabase
      .from("properties")
      .insert([
        {
          ...body,
          agent_id: user.id,
          status: "active",
        },
      ])
      .select()
      .single()

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }

    return NextResponse.json({ property })
  } catch (error) {
    console.error("Property creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
