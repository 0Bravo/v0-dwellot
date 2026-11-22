"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import HeroSearchBar from "@/components/HeroSearchBar"

/**
 * The hero that used to open the homepage, now at the top of the listings.
 *
 * The homepage leads with the money question; this is where someone who has
 * already decided to look at houses arrives. The search box comes with it,
 * because here it is the first thing wanted rather than the last.
 *
 * The headline is deliberately not an h1: the listings header below carries
 * the real one, and it changes with the filters ("Properties for Sale & Rent
 * in East Legon"), which is the heading worth having in search results.
 */
export function PropertiesHero() {
  const [popularFilters, setPopularFilters] = useState({
    priceRange: "Under $300K",
    bedrooms: "3+ bedrooms",
    location: "Cantonments",
    locationCount: 0,
  })

  useEffect(() => {
    let cancelled = false
    fetch("/api/popular-filters")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && !cancelled) setPopularFilters(data)
      })
      .catch(() => {
        // The defaults above are perfectly usable; a failed fetch is not
        // worth showing anyone an error for.
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0">
            <Image
              src="/images/hero-bg.jpg"
              alt="Ghana coastal cityscape"
              fill
              className="object-cover"
              priority
              fetchPriority="high"
              quality={65}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 z-10" />
          </div>

          <div className="relative z-20 py-12 md:py-16 px-6 md:px-12">
            <div className="text-center mb-8">
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 font-display">
                Homes for sale and rent <span className="text-emerald-400">across Ghana</span>
              </p>
              <p className="text-lg md:text-xl text-white/90 font-medium">
                From agents and developers, with what each one costs to buy.
              </p>
            </div>

            <HeroSearchBar popularFilters={popularFilters} />
          </div>
        </div>
      </div>
    </section>
  )
}
