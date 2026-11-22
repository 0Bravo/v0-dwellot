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
import { generateGeneralWhatsAppUrl } from "@/lib/utils/whatsapp"
import { FeaturedPropertyCard, PropertyListCard } from "@/components/PropertyCard"
import { MoneyFirst, type MoneySnapshot } from "@/components/home/MoneyFirst"

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

interface HomeClientProps {
  /** Fetched on the server so the listings are in the HTML for crawlers. */
  initialFeatured?: Property[]
  initialAll?: Property[]
  initialTotal?: number
}

export default function HomeClient({
  initialFeatured = [],
  initialAll = [],
  initialTotal = 0,
  money = null,
}: HomeClientProps & { money?: MoneySnapshot | null }) {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>(initialFeatured)
  const [allProperties, setAllProperties] = useState<Property[]>(initialAll)
  const [totalCount, setTotalCount] = useState(initialTotal)
  const [visibleCount, setVisibleCount] = useState(30)
  const [featuredLoading, setFeaturedLoading] = useState(initialFeatured.length === 0)
  const [allLoading, setAllLoading] = useState(initialAll.length === 0)
  const [popularFilters, setPopularFilters] = useState({
    priceRange: "Under $300K",
    bedrooms: "3",
    location: "Cantonments",
    locationCount: 20,
  })

  useEffect(() => {
    // Fetch all properties marked as featured
    const fetchFeatured = async () => {
      try {
        // Popular filters are not part of the crawlable content, so they are
        // always fetched here; the listings only when the server sent none.
        const filtersRes = await fetch("/api/popular-filters")
        if (filtersRes.ok) {
          setPopularFilters(await filtersRes.json())
        }

        if (initialFeatured.length === 0) {
          const featuredRes = await fetch("/api/properties?featured=true&limit=100")
          if (featuredRes.ok) {
            const data = await featuredRes.json()
            setFeaturedProperties(data.properties || [])
          }
        }
      } catch (error) {
        console.error("Error fetching featured properties:", error)
      } finally {
        setFeaturedLoading(false)
      }
    }

    // Fetch ALL properties for the Properties section
    const fetchAllProperties = async () => {
      if (initialAll.length > 0) {
        setAllLoading(false)
        return
      }
      try {
        const res = await fetch("/api/properties?limit=500")
        if (res.ok) {
          const data = await res.json()
          setAllProperties(data.properties || [])
          setTotalCount(data.total || data.properties?.length || 0)
        }
      } catch (error) {
        console.error("Error fetching all properties:", error)
      } finally {
        setAllLoading(false)
      }
    }

    fetchFeatured()
    fetchAllProperties()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0">
              <Image src="/images/hero-bg.jpg" alt="Ghana coastal cityscape" fill className="object-cover" priority fetchPriority="high" quality={65} sizes="(max-width: 1280px) 100vw, 1280px" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 z-10"></div>
            </div>

            <div className="relative z-20 py-12 md:py-16 px-6 md:px-12">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
                  know what it <span className="text-emerald-400">really costs</span> to buy in Ghana
                </h1>
                <p className="text-xl md:text-2xl text-white font-medium">
                  Then find the house. Property and finance, for buyers abroad.
                </p>
              </div>

              {/* The search box moved down to sit with the listings. The first
                  thing asked here is the money question, which is what the page
                  now leads on. */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/finance"
                  className="px-7 py-4 bg-emerald-400 hover:bg-emerald-500 text-gray-900 font-bold rounded-lg transition text-center"
                >
                  Work out what you can afford
                </Link>
                <Link
                  href="/ghana-property-finance-index"
                  className="px-7 py-4 bg-white/10 hover:bg-white/20 ring-1 ring-white/40 text-white font-semibold rounded-lg transition text-center backdrop-blur-sm"
                >
                  This month&apos;s rates and costs
                </Link>
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

      {/* The money question, above the listings. */}
      <MoneyFirst snapshot={money} />

      {/* Recently Viewed Widget Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RecentlyViewedWidget />
        </div>
      </section>

      {/* Browse: the search box, with the listings it drives */}
      <section className="pt-12 pb-2 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-slate-900 p-5 sm:p-6">
            <HeroSearchBar popularFilters={popularFilters} />
          </div>
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
                {totalCount} {totalCount === 1 ? "property" : "properties"} available
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

          {allLoading ? (
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allProperties.slice(0, visibleCount).map((property) => (
                  <PropertyListCard key={property.id} property={property} />
                ))}
              </div>

              <div className="text-center mt-8">
                <p className="text-gray-500 text-sm mb-4">
                  Showing {Math.min(visibleCount, allProperties.length)} of {totalCount} properties
                </p>

                {visibleCount < allProperties.length ? (
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 30)}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold transition"
                  >
                    Load More Properties
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <Link
                    href="/properties"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
                  >
                    Browse All Properties
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </>
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
                Put your listings in front of Ghanaians abroad who are working out what they can afford.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>List unlimited properties</span>
                </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Your listings sit beside the finance tools buyers come for</span>
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
              href={generateGeneralWhatsAppUrl("Hi Dwellot! I'm looking for a property in Ghana. Can you help me find the right one?")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-semibold"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </Link>
            <span className="text-gray-500">or</span>
            <Link
              href="tel:+447576368312"
              className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-semibold"
            >
              <Phone className="w-5 h-5" />
              Call 07576 368312
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Message us on WhatsApp &bull; We reply from the UK, in UK hours
          </p>
        </div>
      </section>

      {/* Why Choose Dwellot */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-center">What Dwellot does</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Three things, stated plainly, with nothing claimed that we do not do.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HomeIcon className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">The numbers, published</h3>
                <p className="text-gray-600">
                  Lender rates, statutory fees and exchange rates, each with its source and the date
                  it was checked. Free to read and free to quote.
                </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">The full cost, before you commit</h3>
                <p className="text-gray-600">
                  Stamp duty, Lands Commission charges, legal and lender fees — separated into what
                  the law fixes and what you can negotiate.
                </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Built for buying from abroad</h3>
                <p className="text-gray-600">
                  Cedi or dollar, what lenders here ask of a diaspora applicant, and listings from
                  agents and developers in Ghana.
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
