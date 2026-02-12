"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Bed, Bath, Square, Heart, Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface Property {
  id: number
  title: string
  location: string
  price: number
  property_type: string
  bedrooms: number
  bathrooms: number
  area: number
  images: string[]
  agent?: string
  phone?: string
}

export default function RentPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const res = await fetch("/api/properties?listing_type=rent")
      if (res.ok) {
        const data = await res.json()
        // Ensure data is an array before setting state
        setProperties(Array.isArray(data) ? data : [])
      } else {
        console.error("Failed to fetch properties:", res.statusText)
        setProperties([])
      }
    } catch (error) {
      console.error("Error fetching properties:", error)
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-teal-50 to-background py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Rental</h1>
            <p className="text-xl text-muted-foreground">
              Browse apartments, houses, and commercial spaces for rent in Ghana
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input placeholder="Search location, property type..." className="pl-10" />
              </div>
              <Button className="bg-teal-600 hover:bg-teal-700">
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Available for Rent</h2>
            <p className="text-muted-foreground">{properties.length} properties found</p>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading properties...</div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No rental properties available at the moment</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Link key={property.id} href={`/properties/${property.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src={property.images?.[0] || "/placeholder.svg?height=200&width=400"}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                      <button className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white">
                        <Heart className="h-5 w-5" />
                      </button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-1">{property.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {property.location}
                      </p>
                      <div className="flex gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          {property.bedrooms}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="h-4 w-4" />
                          {property.bathrooms}
                        </span>
                        <span className="flex items-center gap-1">
                          <Square className="h-4 w-4" />
                          {property.area} sqm
                        </span>
                      </div>
                      <p className="text-lg font-bold text-teal-600">GH₵ {property.price.toLocaleString()}/month</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
