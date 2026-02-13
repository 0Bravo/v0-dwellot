"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Building2,
  Users,
  TrendingUp,
  Shield,
  Phone,
  MapPin,
  Briefcase,
  User,
} from "lucide-react"

const GHANA_AREAS = [
  "East Legon",
  "Spintex",
  "Tema",
  "Airport Residential",
  "Cantonments",
  "Labone",
  "Osu",
  "Adjiringanor",
  "Trasacco",
  "Ashaley Botwe",
  "Kumasi",
  "Takoradi",
  "Appolonia City",
  "East Legon Hills",
  "Achimota",
  "Kasoa",
]

const EXPERIENCE_OPTIONS = [
  { value: "0-1", label: "Less than 1 year" },
  { value: "1-3", label: "1-3 years" },
  { value: "3-5", label: "3-5 years" },
  { value: "5-10", label: "5-10 years" },
  { value: "10+", label: "10+ years" },
]

export default function AgentSignupPage() {
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    company: "",
    license_number: "",
    experience: "",
    areas: [] as string[],
    bio: "",
  })

  const updateField = (field: string, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const toggleArea = (area: string) => {
    setForm((prev) => ({
      ...prev,
      areas: prev.areas.includes(area)
        ? prev.areas.filter((a) => a !== area)
        : [...prev.areas, area],
    }))
  }

  const validateStep1 = () => {
    if (!form.full_name.trim()) return "Please enter your full name"
    if (!form.email.trim()) return "Please enter your email address"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Please enter a valid email address"
    if (!form.phone.trim()) return "Please enter your phone number"
    return null
  }

  const validateStep2 = () => {
    if (!form.experience) return "Please select your experience level"
    if (form.areas.length === 0) return "Please select at least one area you cover"
    return null
  }

  const handleNext = () => {
    if (step === 1) {
      const err = validateStep1()
      if (err) { setError(err); return }
    }
    if (step === 2) {
      const err = validateStep2()
      if (err) { setError(err); return }
    }
    setError("")
    setStep((s) => s + 1)
  }

  const handleBack = () => {
    setError("")
    setStep((s) => s - 1)
  }

  const handleSubmit = async () => {
    setError("")
    setSubmitting(true)
    try {
      const res = await fetch("/api/agent-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to submit. Please try again.")
        return
      }
      setSubmitted(true)
    } catch {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-lg p-10">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-teal-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Application Submitted!</h1>
          <p className="text-gray-600 mb-2">
            Thank you, <span className="font-semibold">{form.full_name}</span>. Your agent application has been received.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Our team will review your application and contact you within 2-3 business days at{" "}
            <span className="font-medium text-gray-700">{form.email}</span>.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition"
            >
              Back to Homepage
            </Link>
            <Link
              href="/properties"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
            <ArrowLeft className="h-4 w-4" />
            Back to Dwellot
          </Link>
          <span className="text-sm text-gray-500">Step {step} of 3</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Left: Benefits sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Become a Dwellot Agent</h1>
              <p className="text-gray-600">Join Ghana{"'"}s fastest-growing property platform and reach thousands of buyers and renters.</p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Building2, title: "Unlimited Listings", desc: "List as many properties as you want, for free" },
                { icon: Users, title: "Qualified Leads", desc: "Connect with serious buyers and renters" },
                { icon: TrendingUp, title: "Market Insights", desc: "Access data to price properties competitively" },
                { icon: Shield, title: "Verified Badge", desc: "Stand out with a trusted agent verification" },
              ].map((benefit) => (
                <div key={benefit.title} className="flex gap-3">
                  <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{benefit.title}</h3>
                    <p className="text-gray-500 text-sm">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <p className="text-teal-800 text-sm font-medium mb-1">Prefer paper forms?</p>
              <p className="text-teal-700 text-sm mb-3">Download our printable property collection form.</p>
              <Link
                href="/agent-collection-form"
                className="text-teal-600 hover:text-teal-700 text-sm font-semibold underline"
              >
                View Printable Form
              </Link>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            {/* Progress bar */}
            <div className="flex items-center gap-2 mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1 flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition ${
                      s < step
                        ? "bg-teal-600 text-white"
                        : s === step
                          ? "bg-teal-600 text-white"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {s < step ? <CheckCircle className="w-5 h-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`flex-1 h-1 rounded ${s < step ? "bg-teal-600" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <User className="w-5 h-5 text-teal-600" />
                      Personal Information
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Tell us about yourself</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={form.full_name}
                        onChange={(e) => updateField("full_name", e.target.value)}
                        placeholder="e.g. Kwame Mensah"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="+233 XX XXX XXXX"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company / Agency Name</label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => updateField("company", e.target.value)}
                        placeholder="Optional"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                      <input
                        type="text"
                        value={form.license_number}
                        onChange={(e) => updateField("license_number", e.target.value)}
                        placeholder="If applicable"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Experience & Areas */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-teal-600" />
                      Experience & Coverage
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Help us understand your background</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {EXPERIENCE_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => updateField("experience", opt.value)}
                            className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition ${
                              form.experience === opt.value
                                ? "bg-teal-50 border-teal-600 text-teal-700"
                                : "border-gray-300 text-gray-700 hover:border-gray-400"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-teal-600" />
                          Areas You Cover * <span className="text-gray-400 font-normal">(select all that apply)</span>
                        </span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {GHANA_AREAS.map((area) => (
                          <button
                            key={area}
                            type="button"
                            onClick={() => toggleArea(area)}
                            className={`px-3 py-2 rounded-lg border text-sm transition text-left ${
                              form.areas.includes(area)
                                ? "bg-teal-50 border-teal-600 text-teal-700 font-medium"
                                : "border-gray-300 text-gray-700 hover:border-gray-400"
                            }`}
                          >
                            {form.areas.includes(area) && <CheckCircle className="w-3.5 h-3.5 inline mr-1" />}
                            {area}
                          </button>
                        ))}
                      </div>
                      {form.areas.length > 0 && (
                        <p className="text-sm text-teal-600 mt-2">{form.areas.length} area{form.areas.length > 1 ? "s" : ""} selected</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Bio & Review */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-teal-600" />
                      Final Details
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Almost done! Add a short bio and review your application.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio / Introduction</label>
                    <textarea
                      value={form.bio}
                      onChange={(e) => updateField("bio", e.target.value)}
                      placeholder="Tell potential clients about yourself, your specialities, and what makes you a great agent..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">Optional but recommended. This may appear on your public profile.</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-5 space-y-3">
                    <h3 className="font-semibold text-gray-900 text-sm">Review Your Application</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Name:</span>
                        <p className="font-medium text-gray-900">{form.full_name}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <p className="font-medium text-gray-900">{form.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <p className="font-medium text-gray-900">{form.phone}</p>
                      </div>
                      {form.company && (
                        <div>
                          <span className="text-gray-500">Company:</span>
                          <p className="font-medium text-gray-900">{form.company}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-500">Experience:</span>
                        <p className="font-medium text-gray-900">
                          {EXPERIENCE_OPTIONS.find((o) => o.value === form.experience)?.label}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">Areas:</span>
                        <p className="font-medium text-gray-900">{form.areas.join(", ")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-2 px-5 py-2.5 text-gray-600 hover:text-gray-900 font-medium transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold transition"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex items-center gap-2 px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <CheckCircle className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
