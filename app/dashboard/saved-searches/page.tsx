"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Trash2, Bell, BellOff, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SavedSearch {
  id: string
  name: string
  search_query: string | null
  location: string | null
  min_price: number | null
  max_price: number | null
  bedrooms: number | null
  bathrooms: number | null
  property_type: string | null
  listing_type: string
  email_alerts: boolean
  alert_frequency: string
  created_at: string
}

export default function SavedSearchesPage() {
  const [searches, setSearches] = useState<SavedSearch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSavedSearches()
  }, [])

  const fetchSavedSearches = async () => {
    try {
      const response = await fetch("/api/saved-searches")
      const data = await response.json()
      if (data.searches) {
        setSearches(data.searches)
      }
    } catch (error) {
      console.error("Error fetching saved searches:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteSearch = async (id: string) => {
    if (!confirm("Are you sure you want to delete this saved search?")) return

    try {
      await fetch(`/api/saved-searches/${id}`, { method: "DELETE" })
      setSearches(searches.filter((s) => s.id !== id))
    } catch (error) {
      console.error("Error deleting search:", error)
    }
  }

  const toggleAlerts = async (id: string, currentValue: boolean) => {
    try {
      await fetch(`/api/saved-searches/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_alerts: !currentValue }),
      })
      setSearches(searches.map((s) => (s.id === id ? { ...s, email_alerts: !currentValue } : s)))
    } catch (error) {
      console.error("Error updating alerts:", error)
    }
  }

  const buildSearchURL = (search: SavedSearch) => {
    const params = new URLSearchParams()
    if (search.search_query) params.set("search", search.search_query)
    if (search.location) params.set("location", search.location)
    if (search.min_price) params.set("min_price", search.min_price.toString())
    if (search.max_price) params.set("max_price", search.max_price.toString())
    if (search.bedrooms) params.set("bedrooms", search.bedrooms.toString())
    if (search.bathrooms) params.set("bathrooms", search.bathrooms.toString())
    if (search.property_type) params.set("property_type", search.property_type)
    if (search.listing_type !== "all") params.set("type", search.listing_type)
    return `/properties?${params.toString()}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 h-32"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Saved Searches</h1>
              <p className="text-gray-600 mt-1">
                {searches.length} saved {searches.length === 1 ? "search" : "searches"}
              </p>
            </div>
            <Link href="/properties">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Search
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {searches.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved searches yet</h3>
            <p className="text-gray-600 mb-6">Save your property searches to get alerts when new matches appear</p>
            <Link href="/properties">
              <Button>Browse Properties</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {searches.map((search) => (
              <div key={search.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{search.name}</h3>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                      {search.location && <span className="bg-gray-100 px-3 py-1 rounded-full">{search.location}</span>}
                      {search.min_price && (
                        <span className="bg-gray-100 px-3 py-1 rounded-full">Min ${search.min_price}</span>
                      )}
                      {search.max_price && (
                        <span className="bg-gray-100 px-3 py-1 rounded-full">Max ${search.max_price}</span>
                      )}
                      {search.bedrooms && (
                        <span className="bg-gray-100 px-3 py-1 rounded-full">{search.bedrooms}+ beds</span>
                      )}
                      {search.bathrooms && (
                        <span className="bg-gray-100 px-3 py-1 rounded-full">{search.bathrooms}+ baths</span>
                      )}
                      {search.property_type && (
                        <span className="bg-gray-100 px-3 py-1 rounded-full">{search.property_type}</span>
                      )}
                      {search.listing_type !== "all" && (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                          For {search.listing_type === "sale" ? "Sale" : "Rent"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleAlerts(search.id, search.email_alerts)}
                      className={`p-2 rounded-lg transition ${
                        search.email_alerts
                          ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                          : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                      }`}
                      title={search.email_alerts ? "Disable alerts" : "Enable alerts"}
                    >
                      {search.email_alerts ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => deleteSearch(search.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                      title="Delete search"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    {search.email_alerts && (
                      <span className="flex items-center gap-1">
                        <Bell className="w-4 h-4" />
                        {search.alert_frequency} alerts
                      </span>
                    )}
                  </div>
                  <Link href={buildSearchURL(search)}>
                    <Button variant="outline" size="sm">
                      View Results
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
