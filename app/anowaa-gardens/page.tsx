"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  MapPin, Phone, Mail, CheckCircle, Shield, ChevronRight,
  MessageCircle, BedDouble, Bath, Maximize2, Building2,
  Car, Wifi, Dumbbell, Lock, Droplets, Trees,
} from "lucide-react"

// ─── Images (from Vercel Blob Storage) ───────────────────────────────────────
const GALLERY_IMAGES = [
  "https://lom7safe82jeycnd.public.blob.vercel-storage.com/properties/1776441019239-Anowaa%20Gardens%20%2810%29-fx9mAaurRfTiZ4bZf1pAQMRH8mfr4h.jpg",
  "https://lom7safe82jeycnd.public.blob.vercel-storage.com/properties/1776441019202-Anowaa%20Gardens%20%20%281%29%20-%20Copy-dELpBXvc8NrKwD5Rp1GzZzulSKtojE.jpg",
  "https://lom7safe82jeycnd.public.blob.vercel-storage.com/properties/1776441021583-Anowaa%20Gardens%20%20%281%29%20-%20Copy-J2G64heInSYJBJoGjHgy8NWy2bvGj0.png",
  "https://lom7safe82jeycnd.public.blob.vercel-storage.com/properties/1776441020523-Anowaa%20Gardens%20%20%282%29%20-%20Copy-SXQFsouYPug2zckLFTgX0I5q5bI4TV.png",
  "https://lom7safe82jeycnd.public.blob.vercel-storage.com/properties/1776441018459-Anowaa%20Gardens%20%20%282%29-65Kk2UH9R5boEHKt0p7n17QeJjSyLA.jpg",
  "https://lom7safe82jeycnd.public.blob.vercel-storage.com/properties/1776441019186-Anowaa%20Gardens%20%20%283%29%20-%20Copy-inxDLVumOeu2WVdiCTjdqzMXqkGSf1.jpg",
  "https://lom7safe82jeycnd.public.blob.vercel-storage.com/properties/1776441019694-Anowaa%20Gardens%20%20%283%29-uf7RVLmRlduoyuBwbcjLuhW7XCkdJR.png",
  "https://lom7safe82jeycnd.public.blob.vercel-storage.com/properties/1776441019202-Anowaa%20Gardens%20%20%284%29-oJ0KgbBsz0IVubUQqAdc0qjhzKGXPw.jpg",
]

// ─── Property Data ────────────────────────────────────────────────────────────
const PROPERTY = {
  name: "Anowaa Gardens",
  tagline: "Peaceful, Modern Living in East Airport, Accra",
  location: "East Airport, Accra",
  price: "$300,000",
  priceUSD: 300000,
  beds: 3,
  baths: 3,
  halfBath: true,
  area: "200 m²",
  parking: 2,
  type: "3-Bedroom Townhome with BQ",
  paymentNote: "Interest-free flexible payment plans available",
  whatsappNumber: "447576368312",
  whatsappMessage: "Hi Bestworld, I'm interested in Anowaa Gardens (East Airport). Please send me more details.",
  heroGradient: "from-emerald-800 via-emerald-700 to-teal-600",
  accentColor: "emerald",
}

const FEATURES = [
  "3 Spacious Bedrooms",
  "3.5 Bathrooms",
  "Boys Quarters (BQ)",
  "Fitted Kitchen",
  "Built-in Wardrobes",
  "Private Parking (x2)",
  "Water Storage Tank",
  "Backup Power Infrastructure",
  "200 sqm living space",
  "Gated Community",
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
    title: "Prime East Airport Location",
    desc: "Minutes from Kotoka International Airport, international schools, shopping malls, and Accra's business district.",
  },
  {
    title: "Interest-Free Payment Plans",
    desc: "Secure your home with a flexible, interest-free instalment plan. No hidden charges — Bestworld makes ownership straightforward.",
  },
  {
    title: "Built for Diaspora Buyers",
    desc: "Our team in Accra and London supports remote buyers every step of the way — virtual tours, legal checks, and key handover.",
  },
  {
    title: "Quality You Can See",
    desc: "Premium finishes, modern architecture, and thoughtful layouts designed for comfortable family living.",
  },
]

