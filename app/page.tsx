"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  MapPin,
  Heart,
  HomeIcon,
  ChevronRight,
  Phone,
  MessageCircle,
  CheckCircle,
} from "lucide-react"
import dynamic from "next/dynamic"
import HeroSearchBar from "@/components/HeroSearchBar"
import { FeaturedPropertyCard, PropertyListCard } from "@/components/PropertyCard"

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
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([])
  const [allProperties, setAllProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [popularFilters, setPopularFilters] = useState({
    priceRange: "Under $500K",
    bedrooms: "3",
    location: "East Legon, Accra",
    locationCount: 15,
  })

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const [apolloniaRes, kharisRes, devtracoRes, filtersRes] = await Promise.all([
          fetch("/api/properties?location=appolonia&limit=13"),
          fetch("/api/properties?agent=BestWorld%20Company&limit=3"),
          fetch("/api/properties?agent=Devtraco%20Group&limit=2"),
          fetch("/api/popular-filters"),
        ])

        let apolloniaProperties: Property[] = []
        let kharisProperties: Property[] = []
        let devtracoProperties: Property[] = []

        if (apolloniaRes.ok) {
          const data = await apolloniaRes.json()
          apolloniaProperties = data.properties || []
        }
        if (kharisRes.ok) {
          const data = await kharisRes.json()
          kharisProperties = data.properties || []
        }
        if (devtracoRes.ok) {
          const data = await devtracoRes.json()
          devtracoProperties = data.properties || []
        }

        const combined = [...apolloniaProperties, ...kharisProperties, ...devtracoProperties]

        const withRealImages = combined.filter(
          (prop) =>
            prop.images &&
            prop.images.length > 0 &&
            !prop.images[0]?.includes("image-coming-soon") &&
            !prop.images[0]?.includes("placeholder"),
        )

        setFeaturedProperties(withRealImages)
        setAllProperties(combined)

        if (filtersRes.ok) {
          const data = await filtersRes.json()
          setPopularFilters(data)
        }
      } catch (error) {
        console.error("Error fetching properties:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

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

              <HeroSearchBar popularFilters={popularFilters} />
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

          {loading ? (
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
              {featuredProperties.map((property) => (
                <FeaturedPropertyCard key={property.id} property={property} />
              ))}
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

          {loading ? (
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
                <PropertyListCard key={property.id} property={property} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              View All {allProperties.length} Properties
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
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
              href="https://wa.me/233201578429"
              className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-semibold"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </Link>
            <span className="text-gray-500">or</span>
            <Link
              href="tel:+233201578429"
              className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-semibold"
            >
              <Phone className="w-5 h-5" />
              Call 020 157 8429
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Available 24/7 &bull; Mobile Money payments accepted &bull; Local support team
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
