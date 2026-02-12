"use client"

import type React from "react"

import { useState } from "react"
import { MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import StarRating from "./StarRating"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface ReviewFormProps {
  propertyId: number
  onReviewSubmitted?: () => void
}

export default function ReviewForm({ propertyId, onReviewSubmitted }: ReviewFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      router.push("/auth")
      return
    }

    if (rating === 0) {
      setError("Please select a rating")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          property_id: propertyId,
          rating,
          comment,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit review")
      }

      setSuccess(true)
      setRating(0)
      setComment("")

      if (onReviewSubmitted) {
        onReviewSubmitted()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        Write a Review
      </h3>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm mb-4">
          Thank you for your review!
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
          <StarRating rating={rating} interactive={true} onRatingChange={setRating} size={32} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Review (Optional)</label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this property..."
            rows={4}
            className="w-full"
          />
        </div>

        <Button type="submit" disabled={isLoading || rating === 0} className="w-full">
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Send className="h-4 w-4 mr-2" />
              Submit Review
            </div>
          )}
        </Button>
      </form>
    </div>
  )
}
