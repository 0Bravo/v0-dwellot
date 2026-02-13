"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Plus, Eye, Edit, Trash2, MoreVertical, Filter } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

interface Property {
  id: number
  title: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  status: string
  listing_type: string
  featured: boolean
  view_count: number
  enquiry_count: number
  created_at: string
  agent: string
}

export default function PropertiesListClient() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [listingTypeFilter, setListingTypeFilter] = useState("all")
  const [selectedProperties, setSelectedProperties] = useState<number[]>([])

  useEffect(() => {
    fetchProperties()
  }, [])

  async function fetchProperties() {
    const supabase = createBrowserClient()
    if (!supabase) return

    let query = supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error("Error fetching properties:", error)
    } else {
      setProperties(data || [])
    }
    setLoading(false)
  }

  async function deleteProperty(id: number) {
    if (!confirm("Are you sure you want to delete this property?")) return

    const supabase = createBrowserClient()
    if (!supabase) return

    const { error } = await supabase
      .from("properties")
      .update({ status: "deleted" })
      .eq("id", id)

    if (error) {
      alert("Error deleting property")
    } else {
      fetchProperties()
    }
  }

  async function toggleFeatured(id: number, currentFeatured: boolean) {
    const supabase = createBrowserClient()
    if (!supabase) return

    const { error } = await supabase
      .from("properties")
      .update({ featured: !currentFeatured })
      .eq("id", id)

    if (error) {
      alert("Error updating property")
    } else {
      fetchProperties()
    }
  }

  async function bulkDelete() {
    if (selectedProperties.length === 0) return
    if (!confirm(`Delete ${selectedProperties.length} properties?`)) return

    const supabase = createBrowserClient()
    if (!supabase) return

    const { error } = await supabase
      .from("properties")
      .update({ status: "deleted" })
      .in("id", selectedProperties)

    if (error) {
      alert("Error deleting properties")
    } else {
      setSelectedProperties([])
      fetchProperties()
    }
  }

  const filteredProperties = properties.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || p.status === statusFilter
    const matchesListingType = listingTypeFilter === "all" || p.listing_type === listingTypeFilter
    return matchesSearch && matchesStatus && matchesListingType
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-sm text-gray-500">{filteredProperties.length} total properties</p>
        </div>
        <Link
          href="/admin/properties/add"
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
        >
          <Plus className="h-5 w-5" />
          Add Property
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </select>
          <select
            value={listingTypeFilter}
            onChange={(e) => setListingTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Types</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
          {selectedProperties.length > 0 && (
            <button
              onClick={bulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete ({selectedProperties.length})
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No properties found</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProperties.length === filteredProperties.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProperties(filteredProperties.map((p) => p.id))
                      } else {
                        setSelectedProperties([])
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProperties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProperties.includes(property.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProperties([...selectedProperties, property.id])
                        } else {
                          setSelectedProperties(selectedProperties.filter((id) => id !== property.id))
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{property.title}</p>
                      <p className="text-sm text-gray-500">{property.location}</p>
                      {property.featured && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-800 mt-1">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">${property.price?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 capitalize">{property.listing_type}</span>
                    <p className="text-xs text-gray-500">{property.bedrooms}bd / {property.bathrooms}ba</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        property.status === "active"
                          ? "bg-green-100 text-green-800"
                          : property.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-500">
                      <p>{property.view_count || 0} views</p>
                      <p>{property.enquiry_count || 0} enquiries</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/properties/${property.id}`}
                        target="_blank"
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/properties/${property.id}/edit`}
                        className="p-1 text-gray-400 hover:text-teal-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => toggleFeatured(property.id, property.featured)}
                        className="p-1 text-gray-400 hover:text-teal-600 text-xs"
                      >
                        {property.featured ? "Unfeature" : "Feature"}
                      </button>
                      <button
                        onClick={() => deleteProperty(property.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
