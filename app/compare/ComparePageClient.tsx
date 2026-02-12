"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { X, Plus, ArrowLeft, Check, Minus } from "lucide-react"

interface Property {
  id: string
  title: string
  location: string
  price: number
  listing_type: string
  property_type: string
  bedrooms: number
  bathrooms: number
  area: number
  parking: number
  images: string[]
  features: string[]
}

export default function ComparePageClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ids = searchParams.get("ids")?.split(",").filter(Boolean) || []
    if (ids.length > 0) {
      fetchProperties(ids)
    } else {
      setLoading(false)
    }
  }, [searchParams])

  const fetchProperties = async (ids: string[]) => {
    try {
      setLoading(true)
      const responses = await Promise.all(ids.map((id) => fetch(`/api/properties/${id}`)))
      const data = await Promise.all(responses.map((r) => r.json()))
      setProperties(data.map((d) => d.property).filter(Boolean))
    } catch (error) {
      console.error("Error fetching properties:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeProperty = (id: string) => {
    const newIds = properties.filter((p) => p.id !== id).map((p) => p.id)
    if (newIds.length > 0) {
      router.push(`/compare?ids=${newIds.join(",")}`)
    } else {
      router.push("/properties")
    }
  }

  const formatPrice = (price: number, listingType: string) => {
    return `$${price.toLocaleString()}${listingType === "rent" ? "/month" : ""}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Properties to Compare</h2>
          <p className="text-gray-600 mb-6">Start adding properties to compare their features side by side.</p>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Browse Properties
          </Link>
        </div>
      </div>
    )
  }

  const allFeatures = Array.from(new Set(properties.flatMap((p) => p.features)))

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition mb-2"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Compare Properties</h1>
            <p className="text-gray-600 mt-2">Compare up to 4 properties side by side</p>
          </div>
          {properties.length < 4 && (
            <Link
              href="/properties"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-5 h-5" />
              Add Property
            </Link>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="sticky left-0 bg-gray-50 px-6 py-4 text-left text-sm font-semibold text-gray-900 w-48">
                    Feature
                  </th>
                  {properties.map((property) => (
                    <th key={property.id} className="px-6 py-4 text-center min-w-[280px]">
                      <div className="relative">
                        <button
                          onClick={() => removeProperty(property.id)}
                          className="absolute top-0 right-0 p-1 bg-red-100 hover:bg-red-200 rounded-full text-red-600 transition"
                          title="Remove from comparison"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="relative h-40 rounded-lg overflow-hidden mb-3">
                          <Image
                            src={property.images?.[0] || "/placeholder.svg"}
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{property.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{property.location}</p>
                        <div className="text-xl font-bold text-blue-600">
                          {formatPrice(property.price, property.listing_type)}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="bg-gray-50">
                  <td className="sticky left-0 bg-gray-50 px-6 py-4 font-semibold text-gray-900">Basic Info</td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4"></td>
                  ))}
                </tr>
                <tr>
                  <td className="sticky left-0 bg-white px-6 py-4 text-gray-700">Property Type</td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-center text-gray-900">
                      {property.property_type}
                    </td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="sticky left-0 bg-gray-50 px-6 py-4 text-gray-700">Listing Type</td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          property.listing_type === "sale" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        For {property.listing_type === "sale" ? "Sale" : "Rent"}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="sticky left-0 bg-white px-6 py-4 text-gray-700">Bedrooms</td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-center font-semibold text-gray-900">
                      {property.bedrooms}
                    </td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="sticky left-0 bg-gray-50 px-6 py-4 text-gray-700">Bathrooms</td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-center font-semibold text-gray-900">
                      {property.bathrooms}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="sticky left-0 bg-white px-6 py-4 text-gray-700">Area (m²)</td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-center font-semibold text-gray-900">
                      {property.area}
                    </td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="sticky left-0 bg-gray-50 px-6 py-4 text-gray-700">Parking Spaces</td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-center font-semibold text-gray-900">
                      {property.parking}
                    </td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td
                    colSpan={properties.length + 1}
                    className="sticky left-0 bg-gray-50 px-6 py-4 font-semibold text-gray-900"
                  >
                    Features & Amenities
                  </td>
                </tr>
                {allFeatures.map((feature, index) => (
                  <tr key={feature} className={index % 2 === 0 ? "" : "bg-gray-50"}>
                    <td
                      className={`sticky left-0 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} px-6 py-4 text-gray-700`}
                    >
                      {feature}
                    </td>
                    {properties.map((property) => (
                      <td key={property.id} className="px-6 py-4 text-center">
                        {property.features.includes(feature) ? (
                          <Check className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <Minus className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td className="sticky left-0 bg-gray-50 px-6 py-4 font-semibold text-gray-900">Actions</td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-center">
                      <Link
                        href={`/properties/${property.id}`}
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> You can compare up to 4 properties at once. Add more properties from the property
            listing page by clicking the compare button on each property card.
          </p>
        </div>
      </div>
    </div>
  )
}
