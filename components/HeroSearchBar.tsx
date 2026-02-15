"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import useSWR from "swr"
import { Search, MapPin, Building2, Home, Landmark } from "lucide-react"

interface PopularFilters {
  priceRange: string
  bedrooms: string
  location: string
  locationCount: number
}

interface Suggestion {
  label: string
  type: "location" | "developer" | "property_type" | "estate"
  count: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function getSuggestionIcon(type: string) {
  switch (type) {
    case "location": return <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
    case "developer": return <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
    case "property_type": return <Home className="w-4 h-4 text-gray-400 flex-shrink-0" />
    case "estate": return <Landmark className="w-4 h-4 text-gray-400 flex-shrink-0" />
    default: return <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
  }
}

function getSuggestionTypeLabel(type: string) {
  switch (type) {
    case "location": return "Location"
    case "developer": return "Developer"
    case "property_type": return "Type"
    case "estate": return "Estate"
    default: return type
  }
}

function getSuggestionUrl(suggestion: Suggestion) {
  switch (suggestion.type) {
    case "location": return `/properties?location=${encodeURIComponent(suggestion.label)}`
    case "developer": return `/properties?search=${encodeURIComponent(suggestion.label)}`
    case "property_type": return `/properties?property_type=${encodeURIComponent(suggestion.label.toLowerCase())}`
    case "estate": return `/properties?search=${encodeURIComponent(suggestion.label)}`
    default: return `/properties?search=${encodeURIComponent(suggestion.label)}`
  }
}

export default function HeroSearchBar({ popularFilters }: { popularFilters: PopularFilters }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { data } = useSWR<{ suggestions: Suggestion[] }>("/api/search-suggestions", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 600000,
  })

  const allSuggestions = data?.suggestions || []

  const filtered = searchQuery.trim().length > 0
    ? allSuggestions.filter((s) => s.label.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8)
    : allSuggestions.slice(0, 8)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function navigateToSuggestion(suggestion: Suggestion) {
    setShowSuggestions(false)
    window.location.href = getSuggestionUrl(suggestion)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showSuggestions) {
      if (e.key === "ArrowDown") {
        setShowSuggestions(true)
        e.preventDefault()
        return
      }
      if (e.key === "Enter" && searchQuery.trim()) {
        window.location.href = `/properties?search=${encodeURIComponent(searchQuery)}`
        return
      }
      return
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (selectedIndex >= 0 && filtered[selectedIndex]) {
        navigateToSuggestion(filtered[selectedIndex])
      } else if (searchQuery.trim()) {
        setShowSuggestions(false)
        window.location.href = `/properties?search=${encodeURIComponent(searchQuery)}`
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[#0A1F44] rounded-2xl p-6 shadow-2xl">
        <h2 className="text-white text-base md:text-lg font-semibold mb-4">
          Find your next home in Ghana
        </h2>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1" ref={wrapperRef}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search by location, developer, or property name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSuggestions(true)
                  setSelectedIndex(-1)
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                className="w-full pl-12 pr-5 py-4 rounded-lg bg-white text-gray-900 text-base focus:ring-2 focus:ring-emerald-400 focus:outline-none placeholder-gray-500 border border-gray-300"
                autoComplete="off"
                role="combobox"
                aria-expanded={showSuggestions}
                aria-haspopup="listbox"
                aria-autocomplete="list"
              />
            </div>

            {showSuggestions && (filtered.length > 0 || searchQuery.trim().length > 0) && (
              <div
                className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
                role="listbox"
              >
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50">
                  {searchQuery.trim().length === 0 ? "Browse by" : `Results for "${searchQuery}"`}
                </div>
                {filtered.map((suggestion, index) => (
                  <button
                    key={`${suggestion.type}-${suggestion.label}`}
                    onClick={() => navigateToSuggestion(suggestion)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition ${
                      index === selectedIndex
                        ? "bg-teal-50 text-teal-900"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    role="option"
                    aria-selected={index === selectedIndex}
                  >
                    {getSuggestionIcon(suggestion.type)}
                    <span className="flex-1">{suggestion.label}</span>
                    <span className="text-xs text-gray-400">{suggestion.count} {suggestion.count === 1 ? "listing" : "listings"}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{getSuggestionTypeLabel(suggestion.type)}</span>
                  </button>
                ))}
                {filtered.length === 0 && searchQuery.trim().length > 0 && (
                  <div className="px-4 py-4 text-sm text-gray-500 text-center">
                    No suggestions found. Press Enter to search for &ldquo;{searchQuery}&rdquo;
                  </div>
                )}
              </div>
            )}
          </div>

          <Link
            href={
              searchQuery.trim()
                ? `/properties?listing_type=sale&search=${encodeURIComponent(searchQuery)}`
                : "/properties?listing_type=sale"
            }
            className="px-8 py-4 bg-emerald-400 hover:bg-emerald-500 text-gray-900 font-bold rounded-lg transition text-center whitespace-nowrap"
          >
            For sale
          </Link>
          <Link
            href={
              searchQuery.trim()
                ? `/rent?search=${encodeURIComponent(searchQuery)}`
                : "/rent"
            }
            className="px-8 py-4 bg-cyan-400 hover:bg-cyan-500 text-gray-900 font-bold rounded-lg transition text-center whitespace-nowrap"
          >
            To rent
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-white text-sm">Popular:</span>
          <Link
            href={`/properties?max_price=${popularFilters.priceRange === "Under $100K" ? "100000" : popularFilters.priceRange === "Under $250K" ? "250000" : popularFilters.priceRange === "Under $300K" ? "300000" : popularFilters.priceRange === "Under $500K" ? "500000" : "1000000"}`}
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
            href="/properties?sort=newest"
            className="bg-white/20 text-white px-3 py-1 rounded-full text-sm hover:bg-white/30 transition"
          >
            New listings
          </Link>
        </div>
      </div>
    </div>
  )
}
