"use client"

import { useState } from "react"
import Link from "next/link"

interface PopularFilters {
  priceRange: string
  bedrooms: string
  location: string
  locationCount: number
}

export default function HeroSearchBar({ popularFilters }: { popularFilters: PopularFilters }) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[#0A1F44] rounded-2xl p-6 shadow-2xl">
        <h2 className="text-white text-base md:text-lg font-semibold mb-4">
          Search properties for sale and to rent
        </h2>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="e.g. East Legon, Accra, or Airport Hills"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                window.location.href = `/properties?search=${encodeURIComponent(searchQuery)}`
              }
            }}
            className="flex-1 px-5 py-4 rounded-lg bg-white text-gray-900 text-base focus:ring-2 focus:ring-emerald-400 focus:outline-none placeholder-gray-500 border border-gray-300"
          />
          <Link
            href={
              searchQuery.trim()
                ? `/properties?status=sale&search=${encodeURIComponent(searchQuery)}`
                : "/properties?status=sale"
            }
            className="px-8 py-4 bg-emerald-400 hover:bg-emerald-500 text-gray-900 font-bold rounded-lg transition text-center whitespace-nowrap"
          >
            For sale
          </Link>
          <Link
            href={
              searchQuery.trim()
                ? `/properties?status=rent&search=${encodeURIComponent(searchQuery)}`
                : "/properties?status=rent"
            }
            className="px-8 py-4 bg-cyan-400 hover:bg-cyan-500 text-gray-900 font-bold rounded-lg transition text-center whitespace-nowrap"
          >
            To rent
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-white text-sm">Popular:</span>
          <Link
            href={`/properties?price_max=${popularFilters.priceRange === "Under $250K" ? "250000" : popularFilters.priceRange === "Under $500K" ? "500000" : "1000000"}`}
            className="bg-white/20 text-white px-3 py-1 rounded-full text-sm hover:bg-white/30 transition"
          >
            {popularFilters.priceRange}
          </Link>
          <Link
            href={`/properties?bedrooms=${popularFilters.bedrooms}`}
            className="bg-white/20 text-white px-3 py-1 rounded-full text-sm hover:bg-white/30 transition"
          >
            {popularFilters.bedrooms}+ bedrooms
          </Link>
          <Link
            href={`/properties?location=${encodeURIComponent(popularFilters.location)}`}
            className="bg-white/20 text-white px-3 py-1 rounded-full text-sm hover:bg-white/30 transition"
          >
            {popularFilters.location} ({popularFilters.locationCount})
          </Link>
          <Link
            href="/properties?new=true"
            className="bg-white/20 text-white px-3 py-1 rounded-full text-sm hover:bg-white/30 transition"
          >
            New listings
          </Link>
        </div>
      </div>
    </div>
  )
}
