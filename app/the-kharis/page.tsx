"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  MapPin, Phone, Mail, CheckCircle, Shield, ChevronRight,
  MessageCircle, BedDouble, Bath, Maximize2, Building2,
  Car, Dumbbell, Lock, Droplets, Trees, Star,
} from "lucide-react"

// ─── Images (from Vercel Blob Storage) ───────────────────────────────────────
// Shared pool — same development, both unit types use same photography
const GALLERY_IMAGES = [
  "https://lom7safe82jeycnd.public.blob.vercel-storage.com/properties/1776441545456-IMG-20240425-WA0002-w269FJHWphRZOozUJyOB43L5cGzHPj.jpg",
  "https://lom7safe82jeycnd.public.blob.vercel-storage.com/properties/1776441545553-IMG-20240425-WA0021-MYKwfneCBosnBcgTcI835l8WkJqrnW.jpg",
  "https://lom7safe82jeycnd.public.blob.vercel-storage.com/properties/1776441545379-IMG-20240612-WA0076-Fs5oaNhEgUXDXxcOxgeMFSTE3GSgNW.jpg",
  "https://lom7safe82jeycnd.public.blob.vercel-storage.com/properties/1776441545036-IMG-20240612-WA0077-V4g32zYlAX544781knceywFiu7a2u3.jpg",
  "https://lom7safe82jeycnd.public.blob.vercel-storage.com/properties/1776442138345-IMG-20240425-WA0000-dU8GrgHTwc07SSN6opiJAypys3eBHS.jpg",
  "https://lom7safe82jeycnd.public.blob.vercel-storage.com/properties/1776442138040-IMG-20240425-WA0002-XWwUiK0Z0nWMWTpsKLEX7Vg6LYk0fZ.jpg",
  "https://lom7safe82jeycnd.public.blob.vercel-storage.com/properties/1776442137919-IMG-20240425-WA0021-C88z6DSz5XbQlZYaWhBkJ8XUcY1bnR.jpg",
  "https://lom7safe82jeycnd.public.blob.vercel-storage.com/properties/1776442137587-IMG-20240612-WA0076-dYWEUEIRy4dNGwLc8HOlnUrRMbRbqI.jpg",
]

// ─── Unit Types ───────────────────────────────────────────────────────────────
const UNITS = [
  {
    id: "3br",
    label: "3-Bedroom Home",
    beds: 3,
    baths: 3,
    area: "220 m²",
    parking: 2,
    price: "$320,000",
    priceRaw: 320000,
    hasBQ: true,
    badge: "Most Popular",
    badgeColor: "bg-blue-500",
    features: [
      "3 Spacious Bedrooms",
      "3 Bathrooms",
      "1-Bedroom Boys Quarters (BQ)",
      "Fitted Kitchen",
      "Built-in Wardrobes",
      "Private Parking (x2)",
      "Water Storage Tank",
      "Backup Power Infrastructure",
      "220 sqm total",
      "Gated Community",
    ],
  },
  {
    id: "4br",
    label: "4-Bedroom Home",
    beds: 4,
    baths: 4,
    area: "280 m²",
    parking: 2,
    price: "$420,000",
    priceRaw: 420000,
    hasBQ: true,
    badge: "Premium",
    badgeColor: "bg-purple-500",
    features: [
      "4 Spacious Bedrooms",
      "4 Bathrooms",
      "1-Bedroom Boys Quarters (BQ)",
      "Fitted Kitchen",
      "Built-in Wardrobes",
      "Private Parking (x2)",
      "Water Storage Tank",
      "Backup Power Infrastructure",
      "280 sqm total",
      "Gated Community",
    ],
  },
]

const AMENITIES = [
  { icon: <Dumbbell className="w-5 h-5" />, label: "Gym / Fitness Center" },
  { icon: <Droplets className="w-5 h-5" />, label: "Swimming Pool" },
  { icon: <Lock className="w-5 h-5" />, label: "24/7 Security & CCTV" },
  { icon: <Car className="w-5 h-5" />, label: "Ample Parking" },
  { icon: <Trees className="w-5 h-5" />, label: "Green Spaces" },
  { icon: <Shield className="w-5 h-5" />, label: "Gated Estate" },
]

const WHY_POINTS = [
  {
    title: "Prime East Airport Address",
    desc: "The Kharis sits in the heart of East Airport — one of Accra's most prestigious and connected addresses, minutes from the city's best amenities.",
  },
  {
    title: "Interest-Free Payment Plans",
    desc: "Spread your payments with zero interest. Bestworld's flexible plan makes owning a $300k+ home achievable without the burden of mortgage rates.",
  },
  {
    title: "Two Unit Types, One Community",
    desc: "Choose a 3-bedroom or 4-bedroom home — both include a Boys Quarters (BQ), premium finishes, and access to all estate amenities.",
  },
  {
    title: "Remote Buying Made Simple",
    desc: "Diaspora buyers from the UK, US, and Canada complete purchases through us every week. Virtual tours, legal support, and seamless remote handover.",
  },
]

