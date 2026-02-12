"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Heart, MapPin, DollarSign, Bed, Bath, Maximize, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import FavoriteButton from "@/components/FavoriteButton"

interface Property {
  id: number
  title: string
  location: string
  price: number
  bedrooms: number
  bathrooms: number
  area: number
  property_type: string
  listing_type: string
  images: string[]
  status: string
}

interface Favorite {
  id: number
  property_id: number
  created_at: string
  properties: Property
}

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchFavorites()
    }
  }, [user])

  const fetchFavorites = async () => {
    try {
      const response = await fetch("/api/favorites")
      const data = await response.json()

      if (response.ok) {
        setFavorites(data.favorites || [])
      } else {
        console.error("Failed to fetch favorites:", data.error)
      }
    } catch (error) {
      console.error("Error fetching favorites:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading favorites...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8 text-red-600 fill-current" />
            <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
          </div>
          <p className="text-gray-600">Properties you&apos;ve saved for later</p>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Heart size={64} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No favorites yet</h2>
            <p className="text-gray-600 mb-6">Start exploring properties and save your favorites to view them here</p>
            <Link
              href="/properties"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => {
              const property = favorite.properties
              return (
                <div
                  key={favorite.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
                >
                  <div className="relative h-48 bg-gray-200">
                    {property.images && property.images.length > 0 ? (
                      <Image
                        src={property.images[0] || "/placeholder.svg"}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                    )}
                    <div className="absolute top-3 right-3">
                      <FavoriteButton propertyId={property.id} initialIsFavorite={true} />
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{property.title}</h3>

                    <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
                      <MapPin size={14} />
                      <span>{property.location}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <DollarSign size={18} className="text-green-600" />
                      <span className="text-xl font-bold text-green-700">{formatCurrency(property.price)}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Bed size={14} />
                        <span>{property.bedrooms} Beds</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath size={14} />
                        <span>{property.bathrooms} Baths</span>
                      </div>
                      {property.area > 0 && (
                        <div className="flex items-center gap-1">
                          <Maximize size={14} />
                          <span>{property.area} sqft</span>
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/properties/${property.id}`}
                      className="block w-full text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
