"use client"

import { useRef, useState } from "react"
import { ArrowUp, Sparkles } from "lucide-react"
import { AssistantText } from "@/components/finance/AssistantText"

/**
 * A question box for this month's figures.
 *
 * Narrow by design: it answers from the published edition and says so when it
 * cannot. The suggestions are the questions the index actually holds answers
 * to, so the first thing anyone tries succeeds rather than hitting a refusal.
 */

interface Msg {
  role: "user" | "assistant"
  content: string
}

const SUGGESTIONS = [
  "What is the Ghana Reference Rate right now?",
  "Which lender has the cheapest published cedi rate?",
  "What does stamp duty cost on a GH₵1m home?",
  "Why has the policy cut not reached borrowers?",
]

export function IndexAssistant() {
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  async function send(question: string) {
    const text = question.trim()
    if (!text || busy) return

    const next: Msg[] = [...messages, { role: "user", content: text }]
    setMessages(next)
    setInput("")
    setBusy(true)
    setError(null)

    try {
      const res = await fetch("/api/finance-assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error ?? "The assistant could not answer.")
      } else {
        setMessages([...next, { role: "assistant", content: data.reply }])
      }
    } catch {
      setError("Could not reach the assistant.")
    } finally {
      setBusy(false)
      requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }))
    }
  }

  return (
    <section className="mt-8 bg-white rounded-2xl ring-1 ring-gray-200 p-6 sm:p-8">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-teal-600" aria-hidden="true" />
        Ask about this month&apos;s figures
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Answers come from the edition above and nothing else. It will tell you when the index does
        not hold something rather than guessing, and it does not give advice on what you should do.
      </p>

      {messages.length > 0 && (
        <div className="mt-5 space-y-4" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : ""}>
              <div
                className={`inline-block max-w-[90%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-teal-600 text-white text-left"
                    : "bg-gray-50 ring-1 ring-gray-200 text-gray-800"
                }`}
              >
                {m.role === "assistant" ? <AssistantText>{m.content}</AssistantText> : m.content}
              </div>
            </div>
          ))}
          {busy && <p className="text-sm text-gray-500">Checking the figures…</p>}
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
              className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm text-gray-800 transition"
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
        <label htmlFor="assistant-input" className="sr-only">
          Ask about this month&apos;s figures
        </label>
        <input
          id="assistant-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={600}
          placeholder="Ask about a rate, a fee or what it means…"
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
        Generated answers can be wrong. The figures above and the calculators are the record, and
        none of this is advice on a particular purchase or loan.
      </p>
    </section>
  )
}
