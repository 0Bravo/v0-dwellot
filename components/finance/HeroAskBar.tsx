"use client"

import { useState } from "react"
import { ArrowRight, Sparkles } from "lucide-react"

/**
 * A single-line way in, sitting in the hero.
 *
 * It takes a question and nothing else: no answer appears here. Typing
 * a sentence hands it to the assistant beside the dials and scrolls
 * there, because the answer is only half of what that panel does — the
 * other half is the dials moving to the figures behind it, and an answer
 * delivered up here would arrive with the dials a screen and a half
 * away. Same reason the panel itself is not in the hero: a conversation
 * that grows to five exchanges fights what a hero is for.
 */

const EXAMPLE = "A GH₵900k place in Tema, about 180k saved, 15 years…"

export function HeroAskBar({ onAsk }: { onAsk: (question: string) => void }) {
  const [value, setValue] = useState("")

  return (
    <form
      className="glass-panel rounded-2xl p-4 sm:p-5 shadow-2xl max-w-2xl text-left"
      onSubmit={(e) => {
        e.preventDefault()
        const text = value.trim()
        if (!text) return
        onAsk(text)
        setValue("")
      }}
    >
      <label htmlFor="hero-ask" className="flex items-center gap-2 text-white text-sm font-semibold">
        <Sparkles className="w-4 h-4 text-teal-300" aria-hidden="true" />
        Or just describe what you&apos;re looking at
      </label>
      <div className="mt-3 flex gap-2">
        <input
          id="hero-ask"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={800}
          placeholder={EXAMPLE}
          className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-teal-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="px-4 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-white font-semibold inline-flex items-center gap-1.5 whitespace-nowrap"
        >
          Work it out
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
      <p className="mt-2.5 text-xs text-teal-100/80">
        The dials below move to match, and every figure comes from this page&apos;s own calculator.
      </p>
    </form>
  )
}
