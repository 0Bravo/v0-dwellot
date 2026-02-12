"use client"

import type React from "react"

import { useState } from "react"
import { Heart } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface FavoriteButtonProps {
  propertyId: number
  initialIsFavorite?: boolean
}

export default function FavoriteButton({ propertyId, initialIsFavorite = false }: FavoriteButtonProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      router.push("/auth")
      return
    }

    setIsLoading(true)

    try {
      if (isFavorite) {
        const response = await fetch(`/api/favorites?property_id=${propertyId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          setIsFavorite(false)
        }
      } else {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ property_id: propertyId }),
        })

        if (response.ok) {
          setIsFavorite(true)
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`p-2 rounded-full transition-all ${
        isFavorite ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-white text-gray-600 hover:bg-gray-100"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
    </button>
  )
}
