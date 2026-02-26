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
    console.log("DEBUG: initialProperties received:", initialProperties);
    console.log("DEBUG: properties state value:", properties);
    const [loading, setLoading] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
    const searchWrapperRef = useRef(null)

    // Sync server-fetched results into state whenever Next.js re-renders this
    // component
    // (You will need to re-add the original code here later, but for now, we're simplifying to debug)


    // Everything below here was part of the original component logic that you can ignore for this debugging step
    // const { data: suggestionsData } = useSWR("/api/search-suggestions", suggestionFetcher, {
    //   revalidateOnFocus: false,
    //   dedupingInterval: 600000,
    // })

    // const allSuggestions = suggestionsData?.suggestions || []
    // const filteredSuggestions = filters.search.trim().length > 0
    //   ? allSuggestions.filter((s) => s.label.toLowerCase().includes(filters.search.toLowerCase())).slice(0, 8)
    //   : allSuggestions.slice(0, 8)

    // useEffect(() => {
    //   function handleClickOutside(e: MouseEvent) {
    //     if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
    //       setShowSuggestions(false)
    //     }
    //   }
    //   document.addEventListener("mousedown", handleClickOutside)
    //   return () => document.removeEventListener("mousedown", handleClickOutside)
    // }, [])

    // const hasMore = properties.length < total && !loading && !loadingMore

    // const applyFilters = useCallback(
    //   async (newFilters: Filters) => {
    //     setLoading(true)
    //     const params = new URLSearchParams()
    //     if (newFilters.search) params.set("search", newFilters.search)
    //     if (newFilters.location) params.set("location", newFilters.location)
    //     if (newFilters.listing_type && newFilters.listing_type !== "all") params.set("listing_type", newFilters.listing_type)
    //     if (newFilters.property_type) params.set("property_type", newFilters.property_type)
    //     if (newFilters.bedrooms) params.set("bedrooms", newFilters.bedrooms)
    //     if (newFilters.min_price) params.set("min_price", newFilters.min_price)
    //     if (newFilters.max_price) params.set("max_price", newFilters.max_price)
    //     if (newFilters.sort && newFilters.sort !== "newest") params.set("sort", newFilters.sort)

    //     const qs = params.toString()
    //     router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })

    //     try {
    //       const res = await fetch(`/api/properties?${params}`)
    //       if (res.ok) {
    //         const data = await res.json()
    //         setProperties(data.properties || [])
    //         setTotal(data.total || 0)
    //       } else {
    //         console.error("Failed to fetch properties:", res.status, res.statusText)
    //         setProperties([])
    //         setTotal(0)
    //       }
    //     } catch (error) {
    //       console.error("Error fetching properties:", error)
    //       setProperties([])
    //       setTotal(0)
    //     } finally {
    //       setLoading(false)
    //     }
    //   },
    //   [router, pathname],
    // )

    // const applySuggestion = useCallback(
    //   (suggestion: Suggestion) => {
    //     setShowSuggestions(false)
    //     setSelectedSuggestionIndex(-1)
    //     let updated: Filters
    //     switch (suggestion.type) {
    //       case "location":
    //         updated = { ...filters, location: suggestion.label, search: "" }
    //         break
    //       case "developer":
    //       case "estate":
    //         updated = { ...filters, search: suggestion.label }
    //         break
    //       case "property_type":
    //         updated = { ...filters, property_type: suggestion.label.toLowerCase(), search: "" }
    //         break
    //       default:
    //         updated = { ...filters, search: suggestion.label }
    //     }
    //     setFilters(updated)
    //     applyFilters(updated)
    //   },
    //   [filters, applyFilters],
    // )

    // const handleSearchKeyDown = useCallback(
    //   (e: React.KeyboardEvent) => {
    //     if (!showSuggestions) {
    //       if (e.key === "ArrowDown") {
    //         setShowSuggestions(true)
    //         e.preventDefault()
    //       }
    //       return
    //     }

    //     if (e.key === "ArrowDown") {
    //       e.preventDefault()
    //       setSelectedSuggestionIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0))
    //     } else if (e.key === "ArrowUp") {
    //       e.preventDefault()
    //       setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1))
    //     } else if (e.key === "Enter") {
    //       if (selectedSuggestionIndex >= 0 && filteredSuggestions[selectedSuggestionIndex]) {
    //         e.preventDefault()
    //         applySuggestion(filteredSuggestions[selectedSuggestionIndex])
    //       }
    //       // Otherwise let the form submit naturally
    //     } else if (e.key === "Escape") {
    //       setShowSuggestions(false)
    //       setSelectedSuggestionIndex(-1)
    //     }
    //   },
    //   [showSuggestions, selectedSuggestionIndex, filteredSuggestions, applySuggestion],
    // )

    // const handleFilterChange = useCallback(
    //   (key: keyof Filters, value: string) => {
    //     const updated = { ...filters, [key]: value }
    //     setFilters(updated)
    //     applyFilters(updated)
    //   },
    //   [filters, applyFilters],
    // )

    // const resetFilters = useCallback(() => {
    //   const empty: Filters = {
    //     search: "",
    //     location: "",
    //     listing_type: "all",
    //     property_type: "",
    //     bedrooms: "",
    //     min_price: "",
    //     max_price: "",
    //     sort: "newest",
    //   }
    //   setFilters(empty)
    //   applyFilters(empty)
    // }, [applyFilters])

    // const hasActiveFilters =
    //   filters.search || filters.location || (filters.listing_type && filters.listing_type !== "all") ||
    //   filters.property_type || filters.bedrooms || filters.min_price || filters.max_price

    // const loadMore = useCallback(async () => {
    //   setLoadingMore(true)
    //   try {
    //     const params = new URLSearchParams()
    //     params.set("limit", ITEMS_PER_PAGE.toString())
    //     params.set("offset", properties.length.toString())
    //     if (filters.search) params.set("search", filters.search)
    //     if (filters.location) params.set("location", filters.location)
    //     if (filters.listing_type && filters.listing_type !== "all") {
    //       // Map listing_type filter to match API expectations
    //       params.set("listing_type", filters.listing_type)
    //     }
    //     if (filters.property_type) params.set("property_type", filters.property_type)
    //     if (filters.bedrooms) params.set("bedrooms", filters.bedrooms)
    //     if (filters.min_price) params.set("min_price", filters.min_price)
    //     if (filters.max_price) params.set("max_price", filters.max_price)
    //     if (filters.sort && filters.sort !== "newest") params.set("sort", filters.sort)

    //     const res = await fetch(`/api/properties?${params}`)
    //     if (res.ok) {
    //       const data = await res.json()
    //       setProperties((prev) => [...prev, ...(data.properties || [])])
    //       if (data.total) setTotal(data.total)
    //     }
    //   } catch (error) {
    //     console.error("Error loading more properties:", error)
    //   } finally {
    //     setLoadingMore(false)
    //   }
    // }, [properties.length, filters])

    // const handleSearchSubmit = useCallback(
    //   (e: React.FormEvent) => {
    //     e.preventDefault()
    //     applyFilters(filters)
    //   },
    //   [filters, applyFilters],
    // )

    // This is the missing return statement. This whole block needs to be added.
    return (
      <div style={{ padding: '20px', backgroundColor: 'lightyellow', border: '1px solid orange' }}>
        <h1>DEBUG: Properties List Test</h1>
        {properties.length === 0 ? (
          <p>No properties found in state (should not happen).</p>
        ) : (
          <ul>
            {properties.map((property) => (
              <li key={property.id} style={{ borderBottom: '1px solid #ccc', padding: '5px', margin: '5px 0' }}>
                {property.title} - {property.location} - ${property.price.toLocaleString()}
              </li>
            ))}
          </ul>
        )}
        <p>Showing {properties.length} properties.</p>
      </div>
    );
}
