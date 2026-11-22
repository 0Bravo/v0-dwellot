"use client"

import { useRef, useState } from "react"
import { ArrowUp, Sparkles } from "lucide-react"
import { AssistantText } from "@/components/finance/AssistantText"
import type { MortgageCurrency } from "@/lib/mortgage/calc"

/**
 * The assistant beside the calculator.
 *
 * It does not compute anything and neither does the model behind it: every
 * figure comes back from the same engine this page uses. When it works one
 * out, the dials move to the inputs it used, so an assumption it got wrong
 * is visible on screen and can be dragged rather than argued with.
 */

export interface CalculatorInputs {
  currency: MortgageCurrency
  price: number
  deposit: number
  annualRatePct: number
  termYears: number
}

interface Msg {
  role: "user" | "assistant"
  content: string
}

const SUGGESTIONS = [
  "I'm looking at a GH₵1.2m house with 250k saved, over 20 years",
  "What rate should I assume for a cedi mortgage?",
  "How much cash do I need up front on a GH₵800k place?",
  "What changes if I put down 30% instead of 20%?",
]

export function CalculatorAssistant({
  onApply,
}: {
  /** Moves the page's dials to the inputs the assistant calculated with. */
  onApply: (inputs: CalculatorInputs) => void
}) {
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [applied, setApplied] = useState(false)
  /* The panel renders unconditionally, because the page is a client
     component and cannot read the server-only key. If the endpoint says it
     is not configured, take the panel away rather than leaving a box that
     apologises every time someone types in it. */
  const [unavailable, setUnavailable] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  async function send(question: string) {
    const text = question.trim()
    if (!text || busy) return

    const next: Msg[] = [...messages, { role: "user", content: text }]
    setMessages(next)
    setInput("")
    setBusy(true)
    setError(null)
    setApplied(false)

    try {
      const res = await fetch("/api/calculator-assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
      })
      const data = await res.json()
      if (res.status === 503) {
        setUnavailable(true)
        setMessages(messages)
      } else if (!res.ok) {
        setError(data?.error ?? "The assistant could not answer.")
      } else {
        setMessages([...next, { role: "assistant", content: data.reply }])
        if (data.calculatorInputs) {
          onApply(data.calculatorInputs as CalculatorInputs)
          setApplied(true)
        }
      }
    } catch {
      setError("Could not reach the assistant.")
    } finally {
      setBusy(false)
      requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth" }))
    }
  }

  if (unavailable) return null

  return (
    <section className="mt-8 bg-white rounded-2xl ring-1 ring-gray-200 p-6 sm:p-8">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-teal-600" aria-hidden="true" />
        Describe what you&apos;re looking at
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Say it in your own words and the dials above will move to match. Every figure is worked
        out by this page&apos;s own calculator, and every rate comes from the published index —
        nothing is estimated. It will not tell you what you can afford or what to buy.
      </p>

      {messages.length > 0 && (
        <div className="mt-5 space-y-4" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : ""}>
              <div
                className={`inline-block max-w-[90%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-teal-600 text-white text-left"
                    : "bg-gray-50 ring-1 ring-gray-200 text-gray-800"
                }`}
              >
                {m.role === "assistant" ? <AssistantText>{m.content}</AssistantText> : m.content}
              </div>
            </div>
          ))}
          {applied && !busy && (
            <p className="text-xs text-teal-700">The dials above now show these figures.</p>
          )}
          {busy && <p className="text-sm text-gray-500">Working it out…</p>}
          <div ref={endRef} />
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-amber-800 bg-amber-50 ring-1 ring-amber-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {messages.length === 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm text-gray-800 transition text-left"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        className="mt-5 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
      >
        <label htmlFor="calculator-assistant-input" className="sr-only">
          Describe the property and what you have saved
        </label>
        <input
          id="calculator-assistant-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={800}
          placeholder="A GH₵900k place in Tema, about 180k saved, 15 years…"
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900"
          disabled={busy}
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="px-4 py-3 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-semibold inline-flex items-center gap-1.5"
        >
          <span className="sr-only">Send</span>
          <ArrowUp className="w-5 h-5" aria-hidden="true" />
        </button>
      </form>

      <p className="mt-3 text-xs text-gray-500">
        Generated answers can be wrong, and an assumption it makes for you may not be yours. The
        dials and the figures they produce are the record. None of this is advice on a particular
        purchase or loan.
      </p>
    </section>
  )
}
