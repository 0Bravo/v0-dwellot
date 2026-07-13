"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  MapPin, Mail, CheckCircle, ChevronRight,
  MessageCircle, BedDouble, Bath, Maximize2, Building2,
  Car, Dumbbell, Lock, Droplets, Trees, Shield, CalendarDays, Clock,
} from "lucide-react"

// ─── Shared constants ─────────────────────────────────────────────────────────
const WA_NUMBER = "447576368312"
const WA_BASE = `https://wa.me/${WA_NUMBER}?text=`

// ─── Property data ────────────────────────────────────────────────────────────
const PROPERTIES = [
  {
    id: "kharis",
    name: "The Kharis",
    tagline: "3 & 4-Bedroom Homes with BQ",
    location: "East Airport, Accra",
    priceFrom: "$320,000",
    priceNote: "4-bedroom from $420,000",
    gradient: "from-blue-800 via-blue-700 to-indigo-600",
    accent: "blue",
    accentHex: "#2563eb",
    href: "/the-kharis",
    waMsg: "Hi Dwellot! I'm interested in The Kharis (East Airport). Please share more details.",
    images: [
      "https://lom7safe82jeycnd.public.blob.vercel-storage.com/properties/1776441545456-IMG-20240425-WA0002-w269FJHWphRZOozUJyOB43L5cGzHPj.jpg",
      "https://lom7safe82jeycnd.public.blob.vercel-storage.com/properties/1776441545553-IMG-20240425-WA0021-MYKwfneCBosnBcgTcI835l8WkJqrnW.jpg",
      "https://lom7safe82jeycnd.public.blob.vercel-storage.com/properties/1776441545379-IMG-20240612-WA0076-Fs5oaNhEgUXDXxcOxgeMFSTE3GSgNW.jpg",
      "https://lom7safe82jeycnd.public.blob.vercel-storage.com/properties/1776441545036-IMG-20240612-WA0077-V4g32zYlAX544781knceywFiu7a2u3.jpg",
    ],
    units: [
      {
        label: "3-Bedroom + BQ",
        beds: 3, baths: 3, area: "220 m²", parking: 2,
        price: "$320,000", priceRaw: 320000,
        badge: "Most Popular",
        plan: [
          { stage: "Reservation", pct: 10, note: "Secures your unit" },
          { stage: "Foundation", pct: 30, note: "At foundation slab" },
          { stage: "Superstructure", pct: 30, note: "Walls & roof complete" },
          { stage: "Completion", pct: 30, note: "Keys handover" },
        ],
      },
      {
        label: "4-Bedroom + BQ",
        beds: 4, baths: 4, area: "280 m²", parking: 2,
        price: "$420,000", priceRaw: 420000,
        badge: "Premium",
        plan: [
          { stage: "Reservation", pct: 10, note: "Secures your unit" },
          { stage: "Foundation", pct: 30, note: "At foundation slab" },
          { stage: "Superstructure", pct: 30, note: "Walls & roof complete" },
          { stage: "Completion", pct: 30, note: "Keys handover" },
        ],
      },
    ],
    features: [
      "Spacious open-plan living",
      "Fitted kitchen with modern appliances",
      "Boys Quarters (BQ)",
      "Built-in wardrobes",
      "Private parking × 2",
      "Water storage tank",
      "Backup power infrastructure",
      "Gated community with 24/7 security",
    ],
  },
  {
    id: "mantebea",
    name: "Mantebea Gardens",
    tagline: "3, 4 & 5-Bedroom Homes",
    location: "East Amrahia, Accra",
    priceFrom: "$140,000",
    priceNote: "5-bedroom from $280,000",
    gradient: "from-teal-800 via-teal-700 to-emerald-600",
    accent: "teal",
    accentHex: "#0d9488",
    href: "/mantebea-gardens",
    waMsg: "Hi Dwellot! I'm interested in Mantebea Gardens (East Amrahia). Please share more details.",
    images: [
      "https://lom7safe82jeycnd.public.blob.vercel-storage.com/properties/1776443299141-IMG-20240612-WA0007-GLhaANZ7WZ2FOd89ozRjJFiXxFdQpp.jpg",
      "https://lom7safe82jeycnd.public.blob.vercel-storage.com/properties/1776443299066-IMG-20240612-WA0008-wWLA5jivJWZYcUE836Ulg9UpXo41Gv.jpg",
      "https://lom7safe82jeycnd.public.blob.vercel-storage.com/properties/1776443299806-IMG-20240612-WA0009-VU4kPrjcO4kqddoUdPHoeoPuxdQYdx.jpg",
      "https://lom7safe82jeycnd.public.blob.vercel-storage.com/properties/1776443299089-IMG-20240612-WA0010-BEfp1vsrqs1B5nqLpKRM4tdbnU15.jpg",
    ],
    units: [
      {
        label: "3-Bedroom Single-Storey",
        beds: 3, baths: 2, area: "160 m²", parking: 2,
        price: "$140,000", priceRaw: 140000,
        badge: "Best Value",
        plan: [
          { stage: "Reservation", pct: 10, note: "Locks your plot" },
          { stage: "Foundation", pct: 25, note: "Ground works begin" },
          { stage: "Superstructure", pct: 35, note: "Walls & roof" },
          { stage: "Completion", pct: 30, note: "Keys handover" },
        ],
      },
      {
        label: "4-Bedroom",
        beds: 4, baths: 3, area: "200 m²", parking: 2,
        price: "$200,000", priceRaw: 200000,
        badge: "Popular",
        plan: [
          { stage: "Reservation", pct: 10, note: "Locks your plot" },
          { stage: "Foundation", pct: 25, note: "Ground works begin" },
          { stage: "Superstructure", pct: 35, note: "Walls & roof" },
          { stage: "Completion", pct: 30, note: "Keys handover" },
        ],
      },
      {
        label: "5-Bedroom",
        beds: 5, baths: 4, area: "260 m²", parking: 2,
        price: "$280,000", priceRaw: 280000,
        badge: "Spacious",
        plan: [
          { stage: "Reservation", pct: 10, note: "Locks your plot" },
          { stage: "Foundation", pct: 25, note: "Ground works begin" },
          { stage: "Superstructure", pct: 35, note: "Walls & roof" },
          { stage: "Completion", pct: 30, note: "Keys handover" },
        ],
      },
    ],
    features: [
      "Single & double storey options",
      "3, 4 and 5 bedroom configurations",
      "Modern fitted kitchen",
      "Private garden / compound",
      "Private parking × 2",
      "Water storage & booster pump",
      "Backup power infrastructure",
      "Quiet, fast-growing neighbourhood",
    ],
  },
  {
    id: "anowaa",
    name: "Anowaa Gardens",
    tagline: "3-Bedroom Townhomes with BQ",
    location: "East Airport, Accra",
    priceFrom: "$300,000",
    priceNote: "3BR + BQ townhomes",
    gradient: "from-emerald-800 via-emerald-700 to-teal-600",
    accent: "emerald",
    accentHex: "#059669",
    href: "/anowaa-gardens",
    waMsg: "Hi Dwellot! I'm interested in Anowaa Gardens (East Airport). Please share more details.",
    images: [
      "https://lom7safe82jeycnd.public.blob.vercel-storage.com/properties/1776441019239-Anowaa%20Gardens%20%2810%29-fx9mAaurRfTiZ4bZf1pAQMRH8mfr4h.jpg",
      "https://lom7safe82jeycnd.public.blob.vercel-storage.com/properties/1776441019202-Anowaa%20Gardens%20%20%281%29%20-%20Copy-dELpBXvc8NrKwD5Rp1GzZzulSKtojE.jpg",
      "https://lom7safe82jeycnd.public.blob.vercel-storage.com/properties/1776441021583-Anowaa%20Gardens%20%20%281%29%20-%20Copy-J2G64heInSYJBJoGjHgy8NWy2bvGj0.png",
      "https://lom7safe82jeycnd.public.blob.vercel-storage.com/properties/1776441020523-Anowaa%20Gardens%20%20%282%29%20-%20Copy-SXQFsouYPug2zckLFTgX0I5q5bI4TV.png",
    ],
    units: [
      {
        label: "3-Bedroom Townhome + BQ",
        beds: 3, baths: 3, area: "200 m²", parking: 2,
        price: "$300,000", priceRaw: 300000,
        badge: "Gated Community",
        plan: [
          { stage: "Reservation", pct: 10, note: "Secures your unit" },
          { stage: "Foundation", pct: 30, note: "At foundation slab" },
          { stage: "Superstructure", pct: 30, note: "Walls & roof complete" },
          { stage: "Completion", pct: 30, note: "Keys handover" },
        ],
      },
    ],
    features: [
      "3 spacious bedrooms + BQ",
      "3.5 bathrooms",
      "Fitted kitchen",
      "Boys Quarters (BQ)",
      "Built-in wardrobes",
      "Private parking × 2",
      "Swimming pool & gym",
      "Gated estate, 24/7 security",
    ],
  },
]

