"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Heart,
  HomeIcon,
  ChevronRight,
  Car,
  Phone,
  Shield,
  Users,
  MessageCircle,
  CheckCircle,
  Camera,
} from "lucide-react"
import dynamic from "next/dynamic"
import { registerServiceWorker } from "@/lib/register-sw"

const RecentlyViewedWidget = dynamic(() => import("@/components/RecentlyViewedWidget"), { ssr: false })
const PWAInstallPrompt = dynamic(() => import("@/components/PWAInstallPrompt"), { ssr: false })

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
  featured: boolean
  status: string
  agent?: string
  phone?: string
  view_count?: number
}

export default function HomePage() {
  const [savedProperties, setSavedProperties] = useState<Set<number>>(new Set())
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([])
  const [allProperties, setAllProperties] = useState<Property[]>([])
  const [featuredLoading, setFeaturedLoading] = useState(true)
  const [allPropertiesLoading, setAllPropertiesLoading] = useState(true)
  const [currentImages, setCurrentImages] = useState<{ [key: number]: number }>({})
  const [popularFilters, setPopularFilters] = useState({
    priceRange: "Under $500K",
    bedrooms: "3",
    location: "East Legon, Accra",
    locationCount: 15,
  })
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    registerServiceWorker()

    const fetchProperties = async () => {
      try {
        const [apolloniaRes, kharisRes, devtracoRes, filtersRes] = await Promise.all([
          fetch("/api/properties?location=appolonia&limit=13"),
          fetch("/api/properties?agent=BestWorld%20Company&limit=3"),
          fetch("/api/properties?agent=Devtraco%20Group&limit=2"),
          fetch("/api/popular-filters"),
        ])

        let allApoloniaProperties: Property[] = []
        let allKharisProperties: Property[] = []
        let allDevtracoProperties: Property[] = []

        if (apolloniaRes.ok) {
          const apolloniaData = await apolloniaRes.json()
          allApoloniaProperties = apolloniaData.properties || []
        }

        if (kharisRes.ok) {
          const kharisData = await kharisRes.json()
          allKharisProperties = kharisData.properties || []
        }

        if (devtracoRes.ok) {
          const devtracoData = await devtracoRes.json()
          allDevtracoProperties = devtracoData.properties || []
        }

        // Filter all properties to only include those with real images (no placeholders)
        const allPropertiesCombined = [...allApoloniaProperties, ...allKharisProperties, ...allDevtracoProperties]
        
        const propertiesWithRealImages = allPropertiesCombined.filter(
          (prop) => 
            prop.images && 
            prop.images.length > 0 && 
            !prop.images[0].includes("image-coming-soon") &&
            !prop.images[0].includes("placeholder")
        )
        
        // Set all properties with real images as featured
        setFeaturedProperties(propertiesWithRealImages)
        setAllProperties(allPropertiesCombined)

        if (filtersRes.ok) {
          const data = await filtersRes.json()
          setPopularFilters(data)
        }
      } catch (error) {
        console.error("Error fetching properties:", error)
      } finally {
        setFeaturedLoading(false)
        setAllPropertiesLoading(false)
      }
    }

    fetchProperties()
  }, [])

  const toggleSave = useCallback((e: React.MouseEvent, propertyId: number) => {
    e.preventDefault()
    e.stopPropagation()
    setSavedProperties((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId)
      } else {
        newSet.add(propertyId)
      }
      return newSet
    })
  }, [])

  const handleImageNavigation = useCallback(
    (e: React.MouseEvent, propertyId: number, direction: "prev" | "next", totalImages: number) => {
      e.preventDefault()
      e.stopPropagation()
      setCurrentImages((prev) => {
        const current = prev[propertyId] || 0
        let newIndex
        if (direction === "next") {
          newIndex = (current + 1) % totalImages
        } else {
          newIndex = current === 0 ? totalImages - 1 : current - 1
        }
        return { ...prev, [propertyId]: newIndex }
      })
    },
    [],
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0">
              <Image src="/images/hero-bg.jpg" alt="Ghana coastal cityscape" fill className="object-cover" priority sizes="100vw" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 z-10"></div>
            </div>

            <div className="relative z-20 py-12 md:py-16 px-6 md:px-12">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
                  <span className="text-emerald-400">discover</span> your perfect home
                </h1>
                <p className="text-xl md:text-2xl text-white font-medium">
                  with Ghana&apos;s most comprehensive property marketplace
                </p>
              </div>

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
            </div>

            <div className="mt-8 bg-gray-100 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sign in to streamline your search</h3>
                <p className="text-gray-600">
                  Save properties, create alerts and keep track of the enquiries you send to agents.
                </p>
              </div>
              <Link
                href="/auth"
                className="px-8 py-3 border-2 border-gray-900 text-gray-900 font-bold rounded-lg hover:bg-gray-900 hover:text-white transition whitespace-nowrap"
              >
                Sign in or create an account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed Widget Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RecentlyViewedWidget />
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Properties</h2>
              <p className="text-gray-600 mt-2">Discover premium properties across Ghana</p>
            </div>
            <Link href="/properties" className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
              View all properties
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {featuredLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading featured properties...</p>
            </div>
          ) : featuredProperties.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <HomeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Featured Properties Yet</h3>
              <p className="text-gray-600 mb-6">Add properties and mark them as featured to display them here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredProperties.map((property) => {
                const currentImg = currentImages[property.id] || 0

                return (
                  <Link
                    key={property.id}
                    href={`/properties/${property.id}`}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow group"
                  >
                    <div className="relative">
                      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                        <span className="bg-teal-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold">
                          FEATURED PROPERTY
                        </span>
                        {property.status === "active" && (
                          <span className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>

                      <div className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                        {currentImg + 1}/{property.images?.length || 1}
                      </div>

                      <div className="relative h-80 overflow-hidden">
                        <Image
                          src={property.images?.[currentImg] || property.images?.[0] || "/api/placeholder/400/300"}
                          alt={property.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {property.images && property.images.length > 1 && (
                          <>
                            <button
                              onClick={(e) => handleImageNavigation(e, property.id, "prev", property.images.length)}
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition"
                            >
                              ←
                            </button>
                            <button
                              onClick={(e) => handleImageNavigation(e, property.id, "next", property.images.length)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition"
                            >
                              →
                            </button>
                          </>
                        )}
                      </div>

                      <div className="absolute bottom-0 left-0 bg-teal-600 text-white px-5 py-3">
                        <div className="text-3xl font-bold">
                          {property.listing_type === "rent" ? "$" : "$"} {property.price.toLocaleString()}
                          {property.listing_type === "rent" && <span className="text-base font-normal">/month</span>}
                        </div>
                        <div className="text-sm opacity-90">
                          {property.listing_type === "rent" ? "To rent" : "Offers Over"}
                        </div>
                      </div>
                    </div>

                    <div className="p-8">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition">
                          {property.title}
                        </h3>
                        <button
                          onClick={(e) => toggleSave(e, property.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Heart
                            className={`h-6 w-6 ${savedProperties.has(property.id) ? "fill-red-500 text-red-500" : ""}`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-gray-600 text-lg">{property.property_type}</span>
                        <div className="flex items-center gap-4 text-gray-600">
                          {property.bedrooms > 0 && (
                            <div className="flex items-center gap-1">
                              <Bed className="h-5 w-5" />
                              <span className="text-lg">{property.bedrooms}</span>
                            </div>
                          )}
                          {property.bathrooms > 0 && (
                            <div className="flex items-center gap-1">
                              <Bath className="h-5 w-5" />
                              <span className="text-lg">{property.bathrooms}</span>
                            </div>
                          )}
                          {property.area && (
                            <div className="flex items-center gap-1">
                              <Square className="h-5 w-5" />
                              <span className="text-lg">{property.area}m²</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-600 mb-5 line-clamp-2">{property.description}</p>

                      <div className="text-teal-600 font-medium mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Added recently by {property.agent || "Dwellot Estates"}
                        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded text-sm">
                          <Users className="w-4 h-4 inline mr-1" />
                          {property.view_count || 0} views
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="bg-yellow-400 p-2 rounded">
                            <HomeIcon className="h-5 w-5 text-yellow-800" />
                          </div>
                          <div>
                            <div className="font-medium">
                              <span
                                onClick={(e) => {
                                  e.stopPropagation()
                                  window.location.href = `tel:${property.phone || "0302967150"}`
                                }}
                                className="hover:text-blue-600 transition cursor-pointer"
                              >
                                {property.phone || "0302 967150"}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">Local call rate</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              window.open(
                                `https://wa.me/${(property.phone || "0302967150").replace(/[\s\-()]/g, "").replace(/^0/, "233")}`,
                                "_blank",
                                "noopener,noreferrer",
                              )
                            }}
                            className="bg-green-500 p-2 rounded hover:bg-green-600 transition"
                            title="WhatsApp"
                          >
                            <MessageCircle className="h-5 w-5 text-white" />
                          </button>
                          <button
                            onClick={(e) => toggleSave(e, property.id)}
                            className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* All Properties Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Properties</h2>
              <p className="text-gray-600 mt-2">
                {allProperties.length} {allProperties.length === 1 ? "property" : "properties"} available
              </p>
            </div>

            <Link
              href="/properties"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition"
            >
              View all properties
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="space-y-6">
            {allPropertiesLoading ? (
              <div className="text-center py-12">
                <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading properties...</p>
              </div>
            ) : allProperties.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <HomeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Properties Yet</h3>
                <p className="text-gray-600 mb-6">Be the first to add a property to our platform!</p>
                <Link
                  href="/admin/add-property"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Add Your First Property
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allProperties.map((property) => (
                  <Link
                    key={property.id}
                    href={`/properties/${property.id}`}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col"
                  >
                    <div className="relative h-96 flex-shrink-0">
                      <Image
                        src={
                          currentImages[property.id] !== undefined
                            ? property.images[currentImages[property.id]]
                            : property.images?.[0] || "/api/placeholder/800/600"
                        }
                        alt={property.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {(!property.images ||
                        property.images.length === 0 ||
                        property.images[0]?.includes("placeholder")) && (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center">
                          <Camera className="w-16 h-16 text-gray-400 mb-4" />
                          <p className="text-white text-xl font-semibold">Photos Coming Soon</p>
                          <p className="text-gray-300 text-sm mt-2">Professional photography in progress</p>
                        </div>
                      )}

                      {property.images && property.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => handleImageNavigation(e, property.id, "prev", property.images.length)}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition"
                          >
                            ←
                          </button>
                          <button
                            onClick={(e) => handleImageNavigation(e, property.id, "next", property.images.length)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition"
                          >
                            →
                          </button>
                        </>
                      )}
                    </div>

                    <div className="p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition mb-2">
                              {property.title}
                            </h3>
                            <p className="text-gray-600 flex items-center gap-1 mb-3">
                              <MapPin className="w-4 h-4" />
                              {property.location}
                            </p>
                          </div>
                          <div className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-700 rounded uppercase">
                            {property.property_type}
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-gray-700 mb-4">
                          {property.bedrooms > 0 && (
                            <span className="flex items-center gap-2">
                              <Bed className="w-5 h-5" />
                              <span className="font-medium">{property.bedrooms}</span>
                            </span>
                          )}
                          {property.bathrooms > 0 && (
                            <span className="flex items-center gap-2">
                              <Bath className="w-5 h-5" />
                              <span className="font-medium">{property.bathrooms}</span>
                            </span>
                          )}
                          {property.area > 0 && (
                            <span className="flex items-center gap-2">
                              <Square className="w-5 h-5" />
                              <span className="font-medium">{property.area}m²</span>
                            </span>
                          )}
                          {property.parking && property.parking > 0 && (
                            <span className="flex items-center gap-2">
                              <Car className="w-5 h-5" />
                              <span className="font-medium">{property.parking}</span>
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 text-sm line-clamp-3">{property.description}</p>
                      </div>

                      <div className="mt-4 flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-gray-500">
                          <span className="text-teal-600 font-medium">Recently added</span> by{" "}
                          {property.agent || "Dwellot Estates"}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">Contact agent</span>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {allProperties.length > 6 && (
            <div className="text-center mt-12">
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
              >
                View All {allProperties.length} Properties
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Market Insights & Agent CTA Section */}
      <section className="py-12 bg-gradient-to-r from-blue-50 to-teal-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Agent Onboarding CTA */}
            <div className="bg-gradient-to-br from-teal-600 to-emerald-600 text-white rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2">Are you a Real Estate Agent?</h3>
              <p className="text-teal-100 mb-4">
                Join Ghana&apos;s fastest growing property platform and reach thousands of potential buyers.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>List unlimited properties</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Get verified agent badge</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Mobile Money payments accepted</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/agent-signup"
                  className="flex-1 bg-white text-teal-600 px-4 py-3 rounded-lg font-semibold text-center hover:bg-gray-50 transition"
                >
                  Become an Agent
                </Link>
                <Link
                  href="/list-property"
                  className="flex-1 bg-teal-500 text-white px-4 py-3 rounded-lg font-semibold text-center hover:bg-teal-400 transition"
                >
                  List Property
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile & WhatsApp Integration */}
      <section className="py-12 bg-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay Connected on Mobile</h2>
          <p className="text-gray-600 mb-6">Get instant property alerts and chat with agents directly via WhatsApp</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="https://wa.me/233123456789"
              className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-semibold"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </Link>
            <span className="text-gray-500">or</span>
            <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-semibold">
              <Phone className="w-5 h-5" />
              Call +233 (0) 123 456 789
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Available 24/7 • Mobile Money payments accepted • Local support team
          </p>
        </div>
      </section>

      {/* Popular Areas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Popular Areas in Ghana</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "East Legon", count: 1070 },
              { name: "Spintex", count: 525 },
              { name: "Tema", count: 159 },
              { name: "East Legon Hills", count: 140 },
              { name: "Adjiringanor", count: 126 },
              { name: "Airport Hills", count: 110 },
              { name: "Ashaley Botwe", count: 104 },
              { name: "Cantonments", count: 81 },
            ].map((area) => (
              <Link
                key={area.name}
                href={`/properties?location=${area.name}`}
                className="bg-gray-50 hover:bg-teal-50 border border-gray-200 hover:border-teal-200 p-4 rounded-lg transition text-center"
              >
                <h3 className="font-semibold text-gray-900">{area.name}</h3>
                <p className="text-gray-600 text-sm">{area.count} Properties</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Dwellot */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Why Choose Dwellot?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HomeIcon className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Properties</h3>
              <p className="text-gray-600">
                All properties are verified by our team to ensure quality and authenticity
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Prime Locations</h3>
              <p className="text-gray-600">Properties in Ghana&apos;s most sought-after neighborhoods and cities</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
              <p className="text-gray-600">
                Our team of experts is here to guide you through every step of your journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PWA Install Prompt */}
  <PWAInstallPrompt />
    </div>
  )
}
