import Link from "next/link"
import {
  Shield,
  MapPin,
  MessageCircle,
  Users,
  Building2,
  Home,
  TrendingUp,
  BarChart3,
  CheckCircle,
  ChevronRight,
  Phone,
  Landmark,
} from "lucide-react"

const PLACEHOLDER_AGENTS = [
  {
    name: "Kwame Asante",
    initials: "KA",
    company: "Appolonia Development",
    location: "Appolonia City, Accra",
    specialties: ["Residential", "Land"],
    listings: 24,
    phone: "233201578429",
  },
  {
    name: "Ama Mensah",
    initials: "AM",
    company: "BestWorld Company",
    location: "East Legon, Accra",
    specialties: ["Residential", "Commercial"],
    listings: 18,
    phone: "233201578429",
  },
  {
    name: "Kofi Adjei",
    initials: "KJ",
    company: "Devtraco Group",
    location: "Airport Hills, Accra",
    specialties: ["Residential", "Luxury"],
    listings: 31,
    phone: "233201578429",
  },
  {
    name: "Efua Owusu",
    initials: "EO",
    company: "Dwellot Realty",
    location: "Spintex, Accra",
    specialties: ["Commercial", "Land"],
    listings: 12,
    phone: "233201578429",
  },
  {
    name: "Yaw Boateng",
    initials: "YB",
    company: "Gold Coast Properties",
    location: "Cantonments, Accra",
    specialties: ["Residential", "Luxury"],
    listings: 27,
    phone: "233201578429",
  },
  {
    name: "Abena Darko",
    initials: "AD",
    company: "Kumasi Estates",
    location: "Kumasi, Ashanti",
    specialties: ["Residential", "Land"],
    listings: 15,
    phone: "233201578429",
  },
]

const AREAS = [
  "East Legon",
  "Spintex",
  "Tema",
  "Airport Hills",
  "Cantonments",
  "Kumasi",
  "Takoradi",
  "Appolonia City",
]

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-teal-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">
            Find Real Estate Agents in Ghana
          </h1>
          <p className="text-teal-100 text-lg md:text-xl max-w-2xl mx-auto text-pretty">
            Connect with verified property professionals across Ghana
          </p>
        </div>
      </section>

      {/* Why Use a Dwellot Agent */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Why Use a Dwellot Agent</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
              <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Shield className="w-7 h-7 text-teal-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Professionals</h3>
              <p className="text-gray-600 leading-relaxed">
                All agents verified with ID and license checks. Only trusted professionals make it onto our platform.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
              <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <MapPin className="w-7 h-7 text-teal-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Local Expertise</h3>
              <p className="text-gray-600 leading-relaxed">
                {"Deep knowledge of Ghana's property markets and neighborhoods. Get advice from people who know the area."}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
              <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <MessageCircle className="w-7 h-7 text-teal-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Free Consultation</h3>
              <p className="text-gray-600 leading-relaxed">
                No upfront costs. Agents earn commission on successful deals. Get expert guidance at no charge to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Agent Network */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Our Agent Network</h2>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 text-gray-700">
              <Users className="w-5 h-5 text-teal-600" />
              <span className="font-semibold">50+ Agents</span>
            </div>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <div className="flex items-center gap-2 text-gray-700">
              <Building2 className="w-5 h-5 text-teal-600" />
              <span className="font-semibold">8 Cities</span>
            </div>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <div className="flex items-center gap-2 text-gray-700">
              <Home className="w-5 h-5 text-teal-600" />
              <span className="font-semibold">200+ Properties Listed</span>
            </div>
          </div>

          {/* Agent Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLACEHOLDER_AGENTS.map((agent) => (
              <div
                key={agent.name}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">{agent.initials}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{agent.name}</h3>
                    <p className="text-gray-600 text-sm">{agent.company}</p>
                    <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {agent.location}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {agent.specialties.map((s) => (
                    <span key={s} className="bg-teal-50 text-teal-700 text-xs font-medium px-2.5 py-1 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>

                <p className="text-gray-600 text-sm mb-5">
                  <span className="font-semibold text-gray-900">{agent.listings}</span> active listings
                </p>

                <div className="flex gap-3">
                  <Link
                    href="/properties"
                    className="flex-1 text-center bg-gray-100 text-gray-800 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
                  >
                    View Profile
                  </Link>
                  <a
                    href={`https://wa.me/${agent.phone}?text=${encodeURIComponent(`Hi ${agent.name}, I found your profile on Dwellot and I'd like to discuss property options.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 transition font-medium text-sm flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become an Agent CTA */}
      <section className="py-16 bg-teal-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-balance">
            {"Join Ghana's Fastest Growing Property Platform"}
          </h2>
          <p className="text-teal-100 text-lg mb-8 max-w-2xl mx-auto">
            Sign up as a Dwellot agent and grow your real estate business with qualified leads and powerful tools.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-10">
            {[
              "List unlimited properties",
              "Get qualified leads",
              "Free agent profile",
              "Dashboard analytics",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 text-teal-50">
                <CheckCircle className="w-5 h-5 text-teal-300 flex-shrink-0" />
                <span className="text-left">{benefit}</span>
              </div>
            ))}
          </div>

          <Link
            href="/agent-collection-form"
            className="inline-flex items-center gap-2 bg-white text-teal-700 px-8 py-3.5 rounded-lg font-bold text-lg hover:bg-teal-50 transition"
          >
            Sign Up as Agent
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Areas We Cover */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Areas We Cover</h2>
          <p className="text-gray-600 text-center mb-10 max-w-xl mx-auto">
            Our agents operate across major cities and neighborhoods in Ghana
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {AREAS.map((area) => (
              <Link
                key={area}
                href={`/properties?location=${encodeURIComponent(area)}`}
                className="flex items-center gap-3 bg-gray-50 hover:bg-teal-50 border border-gray-200 hover:border-teal-200 p-4 rounded-lg transition"
              >
                <Landmark className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <span className="font-medium text-gray-900">{area}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
