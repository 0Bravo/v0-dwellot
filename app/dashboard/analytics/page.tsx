"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Eye, MessageSquare, Users, ArrowUp, ArrowDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface TopProperty {
  id: string
  title: string
  location: string
  price: number
  images: string[]
  view_count: number
}

interface InquiryStats {
  total: number
  byStatus: Record<string, number>
  byDay: Record<string, number>
}

export default function AnalyticsPage() {
  const [topViewed, setTopViewed] = useState<TopProperty[]>([])
  const [inquiryStats, setInquiryStats] = useState<InquiryStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const [viewsRes, inquiriesRes] = await Promise.all([
        fetch("/api/analytics/property-views"),
        fetch("/api/analytics/inquiries?period=30"),
      ])

      const viewsData = await viewsRes.json()
      const inquiriesData = await inquiriesRes.json()

      setTopViewed(viewsData.topViewed || [])
      setInquiryStats(inquiriesData)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <Eye className="w-8 h-8 text-blue-600" />
              <span className="flex items-center text-sm text-green-600">
                <ArrowUp className="w-4 h-4 mr-1" />
                12%
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {topViewed.reduce((sum, p) => sum + p.view_count, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Property Views</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <MessageSquare className="w-8 h-8 text-green-600" />
              <span className="flex items-center text-sm text-green-600">
                <ArrowUp className="w-4 h-4 mr-1" />
                8%
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{inquiryStats?.total || 0}</div>
            <div className="text-sm text-gray-600">Inquiries (30 days)</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <span className="flex items-center text-sm text-red-600">
                <ArrowDown className="w-4 h-4 mr-1" />
                3%
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">4.2%</div>
            <div className="text-sm text-gray-600">Conversion Rate</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-orange-600" />
              <span className="flex items-center text-sm text-green-600">
                <ArrowUp className="w-4 h-4 mr-1" />
                15%
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">2,847</div>
            <div className="text-sm text-gray-600">Active Users</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top Viewed Properties</h2>
          <div className="space-y-4">
            {topViewed.map((property, index) => (
              <Link
                key={property.id}
                href={`/properties/${property.id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600">#{index + 1}</span>
                </div>
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={property.images[0] || "/placeholder.svg"}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{property.title}</h3>
                  <p className="text-sm text-gray-600">{property.location}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">${property.price.toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Eye className="w-5 h-5" />
                    <span className="font-semibold">{property.view_count.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {inquiryStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Inquiries by Status</h2>
              <div className="space-y-4">
                {Object.entries(inquiryStats.byStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-gray-700 capitalize">{status}</span>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${(count / inquiryStats.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold text-gray-900 w-12 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Daily Inquiries Trend</h2>
              <div className="space-y-3">
                {Object.entries(inquiryStats.byDay)
                  .slice(-7)
                  .map(([date, count]) => (
                    <div key={date} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{new Date(date).toLocaleDateString()}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-600 rounded-full"
                            style={{ width: `${(count / Math.max(...Object.values(inquiryStats.byDay))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
