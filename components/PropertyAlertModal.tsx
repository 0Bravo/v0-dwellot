"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { X, CheckCircle2, Loader2, Bell, MessageCircle, MapPin } from "lucide-react"
import { usePathname } from "next/navigation"
import { trackLead } from "@/lib/facebook-pixel"
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext"

const GHANA_LOCATIONS = [
  "Accra", "East Legon", "Airport Residential", "Cantonments", "Labone",
  "Osu", "Ridge", "Tema", "Kumasi", "Takoradi", "Spintex", "Trassaco",
  "Adjiringanor", "Roman Ridge", "Dzorwulu", "North Legon", "Madina", "Achimota",
]

const BUDGET_RANGES = [
  { label: "Under $50K", min: 0, max: 50000 },
  { label: "$50K - $100K", min: 50000, max: 100000 },
  { label: "$100K - $200K", min: 100000, max: 200000 },
  { label: "$200K - $500K", min: 200000, max: 500000 },
  { label: "$500K+", min: 500000, max: null },
]

const STORAGE_KEYS = {
  submitted: "dwellot_alert_submitted",
  dismissCount: "dwellot_alert_dismiss_count",
  lastShown: "dwellot_alert_last_shown",
} as const

const MAX_DISMISSALS = 2
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000 // 7 days after dismissal
const MIN_PROPERTIES_VIEWED = 3

function getStorageInt(key: string, fallback = 0): number {
  try {
    return parseInt(localStorage.getItem(key) || String(fallback), 10)
  } catch {
    return fallback
  }
}

function hasSubmitted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.submitted) === "true"
  } catch {
    return false
  }
}

function isEligible(): boolean {
  if (hasSubmitted()) return false
  if (getStorageInt(STORAGE_KEYS.dismissCount) >= MAX_DISMISSALS) return false
  const lastShown = getStorageInt(STORAGE_KEYS.lastShown)
  if (lastShown && Date.now() - lastShown < COOLDOWN_MS) return false
  return true
}

