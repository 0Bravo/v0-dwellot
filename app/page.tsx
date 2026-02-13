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
import { createAdminClient } from "@/lib/supabase/admin"
import HeroSearchBar from "@/components/HeroSearchBar"
import { FeaturedPropertyCard, PropertyListCard } from "@/components/PropertyCard"
import RecentlyViewedWidget from "@/components/RecentlyViewedWidget"
import PWAInstallPrompt from "@/components/PWAInstallPrompt"

export const revalidate = 60

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

async function getHomePageData() {
  const adminClient = createAdminClient()

  const selectFields = "id, title, location, price, property_type, listing_type, bedrooms, bathrooms, area, parking, description, images, featured, status, agent, phone, view_count"

  // Fetch all active properties + total count in parallel
  const [propertiesResult, countResult] = await Promise.all([
    adminClient
      .from("properties")
      .select(selectFields)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(500),
    adminClient
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
  ])

  if (propertiesResult.error) {
    console.error("[Homepage] Error fetching properties:", propertiesResult.error)
  }

  const allProperties: Property[] = propertiesResult.data || []
  const totalCount: number = countResult.count ?? allProperties.length

  // Featured = properties with real images (not placeholders)
  const featuredProperties = allProperties.filter(
    (prop) =>
      prop.images &&
      prop.images.length > 0 &&
      !prop.images[0]?.includes("image-coming-soon") &&
      !prop.images[0]?.includes("placeholder"),
  )

  // Compute popular filters from real data
  let popularFilters = {
    priceRange: "Under $500K",
    bedrooms: "3",
    location: "East Legon, Accra",
    locationCount: 15,
  }

  if (allProperties.length > 0) {
    const prices = allProperties.map((p) => p.price).filter(Boolean)
    const medianPrice = prices.length > 0 ? prices.sort((a, b) => a - b)[Math.floor(prices.length / 2)] : 500000
    const priceRange = medianPrice <= 250000 ? "Under $250K" : medianPrice <= 500000 ? "Under $500K" : "Under $1M"

    const bedCounts = allProperties.map((p) => p.bedrooms).filter(Boolean)
    const avgBeds = bedCounts.length > 0 ? Math.round(bedCounts.reduce((a, b) => a + b, 0) / bedCounts.length) : 3

    const locationCounts: Record<string, number> = {}
    for (const p of allProperties) {
      if (p.location) {
        locationCounts[p.location] = (locationCounts[p.location] || 0) + 1
      }
    }
    const topLocation = Object.entries(locationCounts).sort(([, a], [, b]) => (b as number) - (a as number))[0]

    popularFilters = {
      priceRange,
      bedrooms: String(avgBeds),
      location: topLocation ? topLocation[0] : "East Legon, Accra",
      locationCount: topLocation ? (topLocation[1] as number) : 15,
    }
  }

  return { featuredProperties, allProperties, totalCount, popularFilters }
}

export default async function HomePage() {
  const { featuredProperties, allProperties, totalCount, popularFilters } = await getHomePageData()

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

          {featuredProperties.length === 0 ? (
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

          {allProperties.length === 0 ? (
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
              View All {totalCount} Properties
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
