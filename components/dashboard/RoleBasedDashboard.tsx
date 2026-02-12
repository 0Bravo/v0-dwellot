// src/components/dashboard/RoleBasedDashboard.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import {
  User,
  Heart,
  Bell,
  Settings,
  LogOut,
  Home,
  Eye,
  MessageSquare,
  Calendar,
  TrendingUp,
  MapPin,
  Bed,
  Bath,
  Square,
  X,
  Mail,
  Phone,
  Edit2,
  Save,
  Search,
  Users,
  UserCheck,
  AlertTriangle,
  Plus,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function RoleBasedDashboard() {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  // Handle loading states
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const handleSignOut = async () => {
    await signOut()
  }

  const userRole = "user"

  // Get role-specific tabs and content
  const getRoleTabs = () => {
    const baseTabs = [
      { id: "overview", label: "Overview", icon: Home },
      { id: "profile", label: "Profile", icon: User },
      { id: "settings", label: "Settings", icon: Settings },
    ]

    return [
      { id: "overview", label: "Overview", icon: Home },
      { id: "saved", label: "Saved Properties", icon: Heart },
      { id: "messages", label: "Messages", icon: MessageSquare },
      ...baseTabs.slice(1),
    ]
  }

  const tabs = getRoleTabs()

  // Sample data (replace with real data later)
  const savedProperties = [
    {
      id: 1,
      image: "/api/placeholder/400/300",
      title: "Modern 3BR Apartment in Cantonments",
      location: "Cantonments, Accra",
      price: "$ 450,000",
      beds: 3,
      baths: 2,
      area: "150m²",
      savedDate: "2 days ago",
    },
    {
      id: 2,
      image: "/api/placeholder/400/300",
      title: "Luxury Villa with Pool",
      location: "East Legon, Accra",
      price: "$ 1,200,000",
      beds: 5,
      baths: 4,
      area: "350m²",
      savedDate: "1 week ago",
    },
    {
      id: 3,
      image: "/api/placeholder/400/300",
      title: "Cozy 2BR House",
      location: "Labone, Accra",
      price: "$ 280,000",
      beds: 2,
      baths: 2,
      area: "110m²",
      savedDate: "2 weeks ago",
    },
  ]

  const recentActivity = [
    { icon: Eye, action: "Viewed", property: "Modern 3BR in Cantonments", time: "2 hours ago" },
    { icon: Heart, action: "Saved", property: "Luxury Villa with Pool", time: "5 hours ago" },
    { icon: Search, action: "Searched for", property: "Properties in East Legon", time: "1 day ago" },
    { icon: Eye, action: "Viewed", property: "Cozy 2BR House", time: "2 days ago" },
    { icon: Bell, action: "Received alert for", property: "New properties in Accra", time: "3 days ago" },
  ]

  // Role-specific stats
  const getStatsCards = () => {
    switch (userRole) {
      case "admin":
      case "super_admin":
        return [
          { icon: Users, label: "Total Users", value: "1,234", change: "+12%" },
          { icon: Home, label: "Total Properties", value: "856", change: "+8%" },
          { icon: UserCheck, label: "Verified Agents", value: "342", change: "+5%" },
          { icon: AlertTriangle, label: "Pending Reviews", value: "23", change: "-2%" },
        ]
      case "agent":
        return [
          { icon: Home, label: "Active Listings", value: "12", change: "+2 this week" },
          { icon: Eye, label: "Total Views", value: "2,456", change: "+15% this month" },
          { icon: MessageSquare, label: "Inquiries", value: "48", change: "+8 today" },
          { icon: Calendar, label: "Scheduled Viewings", value: "6", change: "2 tomorrow" },
        ]
      default:
        return [
          { icon: Heart, label: "Saved Properties", value: "8", change: "+2 this week" },
          { icon: Eye, label: "Property Views", value: "24", change: "Last 30 days" },
          { icon: Search, label: "Saved Searches", value: "3", change: "Active alerts" },
          { icon: Bell, label: "New Matches", value: "12", change: "This week" },
        ]
    }
  }

  const statsCards = getStatsCards()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Dwellot
              </Link>
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-gray-900">
                  {userRole === "admin" || userRole === "super_admin"
                    ? "Admin Dashboard"
                    : userRole === "agent"
                      ? "Agent Dashboard"
                      : "My Dashboard"}
                </h1>
                <p className="text-sm text-gray-600">Welcome back, {user.full_name || user.first_name || "User"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  userRole === "admin" || userRole === "super_admin"
                    ? "bg-red-100 text-red-800"
                    : userRole === "agent"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                }`}
              >
                {userRole === "super_admin"
                  ? "Super Admin"
                  : userRole === "admin"
                    ? "Admin"
                    : userRole === "agent"
                      ? "Agent"
                      : "User"}
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <ul className="space-y-2">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {statsCards.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                          <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <stat.icon className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Role-specific overview content */}
                {userRole === "user" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recently Saved Properties */}
                    <div className="bg-white rounded-lg shadow-sm">
                      <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">Recently Saved</h3>
                          <button
                            onClick={() => handleTabChange("saved")}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            View all
                          </button>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          {savedProperties.slice(0, 2).map((property) => (
                            <div
                              key={property.id}
                              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                            >
                              <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{property.title}</h4>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {property.location}
                                </p>
                                <p className="text-sm font-medium text-blue-600">{property.price}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                  <span className="flex items-center gap-1">
                                    <Bed className="h-3 w-3" />
                                    {property.beds} beds
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Bath className="h-3 w-3" />
                                    {property.baths} baths
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Square className="h-3 w-3" />
                                    {property.area}
                                  </span>
                                </div>
                              </div>
                              <button className="text-red-500 hover:text-red-600">
                                <Heart className="h-5 w-5 fill-current" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-lg shadow-sm">
                      <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                      </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-center space-x-3 py-3 border-b last:border-b-0">
                              <div className="bg-gray-100 p-2 rounded-lg">
                                <activity.icon className="w-4 h-4 text-gray-600" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-gray-900">
                                  <span className="font-medium">{activity.action}</span> {activity.property}
                                </p>
                                <p className="text-xs text-gray-500">{activity.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {userRole === "user" && (
                      <>
                        <Link
                          href="/properties"
                          className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Search className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium">Search Properties</span>
                        </Link>
                        <button className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <Heart className="w-5 h-5 text-red-600" />
                          <span className="text-sm font-medium">Saved Properties</span>
                        </button>
                        <button className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <Bell className="w-5 h-5 text-yellow-600" />
                          <span className="text-sm font-medium">Manage Alerts</span>
                        </button>
                        <button className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <User className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium">My Profile</span>
                        </button>
                      </>
                    )}

                    {userRole === "agent" && (
                      <>
                        <Link
                          href="/add-property"
                          className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium">Add Property</span>
                        </Link>
                        <button className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <MessageSquare className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium">View Inquiries</span>
                        </button>
                        <button className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <Calendar className="w-5 h-5 text-purple-600" />
                          <span className="text-sm font-medium">Schedule</span>
                        </button>
                        <button className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <TrendingUp className="w-5 h-5 text-orange-600" />
                          <span className="text-sm font-medium">Analytics</span>
                        </button>
                      </>
                    )}

                    {(userRole === "admin" || userRole === "super_admin") && (
                      <>
                        <button className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <Users className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium">Manage Users</span>
                        </button>
                        <button className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <Home className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium">Review Properties</span>
                        </button>
                        <button className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <UserCheck className="w-5 h-5 text-purple-600" />
                          <span className="text-sm font-medium">Verify Agents</span>
                        </button>
                        <button className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <TrendingUp className="w-5 h-5 text-orange-600" />
                          <span className="text-sm font-medium">View Analytics</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "saved" && userRole === "user" && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Saved Properties</h2>
                  <p className="text-sm text-gray-600 mt-1">Properties you&apos;ve saved for later</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {savedProperties.map((property) => (
                      <div
                        key={property.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">{property.title}</h3>
                            <div className="flex items-center text-gray-500 text-sm mb-2">
                              <MapPin className="w-3 h-3 mr-1" />
                              {property.location}
                            </div>
                            <p className="text-lg font-semibold text-blue-600">{property.price}</p>
                          </div>
                          <button className="text-red-500 hover:text-red-700 p-1">
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>

                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Bed className="w-3 h-3 mr-1" />
                              {property.beds} beds
                            </span>
                            <span className="flex items-center">
                              <Bath className="w-3 h-3 mr-1" />
                              {property.baths} baths
                            </span>
                            <span className="flex items-center">
                              <Square className="w-3 h-3 mr-1" />
                              {property.area}
                            </span>
                          </div>
                          <span>Saved {property.savedDate}</span>
                        </div>

                        <div className="flex space-x-3">
                          <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                            View Details
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                            Contact Agent
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "messages" && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                </div>
                <div className="p-6">
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                    <p className="text-gray-500 mb-6">
                      When you contact agents or receive messages, they&apos;ll appear here
                    </p>
                    <Link
                      href="/properties"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Browse Properties
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>
                    <button
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      {isEditingProfile ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                      <span>{isEditingProfile ? "Save Changes" : "Edit Profile"}</span>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="max-w-2xl">
                    <div className="flex items-center space-x-6 mb-8">
                      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-10 h-10 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {user.full_name || `${user.first_name || ""} ${user.last_name || ""}`.trim() || "User"}
                        </h3>
                        <p className="text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-500 capitalize">{userRole} Account</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input
                          type="text"
                          value={user.first_name || ""}
                          disabled={!isEditingProfile}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          value={user.last_name || ""}
                          disabled={!isEditingProfile}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            value={user.email}
                            disabled={true} // Email is usually not editable
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            value={user.phone || ""}
                            disabled={!isEditingProfile}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                          />
                        </div>
                      </div>

                      {user.agency_name && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Agency Name</label>
                          <input
                            type="text"
                            value={user.agency_name}
                            disabled={!isEditingProfile}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
                </div>
                <div className="p-6">
                  <div className="max-w-2xl space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Email Notifications</p>
                            <p className="text-sm text-gray-500">Receive notifications via email</p>
                          </div>
                          <input
                            type="checkbox"
                            defaultChecked={user.email_notifications}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">SMS Notifications</p>
                            <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                          </div>
                          <input
                            type="checkbox"
                            defaultChecked={user.sms_notifications}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Marketing Emails</p>
                            <p className="text-sm text-gray-500">Receive marketing and promotional emails</p>
                          </div>
                          <input
                            type="checkbox"
                            defaultChecked={user.marketing_emails}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
                      <div className="space-y-4">
                        <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <p className="font-medium text-gray-900">Change Password</p>
                          <p className="text-sm text-gray-500">Update your account password</p>
                        </button>
                        <button className="w-full text-left p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                          <p className="font-medium text-red-900">Delete Account</p>
                          <p className="text-sm text-red-500">Permanently delete your account and all data</p>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
