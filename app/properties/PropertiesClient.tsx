"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import useSWR from "swr"
import {
    MapPin,
    Bed,
    Bath,
    Square,
    Heart,
    Search,
    ChevronDown,
    X,
    Camera,
    Car,
    SlidersHorizontal,
    Loader2,
    Building2,
    Home,
    Landmark,
} from "lucide-react"

interface Suggestion {
    label: string
    type: "location" | "developer" | "property_type" | "estate"
    count: number
}

const suggestionFetcher = (url: string) => fetch(url).then((res) => res.json())

function getSuggestionIcon(type: string) {
    switch (type) {
      case "location":
              return <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
      case "developer":
              return <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
      case "property_type":
              return <Home className="w-4 h-4 text-gray-400 flex-shrink-0" />
      case "estate":
              return <Landmark className="w-4 h-4 text-gray-400 flex-shrink-0" />
      default:
              return <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
    }
}

function getSuggestionTypeLabel(type: string) {
    switch (type) {
      case "location":
              return "Location"
      case "developer":
              return "Developer"
      case "property_type":
              return "Type"
      case "estate":
              return "Estate"
      default:
              return type
    }
}

interface Property {
    id: number
    title: string
    location: string
    price: number
    property_type: string
    listing_type: string
    bedrooms: number
    bathrooms: number
    area: number
    parking?: number
    description: string
    images: string[]
    agent?: string
    phone?: string
    view_count?: number
    created_at?: string
}

interface Filters {
    search: string
    location: string
    listing_type: string
    property_type: string
    bedrooms: string
    min_price: string
    max_price: string
    sort: string
}

interface Props {
    initialProperties: Property[]
    initialTotal: number
    initialFilters: Filters
}

function hasRealImages(images: string[] | null | undefined): images is string[] {
    if (!images || images.length === 0) return false
    const firstImage = images[0]
    if (!firstImage) return false
    if (firstImage.includes("placeholder") || firstImage.includes("image-coming-soon")) return false
    return true
}

const PROPERTY_TYPES = [
  { value: "", label: "All Types" },
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "townhouse", label: "Townhouse" },
  { value: "studio", label: "Studio" },
  { value: "villa", label: "Villa" },
  { value: "land", label: "Land" },
  { value: "commercial", label: "Commercial" },
  ]

const LOCATIONS = [
  { value: "", label: "All Locations" },
  { value: "Cantonments", label: "Cantonments" },
  { value: "East Legon", label: "East Legon" },
  { value: "Labone", label: "Labone" },
  { value: "Dzorwulu", label: "Dzorwulu" },
  { value: "Tse Addo", label: "Tse Addo" },
  { value: "Airport", label: "Airport Area" },
  { value: "North Ridge", label: "North Ridge" },
  { value: "Roman Ridge", label: "Roman Ridge" },
  { value: "Spintex", label: "Spintex" },
  { value: "Appolonia", label: "Appolonia City" },
  { value: "Adenta", label: "Adenta" },
  { value: "Tema", label: "Tema" },
  ]

const BEDROOM_OPTIONS = [
  { value: "", label: "Any" },
  { value: "0", label: "Studio" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5+" },
  ]

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  ]

const ITEMS_PER_PAGE = 24

// Build a human-readable page heading from active filters
function buildHeading(filters: Filters): string {
    const parts: string[] = []
        if (filters.property_type) {
              const match = PROPERTY_TYPES.find((t) => t.value === filters.property_type)
              parts.push(match ? match.label + "s" : filters.property_type.charAt(0).toUpperCase() + filters.property_type.slice(1) + "s")
        }
    if (filters.listing_type === "sale") parts.push("for Sale")
    else if (filters.listing_type === "rent") parts.push("for Rent")
    else parts.push("for Sale & Rent")
    if (filters.location) {
          const match = LOCATIONS.find((l) => l.value === filters.location)
          parts.push("in " + (match ? match.label : filters.location))
    } else if (filters.search) {
          parts.push(`matching "${filters.search}"`)
    }
    parts.push("in Ghana")
    return "Properties " + parts.join(" ")
}

