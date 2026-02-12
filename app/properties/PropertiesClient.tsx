"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Bed, Bath, Square, Heart, Grid3x3, ListIcon, ChevronRight, ChevronLeft } from "lucide-react"
import { useSearchParams } from "next/navigation"

interface Property {
  id: number
  title: string
  location: string
  price: number
  property_type: string
  listing_type: string
  bedrooms: number
  bathrooms: number
  area: number
  parking?: number
  description: string
  images: string[]
  agent?: string
  phone?: string
}

interface Props {
  initialProperties: Property[]
  initialTotal: number
}

export default function PropertiesClient({ initialProperties, initialTotal }: Props) {
  const searchParams = useSearchParams()
  const urlSearch = searchParams.get("search") || searchParams.get("query") || ""

  const [properties, setProperties] = useState<Property[]>(initialProperties)
  const [savedProperties, setSavedProperties] = useState<Set<number>>(new Set())
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(initialTotal)
  const propertiesPerPage = 20

  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    propertyType: "",
    listingType: "",
  })

  const fetchProperties = async (page: number) => {
    setLoading(true)
    const offset = (page - 1) * propertiesPerPage

    try {
      const params = new URLSearchParams({
        limit: propertiesPerPage.toString(),
        offset: offset.toString(),
        ...(urlSearch && { search: urlSearch }), // Add search if present
        ...filters,
      })

      const response = await fetch(`/api/properties?${params}`)
      const data = await response.json()

      if (data.success) {
        setProperties(data.properties)
        setTotal(data.total)
      }
    } catch (error) {
      console.error("Error fetching properties:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties(currentPage)
  }, [currentPage, urlSearch])

  const totalPages = Math.ceil(total / propertiesPerPage)

  const toggleSave = (e: React.MouseEvent, propertyId: number) => {
    e.preventDefault()
    e.stopPropagation()
    setSavedProperties((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId)
      } else {
        newSet.add(propertyId)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {urlSearch ? `Search results for "${urlSearch}"` : "Properties in Appolonia City"}
            </h1>
            <p className="text-gray-600 mt-2">{total} properties available</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}
            >
              <ListIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Properties Grid/List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading properties...</p>
          </div>
        ) : (
          <>
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {properties.map((property) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                >
                  {/* Property Card Content */}
                  <div className="relative h-64">
                    <Image
                      src={property.images?.[0] || "/api/placeholder/400/300"}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={(e) => toggleSave(e, property.id)}
                      className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg"
                    >
                      <Heart
                        className={`w-5 h-5 ${savedProperties.has(property.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                      />
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{property.title}</h3>
                    <p className="text-gray-600 flex items-center gap-1 mb-3">
                      <MapPin className="w-4 h-4" />
                      {property.location}
                    </p>
                    <div className="flex items-center gap-4 text-gray-600 mb-3">
                      {property.bedrooms > 0 && (
                        <span className="flex items-center gap-1">
                          <Bed className="w-4 h-4" />
                          {property.bedrooms}
                        </span>
                      )}
                      {property.bathrooms > 0 && (
                        <span className="flex items-center gap-1">
                          <Bath className="w-4 h-4" />
                          {property.bathrooms}
                        </span>
                      )}
                      {property.area > 0 && (
                        <span className="flex items-center gap-1">
                          <Square className="w-4 h-4" />
                          {property.area}m²
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t">
                      <span className="text-lg font-bold text-gray-900">${property.price.toLocaleString()}</span>
                      <span className="text-sm text-gray-500">{property.property_type}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white border disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <span className="px-4 py-2">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white border disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
