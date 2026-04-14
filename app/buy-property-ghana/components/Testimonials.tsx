"use client"

import { motion } from "framer-motion"
import { MapPin } from "lucide-react"

const testimonials = [
  {
    quote:
      "I bought my 3-bedroom home in East Legon completely remotely from London. The Dwellot team handled everything — I only flew in for the handover. Absolutely seamless.",
    name: "Abena Owusu",
    location: "London, UK",
    initials: "AO",
  },
  {
    quote:
      "As someone living in Toronto for 15 years, I always dreamed of owning back home. Dwellot made it real. Professional, responsive, and trustworthy from start to finish.",
    name: "Kweku Asante",
    location: "Toronto, Canada",
    initials: "KA",
  },
  {
    quote:
      "The virtual tour was incredibly detailed. I felt confident making an offer without physically being there. Closed on my apartment in Airport Hills within 6 weeks.",
    name: "Nana Ama Boateng",
    location: "New York, USA",
    initials: "NB",
  },
]

function StarRating() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-[#14b8a6] text-sm font-semibold uppercase tracking-widest mb-2">
            Buyer Stories
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-balance">
            Trusted by Buyers Worldwide
          </h2>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col gap-4"
            >
              <StarRating />
              <p className="text-gray-600 italic text-sm leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                <div className="w-9 h-9 rounded-full bg-[#14b8a6]/10 flex items-center justify-center text-[#14b8a6] font-bold text-sm flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="flex items-center gap-1 text-gray-400 text-xs">
                    <MapPin size={11} /> {t.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