const WHATSAPP_NUMBER = "233552599185"

// ─── Lead Form ────────────────────────────────────────────────────────────────
function LeadForm({ selectedUnit }: { selectedUnit: string }) {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", timeline: "", message: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    if (status !== "idle") setStatus("idle")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    const unit = UNITS.find((u) => u.id === selectedUnit)
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          message: `[CAMPAIGN LEAD — The Kharis]\nUnit: ${unit?.label} (${unit?.price})\nTimeline: ${form.timeline}\n\n${form.message}`,
          source: "campaign-the-kharis",
        }),
      })
      setStatus(res.ok ? "success" : "error")
      if (res.ok) setForm({ fullName: "", email: "", phone: "", timeline: "", message: "" })
    } catch {
      setStatus("error")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
          <input name="fullName" type="text" required value={form.fullName} onChange={handleChange}
            placeholder="e.g. Kofi Mensah"
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address *</label>
          <input name="email" type="email" required value={form.email} onChange={handleChange}
            placeholder="you@example.com"
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Phone / WhatsApp</label>
        <input name="phone" type="tel" value={form.phone} onChange={handleChange}
          placeholder="+1 555 000 0000 or +44 7000 000000"
          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">When are you looking to buy?</label>
        <select name="timeline" value={form.timeline} onChange={handleChange}
          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400">
          <option value="">Select timeline</option>
          <option value="Immediately">Immediately</option>
          <option value="Within 1 month">Within 1 month</option>
          <option value="1–3 months">1–3 months</option>
          <option value="3–6 months">3–6 months</option>
          <option value="6–12 months">6–12 months</option>
          <option value="Just browsing">Just browsing</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Any questions? (optional)</label>
        <textarea name="message" rows={2} value={form.message} onChange={handleChange}
          placeholder="Payment plan questions, viewing requests, specific requirements..."
          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
      </div>
      <button type="submit" disabled={status === "loading"}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
        {status === "loading"
          ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending…</>
          : <>Request Free Consultation <ChevronRight className="w-4 h-4" /></>}
      </button>
      {status === "success" && (
        <p className="text-green-600 text-sm flex items-center gap-2 font-medium">
          <CheckCircle className="w-4 h-4" /> Thank you! Our team will be in touch within 24 hours.
        </p>
      )}
      {status === "error" && (
        <p className="text-red-500 text-xs">
          Something went wrong. WhatsApp us on{" "}
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="underline font-semibold">+233 55 259 9185</a>.
        </p>
      )}
      <p className="text-gray-400 text-xs text-center">We respect your privacy. No spam, ever.</p>
    </form>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TheKharisPage() {
  const [selectedUnit, setSelectedUnit] = useState("3br")
  const unit = UNITS.find((u) => u.id === selectedUnit)!
  const waMessage = `Hi Bestworld, I'm interested in The Kharis (${unit.label}, ${unit.price}) in East Airport. Please send me more details.`

  return (
    <main className="min-h-screen bg-white font-sans">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-teal-500">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          <span className="font-bold text-gray-900 text-lg">Dwellot</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/properties" className="hidden sm:block text-sm text-gray-600 hover:text-teal-500 font-medium transition-colors">
            Browse Properties
          </Link>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Us
          </a>
        </div>
      </div>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">

          {/* Left: Copy */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-5">
              <Building2 className="w-3.5 h-3.5" /> By Bestworld Real Estate · East Airport, Accra
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
              The Kharis<br />
              <span className="text-blue-200">Luxury Homes</span><br />
              in East Airport
            </h1>
            <p className="text-blue-100 text-lg mb-4 max-w-md leading-relaxed">
              An exclusive gated community offering 3 and 4-bedroom homes with Boys Quarters in one of Accra's most sought-after addresses.
            </p>
            <p className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 text-yellow-200 text-sm font-semibold px-4 py-2 rounded-full mb-8">
              ✦ Interest-free flexible payment plans available
            </p>

            {/* Unit selector pills */}
            <div className="mb-6">
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-wide mb-3">Choose Your Unit</p>
              <div className="flex gap-3 flex-wrap">
                {UNITS.map((u) => (
                  <button key={u.id} onClick={() => setSelectedUnit(u.id)}
                    className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all border-2 ${
                      selectedUnit === u.id
                        ? "bg-white text-blue-700 border-white"
                        : "bg-transparent text-white border-white/40 hover:border-white/70"
                    }`}>
                    {u.label} — {u.price}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected unit specs */}
            <div className="flex flex-wrap gap-4 mb-8">
              {[
                { icon: <BedDouble className="w-4 h-4" />, text: `${unit.beds} Beds + BQ` },
                { icon: <Bath className="w-4 h-4" />, text: `${unit.baths} Bathrooms` },
                { icon: <Maximize2 className="w-4 h-4" />, text: unit.area },
                { icon: <Car className="w-4 h-4" />, text: "2 Parking" },
              ].map((s) => (
                <span key={s.text} className="flex items-center gap-1.5 text-sm text-white/90 bg-white/10 px-3 py-1.5 rounded-full">
                  {s.icon} {s.text}
                </span>
              ))}
            </div>

            {/* Contact strip */}
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-blue-100">
              <div>
                <p className="font-semibold text-white text-xs uppercase tracking-wide mb-0.5">Bestworld — Ghana</p>
                <a href="tel:+233552599185" className="hover:text-white">+233 55 259 9185</a>
                {" · "}
                <a href="tel:+233201578429" className="hover:text-white">+233 20 157 8429</a>
              </div>
              <div className="hidden sm:block w-px bg-white/20" />
              <div>
                <p className="font-semibold text-white text-xs uppercase tracking-wide mb-0.5">UK Office</p>
                <a href="tel:+447861932209" className="hover:text-white">+44 7861 932209</a>
                <span className="text-blue-300 text-xs ml-1">· London EC2A</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Lead Form */}
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-gray-900 text-xl font-bold">Enquire About The Kharis</h2>
              <span className={`${unit.badgeColor} text-white text-xs font-bold px-2.5 py-0.5 rounded-full`}>{unit.label}</span>
            </div>
            <p className="text-gray-500 text-sm mb-5">
              Our team will reach out within 24 hours with pricing details, payment plans, and a virtual tour.
            </p>
            <LeadForm selectedUnit={selectedUnit} />
          </motion.div>
        </div>
      </section>

      {/* ── Image Gallery ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">See The Kharis</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {GALLERY_IMAGES.slice(0, 8).map((src, i) => (
            <div key={i} className="relative h-48 rounded-xl overflow-hidden bg-gray-100">
              <Image
                src={src}
                alt={`The Kharis photo ${i + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
        <p className="text-gray-400 text-xs mt-3 text-center">
          Contact us for a full virtual walkthrough via WhatsApp or Zoom.
        </p>
      </section>

      {/* ── Unit Comparison ─────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">Choose Your Home at The Kharis</h2>
            <p className="text-gray-500 mt-2 text-sm">Two unit types — both with Boys Quarters and access to all estate amenities</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {UNITS.map((u) => (
              <motion.div key={u.id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onClick={() => setSelectedUnit(u.id)}
                className={`bg-white rounded-2xl p-6 shadow-sm border-2 cursor-pointer transition-all ${
                  selectedUnit === u.id ? "border-blue-500 shadow-blue-100 shadow-lg" : "border-gray-100 hover:border-blue-200"
                }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-lg">{u.label}</h3>
                  <span className={`${u.badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>{u.badge}</span>
                </div>
                <p className="text-3xl font-black text-blue-600 mb-1">{u.price}</p>
                <p className="text-gray-400 text-xs mb-5">Interest-free payment plan available</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-5 pb-5 border-b border-gray-100">
                  <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4 text-blue-400" /> {u.beds} Beds</span>
                  <span className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-blue-400" /> {u.baths} Baths</span>
                  <span className="flex items-center gap-1.5"><Maximize2 className="w-4 h-4 text-blue-400" /> {u.area}</span>
                </div>
                <div className="space-y-2">
                  {u.features.slice(0, 5).map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi Bestworld, I'm interested in The Kharis ${u.label} (${u.price}). Please send details.`)}`}
                  target="_blank" rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="mt-5 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors">
                  <MessageCircle className="w-4 h-4" /> Enquire About This Unit
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Amenities ───────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Community Amenities</h2>
            <p className="text-gray-500 text-sm mb-6">Every resident at The Kharis has access to:</p>
            <div className="grid grid-cols-2 gap-4">
              {AMENITIES.map((a) => (
                <div key={a.label} className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <span className="text-blue-600">{a.icon}</span>
                  <span className="text-gray-700 text-sm font-medium">{a.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Why Buy Here</h2>
            <div className="space-y-4">
              {WHY_POINTS.map((p, i) => (
                <div key={p.title} className="flex gap-4">
                  <span className="text-2xl font-black text-blue-100 leading-none flex-shrink-0">0{i + 1}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{p.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Location ───────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              <MapPin className="w-6 h-6 text-blue-600 inline mr-2" />
              East Airport, Accra
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              The Kharis is located in East Airport — Accra's most connected and prestigious neighbourhood.
              Minutes from Kotoka Airport, international schools, embassies, shopping malls, and business hubs.
            </p>
            <div className="space-y-3">
              {[
                "5 min to Kotoka International Airport",
                "10 min to Cantonments & Embassy Row",
                "Near A&C Mall, Junction Mall",
                "Close to top international schools",
                "Fast access to East Legon & Spintex Corridor",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-8 text-center">
            <Building2 className="w-16 h-16 text-blue-300 mx-auto mb-4" />
            <p className="text-gray-700 font-semibold mb-2">Book a Virtual Tour</p>
            <p className="text-gray-500 text-sm mb-5">
              Our Accra team takes you through every room, the street, and the community via WhatsApp or Zoom.
              Diaspora buyers complete full purchases remotely every week.
            </p>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Bestworld, I'd like to schedule a virtual tour of The Kharis.")}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-blue-700 transition-colors">
              <MessageCircle className="w-4 h-4" /> Book a Virtual Tour
            </a>
          </div>
        </div>
      </section>

      {/* ── Other Bestworld Projects ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Other Bestworld Projects</h2>
          <p className="text-gray-500 mt-2 text-sm">Explore more homes by Bestworld Real Estate</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: "Anowaa Gardens",
              location: "East Airport, Accra",
              price: "From $300,000",
              type: "3-Bedroom Townhome with BQ",
              href: "/anowaa-gardens",
            },
            {
              name: "Mantebea Gardens",
              location: "East Amrahia, Accra",
              price: "From $140,000",
              type: "3, 4 & 5-Bedroom Homes",
              href: "/mantebea-gardens",
            },
          ].map((proj) => (
            <Link key={proj.name} href={proj.href}
              className="group flex items-center justify-between bg-white border border-gray-200 hover:border-blue-300 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
              <div>
                <p className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{proj.name}</p>
                <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> {proj.location}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">{proj.type}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-gray-900 text-sm">{proj.price}</p>
                <span className="text-xs text-blue-600 font-semibold flex items-center gap-0.5 justify-end mt-1">
                  View Project <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ─────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Own at The Kharis?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            3-bedroom from $320,000 · 4-bedroom from $420,000 — with interest-free payment plans.
            East Airport, Accra's most connected address.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Bestworld, I'm interested in The Kharis. Please send me details and payment plan options.")}`}
              target="_blank" rel="noopener noreferrer"
              className="bg-white text-blue-700 font-bold px-8 py-3.5 rounded-full hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm">
              <MessageCircle className="w-4 h-4" /> WhatsApp Our Team
            </a>
            <Link href="/properties"
              className="border-2 border-white text-white font-bold px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors text-sm">
              Browse All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 px-6 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <p className="text-white font-bold text-lg mb-2">Dwellot</p>
            <p className="text-gray-500 text-xs leading-relaxed">
              Ghana's trusted property platform. Connecting buyers, sellers, and developers across Accra and beyond.
            </p>
          </div>
          <div>
            <p className="text-white font-semibold mb-3">Bestworld Projects</p>
            <div className="flex flex-col gap-2">
              <Link href="/anowaa-gardens" className="hover:text-white transition-colors">Anowaa Gardens</Link>
              <Link href="/the-kharis" className="hover:text-white transition-colors">The Kharis</Link>
              <Link href="/mantebea-gardens" className="hover:text-white transition-colors">Mantebea Gardens</Link>
              <Link href="/properties" className="hover:text-white transition-colors">All Properties</Link>
            </div>
          </div>
          <div>
            <p className="text-white font-semibold mb-3">Contact Bestworld</p>
            <div className="flex flex-col gap-2 text-xs">
              <p className="text-gray-300 font-medium">🇬🇭 Ghana Office</p>
              <a href="tel:+233552599185" className="hover:text-white">+233 55 259 9185</a>
              <a href="tel:+233201578429" className="hover:text-white">+233 20 157 8429</a>
              <p className="text-gray-300 font-medium mt-2">🇬🇧 UK Office</p>
              <a href="tel:+447861932209" className="hover:text-white">+44 7861 932209</a>
              <a href="mailto:support@dwellot.com" className="hover:text-white flex items-center gap-1">
                <Mail className="w-3 h-3" /> support@dwellot.com
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© 2026 Dwellot. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </footer>

      {/* ── Floating WhatsApp ───────────────────────────────────────────────── */}
      <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`}
        target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-colors"
        aria-label="Chat on WhatsApp">
        <MessageCircle className="w-6 h-6" />
      </a>

    </main>
  )
}
