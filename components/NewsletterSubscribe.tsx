"use client"

import type React from "react"

import { useState } from "react"
import { Mail, CheckCircle2, Loader2 } from "lucide-react"

interface NewsletterSubscribeProps {
  variant?: "default" | "minimal" | "footer"
  className?: string
}

export default function NewsletterSubscribe({ variant = "default", className = "" }: NewsletterSubscribeProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
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
        body: JSON.stringify({ email, name: name || null }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage("Thank you for subscribing! Check your email for confirmation.")
        setEmail("")
        setName("")

        // Reset success message after 5 seconds
        setTimeout(() => {
          setStatus("idle")
          setMessage("")
        }, 5000)
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to subscribe. Please try again.")
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error)
      setStatus("error")
      setMessage("An error occurred. Please try again later.")
    }
  }

  if (variant === "minimal") {
    return (
      <div className={className}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            disabled={status === "loading" || status === "success"}
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {status === "loading" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : status === "success" ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Subscribed
              </>
            ) : (
              "Subscribe"
            )}
          </button>
        </form>
        {message && (
          <p className={`text-sm mt-2 ${status === "error" ? "text-red-600" : "text-green-600"}`}>{message}</p>
        )}
      </div>
    )
  }

  if (variant === "footer") {
    return (
      <div className={className}>
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">Subscribe to Our Newsletter</h3>
        </div>
        <p className="text-gray-600 mb-4 text-sm">
          Get the latest property listings and market updates delivered to your inbox
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            disabled={status === "loading" || status === "success"}
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Subscribing...
              </>
            ) : status === "success" ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Subscribed!
              </>
            ) : (
              "Subscribe"
            )}
          </button>
        </form>
        {message && (
          <p className={`text-xs mt-2 ${status === "error" ? "text-red-600" : "text-green-600"}`}>{message}</p>
        )}
      </div>
    )
  }

  // Default variant - full card
  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 ${className}`}>
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated with New Properties</h2>
        <p className="text-gray-600 mb-8 text-lg">
          Subscribe to our newsletter and be the first to know about new listings, price drops, and exclusive deals in
          your favorite areas
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              disabled={status === "loading" || status === "success"}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              disabled={status === "loading" || status === "success"}
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2 mx-auto"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Subscribing...
              </>
            ) : status === "success" ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Successfully Subscribed!
              </>
            ) : (
              "Subscribe to Newsletter"
            )}
          </button>
        </form>

        {message && (
          <div
            className={`mt-6 p-4 rounded-lg ${status === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
          >
            <p className="flex items-center justify-center gap-2 font-medium">
              {status === "success" ? <CheckCircle2 className="w-5 h-5" /> : null}
              {message}
            </p>
          </div>
        )}

        <p className="text-gray-500 text-sm mt-6">We respect your privacy. Unsubscribe at any time. No spam, ever.</p>
      </div>
    </div>
  )
}
