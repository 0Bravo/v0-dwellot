"use client"

import { useState, useEffect, useCallback } from "react"
import { Star, User } from "lucide-react"
import Image from "next/image"
import StarRating from "./StarRating"

interface Review {
  id: number
  rating: number
  comment: string
  created_at: string
  profiles: {
    full_name: string | null
    avatar_url: string | null
  }
}

interface ReviewsListProps {
  propertyId: number
  refreshTrigger?: number
}

export default function ReviewsList({ propertyId, refreshTrigger }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchReviews = useCallback(async () => {
    try {
      const response = await fetch(`/api/reviews?property_id=${propertyId}`)
      const data = await response.json()

      if (response.ok) {
        setReviews(data.reviews || [])
        setAverageRating(data.averageRating || 0)
        setTotalReviews(data.totalReviews || 0)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }, [propertyId])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews, refreshTrigger])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Reviews & Ratings</h3>
        {totalReviews > 0 ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              <span className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
            </div>
            <span className="text-gray-600">
              ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
            </span>
          </div>
        ) : (
          <p className="text-gray-600">No reviews yet. Be the first to review!</p>
        )}
      </div>

      {reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-t border-gray-200 pt-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {review.profiles.avatar_url ? (
                    <Image
                      src={review.profiles.avatar_url || "/placeholder.svg"}
                      alt={review.profiles.full_name || "User"}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{review.profiles.full_name || "Anonymous"}</h4>
                    <span className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                  <StarRating rating={review.rating} size={16} />
                  {review.comment && <p className="mt-2 text-gray-700 text-sm">{review.comment}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
