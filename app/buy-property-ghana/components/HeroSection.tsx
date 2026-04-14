"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, ShieldCheck, Globe, MapPin, Loader2, AlertCircle } from "lucide-react"

const PROPERTY_TYPES = [
  "Apartment",
  "Townhouse",
  "Detached House",
  "Semi-Detached House",
  "Land / Plot",
  "Gated Community Home",
]

const BUDGET_RANGES = [
  "Under $50,000",
  "$50,000 – $100,000",
  "$100,000 – $200,000",
  "$200,000 – $400,000",
  "$400,000 – $700,000",
  "Above $700,000",
]

type FormStatus = "idle" | "loading" | "success" | "error"

export default function HeroSection() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    property_type: "",
    budget_range: "",
    message: "",
  })
  const [status, setStatus] = useState<FormStatus>("idle")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch("/api/campaign-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed")
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  const trustPills = [
    { icon: ShieldCheck, label: "Verified Listings" },
    { icon: Globe, label: "Remote Purchase Support" },
    { icon: MapPin, label: "Ghana-Wide Coverage" },
  ]

  return (
    <section className="pt-14 bg-gradient-to-br from-[#0f766e] via-[#14b8a6] to-[#0d9488] min-h-[calc(100vh-56px)] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-white"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Serving buyers worldwide
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.15] text-balance mb-5">
              Own a Beautiful Home in Ghana —{" "}
              <span className="text-white/90">From Anywhere in the World</span>
            </h1>

            <p className="text-white/85 text-lg leading-relaxed mb-8 max-w-lg">
              Browse 500+ verified residential properties across Ghana. Our team guides you through
              every step — from search to keys — no matter where you live.
            </p>

            {/* Trust pills */}
            <div className="flex flex-wrap gap-3">
              {trustPills.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm font-medium"
                >
                  <Icon size={15} className="text-white" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Lead capture form */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Get Free Property Consultation</h2>
              <p className="text-sm text-gray-500 mb-6">Our team responds within 24 hours.</p>

              {status === "success" ? (
                <div className="flex flex-col items-center gap-4 py-10 text-center">
                  <CheckCircle className="text-[#14b8a6]" size={48} />
                  <p className="text-lg font-semibold text-gray-900">Thank you!</p>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Our team will be in touch within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="full_name"
                      name="full_name"
                      type="text"
                      required
                      value={form.full_name}
                      onChange={handleChange}
                      placeholder="Kwame Mensah"
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent transition"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent transition"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+44 7700 900123"
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent transition"
                    />
                  </div>

                  {/* Property Type */}
                  <div>
                    <label htmlFor="property_type" className="block text-sm font-medium text-gray-700 mb-1">
                      Property Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="property_type"
                      name="property_type"
                      required
                      value={form.property_type}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent transition"
                    >
                      <option value="" disabled>Select property type</option>
                      {PROPERTY_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Budget Range */}
                  <div>
                    <label htmlFor="budget_range" className="block text-sm font-medium text-gray-700 mb-1">
                      Budget Range <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="budget_range"
                      name="budget_range"
                      required
                      value={form.budget_range}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent transition"
                    >
                      <option value="" disabled>Select budget range</option>
                      {BUDGET_RANGES.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us more about what you're looking for…"
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent transition resize-none"
                    />
                  </div>

                  {/* Error */}
                  {status === "error" && (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-lg px-3.5 py-2.5">
                      <AlertCircle size={15} />
                      <span>Something went wrong. Please try again.</span>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full flex items-center justify-center gap-2 bg-[#14b8a6] hover:bg-[#0d9488] disabled:opacity-70 text-white font-semibold rounded-lg px-6 py-3 text-sm transition-colors mt-1"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending…
                      </>
                    ) : (
                      "Get Free Property Consultation →"
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
