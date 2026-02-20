import { NextResponse } from "next/server"

const SITEMAP_URL = "https://dwellot.com/sitemap.xml"

export async function POST() {
  const results: { engine: string; status: string }[] = []

  // Ping Google
  try {
    const googleRes = await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
      { method: "GET" }
    )
    results.push({ engine: "Google", status: googleRes.ok ? "success" : `failed (${googleRes.status})` })
  } catch (error) {
    results.push({ engine: "Google", status: `error: ${error instanceof Error ? error.message : "unknown"}` })
  }

  // Ping Bing
  try {
    const bingRes = await fetch(
      `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
      { method: "GET" }
    )
    results.push({ engine: "Bing", status: bingRes.ok ? "success" : `failed (${bingRes.status})` })
  } catch (error) {
    results.push({ engine: "Bing", status: `error: ${error instanceof Error ? error.message : "unknown"}` })
  }

  return NextResponse.json({
    message: "Sitemap ping complete",
    sitemap: SITEMAP_URL,
    results,
    pingedAt: new Date().toISOString(),
  })
}
