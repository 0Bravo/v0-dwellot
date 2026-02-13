"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { X, Mail, CheckCircle2, Loader2, Bell, ArrowRight, Sparkles } from "lucide-react"
import { usePathname } from "next/navigation"

type Stage = "modal" | "banner" | "takeover" | "none"

const STORAGE_KEYS = {
  subscribed: "dwellot_newsletter_subscribed",
  dismissCount: "dwellot_newsletter_dismiss_count",
  pageViews: "dwellot_newsletter_page_views",
  lastShown: "dwellot_newsletter_last_shown",
} as const

function getStorageInt(key: string, fallback = 0): number {
  try {
    return parseInt(localStorage.getItem(key) || String(fallback), 10)
  } catch {
    return fallback
  }
}

function isSubscribed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.subscribed) === "true"
  } catch {
    return false
  }
}

export default function NewsletterModal() {
  const [stage, setStage] = useState<Stage>("none")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [countdown, setCountdown] = useState(15)
  const [hasSubscribed, setHasSubscribed] = useState(false)
  const exitIntentFired = useRef(false)
  const scrollFired = useRef(false)
  const pathname = usePathname()

  // Track page views on navigation
  useEffect(() => {
    if (isSubscribed()) {
      setHasSubscribed(true)
      return
    }
    const views = getStorageInt(STORAGE_KEYS.pageViews) + 1
    localStorage.setItem(STORAGE_KEYS.pageViews, String(views))

    // Reset scroll/exit triggers on navigation
    scrollFired.current = false
    exitIntentFired.current = false
  }, [pathname])

  // Stage 1: Timed popup after 10 seconds
  useEffect(() => {
    if (isSubscribed()) return
    const dismissCount = getStorageInt(STORAGE_KEYS.dismissCount)
    if (dismissCount >= 2) return // Banner mode handled separately

    const timer = setTimeout(() => {
      if (!isSubscribed() && stage === "none") {
        setStage("modal")
      }
    }, 10000)

    return () => clearTimeout(timer)
  }, [pathname, stage])

  // Scroll-triggered popup: 50% scroll
  useEffect(() => {
    if (isSubscribed()) return

    const handleScroll = () => {
      if (scrollFired.current || stage !== "none") return
      const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight
      if (scrollPercent > 0.5) {
        scrollFired.current = true
        const dismissCount = getStorageInt(STORAGE_KEYS.dismissCount)
        if (dismissCount < 2) {
          setStage("modal")
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [stage])

  // Exit-intent detection (desktop only)
  useEffect(() => {
    if (isSubscribed()) return

    const handleMouseLeave = (e: MouseEvent) => {
      if (exitIntentFired.current || stage !== "none") return
      if (e.clientY <= 5) {
        exitIntentFired.current = true
        const dismissCount = getStorageInt(STORAGE_KEYS.dismissCount)
        if (dismissCount < 2) {
          setStage("modal")
        }
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave)
    return () => document.removeEventListener("mouseleave", handleMouseLeave)
  }, [stage])

  // Persistent banner after 2 dismissals
  useEffect(() => {
    if (isSubscribed()) return
    const dismissCount = getStorageInt(STORAGE_KEYS.dismissCount)
    if (dismissCount >= 2 && stage === "none") {
      const timer = setTimeout(() => {
        if (!isSubscribed()) {
          setStage("banner")
        }
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [pathname, stage])

  // Full-screen takeover after 5 page views
  useEffect(() => {
    if (isSubscribed()) return
    const views = getStorageInt(STORAGE_KEYS.pageViews)
    if (views >= 5 && stage === "none") {
      const lastShown = getStorageInt(STORAGE_KEYS.lastShown)
      const now = Date.now()
      // Only show takeover once every 5 minutes
      if (now - lastShown > 300000) {
        const timer = setTimeout(() => {
          if (!isSubscribed()) {
            setStage("takeover")
            setCountdown(15)
            localStorage.setItem(STORAGE_KEYS.lastShown, String(now))
          }
        }, 8000)
        return () => clearTimeout(timer)
      }
    }
  }, [pathname, stage])

  // Countdown timer for takeover
  useEffect(() => {
    if (stage !== "takeover" || countdown <= 0) return
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [stage, countdown])

  // Re-show after 60 seconds if dismissed once
  useEffect(() => {
    if (isSubscribed() || stage !== "none") return
    const dismissCount = getStorageInt(STORAGE_KEYS.dismissCount)
    if (dismissCount === 1) {
      const timer = setTimeout(() => {
        if (!isSubscribed() && stage === "none") {
          setStage("modal")
        }
      }, 60000)
      return () => clearTimeout(timer)
    }
  }, [stage])

  const handleDismiss = useCallback(() => {
    const count = getStorageInt(STORAGE_KEYS.dismissCount) + 1
    localStorage.setItem(STORAGE_KEYS.dismissCount, String(count))
    localStorage.setItem(STORAGE_KEYS.lastShown, String(Date.now()))

    if (count >= 2) {
      // Switch to persistent banner
      setStage("banner")
    } else {
      setStage("none")
    }
  }, [])

  const handleDismissBanner = useCallback(() => {
    setStage("none")
    // Banner re-appears on next page navigation
  }, [])

  const handleDismissTakeover = useCallback(() => {
    setStage("none")
    localStorage.setItem(STORAGE_KEYS.lastShown, String(Date.now()))
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setStatus("error")
      setMessage("Please enter your email address")
      return
    }

    setStatus("loading")
    setMessage("")

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || null, source: `modal_${stage}` }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage("You're in! Welcome to the Dwellot community.")
        localStorage.setItem(STORAGE_KEYS.subscribed, "true")
        setHasSubscribed(true)

        setTimeout(() => {
          setStage("none")
        }, 2500)
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to subscribe. Please try again.")
      }
    } catch {
      setStatus("error")
      setMessage("An error occurred. Please try again later.")
    }
  }, [email, name])

  if (hasSubscribed) return null

  // ---- STAGE: Modal ----
  if (stage === "modal") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      >
        <div
          className="relative w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl"
          style={{
            animation: "modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Gradient header */}
          <div
            className="px-8 pt-8 pb-6 text-center"
            style={{ background: "linear-gradient(135deg, #0d9488, #059669)" }}
          >
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 rounded-full p-1 transition"
              style={{ color: "rgba(255,255,255,0.7)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
              aria-label="Close newsletter popup"
            >
              <X className="h-5 w-5" />
            </button>
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <Bell className="h-8 w-8 text-white" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-white text-balance">
              Don{"'"}t Miss Your Dream Property
            </h2>
            <p style={{ color: "rgba(255,255,255,0.9)" }} className="text-sm">
              Join 5,000+ property seekers getting exclusive listings, price drops, and market insights delivered weekly.
            </p>
          </div>

          {/* Form body */}
          <div className="bg-white px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                disabled={status === "loading" || status === "success"}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                disabled={status === "loading" || status === "success"}
                required
              />
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold text-white transition disabled:opacity-50"
                style={{ backgroundColor: "#0d9488" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0f766e")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0d9488")}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Subscribing...
                  </>
                ) : status === "success" ? (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Subscribed!
                  </>
                ) : (
                  <>
                    Get Exclusive Alerts
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
            {message && (
              <p className={`mt-3 text-center text-sm ${status === "error" ? "text-red-600" : "text-emerald-600"}`}>
                {message}
              </p>
            )}
            <p className="mt-4 text-center text-xs text-gray-400">
              No spam, ever. Unsubscribe with one click.
            </p>
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

  // ---- STAGE: Sticky Bottom Banner ----
  if (stage === "banner") {
    return (
      <div
        className="fixed bottom-0 left-0 right-0 z-50 border-t shadow-lg"
        style={{
          backgroundColor: "#0d9488",
          borderColor: "#0f766e",
          animation: "bannerSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-3 sm:flex-row sm:gap-4">
          <button
            onClick={handleDismissBanner}
            className="absolute right-3 top-3 rounded-full p-1 sm:relative sm:right-auto sm:top-auto sm:order-last"
            style={{ color: "rgba(255,255,255,0.7)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2 text-white">
            <Mail className="h-5 w-5 shrink-0" />
            <span className="text-sm font-medium">
              Get new listings before anyone else
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full items-center gap-2 sm:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="min-w-0 flex-1 rounded-lg bg-white/90 px-3 py-2 text-sm text-gray-900 outline-none transition focus:bg-white focus:ring-2 focus:ring-white/50 sm:w-56"
              disabled={status === "loading" || status === "success"}
              required
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50"
              style={{ backgroundColor: "#064e3b", color: "#fff" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#022c22")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#064e3b")}
            >
              {status === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : status === "success" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                "Subscribe"
              )}
            </button>
          </form>
        </div>

        {message && (
          <div className="pb-2 text-center">
            <p className={`text-xs ${status === "error" ? "text-red-200" : "text-emerald-100"}`}>
              {message}
            </p>
          </div>
        )}

        <style jsx>{`
          @keyframes bannerSlideUp {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    )
  }

  // ---- STAGE: Full-Screen Takeover ----
  if (stage === "takeover") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          backgroundColor: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(8px)",
          animation: "takeoverFadeIn 0.5s ease-out",
        }}
      >
        <div
          className="relative w-full max-w-md overflow-hidden rounded-2xl shadow-2xl"
          style={{ animation: "takeoverScaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both" }}
        >
          <div
            className="relative px-8 pt-10 pb-8 text-center"
            style={{ background: "linear-gradient(135deg, #0d9488, #059669, #047857)" }}
          >
            {countdown > 0 && (
              <button
                onClick={handleDismissTakeover}
                className="absolute right-4 top-4 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)" }}
                aria-label="Close in seconds"
              >
                Skip in {countdown}s
              </button>
            )}
            {countdown === 0 && (
              <button
                onClick={handleDismissTakeover}
                className="absolute right-4 top-4 rounded-full p-1 transition"
                style={{ color: "rgba(255,255,255,0.7)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                aria-label="Close newsletter popup"
              >
                <X className="h-5 w-5" />
              </button>
            )}

            <div
              className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full"
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                animation: "pulseGlow 2s infinite",
              }}
            >
              <Sparkles className="h-10 w-10 text-white" />
            </div>

            <h2 className="mb-3 text-3xl font-bold text-white text-balance">
              You{"'"}re Missing Out!
            </h2>
            <p className="mb-1 text-sm" style={{ color: "rgba(255,255,255,0.9)" }}>
              Properties in your area are selling fast.
            </p>
            <p className="text-sm font-medium" style={{ color: "#a7f3d0" }}>
              Be the first to know about new listings.
            </p>
          </div>

          <div className="bg-white px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                disabled={status === "loading" || status === "success"}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                disabled={status === "loading" || status === "success"}
                required
              />
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-base font-bold text-white transition disabled:opacity-50"
                style={{ backgroundColor: "#0d9488" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0f766e")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0d9488")}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Subscribing...
                  </>
                ) : status === "success" ? (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Welcome Aboard!
                  </>
                ) : (
                  <>
                    Yes, Alert Me First!
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {message && (
              <p className={`mt-3 text-center text-sm ${status === "error" ? "text-red-600" : "text-emerald-600"}`}>
                {message}
              </p>
            )}

            <p className="mt-4 text-center text-xs text-gray-400">
              Join 5,000+ subscribers. Unsubscribe anytime.
            </p>
          </div>
        </div>

        <style jsx>{`
          @keyframes takeoverFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes takeoverScaleIn {
            from {
              opacity: 0;
              transform: scale(0.9) translateY(20px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          @keyframes pulseGlow {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(255,255,255,0.3);
            }
            50% {
              box-shadow: 0 0 0 12px rgba(255,255,255,0);
            }
          }
        `}</style>
      </div>
    )
  }

  return null
}
