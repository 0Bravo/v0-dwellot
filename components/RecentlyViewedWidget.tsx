"use client"

import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Clock } from "lucide-react"

export default function RecentlyViewedWidget() {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed()

  if (recentlyViewed.length === 0) return null

  const formatPrice = (price: number, listingType: string) => {
    return `$ ${price.toLocaleString()}${listingType === "rent" ? "/month" : ""}`
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-600" />
          Recently Viewed
        </h3>
        <button onClick={clearRecentlyViewed} className="text-sm text-gray-500 hover:text-gray-700 transition">
          Clear all
        </button>
      </div>

      <div className="space-y-3">
        {recentlyViewed.slice(0, 5).map((property) => (
          <Link
            key={property.id}
            href={`/properties/${property.id}`}
            className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition group"
          >
            <div className="relative w-20 h-16 flex-shrink-0 rounded overflow-hidden">
              <Image
                src={property.images?.[0] || "/placeholder.svg"}
                alt={property.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-gray-900 group-hover:text-blue-600 transition line-clamp-1">
                {property.title}
              </h4>
              <p className="text-xs text-gray-600 flex items-center gap-1 mb-1">
                <MapPin className="w-3 h-3" />
                <span className="line-clamp-1">{property.location}</span>
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-blue-600">
                  {formatPrice(property.price, property.listing_type)}
                </span>
                <span className="text-xs text-gray-400">{formatTimeAgo(property.viewed_at)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {recentlyViewed.length > 5 && (
        <Link
          href="/dashboard/recently-viewed"
          className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium mt-4 pt-4 border-t"
        >
          View all {recentlyViewed.length} properties
        </Link>
      )}
    </div>
  )
}
