import Link from "next/link"
import {
  Shield,
  MapPin,
  MessageCircle,
  Users,
  Building2,
  Home,
  CheckCircle,
  ChevronRight,
  Phone,
  Landmark,
  UserPlus,
} from "lucide-react"
import { createClient } from "@supabase/supabase-js"

export const revalidate = 300

interface AgentProfile {
  id: string
  full_name: string
  phone: string | null
  bio: string | null
  avatar_url: string | null
  email: string | null
}

interface AgentWithListings extends AgentProfile {
  listings: number
}

async function getAgents(): Promise<{
  agents: AgentWithListings[]
  totalProperties: number
  areas: string[]
}> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return { agents: [], totalProperties: 0, areas: [] }
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  // Fetch agent profiles
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name, phone, bio, avatar_url, email")
    .eq("role", "agent")
    .order("created_at", { ascending: false })

  if (profilesError || !profiles) {
    console.error("Error fetching agents:", profilesError)
    return { agents: [], totalProperties: 0, areas: [] }
  }

  // Fetch all active properties for agent listing counts and stats
  const { data: properties, error: propsError } = await supabase
    .from("properties")
    .select("agent_id, location")
    .eq("status", "active")

  if (propsError) {
    console.error("Error fetching properties:", propsError)
  }

  const activeProperties = properties || []

  // Count listings per agent
  const listingCounts: Record<string, number> = {}
  const areaSet = new Set<string>()

  for (const prop of activeProperties) {
    if (prop.agent_id) {
      listingCounts[prop.agent_id] = (listingCounts[prop.agent_id] || 0) + 1
    }
    if (prop.location) {
      // Extract area name (take the first part before comma)
      const area = prop.location.split(",")[0].trim()
      if (area) areaSet.add(area)
    }
  }

  const agents: AgentWithListings[] = profiles.map((profile) => ({
    ...profile,
    listings: listingCounts[profile.id] || 0,
  }))

  return {
    agents,
    totalProperties: activeProperties.length,
    areas: Array.from(areaSet).sort(),
  }
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default async function AgentsPage() {
  const { agents, totalProperties, areas } = await getAgents()

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
          {agents.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
              <div className="flex items-center gap-2 text-gray-700">
                <Users className="w-5 h-5 text-teal-600" />
                <span className="font-semibold">
                  {agents.length} {agents.length === 1 ? "Agent" : "Agents"}
                </span>
              </div>
              {areas.length > 0 && (
                <>
                  <span className="text-gray-300 hidden sm:inline">|</span>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Building2 className="w-5 h-5 text-teal-600" />
                    <span className="font-semibold">
                      {areas.length} {areas.length === 1 ? "Area" : "Areas"}
                    </span>
                  </div>
                </>
              )}
              {totalProperties > 0 && (
                <>
                  <span className="text-gray-300 hidden sm:inline">|</span>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Home className="w-5 h-5 text-teal-600" />
                    <span className="font-semibold">
                      {totalProperties} {totalProperties === 1 ? "Property" : "Properties"} Listed
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Agent Cards Grid */}
          {agents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {agent.avatar_url ? (
                      <img
                        src={agent.avatar_url}
                        alt={`${agent.full_name} profile photo`}
                        className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">
                          {getInitials(agent.full_name)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{agent.full_name}</h3>
                      {agent.bio && (
                        <p className="text-gray-600 text-sm line-clamp-2">{agent.bio}</p>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-5">
                    <span className="font-semibold text-gray-900">{agent.listings}</span>{" "}
                    active {agent.listings === 1 ? "listing" : "listings"}
                  </p>

                  <div className="flex gap-3">
                    <Link
                      href={`/properties?agent_id=${agent.id}`}
                      className="flex-1 text-center bg-gray-100 text-gray-800 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
                    >
                      View Listings
                    </Link>
                    {agent.phone && (
                      <a
                        href={`https://wa.me/${agent.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${agent.full_name}, I found your profile on Dwellot and I'd like to discuss property options.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 transition font-medium text-sm flex items-center justify-center gap-1.5"
                      >
                        <Phone className="w-4 h-4" />
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserPlus className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No agents yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We are actively onboarding verified agents across Ghana. Be among the first to join our network.
              </p>
              <Link
                href="/agent-collection-form"
                className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
              >
                Sign Up as Agent
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          )}
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

      {/* Areas We Cover - only show if there are real areas from properties */}
      {areas.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Areas We Cover</h2>
            <p className="text-gray-600 text-center mb-10 max-w-xl mx-auto">
              Our agents operate across major cities and neighborhoods in Ghana
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {areas.map((area) => (
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
      )}
    </div>
  )
}