// ─── Mortgage calculator ──────────────────────────────────────────────────────
function MortgageCalc() {
  const [price, setPrice] = useState(300000)
  const [dep, setDep] = useState(20)
  const [yrs, setYrs] = useState(15)
  const [results, setResults] = useState<null | {
    loan: number; ghsMo: number; ghsTot: number; usdMo: number; usdTot: number
  }>(null)

  function pmt(rate: number, months: number, principal: number) {
    if (rate === 0) return principal / months
    return (rate * principal * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
  }

  function fmt(val: number) {
    return Math.round(val).toLocaleString("en-US")
  }

  function calculate() {
    const loan = price * (1 - dep / 100)
    const months = yrs * 12
    const ghsMo = pmt(0.22 / 12, months, loan)
    const usdMo = pmt(0.105 / 12, months, loan)
    setResults({
      loan,
      ghsMo,
      ghsTot: ghsMo * months,
      usdMo,
      usdTot: usdMo * months,
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-600 px-6 py-5 text-white">
        <h3 className="text-lg font-bold mb-0.5">Absa Ghana Mortgage Calculator</h3>
        <p className="text-blue-100 text-sm">GHS rate: 22% p.a. · USD rate: 10.5% p.a. · Up to 15 years · Up to 90% LTV</p>
      </div>
      <div className="p-6 space-y-5">
        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Property Price (USD)</label>
            <select
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value={140000}>Mantebea 3BR — $140,000</option>
              <option value={200000}>Mantebea 4BR — $200,000</option>
              <option value={280000}>Mantebea 5BR — $280,000</option>
              <option value={300000}>Anowaa 3BR — $300,000</option>
              <option value={320000}>Kharis 3BR — $320,000</option>
              <option value={420000}>Kharis 4BR — $420,000</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Deposit (%)</label>
            <select
              value={dep}
              onChange={e => setDep(Number(e.target.value))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value={10}>10% (Absa minimum)</option>
              <option value={15}>15%</option>
              <option value={20}>20%</option>
              <option value={25}>25%</option>
              <option value={30}>30%</option>
              <option value={40}>40%</option>
              <option value={50}>50%</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Loan Term (years)</label>
            <select
              value={yrs}
              onChange={e => setYrs(Number(e.target.value))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {[5, 7, 10, 12, 15].map(y => (
                <option key={y} value={y}>{y} years</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
        >
          Calculate My Payments →
        </button>

        {results && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <p className="text-gray-500 text-xs text-center">
              Loan amount: <strong className="text-gray-800">${fmt(results.loan)}</strong>
              {" · "}{dep}% deposit · {yrs} year term
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* GHS loan */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <p className="text-xs font-bold text-orange-700 uppercase tracking-wide mb-2">GHS Loan · 22% p.a.</p>
                <p className="text-2xl font-black text-orange-800">${fmt(results.ghsMo)}<span className="text-sm font-medium text-orange-600"> / mo</span></p>
                <p className="text-xs text-orange-600 mt-1">Total repaid: ${fmt(results.ghsTot)}</p>
                <p className="text-xs text-orange-500">Interest cost: ${fmt(results.ghsTot - results.loan)}</p>
              </div>
              {/* USD loan */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-2">USD Loan · 10.5% p.a.</p>
                <p className="text-2xl font-black text-green-800">${fmt(results.usdMo)}<span className="text-sm font-medium text-green-600"> / mo</span></p>
                <p className="text-xs text-green-600 mt-1">Total repaid: ${fmt(results.usdTot)}</p>
                <p className="text-xs text-green-500">Interest cost: ${fmt(results.usdTot - results.loan)}</p>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-center">
              <p className="text-blue-800 text-sm font-semibold">
                💡 USD loan saves you <strong>${fmt(results.ghsTot - results.usdTot)}</strong> in interest over {yrs} years
              </p>
            </div>
            <p className="text-gray-400 text-xs text-center">
              Estimates only. Subject to Absa Ghana credit assessment & prevailing rates.{" "}
              <a href="https://www.absa.com.gh/personal/borrowing/home-loan/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">Apply at Absa →</a>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// ─── Property card ────────────────────────────────────────────────────────────
function PropertyCard({ prop }: { prop: typeof PROPERTIES[0] }) {
  const [activeUnit, setActiveUnit] = useState(0)
  const unit = prop.units[activeUnit]

  return (
    <section id={prop.id} className="py-16 scroll-mt-20">
      {/* Header */}
      <div className={`bg-gradient-to-br ${prop.gradient} text-white rounded-3xl overflow-hidden mb-8`}>
        <div className="max-w-5xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <Building2 className="w-3.5 h-3.5" /> By Bestworld Real Estate · {prop.location}
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold mb-3">{prop.name}</h2>
            <p className="text-white/80 text-base mb-2">{prop.tagline}</p>
            <p className="text-white/60 flex items-center gap-1.5 text-sm mb-5">
              <MapPin className="w-4 h-4" /> {prop.location}
            </p>
            <div className="text-3xl font-black mb-1">From {prop.priceFrom}</div>
            <p className="text-white/70 text-xs mb-6">{prop.priceNote}</p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`${WA_BASE}${encodeURIComponent(prop.waMsg)}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-5 py-2.5 rounded-full text-sm hover:bg-gray-50 transition-colors"
              >
                <MessageCircle className="w-4 h-4" style={{ color: prop.accentHex }} /> WhatsApp Us
              </a>
              <Link
                href={prop.href}
                className="inline-flex items-center gap-2 border-2 border-white/60 text-white font-bold px-5 py-2.5 rounded-full text-sm hover:bg-white/10 transition-colors"
              >
                Full Details <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          {/* Image grid */}
          <div className="grid grid-cols-2 gap-2">
            {prop.images.map((src, i) => (
              <div key={i} className="relative h-36 rounded-xl overflow-hidden bg-white/10">
                <Image src={src} alt={`${prop.name} photo ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {/* Unit selector */}
        {prop.units.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {prop.units.map((u, i) => (
              <button
                key={i}
                onClick={() => setActiveUnit(i)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${
                  activeUnit === i
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {u.label}
              </button>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Unit details */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-black text-gray-900">{unit.price}</span>
              <span className="text-xs font-bold bg-gray-900 text-white px-2.5 py-1 rounded-full">{unit.badge}</span>
            </div>
            {/* Specs row */}
            <div className="flex flex-wrap gap-3 mb-6">
              {[
                { icon: <BedDouble className="w-4 h-4" />, text: `${unit.beds} Beds` },
                { icon: <Bath className="w-4 h-4" />, text: `${unit.baths} Baths` },
                { icon: <Maximize2 className="w-4 h-4" />, text: unit.area },
                { icon: <Car className="w-4 h-4" />, text: `${unit.parking} Parking` },
              ].map((s) => (
                <span key={s.text} className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                  {s.icon} {s.text}
                </span>
              ))}
            </div>
            {/* Features */}
            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">What's included</h4>
            <div className="grid grid-cols-1 gap-2">
              {prop.features.map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Payment plan */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Payment Plan — {unit.label}</h4>
            <div className="space-y-3">
              {unit.plan.map((stage, i) => (
                <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-xl px-4 py-3">
                  <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-black flex-shrink-0">
                    {stage.pct}%
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{stage.stage}</p>
                    <p className="text-xs text-gray-500">{stage.note}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-sm font-semibold text-gray-800">
                      ${Math.round(unit.priceRaw * stage.pct / 100).toLocaleString("en-US")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <p className="font-semibold mb-1">✦ Interest-free payment plan</p>
              <p className="text-xs text-amber-700">No interest, no hidden fees. Payments tied to construction milestones.</p>
            </div>
            <a
              href={`${WA_BASE}${encodeURIComponent(`Hi Dwellot! I want to know more about the payment plan for ${prop.name} (${unit.label}). Please get in touch.`)}`}
              target="_blank" rel="noopener noreferrer"
              className="mt-4 w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4" /> Enquire About This Unit
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BestworldPage() {
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
        {/* Property anchor nav */}
        <div className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-600">
          <a href="#kharis" className="hover:text-blue-600 transition-colors">The Kharis</a>
          <a href="#mantebea" className="hover:text-teal-600 transition-colors">Mantebea</a>
          <a href="#anowaa" className="hover:text-emerald-600 transition-colors">Anowaa</a>
        </div>
        <a
          href={`${WA_BASE}${encodeURIComponent("Hi Dwellot! I'd like to know more about Bestworld properties in Accra.")}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Us
        </a>
      </div>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 text-white overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <Building2 className="w-3.5 h-3.5" /> Bestworld Real Estate · Accra, Ghana
            </span>
            <h1 className="text-4xl lg:text-6xl font-black mb-5 leading-tight">
              Premium Homes in<br />
              <span className="text-teal-400">Accra, Ghana</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Three exceptional developments. Interest-free payment plans. Built for diaspora and local buyers alike.
              From <strong className="text-white">$140,000</strong> — East Airport &amp; East Amrahia.
            </p>
            {/* Property jump buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {PROPERTIES.map((p) => (
                <a key={p.id} href={`#${p.id}`}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-full text-sm transition-colors">
                  {p.name} · {p.priceFrom}
                </a>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`${WA_BASE}${encodeURIComponent("Hi Dwellot! I'd like to learn about all the Bestworld properties in Accra.")}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-7 py-3.5 rounded-full transition-colors text-sm"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Our Team
              </a>
              <a href="#calculator"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-bold px-7 py-3.5 rounded-full hover:bg-white/10 transition-colors text-sm">
                Mortgage Calculator ↓
              </a>
            </div>
          </motion.div>
        </div>
        {/* Stat bar */}
        <div className="border-t border-white/10 bg-white/5">
          <div className="max-w-4xl mx-auto px-6 py-4 grid grid-cols-3 gap-4 text-center text-sm">
            {[
              { label: "Developments", value: "3" },
              { label: "Locations in Accra", value: "2" },
              { label: "Starting from", value: "$140K" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-white font-black text-xl">{s.value}</p>
                <p className="text-gray-400 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Properties ─────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="divide-y divide-gray-100">
          {PROPERTIES.map((prop) => (
            <PropertyCard key={prop.id} prop={prop} />
          ))}
        </div>
      </div>

      {/* ── Absa Mortgage Calculator ────────────────────────────────────────── */}
      <section id="calculator" className="bg-gray-50 py-16 scroll-mt-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Mortgage Calculator</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Use Absa Ghana's home loan to finance your purchase.
              Compare GHS vs USD loan costs and find the right option for you.
            </p>
          </div>
          <MortgageCalc />
          {/* Absa key facts */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Max LTV", value: "90%" },
              { label: "GHS Rate", value: "22% p.a." },
              { label: "USD Rate", value: "10.5% p.a." },
              { label: "Max Term", value: "15 years" },
            ].map((f) => (
              <div key={f.label} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                <p className="text-xl font-black text-gray-900">{f.value}</p>
                <p className="text-xs text-gray-500 mt-1">{f.label}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-xs text-center mt-4">
            Source: Absa Ghana Home Loan. Rates subject to change.{" "}
            <a href="https://www.absa.com.gh/personal/borrowing/home-loan/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">
              Learn more →
            </a>
          </p>
        </div>
      </section>

      {/* ── Why Bestworld ───────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900">Why Buy with Bestworld?</h2>
          <p className="text-gray-500 mt-2 text-sm">Trusted by diaspora buyers across the UK, US, and Europe</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: <Shield className="w-6 h-6 text-blue-500" />,
              title: "Fully Titled Properties",
              desc: "Every Bestworld home comes with clean title documentation. No disputes, no complications — you own it outright.",
            },
            {
              icon: <CalendarDays className="w-6 h-6 text-teal-500" />,
              title: "Interest-Free Payment Plans",
              desc: "Pay in milestone-linked instalments — no bank needed, no interest charged. Perfect for buyers building up to outright ownership.",
            },
            {
              icon: <MessageCircle className="w-6 h-6 text-emerald-500" />,
              title: "Diaspora-Friendly Process",
              desc: "Our Ghana and UK teams support you remotely — virtual tours, legal checks, and key handover handled on your behalf.",
            },
            {
              icon: <Building2 className="w-6 h-6 text-indigo-500" />,
              title: "Quality You Can See",
              desc: "Premium finishes, solid construction, and thoughtful layouts — built to stand the test of time in Accra's growing property market.",
            },
          ].map((p, i) => (
            <motion.div key={p.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex gap-4">
              <span className="flex-shrink-0 mt-1">{p.icon}</span>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ─────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-gray-900 to-slate-800 text-white py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Own in Accra?</h2>
          <p className="text-gray-300 mb-8 text-base max-w-xl mx-auto">
            Three projects. Interest-free plans. Remote buying made easy.
            Our team in Ghana and the UK is ready to help you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <a
              href={`${WA_BASE}${encodeURIComponent("Hi Dwellot! I'd like to learn about Bestworld properties in Accra. Please get in touch.")}`}
              target="_blank" rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3.5 rounded-full transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Our Team
            </a>
            <Link href="/properties"
              className="border-2 border-white/40 text-white font-bold px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors text-sm flex items-center justify-center">
              Browse All Properties
            </Link>
          </div>
          {/* Contact strip */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-400">
            <div>
              <span className="text-white font-semibold">🇬🇭 Ghana: </span>
              <a href="tel:+447576368312" className="hover:text-white">+44 7576 368312</a>
              {" · "}
              <a href="tel:+447576368312" className="hover:text-white">+44 7576 368312</a>
            </div>
            <div>
              <span className="text-white font-semibold">🇬🇧 UK: </span>
              <a href="tel:+447576368312" className="hover:text-white">+44 7576 368312</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-950 text-gray-400 px-6 py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <p className="text-white font-bold text-lg mb-2">Dwellot</p>
            <p className="text-gray-500 text-xs leading-relaxed">
              Ghana's trusted property platform. Connecting diaspora and local buyers with quality developers across Accra.
            </p>
          </div>
          <div>
            <p className="text-white font-semibold mb-3">Bestworld Projects</p>
            <div className="flex flex-col gap-2">
              <a href="#kharis" className="hover:text-white transition-colors">The Kharis — East Airport</a>
              <a href="#mantebea" className="hover:text-white transition-colors">Mantebea Gardens — East Amrahia</a>
              <a href="#anowaa" className="hover:text-white transition-colors">Anowaa Gardens — East Airport</a>
              <Link href="/properties" className="hover:text-white transition-colors mt-1">All Properties →</Link>
            </div>
          </div>
          <div>
            <p className="text-white font-semibold mb-3">Get in Touch</p>
            <div className="flex flex-col gap-1.5 text-xs">
              <p className="text-gray-300 font-medium">🇬🇭 Ghana Office</p>
              <a href="tel:+447576368312" className="hover:text-white">+44 7576 368312</a>
              <a href="tel:+447576368312" className="hover:text-white">+44 7576 368312</a>
              <p className="text-gray-300 font-medium mt-2">🇬🇧 UK Office</p>
              <a href="tel:+447576368312" className="hover:text-white">+44 7576 368312</a>
              <a href="mailto:support@dwellot.com" className="hover:text-white flex items-center gap-1 mt-1">
                <Mail className="w-3 h-3" /> support@dwellot.com
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© 2026 Dwellot. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </footer>

      {/* ── Floating WhatsApp ───────────────────────────────────────────────── */}
      <a
        href={`${WA_BASE}${encodeURIComponent("Hi Dwellot! I'd like to learn about Bestworld properties in Accra.")}`}
        target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-colors"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>

    </main>
  )
}
