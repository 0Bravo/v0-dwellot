import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { type NextRequest, NextResponse } from "next/server"

// ── Bot detection ──────────────────────────────────────────────
const BOT_PATTERNS = [
  /bot/i, /crawl/i, /spider/i, /slurp/i, /mediapartners/i,
  /lighthouse/i, /pingdom/i, /pagespeed/i, /headless/i,
  /prerender/i, /wget/i, /curl/i, /python/i, /Go-http/i,
  /Googlebot/i, /Bingbot/i, /YandexBot/i, /DuckDuckBot/i,
  /Baiduspider/i, /facebookexternalhit/i, /Twitterbot/i,
  /LinkedInBot/i, /WhatsApp/i, /Slackbot/i, /Semrush/i,
  /AhrefsBot/i, /MJ12bot/i, /Screaming Frog/i, /Bytespider/i,
  /PetalBot/i, /Sogou/i, /Applebot/i, /UptimeRobot/i,
]

function isBot(userAgent: string): boolean {
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent))
}

// ── Real IP extraction (behind Cloudflare / Vercel) ───────────
function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown"
  )
}

// ── Simple in-memory rate limiter (per-instance) ──────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 60 // max 60 view requests per IP per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return false
  }

  entry.count++
  return entry.count > RATE_LIMIT
}

// Periodically clean up stale entries
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(key)
  }
}, 60_000)

// ── Main handler ──────────────────────────────────────────────
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const propertyId = Number.parseInt(id)

    if (isNaN(propertyId)) {
      return NextResponse.json({ error: "Invalid property ID" }, { status: 400 })
    }

    const userAgent = request.headers.get("user-agent") || "unknown"
    const clientIp = getClientIp(request)

    // 1. Reject bots
    if (isBot(userAgent)) {
      return NextResponse.json({ success: true, view_count: 0, views_today: 0, bot: true })
    }

    // 2. Rate limit
    if (isRateLimited(clientIp)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const supabase = await createClient()
    const adminClient = createAdminClient()

    // Get current user if logged in
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // 3. Dedup: use existing check_recent_view RPC
    let isDuplicate = false
    try {
      const { data: isRecent } = await adminClient.rpc("check_recent_view", {
        p_property_id: propertyId,
        p_ip_address: clientIp,
        p_user_id: user?.id || null,
        p_session_id: null,
        p_hours: 1,
      })
      isDuplicate = !!isRecent
    } catch {
      // Fallback: manual dedup query if RPC fails
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
      const { data: existingView } = await adminClient
        .from("property_views")
        .select("id")
        .eq("property_id", propertyId)
        .eq("ip_address", clientIp)
        .gte("viewed_at", oneHourAgo)
        .limit(1)
        .single()
      isDuplicate = !!existingView
    }

    // 4. If NOT a duplicate, record the view and increment the counter
    if (!isDuplicate) {
      // Insert view record
      await adminClient.from("property_views").insert({
        property_id: propertyId,
        user_id: user?.id || null,
        ip_address: clientIp,
        user_agent: userAgent,
        viewed_at: new Date().toISOString(),
      })

      // Increment view_count using existing RPC
      try {
        await adminClient.rpc("increment_view_count", { p_property_id: propertyId })
      } catch {
        // Fallback: manual increment
        const { data: prop } = await adminClient
          .from("properties")
          .select("view_count")
          .eq("id", propertyId)
          .single()
        await adminClient
          .from("properties")
          .update({ view_count: (prop?.view_count || 0) + 1 })
          .eq("id", propertyId)
      }
    }

    // 5. Get current view_count from properties (source of truth after increment)
    const { data: currentProp } = await adminClient
      .from("properties")
      .select("view_count")
      .eq("id", propertyId)
      .single()

    // 6. Get today's views from property_views table
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const { count: viewsToday } = await adminClient
      .from("property_views")
      .select("*", { count: "exact", head: true })
      .eq("property_id", propertyId)
      .gte("viewed_at", todayStart.toISOString())

    return NextResponse.json({
      success: true,
      view_count: currentProp?.view_count || 0,
      views_today: viewsToday || 0,
      duplicate: isDuplicate,
    })
  } catch (error) {
    console.error("Error tracking view:", error)
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 })
  }
}
