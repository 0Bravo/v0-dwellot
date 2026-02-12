"use client"

import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: number
  interactive?: boolean
  onRatingChange?: (rating: number) => void
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 20,
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1
        const isFilled = starValue <= rating
        const isPartial = starValue > rating && starValue - 1 < rating

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(starValue)}
            disabled={!interactive}
            className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
          >
            <Star
              size={size}
              className={`${
                isFilled
                  ? "fill-yellow-400 text-yellow-400"
                  : isPartial
                    ? "fill-yellow-200 text-yellow-400"
                    : "fill-none text-gray-300"
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}
