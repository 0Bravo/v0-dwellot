import { NextResponse } from "next/server"
import { buildCalculatorSystemPrompt } from "@/lib/assistant/calculator-prompt"
import { TOOLS, runTool, type ToolOutcome } from "@/lib/assistant/tools"
import { allowRequest } from "@/lib/rate-limit"

/**
 * The assistant beside the mortgage calculator.
 *
 * Unlike the index assistant, this one may produce a figure for the
 * visitor's own situation — but only through the tools in lib/assistant,
 * which call the same engines the page calls. The model routes and
 * explains; it never calculates.
 *
 * Each question can take several API round trips: the model asks for a
 * tool, we run it, it reads the result, maybe asks for another. Rounds are
 * capped because each one costs, and a loop that will not terminate is
 * exactly the shape of an expensive bug.
 */

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-5-5"
const MAX_TOKENS = Number(process.env.ANTHROPIC_MAX_TOKENS) || 1200
const MAX_CHARS_PER_MESSAGE = 800
const MAX_HISTORY = 8
/** Enough for look up the rate, then calculate, then answer, with one spare. */
const MAX_TOOL_ROUNDS = 4
const WINDOW_SECONDS = 60
/** Lower than the index assistant's: one question here can be four API calls. */
const MAX_PER_WINDOW = 6

const CUT_SHORT =
  "I ran out of room before finishing that. Ask for one figure at a time and I'll get it, " +
  "or set the dials yourself and the page will show the repayment."

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

type Block =
  | { type: "text"; text: string }
  | { type: "tool_use"; id: string; name: string; input: Record<string, unknown> }
  | { type: string; [key: string]: unknown }

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "The assistant is not configured." }, { status: 503 })
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  if (!(await allowRequest(`calculator-assistant:${ip}`, MAX_PER_WINDOW, WINDOW_SECONDS))) {
    return NextResponse.json(
      { error: "That is a lot of questions at once. Give it a minute." },
      { status: 429 },
    )
  }

  let incoming: ChatMessage[]
  try {
    const body = await request.json()
    incoming = Array.isArray(body?.messages) ? body.messages : []
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 })
  }

  const cleaned = incoming
    .filter(
      (m): m is ChatMessage =>
        (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string",
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS_PER_MESSAGE) }))

  if (cleaned.length === 0 || cleaned[cleaned.length - 1].role !== "user") {
    return NextResponse.json({ error: "Ask a question." }, { status: 400 })
  }

  /* Widened from ChatMessage because tool results go back as content blocks. */
  const messages: { role: "user" | "assistant"; content: unknown }[] = [...cleaned]

  let calculatorInputs: ToolOutcome["calculatorInputs"]
  let outputTokens = 0
  let stopReason: string | undefined

  try {
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
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
          system: buildCalculatorSystemPrompt(),
          tools: TOOLS,
          messages,
        }),
      })

      if (!response.ok) {
        const detail = await response.text()
        console.error("[calculator-assistant] upstream", response.status, detail.slice(0, 400))
        return NextResponse.json(
          { error: "The assistant could not answer just now." },
          { status: 502 },
        )
      }

      const data = await response.json()
      outputTokens += data?.usage?.output_tokens ?? 0
      stopReason = typeof data?.stop_reason === "string" ? data.stop_reason : undefined
      const content: Block[] = Array.isArray(data?.content) ? data.content : []

      if (stopReason === "tool_use") {
        const calls = content.filter(
          (b): b is Extract<Block, { type: "tool_use" }> => b.type === "tool_use",
        )

        const results = []
        for (const call of calls) {
          const outcome = await runTool(call.name, call.input ?? {})
          /* The last calculate_mortgage of the turn is what the dials follow:
             if the model works through two scenarios, the visitor should end
             up looking at the one it finished on. */
          if (outcome.calculatorInputs) calculatorInputs = outcome.calculatorInputs
          results.push({ type: "tool_result", tool_use_id: call.id, content: outcome.result })
        }

        messages.push({ role: "assistant", content })
        messages.push({ role: "user", content: results })
        continue
      }

      const reply = content
        .filter((b): b is Extract<Block, { type: "text" }> => b.type === "text")
        .map((b) => (typeof b.text === "string" ? b.text : ""))
        .join("")
        .trim()

      if (stopReason === "refusal" || (stopReason === "max_tokens" && reply.length < 80)) {
        console.error("[calculator-assistant] generation stopped:", stopReason, outputTokens)
        return NextResponse.json({ reply: CUT_SHORT, calculatorInputs, stopReason, outputTokens })
      }

      if (!reply) {
        return NextResponse.json({ error: "The assistant had nothing to say." }, { status: 502 })
      }

      return NextResponse.json({ reply, calculatorInputs, stopReason, outputTokens })
    }

    /* Out of rounds. Whatever it was converging on, it is not converging fast
       enough to keep paying for. */
    console.warn("[calculator-assistant] hit the round cap", outputTokens)
    return NextResponse.json({
      reply:
        "I couldn't get that one settled. Try asking for a single figure — a price, a deposit " +
        "and a term is usually enough.",
      calculatorInputs,
      stopReason: "tool_round_cap",
      outputTokens,
    })
  } catch (error) {
    console.error("[calculator-assistant]", error)
    return NextResponse.json({ error: "The assistant is unavailable." }, { status: 502 })
  }
}
