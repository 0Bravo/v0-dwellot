"use client"

import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Bed, Bath, Square, Clock, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function RecentlyViewedPage() {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed()

  const formatPrice = (price: number, listingType: string) => {
    return `$ ${price.toLocaleString()}${listingType === "rent" ? "/month" : ""}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Recently Viewed</h1>
              <p className="text-gray-600 mt-1">
                {recentlyViewed.length} {recentlyViewed.length === 1 ? "property" : "properties"}
              </p>
            </div>
            {recentlyViewed.length > 0 && (
              <Button variant="outline" onClick={clearRecentlyViewed}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {recentlyViewed.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No recently viewed properties</h3>
            <p className="text-gray-600 mb-6">Properties you view will appear here for easy access</p>
            <Link href="/properties">
              <Button>Browse Properties</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentlyViewed.map((property) => (
              <Link
                key={property.id}
                href={`/properties/${property.id}`}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition group"
              >
                <div className="relative h-48">
                  <Image
                    src={property.images?.[0] || "/placeholder.svg"}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(property.viewed_at)}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition line-clamp-1 mb-2">
                    {property.title}
                  </h3>

                  <p className="text-gray-600 flex items-center gap-1 mb-2 text-sm">
                    <MapPin className="w-3 h-3" />
                    {property.location}
                  </p>

                  <div className="text-xl font-bold text-blue-600 mb-3">
                    {formatPrice(property.price, property.listing_type)}
                  </div>

                  <div className="flex items-center gap-4 text-gray-600 text-sm">
                    {property.bedrooms > 0 && (
                      <span className="flex items-center gap-1">
                        <Bed className="w-3 h-3" />
                        {property.bedrooms}
                      </span>
                    )}
                    {property.bathrooms > 0 && (
                      <span className="flex items-center gap-1">
                        <Bath className="w-3 h-3" />
                        {property.bathrooms}
                      </span>
                    )}
                    {property.area && (
                      <span className="flex items-center gap-1">
                        <Square className="w-3 h-3" />
                        {property.area}m²
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
