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
                                </span>span>
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
                      </button>button>
              </div>
              <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-2">
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-600 transition line-clamp-2 flex-1 mr-2">
                                  {property.title}
                                </h3>h3>
                                <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-700 rounded uppercase whitespace-nowrap flex-shrink-0">
                                  {property.property_type}
                                </span>span>
                      </div>
                      <p className="text-gray-500 flex items-center gap-1 mb-3 text-sm">
                                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="truncate">{property.location}</span>span>
                      </p>
                      <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
                        {property.bedrooms > 0 && (
                            <span className="flex items-center gap-1.5">
                                          <Bed className="w-4 h-4" />
                                          <span>{property.bedrooms}</span>span>
                            </span>span>
                                )}
                        {property.bathrooms > 0 && (
                            <span className="flex items-center gap-1.5">
                                          <Bath className="w-4 h-4" />
                                          <span>{property.bathrooms}</span>span>
                            </span>span>
                                )}
                        {property.area > 0 && (
                            <span className="flex items-center gap-1.5">
                                          <Square className="w-4 h-4" />
                                          <span>{property.area}m&sup2;</span>span>
                            </span>span>
                                )}
                        {property.parking && property.parking > 0 && (
                            <span className="flex items-center gap-1.5">
                                          <Car className="w-4 h-4" />
                                          <span>{property.parking}</span>span>
                            </span>span>
                                )}
                      </div>
                      <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-xl font-bold text-gray-900">
                                            ${property.price.toLocaleString()}
                                  {property.listing_type === "rent" && (
                              <span className="text-sm font-normal text-gray-500">/mo</span>span>
                                            )}
                                </span>span>
                                <span className="text-xs text-gray-400">
                                  {property.agent || "Dwellot Estates"}
                                </span>span>
                      </div>
              </div>
        </Link>Link>
      )
}

export default function PropertiesClient({ initialProperties, initialTotal, initialFilters }: Props) {
    const router = useRouter()
        const pathname = usePathname()
            const [properties, setProperties] = useState<Property[]>(initialProperties)
                const [total, setTotal] = useState(initialTotal)
                    const [filters, setFilters] = useState<Filters>(initialFilters)
                        const [loading, setLoading] = useState(false)
                            const [loadingMore, setLoadingMore] = useState(false)
                                const [showMobileFilters, setShowMobileFilters] = useState(false)
                                    const [showSuggestions, setShowSuggestions] = useState(false)
                                        const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
                                            const searchWrapperRef = useRef<HTMLDivElement>(null)
                                              
                                                // Sync server-fetched results into state whenever Next.js re-renders this
    // component</Link>
