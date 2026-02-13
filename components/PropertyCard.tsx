"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Bed,
  Bath,
  Square,
  Heart,
  HomeIcon,
  Car,
  Shield,
  Users,
  MessageCircle,
  CheckCircle,
  ChevronRight,
  MapPin,
  Camera,
} from "lucide-react"
import { generateWhatsAppUrl } from "@/lib/utils/whatsapp"
import { trackEnquiry } from "@/lib/utils/track-enquiry"

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
  featured: boolean
  status: string
  agent?: string
  phone?: string
  view_count?: number
}

function hasRealImages(images: string[] | null | undefined): images is string[] {
  if (!images || images.length === 0) return false
  const firstImage = images[0]
  if (!firstImage) return false
  if (firstImage.includes("placeholder") || firstImage.includes("image-coming-soon")) return false
  return true
}

export function FeaturedPropertyCard({ property }: { property: Property }) {
  const [currentImg, setCurrentImg] = useState(0)
  const [saved, setSaved] = useState(false)

  const handleImageNav = useCallback(
    (e: React.MouseEvent, direction: "prev" | "next") => {
      e.preventDefault()
      e.stopPropagation()
      if (!property.images || property.images.length <= 1) return
      setCurrentImg((prev) =>
        direction === "next"
          ? (prev + 1) % property.images.length
          : prev === 0
            ? property.images.length - 1
            : prev - 1,
      )
    },
    [property.images],
  )

  const toggleSave = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSaved((prev) => !prev)
  }, [])

  return (
    <Link
      href={`/properties/${property.id}`}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow group"
    >
      <div className="relative">
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
          <span className="bg-teal-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold">
            FEATURED PROPERTY
          </span>
          {property.status === "active" && (
            <span className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>

        <div className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
          {currentImg + 1}/{property.images?.length || 1}
        </div>

        <div className="relative h-80 overflow-hidden">
          {hasRealImages(property.images) ? (
            <Image
              src={property.images[currentImg] || property.images[0]}
              alt={property.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0">
              <Image
                src="/images/images-coming-soon.jpg"
                alt={`${property.title} - Images coming soon`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                <Camera className="w-12 h-12 text-white/80 mb-3" />
                <p className="text-white text-lg font-semibold">Images Coming Soon</p>
                <p className="text-white/70 text-sm mt-1">Professional photography in progress</p>
              </div>
            </div>
          )}

          {property.images && property.images.length > 1 && (
            <>
              <button
                onClick={(e) => handleImageNav(e, "prev")}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition"
                aria-label="Previous image"
              >
                {"<"}
              </button>
              <button
                onClick={(e) => handleImageNav(e, "next")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition"
                aria-label="Next image"
              >
                {">"}
              </button>
            </>
          )}
        </div>

        <div className="absolute bottom-0 left-0 bg-teal-600 text-white px-5 py-3">
          <div className="text-3xl font-bold">
            {"$"} {property.price.toLocaleString()}
            {property.listing_type === "rent" && <span className="text-base font-normal">/month</span>}
          </div>
          <div className="text-sm opacity-90">{property.listing_type === "rent" ? "To rent" : "Offers Over"}</div>
        </div>
      </div>

      <div className="p-8">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition">{property.title}</h3>
          <button onClick={toggleSave} className="text-gray-400 hover:text-red-500 transition-colors">
            <Heart className={`h-6 w-6 ${saved ? "fill-red-500 text-red-500" : ""}`} />
          </button>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <span className="text-gray-600 text-lg">{property.property_type}</span>
          <div className="flex items-center gap-4 text-gray-600">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bed className="h-5 w-5" />
                <span className="text-lg">{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bath className="h-5 w-5" />
                <span className="text-lg">{property.bathrooms}</span>
              </div>
            )}
            {property.area && (
              <div className="flex items-center gap-1">
                <Square className="h-5 w-5" />
                <span className="text-lg">{property.area}m&sup2;</span>
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-600 mb-5 line-clamp-2">{property.description}</p>

        <div className="text-teal-600 font-medium mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Added recently by {property.agent || "Dwellot Estates"}
          <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded text-sm">
            <Users className="w-4 h-4 inline mr-1" />
            {property.view_count || 0} views
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 p-2 rounded">
              <HomeIcon className="h-5 w-5 text-yellow-800" />
            </div>
            <div>
              <div className="font-medium">
                <span
                  onClick={(e) => {
                    e.stopPropagation()
                    window.location.href = `tel:${property.phone || "0302967150"}`
                  }}
                  className="hover:text-blue-600 transition cursor-pointer"
                >
                  {property.phone || "0302 967150"}
                </span>
              </div>
              <div className="text-sm text-gray-500">Local call rate</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={generateWhatsAppUrl(property)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation()
                trackEnquiry({ property_id: property.id, enquiry_type: "whatsapp", source_page: "homepage" })
              }}
              className="bg-green-500 p-2 rounded hover:bg-green-600 transition"
              title="WhatsApp"
            >
              <MessageCircle className="h-5 w-5 text-white" />
            </a>
            <button
              onClick={toggleSave}
              className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function PropertyListCard({ property }: { property: Property }) {
  const [currentImg, setCurrentImg] = useState(0)

  const handleImageNav = useCallback(
    (e: React.MouseEvent, direction: "prev" | "next") => {
      e.preventDefault()
      e.stopPropagation()
      if (!property.images || property.images.length <= 1) return
      setCurrentImg((prev) =>
        direction === "next"
          ? (prev + 1) % property.images.length
          : prev === 0
            ? property.images.length - 1
            : prev - 1,
      )
    },
    [property.images],
  )

  return (
    <Link
      href={`/properties/${property.id}`}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col"
    >
      <div className="relative h-96 flex-shrink-0">
        {hasRealImages(property.images) ? (
          <Image
            src={property.images[currentImg] || property.images[0]}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0">
            <Image
              src="/images/images-coming-soon.jpg"
              alt={`${property.title} - Images coming soon`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
              <Camera className="w-12 h-12 text-white/80 mb-3" />
              <p className="text-white text-lg font-semibold">Images Coming Soon</p>
              <p className="text-white/70 text-sm mt-1">Professional photography in progress</p>
            </div>
          </div>
        )}

        {property.images && property.images.length > 1 && (
          <>
            <button
              onClick={(e) => handleImageNav(e, "prev")}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition"
              aria-label="Previous image"
            >
              {"<"}
            </button>
            <button
              onClick={(e) => handleImageNav(e, "next")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition"
              aria-label="Next image"
            >
              {">"}
            </button>
          </>
        )}
      </div>

      <div className="p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition mb-2">
                {property.title}
              </h3>
              <p className="text-gray-600 flex items-center gap-1 mb-3">
                <MapPin className="w-4 h-4" />
                {property.location}
              </p>
            </div>
            <div className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-700 rounded uppercase">
              {property.property_type}
            </div>
          </div>

          <div className="flex items-center gap-6 text-gray-700 mb-4">
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-2">
                <Bed className="w-5 h-5" />
                <span className="font-medium">{property.bedrooms}</span>
              </span>
            )}
            {property.bathrooms > 0 && (
              <span className="flex items-center gap-2">
                <Bath className="w-5 h-5" />
                <span className="font-medium">{property.bathrooms}</span>
              </span>
            )}
            {property.area > 0 && (
              <span className="flex items-center gap-2">
                <Square className="w-5 h-5" />
                <span className="font-medium">{property.area}m&sup2;</span>
              </span>
            )}
            {property.parking && property.parking > 0 && (
              <span className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                <span className="font-medium">{property.parking}</span>
              </span>
            )}
          </div>

          <p className="text-gray-600 text-sm line-clamp-3">{property.description}</p>
        </div>

        <div className="mt-4 flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-500">
            <span className="text-teal-600 font-medium">Recently added</span> by{" "}
            {property.agent || "Dwellot Estates"}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Contact agent</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>
    </Link>
  )
}
