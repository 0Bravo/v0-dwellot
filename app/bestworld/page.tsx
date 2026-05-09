import Link from "next/link"
import { Home, Globe, Star, TrendingUp, Shield, Users, MapPin, ChevronRight, CheckCircle, Building2, Handshake } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Best World Properties | Dwellot",
  description: "Discover the best properties in the world with Dwellot's curated selection of premium real estate.",
}

export default function BestWorldPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-teal-50 to-white py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
              <Globe className="w-8 h-8 text-teal-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 text-balance">
            Best World Properties
          </h1>
          <p className="text-xl md:text-2xl text-teal-700 font-medium mb-8">
            Premium real estate, handpicked from across the globe
          </p>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              Dwellot&apos;s Best World collection showcases the finest properties available worldwide.
              From luxury beachfront villas to prime urban residences, we curate exceptional homes for
              discerning buyers.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Every listing is verified, every detail is accurate, and every property meets our highest
              standards of quality and value.
            </p>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/properties"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
            >
              Browse Properties <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/about"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-teal-700 border border-teal-300 rounded-lg font-semibold hover:bg-teal-50 transition"
            >
              Learn More <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-14 bg-teal-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white mb-1">500+</p>
              <p className="text-teal-200 font-medium">Global Listings</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white mb-1">30+</p>
              <p className="text-teal-200 font-medium">Countries</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white mb-1">5&#9733;</p>
              <p className="text-teal-200 font-medium">Average Rating</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white mb-1">98%</p>
              <p className="text-teal-200 font-medium">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Best World Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            Why Choose Best World
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            We set the benchmark for premium property discovery worldwide
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-teal-100 bg-teal-50/50">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Verified Listings</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Every property undergoes rigorous verification. We confirm ownership, legal status, and
                  accurate pricing before listing.
                </p>
              </CardContent>
            </Card>
            <Card className="border-teal-100 bg-teal-50/50">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Premium Quality</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Only the finest properties make it into our Best World collection &mdash; curated by
                  experts with decades of real estate experience.
                </p>
              </CardContent>
            </Card>
            <Card className="border-teal-100 bg-teal-50/50">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Global Reach</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  From Ghana to London, Dubai to Toronto &mdash; our network spans over 30 countries,
                  giving you truly global property options.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Regions */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            Featured Regions
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Explore our top-performing property markets around the world
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { region: "Accra, Ghana", type: "Residential & Commercial", icon: MapPin, count: "213+ listings" },
              { region: "London, UK", type: "Luxury Apartments", icon: Building2, count: "85+ listings" },
              { region: "Dubai, UAE", type: "Premium Villas", icon: Star, count: "64+ listings" },
              { region: "Toronto, Canada", type: "Urban Condos", icon: Home, count: "47+ listings" },
              { region: "Lagos, Nigeria", type: "Executive Homes", icon: TrendingUp, count: "52+ listings" },
              { region: "Cape Town, SA", type: "Coastal Properties", icon: Globe, count: "39+ listings" },
            ].map((item) => (
              <Card key={item.region} className="bg-white hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{item.region}</h3>
                      <p className="text-sm text-teal-600 mb-2">{item.type}</p>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-500">{item.count}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Finding your dream property has never been this simple
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Search</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Browse our curated selection of premium properties. Filter by location, price, type,
                and more to find exactly what you are looking for.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Connect</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Get in touch with verified agents who specialise in your chosen region. We handle
                introductions so you can focus on finding the right home.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Move In</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Complete your purchase with confidence. Our team supports you through every step of
                the legal and financial process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            Our Partners
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            We collaborate with trusted agents and developers across the globe
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-teal-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Verified Agents</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Our network of 200+ verified agents are local experts in their markets. Each agent
                  is vetted for professionalism, experience, and client service.
                </p>
                <Link
                  href="/agents"
                  className="text-teal-600 font-semibold text-sm flex items-center gap-1 hover:text-teal-700 transition"
                >
                  Meet Our Agents <ChevronRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Handshake className="w-5 h-5 text-teal-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Developer Partners</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  We partner with leading property developers to bring you exclusive off-plan
                  opportunities and new developments before they hit the open market.
                </p>
                <Link
                  href="/add-property"
                  className="text-teal-600 font-semibold text-sm flex items-center gap-1 hover:text-teal-700 transition"
                >
                  List Your Development <ChevronRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-teal-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Start Your Global Property Journey
          </h2>
          <p className="text-teal-100 text-lg mb-10 max-w-xl mx-auto">
            Whether you are buying, selling, or investing &mdash; Dwellot connects you with the best
            properties the world has to offer
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              href="/properties"
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-teal-700 rounded-lg font-semibold hover:bg-teal-50 transition"
            >
              Browse Properties <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/add-property"
              className="flex items-center justify-center gap-2 px-6 py-4 bg-teal-600 text-white border border-teal-500 rounded-lg font-semibold hover:bg-teal-500 transition"
            >
              List Your Property <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/agent-collection-form"
              className="flex items-center justify-center gap-2 px-6 py-4 bg-teal-600 text-white border border-teal-500 rounded-lg font-semibold hover:bg-teal-500 transition"
            >
              Become an Agent <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
