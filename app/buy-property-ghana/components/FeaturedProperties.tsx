"use client"

import { motion } from "framer-motion"
import { MapPin, Bed, Bath, Maximize2, ArrowRight } from "lucide-react"
import Link from "next/link"

const properties = [
  {
    badge: "Featured",
    badgeColor: "bg-[#14b8a6] text-white",
    title: "3-Bedroom Executive Townhouse",
    location: "East Legon, Accra",
    beds: 3,
    baths: 3,
    sqm: 220,
    price: "$185,000",
    imageBg: "from-[#0f766e] to-[#14b8a6]",
  },
  {
    badge: "New",
    badgeColor: "bg-emerald-500 text-white",
    title: "2-Bedroom Luxury Apartment",
    location: "Airport Hills, Accra",
    beds: 2,
    baths: 2,
    sqm: 140,
    price: "$95,000",
    imageBg: "from-[#0d9488] to-[#2dd4bf]",
  },
  {
    badge: "Premium",
    badgeColor: "bg-amber-500 text-white",
    title: "5-Bedroom Gated Estate Home",
    location: "Cantonments, Accra",
    beds: 5,
    baths: 4,
    sqm: 480,
    price: "$420,000",
    imageBg: "from-[#115e59] to-[#0f766e]",
  },
]

export default function FeaturedProperties() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-[#14b8a6] text-sm font-semibold uppercase tracking-widest mb-2">
            Handpicked For You
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-balance">
            Featured Properties in Ghana
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto leading-relaxed">
            A selection of our most popular verified listings available for remote purchase.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, i) => (
            <motion.div
              key={property.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              {/* Image placeholder */}
              <div className={`relative h-48 bg-gradient-to-br ${property.imageBg} flex items-center justify-center`}>
                <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${property.badgeColor}`}>
                  {property.badge}
                </span>
                <svg
                  className="opacity-20 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3 9.5L12 3l9 6.5V21H3V9.5z" />
                </svg>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 text-base mb-1 leading-snug">{property.title}</h3>
                <div className="flex items-center gap-1 text-gray-400 text-sm mb-4">
                  <MapPin size={13} />
                  <span>{property.location}</span>
                </div>

                {/* Details */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Bed size={14} /> {property.beds} Beds
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath size={14} /> {property.baths} Baths
                  </span>
                  <span className="flex items-center gap-1">
                    <Maximize2 size={14} /> {property.sqm} m²
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#14b8a6] font-bold text-lg">{property.price}</span>
                  <Link
                    href="/properties"
                    className="flex items-center gap-1 text-sm font-semibold text-[#14b8a6] hover:text-[#0d9488] transition-colors group-hover:gap-2"
                  >
                    View Details <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 bg-[#14b8a6] hover:bg-[#0d9488] text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Browse All Properties <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
