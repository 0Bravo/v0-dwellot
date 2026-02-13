import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import {
  Home,
  Users,
  Shield,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  AlertTriangle,
  EyeOff,
  Puzzle,
  CheckCircle,
  Search,
  Handshake,
  Building2,
  Globe,
  ArrowRight,
  ChevronRight,
} from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* SECTION 1 — Hero/Intro */}
      <section className="bg-gradient-to-b from-teal-50 to-white py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 text-balance">
            About Dwellot
          </h1>
          <p className="text-xl md:text-2xl text-teal-700 font-medium mb-8">
            Simplifying property in Ghana, from search to keys
          </p>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              Dwellot was founded to modernise how Ghanaians find, buy, sell, and rent property.
              Built by a UK-Ghana team who saw the gap between what property seekers need and
              what traditional platforms offer.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We believe everyone deserves access to verified property information, transparent pricing,
              and a seamless experience &mdash; whether you are buying your first home in Accra or
              investing from London.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2 — The Problem We Solve */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            The Problem We Solve
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            The Ghanaian property market is full of potential &mdash; but riddled with friction
          </p>

          {/* Problem Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-red-100 bg-red-50/50">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Unverified Listings</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Too many fake or outdated listings waste your time and erode trust in the market.
                </p>
              </CardContent>
            </Card>

            <Card className="border-amber-100 bg-amber-50/50">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <EyeOff className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">No Transparency</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Hidden fees, unclear pricing, and no reliable data make informed decisions nearly impossible.
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-100 bg-orange-50/50">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Puzzle className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Fragmented Market</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Property info scattered across agents, WhatsApp groups, and word of mouth leaves buyers in the dark.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Arrow Transition */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-3 text-teal-600">
              <div className="h-px w-12 bg-teal-300" />
              <ArrowRight className="w-6 h-6" />
              <span className="font-semibold text-lg">Our Solution</span>
              <ArrowRight className="w-6 h-6" />
              <div className="h-px w-12 bg-teal-300" />
            </div>
          </div>

          {/* Solution Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-teal-100 bg-teal-50/50">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Verified Properties</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Every listing on Dwellot is reviewed for accuracy. Real properties, real prices, real agents.
                </p>
              </CardContent>
            </Card>

            <Card className="border-teal-100 bg-teal-50/50">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Full Transparency</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Clear pricing, detailed property data, and no hidden fees. What you see is what you get.
                </p>
              </CardContent>
            </Card>

            <Card className="border-teal-100 bg-teal-50/50">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Handshake className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">One Platform</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Search, compare, and connect with agents &mdash; all in one place. No more scattered searches.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Mission & Values */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mission Statement */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="bg-white border-l-4 border-teal-600 rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Dwellot is committed to simplifying the property buying, selling, and renting process in Ghana.
                We provide a transparent, secure, and efficient platform that connects property seekers with
                verified listings and trusted agents &mdash; making real estate transactions accessible to everyone.
              </p>
            </div>
          </div>

          {/* Values */}
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="h-7 w-7 text-teal-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Quality Listings</h3>
                <p className="text-sm text-gray-600">Only verified, high-quality properties on our platform</p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-7 w-7 text-teal-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Transparency</h3>
                <p className="text-sm text-gray-600">Clear pricing and honest property information always</p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-7 w-7 text-teal-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Customer First</h3>
                <p className="text-sm text-gray-600">Your satisfaction drives every decision we make</p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-7 w-7 text-teal-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Innovation</h3>
                <p className="text-sm text-gray-600">Using technology to improve real estate for everyone</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 4 — Key Numbers */}
      <section className="py-14 bg-teal-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white mb-1">213+</p>
              <p className="text-teal-200 font-medium">Properties Listed</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white mb-1">8+</p>
              <p className="text-teal-200 font-medium">Areas Covered</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white mb-1">2</p>
              <p className="text-teal-200 font-medium">Ghana & UK Offices</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white mb-1">98%</p>
              <p className="text-teal-200 font-medium">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — Our Team */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">Our Team</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Founded by property and technology professionals with deep roots in Ghana and the UK
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-teal-700" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Founder & CEO</h3>
                <p className="text-sm text-teal-600 font-medium mb-3">Strategy & Vision</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Driving the mission to modernise property in Ghana with a background in business and technology from the UK.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-teal-700" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Head of Operations, Ghana</h3>
                <p className="text-sm text-teal-600 font-medium mb-3">On-the-Ground Leadership</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Managing agent partnerships, property verification, and day-to-day operations across Ghana.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-teal-700" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Technology Lead</h3>
                <p className="text-sm text-teal-600 font-medium mb-3">Platform & Product</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Building the platform that powers Dwellot &mdash; from search and discovery to agent tools and analytics.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 6 — Offices */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">Our Offices</h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Ghana Office */}
            <Card className="bg-white">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Ghana Office</h3>
                    <p className="text-sm text-teal-600">Accra, Ghana</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-1" />
                    <span className="text-gray-600">Accra, Ghana</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <a href="tel:+233201578429" className="text-gray-600 hover:text-teal-600 transition">020 157 8429</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <a href="tel:+233552599185" className="text-gray-600 hover:text-teal-600 transition">055 259 9185</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <a href="mailto:ghana@dwellot.com" className="text-gray-600 hover:text-teal-600 transition">ghana@dwellot.com</a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* UK Office */}
            <Card className="bg-white">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">UK Office</h3>
                    <p className="text-sm text-teal-600">London, United Kingdom</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-1" />
                    <span className="text-gray-600">86-90 Paul Street, London EC2A 4NE</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <a href="tel:+447861932209" className="text-gray-600 hover:text-teal-600 transition">+44 7861 932209</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <a href="mailto:support@dwellot.com" className="text-gray-600 hover:text-teal-600 transition">support@dwellot.com</a>
                  </div>
                </div>

                {/* Google Maps Embed */}
                <div className="mt-6 rounded-lg overflow-hidden border">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.4!2d-0.0836!3d51.5264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761cb0e3d02e8b%3A0x6e1e04e5e41dcf7!2s86-90%20Paul%20St%2C%20London%20EC2A%204NE!5e0!3m2!1sen!2suk!4v1700000000000!5m2!1sen!2suk"
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Dwellot UK Office - 86-90 Paul Street, London"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 7 — CTA */}
      <section className="py-16 lg:py-20 bg-teal-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-teal-100 text-lg mb-10 max-w-xl mx-auto">
            Whether you are searching, selling, or partnering &mdash; Dwellot has you covered
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              href="/properties"
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-teal-700 rounded-lg font-semibold hover:bg-teal-50 transition"
            >
              Find a Property
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/sell"
              className="flex items-center justify-center gap-2 px-6 py-4 bg-teal-600 text-white border border-teal-500 rounded-lg font-semibold hover:bg-teal-500 transition"
            >
              List Your Property
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/agent-collection-form"
              className="flex items-center justify-center gap-2 px-6 py-4 bg-teal-600 text-white border border-teal-500 rounded-lg font-semibold hover:bg-teal-500 transition"
            >
              Become an Agent
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