export default function PropertyAlertModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const exitIntentFired = useRef(false)
  const scrollFired = useRef(false)
  const pathname = usePathname()
  const { recentlyViewed } = useRecentlyViewed()

  const [intent, setIntent] = useState<"buy" | "rent" | "">("")
  const [locations, setLocations] = useState<string[]>([])
  const [budget, setBudget] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const openIfEligible = useCallback(() => {
    if (isEligible() && !isOpen) setIsOpen(true)
  }, [isOpen])

  // Reset one-shot triggers on navigation
  useEffect(() => {
    scrollFired.current = false
    exitIntentFired.current = false
  }, [pathname])

  // Engagement trigger: opened after browsing several properties
  useEffect(() => {
    if (recentlyViewed.length >= MIN_PROPERTIES_VIEWED) {
      const timer = setTimeout(openIfEligible, 2000)
      return () => clearTimeout(timer)
    }
  }, [recentlyViewed.length, openIfEligible])

  // Scroll trigger on listing pages only
  useEffect(() => {
    if (!pathname.startsWith("/properties") && pathname !== "/rent" && pathname !== "/buy-property-ghana") return

    const handleScroll = () => {
      if (scrollFired.current || isOpen) return
      const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight
      if (scrollPercent > 0.6) {
        scrollFired.current = true
        openIfEligible()
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname, isOpen, openIfEligible])

  // Exit-intent (desktop)
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (exitIntentFired.current || isOpen) return
      if (e.clientY <= 5) {
        exitIntentFired.current = true
        openIfEligible()
      }
    }
    document.addEventListener("mouseleave", handleMouseLeave)
    return () => document.removeEventListener("mouseleave", handleMouseLeave)
  }, [isOpen, openIfEligible])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Pre-select from browsing history
  useEffect(() => {
    if (!isOpen || recentlyViewed.length === 0) return
    if (locations.length === 0) {
      const seen = recentlyViewed
        .map((p) => GHANA_LOCATIONS.find((l) => p.location?.includes(l)))
        .filter((l): l is string => Boolean(l))
      setLocations([...new Set(seen)].slice(0, 3))
    }
    if (!intent) {
      const renting = recentlyViewed.filter((p) => p.listing_type === "rent").length
      setIntent(renting > recentlyViewed.length / 2 ? "rent" : "buy")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const handleDismiss = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.dismissCount, String(getStorageInt(STORAGE_KEYS.dismissCount) + 1))
    localStorage.setItem(STORAGE_KEYS.lastShown, String(Date.now()))
    setIsOpen(false)
  }, [])

  const toggleLocation = (location: string) => {
    setLocations((prev) =>
      prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location].slice(0, 3)
    )
  }

  const criteriaSummary = () => {
    const parts: string[] = []
    if (intent) parts.push(intent === "buy" ? "Buying" : "Renting")
    if (locations.length) parts.push(`in ${locations.join(", ")}`)
    if (budget) parts.push(`budget ${budget}`)
    return parts.join(" · ")
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setMessage("")

      const cleaned = whatsapp.replace(/[\s\-()]/g, "")
      if (!/^\+?\d{9,15}$/.test(cleaned)) {
        setStatus("error")
        setMessage("Please enter a valid WhatsApp number")
        return
      }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setStatus("error")
        setMessage("Please enter a valid email address")
        return
      }

      setStatus("loading")

      try {
        const budgetRange = BUDGET_RANGES.find((b) => b.label === budget)

        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email: email || undefined,
            phone: cleaned,
            whatsapp_number: cleaned,
            intent,
            min_budget: budgetRange?.min,
            max_budget: budgetRange?.max,
            preferred_locations: locations,
            source: "whatsapp_alerts_modal",
          }),
        })

        const data = await response.json()

        if (response.ok) {
          setStatus("success")
          setMessage("You're on the list! Opening WhatsApp...")
          localStorage.setItem(STORAGE_KEYS.submitted, "true")

          trackLead({
            content_name: "WhatsApp Property Alerts",
            content_category: intent || "general",
            value: budgetRange?.min || 0,
            currency: "USD",
          })

          // Start the WhatsApp conversation with their criteria prefilled
          const waMessage = `Hi Dwellot! Please send me property alerts. My criteria: ${criteriaSummary() || "open to suggestions"}.${name ? ` - ${name}` : ""}`
          const waUrl = `https://wa.me/233201578429?text=${encodeURIComponent(waMessage)}`

          setTimeout(() => {
            window.open(waUrl, "_blank", "noopener,noreferrer")
            setIsOpen(false)
          }, 1500)
        } else {
          setStatus("error")
          setMessage(data.error || "Failed to submit. Please try again.")
        }
      } catch {
        setStatus("error")
        setMessage("An error occurred. Please try again later.")
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [whatsapp, email, name, intent, budget, locations]
  )

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="alert-modal-title"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div
          className="px-6 py-5 text-white relative"
          style={{ background: "linear-gradient(135deg, #0d9488, #059669)" }}
        >
          <button
            onClick={handleDismiss}
            aria-label="Close"
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 id="alert-modal-title" className="text-lg font-bold leading-snug">
                Be first to know
              </h2>
              <p className="text-sm text-white/90">
                Get a WhatsApp alert the moment a matching property lists
              </p>
            </div>
          </div>
        </div>

        {status === "success" ? (
          <div className="px-6 py-10 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="font-semibold text-gray-900">{message}</p>
          </div>
        ) : step === 1 ? (
          <div className="px-6 py-5 space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">I want to</p>
              <div className="flex gap-2">
                {(["buy", "rent"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setIntent(option)}
                    className={`flex-1 py-2.5 rounded-lg border-2 font-semibold capitalize transition ${
                      intent === option
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Where? <span className="font-normal text-gray-400">(up to 3)</span>
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                {GHANA_LOCATIONS.map((location) => (
                  <button
                    key={location}
                    type="button"
                    onClick={() => toggleLocation(location)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${
                      locations.includes(location)
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-gray-200 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Budget</p>
              <div className="flex flex-wrap gap-1.5">
                {BUDGET_RANGES.map((range) => (
                  <button
                    key={range.label}
                    type="button"
                    onClick={() => setBudget(range.label)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${
                      budget === range.label
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-gray-200 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!intent}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-3">
            <p className="text-xs text-gray-500 -mb-1">{criteriaSummary()}</p>

            <div>
              <label htmlFor="alert-whatsapp" className="text-sm font-semibold text-gray-700">
                WhatsApp number <span className="text-red-500">*</span>
              </label>
              <input
                id="alert-whatsapp"
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+233 20 000 0000"
                required
                className="mt-1 w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label htmlFor="alert-name" className="text-sm font-semibold text-gray-700">
                Name
              </label>
              <input
                id="alert-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="mt-1 w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label htmlFor="alert-email" className="text-sm font-semibold text-gray-700">
                Email <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <input
                id="alert-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>

            {status === "error" && <p className="text-sm text-red-600">{message}</p>}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 rounded-xl text-white font-bold transition flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ backgroundColor: "#25D366" }}
            >
              {status === "loading" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <MessageCircle className="w-5 h-5" />
                  Get WhatsApp alerts
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-sm text-gray-500 hover:text-gray-700"
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
