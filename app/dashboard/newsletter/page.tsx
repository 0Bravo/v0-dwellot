"use client"

import { useState, useEffect } from "react"
import { Mail, Users, TrendingUp, Calendar } from "lucide-react"

interface NewsletterStats {
  total_subscribers: number
  active_subscribers: number
  recent_subscribers: number
  growth_rate: string
}

export default function NewsletterDashboard() {
  const [stats, setStats] = useState<NewsletterStats>({
    total_subscribers: 0,
    active_subscribers: 0,
    recent_subscribers: 0,
    growth_rate: "0%",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch newsletter stats
    // For now, showing mock data
    setStats({
      total_subscribers: 1247,
      active_subscribers: 1189,
      recent_subscribers: 42,
      growth_rate: "+12.5%",
    })
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Newsletter Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your newsletter subscribers and campaigns</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.total_subscribers.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Subscribers</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.active_subscribers.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Active Subscribers</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.recent_subscribers}</div>
            <div className="text-sm text-gray-600">New This Week</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.growth_rate}</div>
            <div className="text-sm text-gray-600">Growth Rate</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Newsletter Management</h2>
          <p className="text-gray-600 mb-6">Access subscriber management and campaign tools in your admin dashboard</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Advanced newsletter features including subscriber management, email campaigns, and
              analytics are available in the admin panel.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