function PropertyCard({ property }: { property: Property }) {
    const [saved, setSaved] = useState(false)
    const [imgError, setImgError] = useState(false)

  return (
        <Link
                href={`/properties/${property.id}`}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
              <div className="relative h-64 flex-shrink-0">
                {hasRealImages(property.images) && !imgError ? (
                          <Image
                                        src={property.images[0]}
                                        alt={property.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={() => setImgError(true)}
                                      />
                        ) : (
                          <div className="absolute inset-0 bg-gray-100">
                                      <Image
                                                      src="/images/images-coming-soon.jpg"
                                                      alt={`${property.title} - Images coming soon`}
                                                      fill
                                                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                      className="object-cover"
                                                    />
                                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                                                    <Camera className="w-10 h-10 text-white/80 mb-2" />
                                                    <p className="text-white font-semibold">Images Coming Soon</p>
                                      </div>
                          </div>
                      )}
                      <div className="absolute top-3 left-3 flex gap-2">
                                <span
                                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                                                              property.listing_type === "rent" ? "bg-blue-600 text-white" : "bg-teal-600 text-white"
                                              }`}
                                            >
                                  {property.listing_type === "rent" ? "For Rent" : "For Sale"}
                                </span>
                      </div>
                      <button
                                  onClick={(e) => {
                                                e.preventDefault()
                                                              e.stopPropagation()
                                                                            setSaved((p) => !p)
                                  }}
                                  className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition"
                                  aria-label={saved ? "Remove from saved" : "Save property"}
                                >
                                <Heart className={`w-4 h-4 ${saved ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                      </button>
              </div>
              <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-2">
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-600 transition line-clamp-2 flex-1 mr-2">
                                  {property.title}
                                </h3>
                                <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-700 rounded uppercase whitespace-nowrap flex-shrink-0">
                                  {property.property_type}
                                </span>
                      </div>
                      <p className="text-gray-500 flex items-center gap-1 mb-3 text-sm">
                                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="truncate">{property.location}</span>
                      </p>
                      <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
                        {property.bedrooms > 0 && (
                            <span className="flex items-center gap-1.5">
                                          <Bed className="w-4 h-4" />
                                          <span>{property.bedrooms}</span>
                            </span>
                                )}
                        {property.bathrooms > 0 && (
                            <span className="flex items-center gap-1.5">
                                          <Bath className="w-4 h-4" />
                                          <span>{property.bathrooms}</span>
                            </span>
                                )}
                        {property.area > 0 && (
                            <span className="flex items-center gap-1.5">
                                          <Square className="w-4 h-4" />
                                          <span>{property.area}m&sup2;</span>
                            </span>
                                )}
                        {property.parking && property.parking > 0 && (
                            <span className="flex items-center gap-1.5">
                                          <Car className="w-4 h-4" />
                                          <span>{property.parking}</span>
                            </span>
                                )}
                      </div>
                      <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-xl font-bold text-gray-900">
                                            ${property.price.toLocaleString()}
                                  {property.listing_type === "rent" && (
                              <span className="text-sm font-normal text-gray-500">/mo</span>
                                            )}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {property.agent || "Dwellot Estates"}
                                </span>
                      </div>
              </div>
        </Link>
      )
}

export default function PropertiesClient({ initialProperties, initialTotal, initialFilters }: Props) {
    const router = useRouter()
    const pathname = usePathname()

    const [properties, setProperties] = useState(initialProperties)
    const [total, setTotal] = useState(initialTotal)
    const [filters, setFilters] = useState(initialFilters)
    // console.log("DEBUG: initialProperties received:", initialProperties); // Remove or comment out this line
    // console.log("DEBUG: properties state value:", properties); // Remove or comment out this line

    const [loading, setLoading] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
    const searchWrapperRef = useRef(null)

    const { data: suggestionsData } = useSWR("/api/search-suggestions", suggestionFetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 600000,
    })

    const allSuggestions = suggestionsData?.suggestions || []
    const filteredSuggestions = filters.search.trim().length > 0
        ? allSuggestions.filter((s) => s.label.toLowerCase().includes(filters.search.toLowerCase())).slice(0, 8)
        : allSuggestions.slice(0, 8)

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
                setShowSuggestions(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const hasMore = properties.length < total

    const applyFilters = useCallback(
        async (newFilters: Filters) => {
            setLoading(true)
            const params = new URLSearchParams()
            if (newFilters.search) params.set("search", newFilters.search)
            if (newFilters.location) params.set("location", newFilters.location)
            if (newFilters.listing_type && newFilters.listing_type !== "all") params.set("listing_type", newFilters.listing_type)
            if (newFilters.property_type) params.set("property_type", newFilters.property_type)
            if (newFilters.bedrooms) params.set("bedrooms", newFilters.bedrooms)
            if (newFilters.min_price) params.set("min_price", newFilters.min_price)
            if (newFilters.max_price) params.set("max_price", newFilters.max_price)
            if (newFilters.sort && newFilters.sort !== "newest") params.set("sort", newFilters.sort)

            const qs = params.toString()
            router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })

            try {
                const res = await fetch(`/api/properties?${params}`)
                if (res.ok) {
                    const data = await res.json()
                    setProperties(data.properties || [])
                    setTotal(data.total || 0)
                } else {
                    console.error("Failed to fetch properties:", res.status, res.statusText)
                    setProperties([])
                    setTotal(0)
                }
            } catch (error) {
                console.error("Error fetching properties:", error)
                setProperties([])
                setTotal(0)
            } finally {
                setLoading(false)
            }
        },
        [router, pathname],
    )

    const applySuggestion = useCallback(
        (suggestion: Suggestion) => {
            setShowSuggestions(false)
            setSelectedSuggestionIndex(-1)
            let updated: Filters
            switch (suggestion.type) {
                case "location":
                    updated = { ...filters, location: suggestion.label, search: "" }
                    break
                case "developer":
                case "estate":
                    updated = { ...filters, search: suggestion.label }
                    break
                case "property_type":
                    updated = { ...filters, property_type: suggestion.label.toLowerCase(), search: "" }
                    break
                default:
                    updated = { ...filters, search: suggestion.label }
            }
            setFilters(updated)
            applyFilters(updated)
        },
        [filters, applyFilters],
    )

    const handleSearchKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (!showSuggestions) {
                if (e.key === "ArrowDown") {
                    setShowSuggestions(true)
                    e.preventDefault()
                }
                return
            }

            if (e.key === "ArrowDown") {
                e.preventDefault()
                setSelectedSuggestionIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0))
            } else if (e.key === "ArrowUp") {
                e.preventDefault()
                setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1))
            } else if (e.key === "Enter") {
                if (selectedSuggestionIndex >= 0 && filteredSuggestions[selectedSuggestionIndex]) {
                    e.preventDefault()
                    applySuggestion(filteredSuggestions[selectedSuggestionIndex])
                }
                // Otherwise let the form submit naturally
            } else if (e.key === "Escape") {
                setShowSuggestions(false)
                setSelectedSuggestionIndex(-1)
            }
        },
        [showSuggestions, selectedSuggestionIndex, filteredSuggestions, applySuggestion],
    )

    const handleFilterChange = useCallback(
        (key: keyof Filters, value: string) => {
            const updated = { ...filters, [key]: value }
            setFilters(updated)
            applyFilters(updated)
        },
        [filters, applyFilters],
    )

    const resetFilters = useCallback(() => {
        const empty: Filters = {
            search: "",
            location: "",
            listing_type: "all",
            property_type: "",
            bedrooms: "",
            min_price: "",
            max_price: "",
            sort: "newest",
        }
        setFilters(empty)
        applyFilters(empty)
    }, [applyFilters])

    const hasActiveFilters =
        filters.search || filters.location || (filters.listing_type && filters.listing_type !== "all") ||
        filters.property_type || filters.bedrooms || filters.min_price || filters.max_price

    const loadMore = useCallback(async () => {
        setLoadingMore(true)
        try {
            const params = new URLSearchParams()
            params.set("limit", ITEMS_PER_PAGE.toString())
            params.set("offset", properties.length.toString())
            if (filters.search) params.set("search", filters.search)
            if (filters.location) params.set("location", filters.location)
            if (filters.listing_type && filters.listing_type !== "all") {
                // Map listing_type filter to match API expectations
                params.set("listing_type", filters.listing_type)
            }
            if (filters.property_type) params.set("property_type", filters.property_type)
            if (filters.bedrooms) params.set("bedrooms", filters.bedrooms)
            if (filters.min_price) params.set("min_price", filters.min_price)
            if (filters.max_price) params.set("max_price", filters.max_price)
            if (filters.sort && filters.sort !== "newest") params.set("sort", filters.sort)

            const res = await fetch(`/api/properties?${params}`)
            if (res.ok) {
                const data = await res.json()
                setProperties((prev) => [...prev, ...(data.properties || [])])
                if (data.total) setTotal(data.total)
            }
        } catch (error) {
            console.error("Error loading more properties:", error)
        } finally {
            setLoadingMore(false)
        }
    }, [properties.length, filters])

    const handleSearchSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault()
            applyFilters(filters)
        },
        [filters, applyFilters],
    )

    return (
        <main className="min-h-screen bg-gray-50 pt-16">
            {/* Page Header */}
            <section className="bg-gray-100 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                        {buildHeading(filters)}
                    </h1>
                    <p className="text-lg text-gray-600">
                        Showing {properties.length} of {total} {total === 1 ? "property" : "properties"}
                    </p>
                </div>
            </section>

            {/* Search Bar */}
            <section className="bg-white py-4 shadow-sm z-10 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row gap-4 lg:gap-2 items-center" ref={searchWrapperRef}>
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by location, developer, estate or keywords..."
                                value={filters.search}
                                onChange={(e) => {
                                    setFilters((f) => ({ ...f, search: e.target.value }))
                                    setShowSuggestions(true)
                                    setSelectedSuggestionIndex(-1)
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                onKeyDown={handleSearchKeyDown}
                                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                autoComplete="off"
                                role="combobox"
                                aria-expanded={showSuggestions}
                                aria-haspopup="listbox"
                                aria-autocomplete="list"
                            />
                            {showSuggestions && (filteredSuggestions.length > 0 || filters.search.trim().length > 0) && (
                                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg mt-2 z-20 max-h-60 overflow-y-auto">
                                    <h3 className="px-4 py-3 text-sm font-semibold text-gray-500 border-b border-gray-100">
                                        {filters.search.trim().length === 0 ? "Browse by" : `Suggestions for "${filters.search}"`}
                                    </h3>
                                    <ul role="listbox">
                                        {filteredSuggestions.map((suggestion, index) => (
                                            <li
                                                key={`${suggestion.type}-${suggestion.label}`}
                                                onClick={() => applySuggestion(suggestion)}
                                                onMouseEnter={() => setSelectedSuggestionIndex(index)}
                                                className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition ${
                                                    index === selectedSuggestionIndex
                                                        ? "bg-teal-50 text-teal-900"
                                                        : "text-gray-700 hover:bg-gray-50"
                                                }`}
                                                role="option"
                                                aria-selected={index === selectedSuggestionIndex}
                                            >
                                                {getSuggestionIcon(suggestion.type)}
                                                <div>
                                                    <span className="font-medium">{suggestion.label}</span>
                                                    <span className="text-gray-500 ml-1">
                                                        ({suggestion.count} {suggestion.count === 1 ? "listing" : "listings"})
                                                    </span>
                                                    <span className="text-gray-400 text-xs ml-2">
                                                        {getSuggestionTypeLabel(suggestion.type)}
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                        {filteredSuggestions.length === 0 && filters.search.trim().length > 0 && (
                                            <li className="px-4 py-3 text-sm text-gray-500">
                                                No suggestions found. Press Enter to search for &ldquo;{filters.search}&rdquo;
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            onClick={() => setShowSuggestions(false)}
                            className="px-6 py-3.5 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition whitespace-nowrap"
                        >
                            Search
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className="lg:hidden px-4 py-3.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                            aria-label="Toggle filters"
                        >
                            <SlidersHorizontal className="h-5 w-5 text-gray-700" />
                        </button>
                    </form>
                </div>
            </section>

            {/* Filter Bar */}
            <section className="bg-gray-50 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 transition-all duration-300 ease-in-out ${showMobileFilters ? "max-h-screen opacity-100" : "max-h-0 opacity-0 lg:max-h-screen lg:opacity-100 overflow-hidden"}`}>
                        {/* Listing Type */}
                        <div className="col-span-2 md:col-span-4 lg:col-span-1 flex bg-white border border-gray-200 rounded-lg overflow-hidden">
                            {[
                                { value: "all", label: "All" },
                                { value: "sale", label: "Buy" },
                                { value: "rent", label: "Rent" },
                            ].map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => handleFilterChange("listing_type", opt.value)}
                                    className={`flex-1 py-2 text-sm font-medium transition ${
                                        filters.listing_type === opt.value
                                            ? "bg-teal-600 text-white"
                                            : "bg-white text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        {/* Location */}
                        <div className="col-span-1">
                            <label htmlFor="location" className="sr-only">
                                Location
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <select
                                    id="location"
                                    name="location"
                                    value={filters.location}
                                    onChange={(e) => handleFilterChange("location", e.target.value)}
                                    className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    {LOCATIONS.map((l) => (
                                        <option key={l.value} value={l.value}>
                                            {l.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Property Type */}
                        <div className="col-span-1">
                            <label htmlFor="property_type" className="sr-only">
                                Property Type
                            </label>
                            <div className="relative">
                                <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <select
                                    id="property_type"
                                    name="property_type"
                                    value={filters.property_type}
                                    onChange={(e) => handleFilterChange("property_type", e.target.value)}
                                    className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    {PROPERTY_TYPES.map((t) => (
                                        <option key={t.value} value={t.value}>
                                            {t.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Bedrooms */}
                        <div className="col-span-1">
                            <label htmlFor="bedrooms" className="sr-only">
                                Bedrooms
                            </label>
                            <div className="relative">
                                <Bed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <select
                                    id="bedrooms"
                                    name="bedrooms"
                                    value={filters.bedrooms}
                                    onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
                                    className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    {BEDROOM_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Min Price */}
                        <div className="col-span-1">
                            <label htmlFor="min_price" className="sr-only">
                                Min Price ($)
                            </label>
                            <div className="relative">
                                <select
                                    id="min_price"
                                    name="min_price"
                                    value={filters.min_price}
                                    onChange={(e) => handleFilterChange("min_price", e.target.value)}
                                    className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="">No min</option>
                                    <option value="50000">$50,000</option>
                                    <option value="100000">$100,000</option>
                                    <option value="150000">$150,000</option>
                                    <option value="200000">$200,000</option>
                                    <option value="300000">$300,000</option>
                                    <option value="500000">$500,000</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Max Price */}
                        <div className="col-span-1">
                            <label htmlFor="max_price" className="sr-only">
                                Max Price ($)
                            </label>
                            <div className="relative">
                                <select
                                    id="max_price"
                                    name="max_price"
                                    value={filters.max_price}
                                    onChange={(e) => handleFilterChange("max_price", e.target.value)}
                                    className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="">No max</option>
                                    <option value="100000">$100,000</option>
                                    <option value="200000">$200,000</option>
                                    <option value="300000">$300,000</option>
                                    <option value="500000">$500,000</option>
                                    <option value="750000">$750,000</option>
                                    <option value="1000000">$1,000,000</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Sort */}
                        <div className="col-span-1">
                            <label htmlFor="sort" className="sr-only">
                                Sort By
                            </label>
                            <div className="relative">
                                <select
                                    id="sort"
                                    name="sort"
                                    value={filters.sort}
                                    onChange={(e) => handleFilterChange("sort", e.target.value)}
                                    className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    {SORT_OPTIONS.map((s) => (
                                        <option key={s.value} value={s.value}>
                                            {s.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Reset */}
                        {hasActiveFilters && (
                            <div className="col-span-full flex justify-end">
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition flex items-center gap-1"
                                >
                                    <X className="h-4 w-4" />
                                    Reset all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Properties Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {properties.length === 0 ? (
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            No properties match your filters
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Try adjusting your search or filters to find what you are looking for.
                        </p>
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {properties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>

                        {/* Load More / Count */}
                        <div className="flex flex-col md:flex-row justify-between items-center mt-8 space-y-4 md:space-y-0">
                            <p className="text-gray-600">
                                Showing {properties.length} of {total} properties
                            </p>
                            {hasMore && (
                                <button
                                    type="button"
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                    className="px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition flex items-center gap-2"
                                >
                                    {loadingMore ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        "Load More Properties"
                                    )}
                                </button>
                            )}
                        </div>
                    </>
                )}
            </section>
        </main>
    )
}
