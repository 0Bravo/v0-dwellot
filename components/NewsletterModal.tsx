"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { X, CheckCircle2, Loader2, Bell, ArrowRight, Phone, Home, MapPin, Calendar, DollarSign, Bed } from "lucide-react"
import { usePathname } from "next/navigation"
import { trackLead } from "@/lib/facebook-pixel"

// Ghana locations for the dropdown
const GHANA_LOCATIONS = [
  "Accra",
  "East Legon",
  "Airport Residential",
  "Cantonments",
  "Labone",
  "Osu",
  "Ridge",
  "Tema",
  "Kumasi",
  "Takoradi",
  "Spintex",
  "Trassaco",
  "Adjiringanor",
  "Roman Ridge",
  "Dzorwulu",
  "Abelemkpe",
  "North Legon",
  "Madina",
  "Achimota",
]

// Budget ranges
const BUDGET_RANGES = [
  { label: "Under $50,000", min: 0, max: 50000 },
  { label: "$50,000 - $100,000", min: 50000, max: 100000 },
  { label: "$100,000 - $200,000", min: 100000, max: 200000 },
  { label: "$200,000 - $500,000", min: 200000, max: 500000 },
  { label: "$500,000 - $1,000,000", min: 500000, max: 1000000 },
  { label: "Over $1,000,000", min: 1000000, max: null },
]

// Timeline options
const TIMELINE_OPTIONS = [
  "Immediately",
  "Within 1 month",
  "1-3 months",
  "3-6 months",
  "6-12 months",
  "Just browsing",
]

const STORAGE_KEYS = {
  submitted: "dwellot_lead_submitted",
  dismissCount: "dwellot_lead_dismiss_count",
  pageViews: "dwellot_lead_page_views",
  lastShown: "dwellot_lead_last_shown",
} as const

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

