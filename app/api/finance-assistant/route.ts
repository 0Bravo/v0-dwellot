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
/* The whole output budget, thinking included. 400 was far too small: the
   model spends most of it reasoning, emits a few words of text and hits the
   ceiling, so visitors got "I can't tell you" and nothing after it. Raising
   it is the fix, not trimming the answers. Overridable without a deploy. */
const MAX_TOKENS = Number(process.env.ANTHROPIC_MAX_TOKENS) || 1200
const MAX_CHARS_PER_MESSAGE = 600
/** Only the tail of the conversation is sent; this is a FAQ, not therapy. */
const MAX_HISTORY = 8
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 8

/** Shown when generation stops before the answer does. Says the honest thing
    the model was in the middle of saying, and points at a page rather than
    pretending to weigh up anyone's circumstances. */
const CUT_SHORT =
  "I can only answer questions about the figures in this month's index, and I am not " +
  "able to tell you what to do about your own borrowing. The currency question in " +
  "particular turns on where your income is and how long you expect to hold the " +
  "property: /finance/cedi-or-dollar-mortgage sets out the trade-off, and a lender or " +
  "a licensed adviser can look at your own position. Ask me about a rate, a fee or a " +
  "repayment figure in the index and I can answer that."

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

    /* Generation does not always finish. A refusal stops it mid-sentence and
       hands back the fragment, and hitting the token ceiling does the same.
       Shipping half a sentence reads as a broken site, and on an advice-shaped
       question the severed half is exactly the half that looks like advice, so
       the fragment is replaced rather than trimmed. stopReason is returned so
       this is diagnosable from outside without a deploy. */
    const stopReason: string | undefined =
      typeof data?.stop_reason === "string" ? data.stop_reason : undefined

    if (stopReason === "refusal") {
      console.error("[finance-assistant] refusal; fragment discarded")
      return NextResponse.json({ reply: CUT_SHORT, edition: edition.editionLabel, stopReason })
    }

    if (stopReason === "max_tokens") {
      console.warn("[finance-assistant] max_tokens", data?.usage?.output_tokens)
      return NextResponse.json({
        reply: `${reply}\n\n(Cut short. Ask for one figure at a time, or see /finance/compare-mortgage-rates.)`,
        edition: edition.editionLabel,
        stopReason,
      })
    }

    return NextResponse.json({
      reply,
      edition: edition.editionLabel,
      stopReason,
      outputTokens: data?.usage?.output_tokens,
    })
  } catch (error) {
    console.error("[finance-assistant]", error)
    return NextResponse.json({ error: "The assistant is unavailable." }, { status: 502 })
  }
}
