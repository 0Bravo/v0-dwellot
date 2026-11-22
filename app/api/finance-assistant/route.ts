import { NextResponse } from "next/server"
import { buildFinanceIndexEdition } from "@/lib/finance/index-edition"
import { buildSystemPrompt } from "@/lib/finance/assistant-prompt"

/**
 * The index assistant.
 *
 * Narrow on purpose: it answers questions about this month's published
 * figures and refuses everything else. The system prompt is built server-side
 * from the same edition the page renders, so the assistant and the page
 * cannot disagree, and the prompt never reaches the browser.
 *
 * Caps, because a public endpoint that calls a model is someone else's free
 * API unless you stop it: short answers, a short history, a length limit on
 * what a visitor can send, and a per-IP rate limit.
 */

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-5-5"
const MAX_TOKENS = 400
const MAX_CHARS_PER_MESSAGE = 600
/** Only the tail of the conversation is sent; this is a FAQ, not therapy. */
const MAX_HISTORY = 8
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 8

/* Per-instance and therefore approximate: serverless runs many copies, so a
   determined caller gets MAX_PER_WINDOW per instance rather than overall. It
   stops casual abuse and costs nothing. A shared store is the real fix if
   this ever matters. */
const hits = new Map<string, { count: number; resetAt: number }>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = hits.get(ip)
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    if (hits.size > 5000) hits.clear()
    return false
  }
  entry.count += 1
  return entry.count > MAX_PER_WINDOW
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "The assistant is not configured." }, { status: 503 })
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "That is a lot of questions at once. Give it a minute." },
      { status: 429 },
    )
  }

  let messages: ChatMessage[]
  try {
    const body = await request.json()
    messages = Array.isArray(body?.messages) ? body.messages : []
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 })
  }

  const cleaned = messages
    .filter(
      (m): m is ChatMessage =>
        (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string",
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS_PER_MESSAGE) }))

  if (cleaned.length === 0 || cleaned[cleaned.length - 1].role !== "user") {
    return NextResponse.json({ error: "Ask a question." }, { status: 400 })
  }

  try {
    const edition = await buildFinanceIndexEdition()

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: buildSystemPrompt(edition),
        messages: cleaned,
      }),
    })

    if (!response.ok) {
      const detail = await response.text()
      console.error("[finance-assistant] upstream", response.status, detail.slice(0, 400))
      return NextResponse.json(
        { error: "The assistant could not answer just now." },
        { status: 502 },
      )
    }

    const data = await response.json()
    const reply =
      Array.isArray(data?.content)
        ? data.content
            .filter((b: { type?: string }) => b?.type === "text")
            .map((b: { text?: string }) => b.text ?? "")
            .join("")
            .trim()
        : ""

    if (!reply) {
      return NextResponse.json({ error: "The assistant had nothing to say." }, { status: 502 })
    }

    return NextResponse.json({ reply, edition: edition.editionLabel })
  } catch (error) {
    console.error("[finance-assistant]", error)
    return NextResponse.json({ error: "The assistant is unavailable." }, { status: 502 })
  }
}
