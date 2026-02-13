"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
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
  ShieldCheck,
  DollarSign,
  MessageCircle,
  Home,
} from "lucide-react"

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
  { value: "commercial", label: "Commercial" },
  { value: "townhouse", label: "Townhouse" },
]

const BEDROOM_OPTIONS = [
  { value: "", label: "Any" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5+" },
]

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Rent: Low to High" },
  { value: "price_desc", label: "Rent: High to Low" },
]

const ITEMS_PER_PAGE = 24

function RentalPropertyCard({ property }: { property: Property }) {
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

        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-600 text-white">
            For Rent
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
            <span className="text-sm font-normal text-gray-500">/mo</span>
          </span>
          <span className="text-xs text-gray-400">
            {property.agent || "Dwellot Estates"}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function RentClient({ initialProperties, initialTotal, initialFilters }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const [properties, setProperties] = useState<Property[]>(initialProperties)
  const [total, setTotal] = useState(initialTotal)
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [loadingMore, setLoadingMore] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const hasMore = properties.length < total

  const applyFilters = useCallback(
    (newFilters: Filters) => {
      const params = new URLSearchParams()
      if (newFilters.search) params.set("search", newFilters.search)
      if (newFilters.location) params.set("location", newFilters.location)
      if (newFilters.property_type) params.set("property_type", newFilters.property_type)
      if (newFilters.bedrooms) params.set("bedrooms", newFilters.bedrooms)
      if (newFilters.min_price) params.set("min_price", newFilters.min_price)
      if (newFilters.max_price) params.set("max_price", newFilters.max_price)
      if (newFilters.sort && newFilters.sort !== "newest") params.set("sort", newFilters.sort)

      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [router, pathname],
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
    filters.search || filters.location || filters.property_type ||
    filters.bedrooms || filters.min_price || filters.max_price

  const loadMore = useCallback(async () => {
    setLoadingMore(true)
    try {
      const params = new URLSearchParams()
      params.set("listing_type", "rent")
      params.set("limit", ITEMS_PER_PAGE.toString())
      params.set("offset", properties.length.toString())
      if (filters.search) params.set("search", filters.search)
      if (filters.location) params.set("location", filters.location)
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
      console.error("Error loading more rental properties:", error)
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 text-balance">
            Properties for Rent in Ghana
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Find apartments, houses, and commercial spaces for rent
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by location, title, or keyword..."
                  value={filters.search}
                  onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition whitespace-nowrap shadow-sm"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden px-4 py-3.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm"
                aria-label="Toggle filters"
              >
                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <div className={`bg-white border border-gray-200 rounded-xl p-4 mb-8 ${showMobileFilters ? "block" : "hidden lg:block"}`}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Property Type */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Property Type</label>
              <div className="relative">
                <select
                  value={filters.property_type}
                  onChange={(e) => handleFilterChange("property_type", e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Bedrooms</label>
              <div className="flex rounded-lg overflow-hidden border border-gray-200">
                {BEDROOM_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleFilterChange("bedrooms", opt.value)}
                    className={`flex-1 py-2 text-sm font-medium transition ${
                      filters.bedrooms === opt.value
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Min Rent */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Min Rent ($/mo)</label>
              <input
                type="number"
                placeholder="No min"
                value={filters.min_price}
                onChange={(e) => setFilters((f) => ({ ...f, min_price: e.target.value }))}
                onBlur={() => applyFilters(filters)}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Max Rent */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Max Rent ($/mo)</label>
              <input
                type="number"
                placeholder="No max"
                value={filters.max_price}
                onChange={(e) => setFilters((f) => ({ ...f, max_price: e.target.value }))}
                onBlur={() => applyFilters(filters)}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Sort By</label>
              <div className="relative">
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {SORT_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition"
              >
                <X className="w-4 h-4" />
                Reset all filters
              </button>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Available for Rent</h2>
          <p className="text-gray-500 text-sm">
            {total} {total === 1 ? "property" : "properties"} found
          </p>
        </div>

        {/* Properties Grid */}
        {properties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No rental properties listed yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Are you a landlord? List your property for free and reach thousands of potential tenants.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/agent-collection-form"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
              >
                List Your Property
              </Link>
              <Link
                href="/properties?listing_type=sale"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
              >
                Looking to buy instead?
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <RentalPropertyCard key={property.id} property={property} />
              ))}
            </div>

            <div className="text-center mt-10">
              <p className="text-sm text-gray-500 mb-4">
                Showing {properties.length} of {total} rental properties
              </p>
              {hasMore && (
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More Rentals"
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Why Rent with Dwellot */}
      <section className="bg-white border-t border-gray-100 py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">
            Why Rent with Dwellot
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Verified Listings</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Every rental listing is reviewed for accuracy. Browse with confidence knowing properties are real and available.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Hidden Fees</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Transparent pricing with no surprises. See the full rental cost upfront before you enquire.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Direct Landlord Contact</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Message landlords and agents directly via WhatsApp or phone. No middlemen, no delays.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