export default function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [alreadySubmitted, setAlreadySubmitted] = useState(false)
  const exitIntentFired = useRef(false)
  const scrollFired = useRef(false)
  const pathname = usePathname()

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp_number: "",
    intent: "" as "buy" | "rent" | "",
    property_type: "",
    budget_range: "",
    bedrooms: "",
    preferred_locations: [] as string[],
    timeline: "",
  })

  // Track page views on navigation
  useEffect(() => {
    if (hasSubmitted()) {
      setAlreadySubmitted(true)
      return
    }
    const views = getStorageInt(STORAGE_KEYS.pageViews) + 1
    localStorage.setItem(STORAGE_KEYS.pageViews, String(views))

    // Reset scroll/exit triggers on navigation
    scrollFired.current = false
    exitIntentFired.current = false
  }, [pathname])

  // Timed popup after 15 seconds
  useEffect(() => {
    if (hasSubmitted()) return
    const dismissCount = getStorageInt(STORAGE_KEYS.dismissCount)
    if (dismissCount >= 3) return

    const timer = setTimeout(() => {
      if (!hasSubmitted() && !isOpen) {
        setIsOpen(true)
      }
    }, 15000)

    return () => clearTimeout(timer)
  }, [pathname, isOpen])

  // Scroll-triggered popup: 50% scroll
  useEffect(() => {
    if (hasSubmitted()) return

    const handleScroll = () => {
      if (scrollFired.current || isOpen) return
      const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight
      if (scrollPercent > 0.5) {
        scrollFired.current = true
        const dismissCount = getStorageInt(STORAGE_KEYS.dismissCount)
        if (dismissCount < 3) {
          setIsOpen(true)
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isOpen])

  // Exit-intent detection (desktop only)
  useEffect(() => {
    if (hasSubmitted()) return

    const handleMouseLeave = (e: MouseEvent) => {
      if (exitIntentFired.current || isOpen) return
      if (e.clientY <= 5) {
        exitIntentFired.current = true
        const dismissCount = getStorageInt(STORAGE_KEYS.dismissCount)
        if (dismissCount < 3) {
          setIsOpen(true)
        }
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave)
    return () => document.removeEventListener("mouseleave", handleMouseLeave)
  }, [isOpen])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const handleDismiss = useCallback(() => {
    const count = getStorageInt(STORAGE_KEYS.dismissCount) + 1
    localStorage.setItem(STORAGE_KEYS.dismissCount, String(count))
    localStorage.setItem(STORAGE_KEYS.lastShown, String(Date.now()))
    setIsOpen(false)
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setMessage("")
  }

  const handleLocationToggle = (location: string) => {
    setFormData((prev) => {
      const locations = prev.preferred_locations.includes(location)
        ? prev.preferred_locations.filter((l) => l !== location)
        : [...prev.preferred_locations, location].slice(0, 3)
      return { ...prev, preferred_locations: locations }
    })
  }

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")

    if (!formData.email.trim()) {
      setStatus("error")
      setMessage("Please enter your email address")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setStatus("error")
      setMessage("Please enter a valid email address")
      return
    }

    setStatus("loading")

    try {
      const budgetRange = BUDGET_RANGES.find((b) => b.label === formData.budget_range)

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          whatsapp_number: formData.whatsapp_number || formData.phone,
          intent: formData.intent,
          property_type: formData.property_type,
          min_budget: budgetRange?.min,
          max_budget: budgetRange?.max,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          preferred_locations: formData.preferred_locations,
          timeline: formData.timeline,
          source: "website_modal",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage("We'll match you with perfect properties!")
        localStorage.setItem(STORAGE_KEYS.submitted, "true")
        setAlreadySubmitted(true)

        // Track Facebook Pixel Lead event
        trackLead({
          content_name: "Property Lead Form",
          content_category: formData.intent || "general",
          value: budgetRange?.min || 0,
          currency: "USD",
        })

        setTimeout(() => {
          setIsOpen(false)
        }, 2500)
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to submit. Please try again.")
      }
    } catch {
      setStatus("error")
      setMessage("An error occurred. Please try again later.")
    }
  }, [formData])

  if (alreadySubmitted || !isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
    >
      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{ animation: "modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        {/* Header */}
        <div
          className="px-6 py-6 text-white text-center relative"
          style={{ background: "linear-gradient(135deg, #0d9488, #059669)" }}
        >
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1.5 rounded-full transition"
            style={{ color: "rgba(255,255,255,0.7)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Bell className="w-6 h-6" />
          </div>

          <h2 id="lead-modal-title" className="text-xl font-bold mb-1">
            Find Your Perfect Property
          </h2>
          <p className="text-teal-100 text-sm">
            Tell us what you&apos;re looking for and get matched instantly
          </p>
        </div>

        {/* Form */}
        <div className="p-5">
          {status === "success" ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                You&apos;re All Set!
              </h3>
              <p className="text-gray-600 text-sm">
                {message}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    <Phone className="w-3 h-3 inline mr-1" />
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+233 XX XXX XXXX"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    <Home className="w-3 h-3 inline mr-1" />
                    Looking to
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, intent: "buy" }))}
                      className={`py-2 px-2 rounded-lg border text-xs font-medium transition ${
                        formData.intent === "buy"
                          ? "border-teal-500 bg-teal-50 text-teal-700"
                          : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                    >
                      Buy
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, intent: "rent" }))}
                      className={`py-2 px-2 rounded-lg border text-xs font-medium transition ${
                        formData.intent === "rent"
                          ? "border-teal-500 bg-teal-50 text-teal-700"
                          : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                    >
                      Rent
                    </button>
                  </div>
                </div>
              </div>

              {/* Property Type, Bedrooms, Budget */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Type
                  </label>
                  <select
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleInputChange}
                    className="w-full px-2 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs bg-white"
                  >
                    <option value="">Any</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="land">Land</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    <Bed className="w-3 h-3 inline mr-0.5" />
                    Beds
                  </label>
                  <select
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    className="w-full px-2 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs bg-white"
                  >
                    <option value="">Any</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    <Calendar className="w-3 h-3 inline mr-0.5" />
                    When
                  </label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full px-2 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs bg-white"
                  >
                    <option value="">Select</option>
                    {TIMELINE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  <DollarSign className="w-3 h-3 inline mr-1" />
                  Budget Range
                </label>
                <select
                  name="budget_range"
                  value={formData.budget_range}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
                >
                  <option value="">Select budget</option>
                  {BUDGET_RANGES.map((range) => (
                    <option key={range.label} value={range.label}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred Locations */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  <MapPin className="w-3 h-3 inline mr-1" />
                  Preferred Areas (up to 3)
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto p-0.5">
                  {GHANA_LOCATIONS.map((location) => (
                    <button
                      key={location}
                      type="button"
                      onClick={() => handleLocationToggle(location)}
                      disabled={
                        formData.preferred_locations.length >= 3 &&
                        !formData.preferred_locations.includes(location)
                      }
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                        formData.preferred_locations.includes(location)
                          ? "bg-teal-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                      }`}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error message */}
              {message && status === "error" && (
                <p className="text-red-500 text-xs text-center">{message}</p>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-2.5 px-4 font-semibold rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 text-white"
                style={{ backgroundColor: "#0d9488" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0f766e")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0d9488")}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Get Matched with Properties
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-gray-400 text-center">
                We respect your privacy. No spam, ever.
              </p>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  )
}
