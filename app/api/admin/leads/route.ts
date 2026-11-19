import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"

/**
 * Admin read/update for the leads table.
 *
 * Leads are written by the service-role client (app/api/leads), so they sit
 * behind RLS and a browser client cannot read them. This route checks the
 * caller is an admin against their own session, then reads with the service
 * role, which is how app/api/admin/dashboard-stats handles the same problem.
 */

const STATUSES = ["new", "contacted", "qualified", "viewing", "won", "lost"] as const
type Status = (typeof STATUSES)[number]

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (!profile || profile.role !== "admin") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) }
  }

  return { error: null }
}

export async function GET(request: NextRequest) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const params = request.nextUrl.searchParams
  const page = Math.max(1, Number(params.get("page")) || 1)
  const perPage = Math.min(100, Math.max(1, Number(params.get("perPage")) || 25))
  const status = params.get("status")
  const source = params.get("source")
  const search = params.get("search")?.trim()

  const admin = createAdminClient()

  let query = admin
    .from("leads")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1)

  if (status && status !== "all") query = query.eq("status", status)
  if (source && source !== "all") query = query.eq("source", source)
  if (search) {
    const safe = search.replace(/[%,()]/g, "")
    if (safe) {
      query = query.or(`name.ilike.%${safe}%,email.ilike.%${safe}%,whatsapp.ilike.%${safe}%,phone.ilike.%${safe}%`)
    }
  }

  const { data, count, error } = await query

  if (error) {
    console.error("Admin leads read failed:", error)
    return NextResponse.json({ error: "Failed to load leads" }, { status: 500 })
  }

  // Counts per status, for the filter tabs. head:true so no rows come back.
  const statusCounts: Record<string, number> = {}
  await Promise.all(
    STATUSES.map(async (s) => {
      const { count: c } = await admin.from("leads").select("*", { count: "exact", head: true }).eq("status", s)
      statusCounts[s] = c || 0
    }),
  )

  const { data: sourceRows } = await admin.from("leads").select("source").limit(1000)
  const sources = Array.from(new Set((sourceRows || []).map((r) => r.source).filter(Boolean))) as string[]

  return NextResponse.json({ leads: data || [], total: count || 0, page, perPage, statusCounts, sources })
}

export async function PATCH(request: NextRequest) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  let body: { id?: string; status?: string; notes?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { id, status, notes } = body
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })

  const update: { status?: Status; notes?: string; updated_at: string } = {
    updated_at: new Date().toISOString(),
  }

  if (status !== undefined) {
    if (!STATUSES.includes(status as Status)) {
      return NextResponse.json({ error: `status must be one of: ${STATUSES.join(", ")}` }, { status: 400 })
    }
    update.status = status as Status
  }
  if (notes !== undefined) update.notes = notes

  const admin = createAdminClient()
  const { data, error } = await admin.from("leads").update(update).eq("id", id).select().single()

  if (error) {
    console.error("Admin lead update failed:", error)
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 })
  }

  return NextResponse.json({ success: true, lead: data })
}
