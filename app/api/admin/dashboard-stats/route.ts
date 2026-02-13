import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check admin role
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // Fetch all stats in parallel
  const [
    { count: totalProperties },
    { count: activeProperties },
    { count: totalEnquiries },
    { count: newEnquiries },
    { count: totalSubscribers },
    { count: pendingAgents },
    { data: recentProperties },
    { data: recentEnquiries },
  ] = await Promise.all([
    supabase.from("properties").select("*", { count: "exact", head: true }),
    supabase.from("properties").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("property_enquiries").select("*", { count: "exact", head: true }),
    supabase
      .from("property_enquiries")
      .select("*", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }),
    supabase.from("agent_applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase
      .from("properties")
      .select("id, title, price, location, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("property_enquiries")
      .select("id, property_id, enquiry_type, created_at, properties(title)")
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  return NextResponse.json({
    totalProperties: totalProperties || 0,
    activeProperties: activeProperties || 0,
    totalEnquiries: totalEnquiries || 0,
    newEnquiries: newEnquiries || 0,
    totalSubscribers: totalSubscribers || 0,
    pendingAgents: pendingAgents || 0,
    recentProperties: recentProperties || [],
    recentEnquiries: recentEnquiries || [],
  })
}