// ─── Lead Form ────────────────────────────────────────────────────────────────
function LeadForm({ propertyName }: { propertyName: string }) {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", timeline: "", message: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    if (status !== "idle") setStatus("idle")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          message: `[CAMPAIGN LEAD — ${propertyName}]\nTimeline: ${form.timeline}\n\n${form.message}`,
          source: `campaign-${propertyName.toLowerCase().replace(/\s+/g, "-")}`,
        }),
      })
      setStatus(res.ok ? "success" : "error")
      if (res.ok) {
          setForm({ fullName: "", email: "", phone: "", timeline: "", message: "" })
          if (typeof window !== "undefined" && (window as any).fbq) {
            ;(window as any).fbq("track", "Lead", { content_name: propertyName, currency: "USD", value: 300000 })
          }
        }
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
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address *</label>
          <input name="email" type="email" required value={form.email} onChange={handleChange}
            placeholder="you@example.com"
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Phone / WhatsApp</label>
        <input name="phone" type="tel" value={form.phone} onChange={handleChange}
          placeholder="+1 555 000 0000 or +44 7000 000000"
          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">When are you looking to buy?</label>
        <select name="timeline" value={form.timeline} onChange={handleChange}
          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400">
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
          placeholder="Specific questions, preferred viewing time, payment plan enquiry..."
          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none" />
      </div>
      <button type="submit" disabled={status === "loading"}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
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
          Something went wrong. WhatsApp us directly on{" "}
          <a href={`https://wa.me/${PROPERTY.whatsappNumber}`} className="underline font-semibold">+44 7576 368312</a>.
        </p>
      )}
      <p className="text-gray-400 text-xs text-center">We respect your privacy. No spam, ever.</p>
    </form>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AnowaaGardensPage() {
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
          <a href={`https://wa.me/${PROPERTY.whatsappNumber}?text=${encodeURIComponent(PROPERTY.whatsappMessage)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Us
          </a>
        </div>
      </div>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className={`bg-gradient-to-br ${PROPERTY.heroGradient} text-white overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">

          {/* Left: Copy */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-5">
              <Building2 className="w-3.5 h-3.5" /> By Bestworld Real Estate · East Airport, Accra
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Anowaa Gardens<br />
              <span className="text-emerald-200">Premium Townhomes</span><br />
              in East Airport
            </h1>
            <p className="text-emerald-100 text-lg mb-4 max-w-md leading-relaxed">
              A secure, beautifully designed gated community minutes from Kotoka Airport.
              3-bedroom townhomes with BQ, starting from <strong className="text-white">$300,000</strong>.
            </p>
            <p className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 text-yellow-200 text-sm font-semibold px-4 py-2 rounded-full mb-8">
              ✦ Interest-free flexible payment plans available
            </p>

            {/* Key specs */}
            <div className="flex flex-wrap gap-4 mb-8">
              {[
                { icon: <BedDouble className="w-4 h-4" />, text: "3 Bedrooms + BQ" },
                { icon: <Bath className="w-4 h-4" />, text: "3.5 Bathrooms" },
                { icon: <Maximize2 className="w-4 h-4" />, text: "200 m²" },
                { icon: <Car className="w-4 h-4" />, text: "2 Parking" },
              ].map((s) => (
                <span key={s.text} className="flex items-center gap-1.5 text-sm text-white/90 bg-white/10 px-3 py-1.5 rounded-full">
                  {s.icon} {s.text}
                </span>
              ))}
            </div>

            {/* Contact strip */}
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-emerald-100">
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
                <span className="text-emerald-300 text-xs ml-1">· London EC2A</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Lead Form */}
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8">
            <h2 className="text-gray-900 text-xl font-bold mb-1">Enquire About Anowaa Gardens</h2>
            <p className="text-gray-500 text-sm mb-5">
              Tell us about yourself — our team will respond within 24 hours with full pricing and a virtual tour.
            </p>
            <LeadForm propertyName="Anowaa Gardens" />
          </motion.div>
        </div>
      </section>

      {/* ── Image Gallery Strip ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">See Anowaa Gardens</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {GALLERY_IMAGES.slice(0, 8).map((src, i) => (
            <div key={i} className="relative h-48 rounded-xl overflow-hidden bg-gray-100">
              <Image
                src={src}
                alt={`Anowaa Gardens photo ${i + 1}`}
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

      {/* ── Property Details ────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-start">

          {/* Features list */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">What's Included</h2>
            <p className="text-gray-500 text-sm mb-6">Every Anowaa Gardens townhome comes with:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2.5 bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-100">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm font-medium">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Community Amenities</h2>
            <p className="text-gray-500 text-sm mb-6">Shared facilities within the gated Anowaa Gardens estate:</p>
            <div className="grid grid-cols-2 gap-4">
              {AMENITIES.map((a) => (
                <div key={a.label} className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <span className="text-emerald-600">{a.icon}</span>
                  <span className="text-gray-700 text-sm font-medium">{a.label}</span>
                </div>
              ))}
            </div>

            {/* Price box */}
            <div className="mt-8 bg-emerald-600 rounded-2xl p-6 text-white">
              <p className="text-emerald-200 text-xs font-semibold uppercase tracking-wide mb-1">Starting Price</p>
              <p className="text-4xl font-black mb-1">$300,000</p>
              <p className="text-emerald-200 text-sm mb-4">Interest-free flexible payment plans available</p>
              <a href={`https://wa.me/${PROPERTY.whatsappNumber}?text=${encodeURIComponent(PROPERTY.whatsappMessage)}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-5 py-2.5 rounded-full text-sm hover:bg-emerald-50 transition-colors">
                <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Buy Here ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900">Why Anowaa Gardens?</h2>
          <p className="text-gray-500 mt-2 text-sm max-w-xl mx-auto">
            A rare combination of premium location, quality build, and buyer-friendly payment terms
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {WHY_POINTS.map((p, i) => (
            <motion.div key={p.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex gap-4">
              <span className="text-3xl font-black text-emerald-100 leading-none flex-shrink-0">0{i + 1}</span>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Location ───────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              <MapPin className="w-6 h-6 text-emerald-600 inline mr-2" />
              East Airport, Accra
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Anowaa Gardens sits in one of Accra's most connected neighbourhoods — East Airport.
              You're minutes from Kotoka International Airport, the A&C Mall, international schools,
              hospitals, and the city's main business corridors.
            </p>
            <div className="space-y-3">
              {[
                "5 min to Kotoka International Airport",
                "10 min to Cantonments & Embassy district",
                "Near A&C Mall, Junction Mall",
                "Close to international schools",
                "Easy access to East Legon & Spintex Road",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-8 text-center">
            <Building2 className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
            <p className="text-gray-700 font-semibold mb-2">Schedule a Site Visit</p>
            <p className="text-gray-500 text-sm mb-5">
              Can't travel to Accra? We offer virtual tours via WhatsApp or Zoom.
              Our on-ground team shows you every room, the street, and the community.
            </p>
            <a href={`https://wa.me/${PROPERTY.whatsappNumber}?text=${encodeURIComponent("Hi Bestworld, I'd like to schedule a virtual tour of Anowaa Gardens.")}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-emerald-700 transition-colors">
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
              name: "The Kharis",
              location: "East Airport, Accra",
              price: "From $320,000",
              type: "3 & 4-Bedroom Homes with BQ",
              href: "/the-kharis",
              color: "bg-blue-600",
            },
            {
              name: "Mantebea Gardens",
              location: "East Amrahia, Accra",
              price: "From $140,000",
              type: "3, 4 & 5-Bedroom Homes",
              href: "/mantebea-gardens",
              color: "bg-teal-600",
            },
          ].map((proj) => (
            <Link key={proj.name} href={proj.href}
              className="group flex items-center justify-between bg-white border border-gray-200 hover:border-emerald-300 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
              <div>
                <p className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{proj.name}</p>
                <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> {proj.location}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">{proj.type}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-gray-900 text-sm">{proj.price}</p>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5 justify-end mt-1">
                  View Project <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ─────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-emerald-700 to-teal-600 text-white py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Own in Anowaa Gardens?</h2>
          <p className="text-emerald-100 mb-8 text-lg">
            3-bedroom townhomes from $300,000 with interest-free payment plans.
            Our team makes buying from anywhere in the world simple and stress-free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`https://wa.me/${PROPERTY.whatsappNumber}?text=${encodeURIComponent(PROPERTY.whatsappMessage)}`}
              target="_blank" rel="noopener noreferrer"
              className="bg-white text-emerald-700 font-bold px-8 py-3.5 rounded-full hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 text-sm">
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
      <a href={`https://wa.me/${PROPERTY.whatsappNumber}?text=${encodeURIComponent(PROPERTY.whatsappMessage)}`}
        target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-colors"
        aria-label="Chat on WhatsApp">
        <MessageCircle className="w-6 h-6" />
      </a>

    </main>
  )
}
