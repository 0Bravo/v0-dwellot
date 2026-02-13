import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { Home, Users, MessageSquare, Mail, TrendingUp, Eye, Package } from "lucide-react"
import Link from "next/link"

async function getDashboardStats() {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    }
  )

  // Fetch all stats in parallel
  const [
    { count: totalProperties },
    { count: activeProperties },
    { count: totalEnquiries },
    { count: newEnquiries },
    { count: totalSubscribers },
    { count: pendingAgents },
    { data: recentProperties },
    { data: recentEnquiries },
  ] = await Promise.all([
    supabase.from("properties").select("*", { count: "exact", head: true }),
    supabase.from("properties").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("property_enquiries").select("*", { count: "exact", head: true }),
    supabase.from("property_enquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }),
    supabase.from("agent_applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("properties").select("id, title, price, location, status, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("property_enquiries").select("id, property_id, enquiry_type, created_at, properties(title)").order("created_at", { ascending: false }).limit(5),
  ])

  return {
    totalProperties: totalProperties || 0,
    activeProperties: activeProperties || 0,
    totalEnquiries: totalEnquiries || 0,
    newEnquiries: newEnquiries || 0,
    totalSubscribers: totalSubscribers || 0,
    pendingAgents: pendingAgents || 0,
    recentProperties: recentProperties || [],
    recentEnquiries: recentEnquiries || [],
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  const statCards = [
    {
      name: "Total Properties",
      value: stats.totalProperties,
      change: `${stats.activeProperties} active`,
      icon: Home,
      href: "/admin/properties",
      color: "bg-blue-500",
    },
    {
      name: "New Enquiries",
      value: stats.newEnquiries,
      change: `${stats.totalEnquiries} total`,
      icon: MessageSquare,
      href: "/admin/enquiries",
      color: "bg-teal-500",
    },
    {
      name: "Subscribers",
      value: stats.totalSubscribers,
      change: "Newsletter",
      icon: Mail,
      href: "/admin/subscribers",
      color: "bg-purple-500",
    },
    {
      name: "Pending Agents",
      value: stats.pendingAgents,
      change: "Applications",
      icon: Users,
      href: "/admin/agent-applications",
      color: "bg-orange-500",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening with your properties.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Two column grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Properties */}
        <div className="rounded-lg bg-white shadow border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Properties</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {stats.recentProperties.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-gray-500">
                No properties yet
              </div>
            ) : (
              stats.recentProperties.map((property: any) => (
                <Link
                  key={property.id}
                  href={`/admin/properties/${property.id}/edit`}
                  className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {property.title}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{property.location}</p>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          property.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {property.status}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        ${property.price?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
          <div className="border-t border-gray-200 px-6 py-3">
            <Link
              href="/admin/properties"
              className="text-sm font-medium text-teal-600 hover:text-teal-500"
            >
              View all properties →
            </Link>
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="rounded-lg bg-white shadow border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Enquiries</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {stats.recentEnquiries.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-gray-500">
                No enquiries yet
              </div>
            ) : (
              stats.recentEnquiries.map((enquiry: any) => (
                <Link
                  key={enquiry.id}
                  href={`/admin/enquiries`}
                  className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {enquiry.properties?.title || "Property"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {enquiry.enquiry_type.replace("_", " ")}
                      </p>
                    </div>
                    <div className="ml-4 text-xs text-gray-400">
                      {new Date(enquiry.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
          <div className="border-t border-gray-200 px-6 py-3">
            <Link
              href="/admin/enquiries"
              className="text-sm font-medium text-teal-600 hover:text-teal-500"
            >
              View all enquiries →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="rounded-lg bg-white shadow border border-gray-200 px-6 py-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/admin/properties/add"
            className="flex items-center gap-3 rounded-lg border-2 border-dashed border-gray-300 p-4 hover:border-teal-500 hover:bg-teal-50 transition-colors"
          >
            <Package className="h-8 w-8 text-teal-600" />
            <div>
              <p className="font-medium text-gray-900">Add Property</p>
              <p className="text-sm text-gray-500">Create new listing</p>
            </div>
          </Link>
          
          <Link
            href="/admin/properties/bulk-upload"
            className="flex items-center gap-3 rounded-lg border-2 border-dashed border-gray-300 p-4 hover:border-teal-500 hover:bg-teal-50 transition-colors"
          >
            <TrendingUp className="h-8 w-8 text-teal-600" />
            <div>
              <p className="font-medium text-gray-900">Bulk Upload</p>
              <p className="text-sm text-gray-500">Import multiple properties</p>
            </div>
          </Link>
          
          <Link
            href="/admin/enquiries"
            className="flex items-center gap-3 rounded-lg border-2 border-dashed border-gray-300 p-4 hover:border-teal-500 hover:bg-teal-50 transition-colors"
          >
            <Eye className="h-8 w-8 text-teal-600" />
            <div>
              <p className="font-medium text-gray-900">View Enquiries</p>
              <p className="text-sm text-gray-500">Manage customer requests</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
