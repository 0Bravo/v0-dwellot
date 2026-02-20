"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Square,
  Car,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Shield,
  Eye,
  Clock,
  AlertCircle,
  MessageCircle,
  Maximize2,
} from "lucide-react"
import { generateEnhancedStructuredData } from "@/lib/seo"
import { analytics } from "@/lib/analytics"
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext"
import { generateWhatsAppUrl } from "@/lib/utils/whatsapp"
import { trackEnquiry } from "@/lib/utils/track-enquiry"

// Lazy-load heavy components that are not needed on initial render
const PropertyPrint = dynamic(() => import("@/components/PropertyPrint"), { ssr: false })
const PropertyPrintView = dynamic(() => import("@/components/PropertyPrintView"), { ssr: false })
const ImageGallery = dynamic(() => import("@/components/ImageGallery"), { ssr: false })
const ShareModal = dynamic(() => import("@/components/ShareModal"), { ssr: false })
const MortgageCalculator = dynamic(() => import("@/components/MortgageCalculator"), { ssr: false })
const ContactFormModal = dynamic(() => import("@/components/ContactFormModal"), { ssr: false })

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
  description: string
  images: string[]
  features: string[]
  featured: boolean
  status: string
  users: {
    id: string
    name: string
    email: string
    phone: string
  }
  view_count: number
  created_at: string
  updated_at: string
}

interface ViewStats {
  view_count: number
  views_today: number
}

export default function PropertyDetailsClient() {
  const params = useParams()
  const router = useRouter()
  const { addToRecentlyViewed } = useRecentlyViewed()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [viewStats, setViewStats] = useState<ViewStats>({ view_count: 0, views_today: 0 })
  const [showLightbox, setShowLightbox] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProperty(params.id as string)
    }
  }, [params.id])

  useEffect(() => {
    if (property) {
      trackPropertyView()
      analytics.trackPropertyView(property.id, property.title)

      addToRecentlyViewed({
        id: property.id,
        title: property.title,
        location: property.location,
        price: property.price,
        listing_type: property.listing_type,
        images: property.images,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        property_type: property.property_type,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property])

  const trackPropertyView = async () => {
    try {
      const response = await fetch(`/api/properties/${params.id}/view`, {
        method: "POST",
      })
      if (response.ok) {
        const data = await response.json()
        setViewStats({
          view_count: data.view_count,
          views_today: data.views_today,
        })
      }
    } catch (error) {
      console.error("Error tracking view:", error)
    }
  }

  const fetchProperty = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching property details for ID:", id)

      const response = await fetch(`/api/properties/${id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Failed to fetch property: ${response.status}`)
      }

      if (data.property) {
        setProperty(data.property)
        // Initialize view stats from the property's stored view_count
        // so it shows immediately; the POST tracking call will update with latest
        if (data.property.view_count) {
          setViewStats((prev) => ({ ...prev, view_count: data.property.view_count }))
        }
        console.log("Property loaded:", data.property.title)
      } else {
        throw new Error("Property data not found in response")
      }
    } catch (error) {
      console.error("Error fetching property:", error)
      setError(error instanceof Error ? error.message : "Failed to load property details")
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number, listingType: string) => {
    return `$ ${price.toLocaleString()}${listingType === "rent" ? "/month" : ""}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const nextImage = useCallback(() => {
    if (property?.images && property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
    }
  }, [property?.images])

  const prevImage = useCallback(() => {
    if (property?.images && property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
    }
  }, [property?.images])

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    console.log(isFavorite ? "Removed from favorites" : "Added to favorites", property?.id)
    if (property) {
      analytics.trackFavorite(property.id, isFavorite ? "remove" : "add")
    }
  }

  const handleShare = async () => {
    if (navigator.share && property) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title} in ${property.location}`,
          url: window.location.href,
        })
        analytics.trackShare(property.id, "native")
      } catch {
        setShowShareModal(true)
      }
    } else {
      setShowShareModal(true)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-96 bg-gray-200 rounded-lg mb-6"></div>
                <div className="bg-white rounded-lg p-6">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                  <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg p-6">
                  <div className="h-24 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-12 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => fetchProperty(params.id as string)}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Try Again
            </button>
            <Link
              href="/properties"
              className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition text-center"
            >
              Back to Properties
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <Link href="/properties" className="text-blue-600 hover:text-blue-700 font-medium">
            Back to Properties
          </Link>
        </div>
      </div>
    )
  }

  const structuredData = generateEnhancedStructuredData(property as any)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      {showLightbox && property && (
        <ImageGallery
          images={property.images}
          title={property.title}
          initialIndex={currentImageIndex}
          onClose={() => setShowLightbox(false)}
        />
      )}
      {showShareModal && property && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          url={typeof window !== "undefined" ? window.location.href : ""}
          title={property.title}
          description={`${property.listing_type === "sale" ? "For Sale" : "For Rent"} - ${property.location}. ${property.bedrooms} bed, ${property.bathrooms} bath. $${property.price.toLocaleString()}`}
          imageUrl={property.images?.[0]}
          onShare={(platform) => {
            if (property) {
              analytics.trackShare(property.id, platform)
            }
          }}
        />
      )}
      {property && <PropertyPrintView property={property} />}
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm print-hide">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-900 transition"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Properties
              </button>
              <div className="flex items-center space-x-3">
                <PropertyPrint propertyId={property?.id || ""} />
                <button
                  onClick={toggleFavorite}
                  className={`p-2 rounded-full transition ${
                    isFavorite ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  title={isFavorite ? "Remove from favorites" : "Favorite property"}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition"
                  title="Share property"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div
                className="relative h-[60vh] sm:h-[50vh] md:h-96 lg:h-[28rem] mb-6 rounded-lg overflow-hidden group cursor-pointer"
                onClick={() => setShowLightbox(true)}
              >
                <Image
                  src={
                    property.images?.[currentImageIndex] ||
                    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg"
                  }
                  alt={`${property.title} - Image ${currentImageIndex + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                  priority
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition">
                    <div className="bg-white/90 p-3 rounded-full">
                      <Maximize2 className="w-6 h-6 text-gray-900" />
                    </div>
                  </div>
                </div>

                {property.images && property.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        prevImage()
                      }}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 sm:p-3 rounded-full transition sm:opacity-0 sm:group-hover:opacity-100"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        nextImage()
                      }}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 sm:p-3 rounded-full transition sm:opacity-0 sm:group-hover:opacity-100"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                  {currentImageIndex + 1} / {property.images?.length || 1}
                </div>

                <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded font-medium">
                  {property.listing_type === "rent" ? "For Rent" : "For Sale"}
                </div>

                {property.featured && (
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded text-sm font-medium">
                    Featured
                  </div>
                )}
              </div>

              {property.images && property.images.length > 1 && (
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentImageIndex(index)
                        setShowLightbox(true)
                      }}
                      className={`relative w-24 h-20 sm:w-20 sm:h-16 flex-shrink-0 rounded overflow-hidden transition ${
                        index === currentImageIndex ? "ring-2 ring-blue-600" : "hover:ring-2 hover:ring-gray-300"
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        sizes="96px"
                        loading="lazy"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                  <div className="mb-4 lg:mb-0">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                    <p className="text-gray-600 flex items-center text-lg">
                      <MapPin className="w-5 h-5 mr-2" />
                      {property.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {formatPrice(property.price, property.listing_type)}
                    </div>
                    {property.listing_type === "sale" && <div className="text-gray-600">Negotiable</div>}
                  </div>
                </div>

                {/* Mobile-only property stats bar */}
                <div className="flex items-center flex-wrap gap-4 text-sm text-gray-500 mb-6 lg:hidden">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    {viewStats.view_count} views
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    {viewStats.views_today} today
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {formatDate(property.created_at)}
                  </span>
                  <span className="text-gray-400 font-mono">
                    #{property.id.slice(-6).toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-b">
                  <div className="text-center">
                    <Bed className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-bold text-xl">{property.bedrooms}</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                  <div className="text-center">
                    <Bath className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-bold text-xl">{property.bathrooms}</div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                  <div className="text-center">
                    <Square className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-bold text-xl">{property.area}</div>
                    <div className="text-sm text-gray-600">Area (m²)</div>
                  </div>
                  <div className="text-center">
                    <Car className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-bold text-xl">{property.parking}</div>
                    <div className="text-sm text-gray-600">Parking</div>
                  </div>
                </div>

                <div className="mt-6">
                  <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
                    {property.property_type}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Property</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg">{property.description}</p>
                </div>
              </div>

              {property.features && property.features.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Features & Amenities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                        <span className="text-gray-800 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {property.listing_type === "sale" && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Mortgage Calculator</h2>
                  <MortgageCalculator propertyPrice={property.price} />
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-xl">{property.users?.name?.charAt(0) || "D"}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{property.users?.name || "Dwellot Agent"}</h3>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-700">
                    <Phone className="w-5 h-5 mr-3" />
                    <a
                      href={`tel:${property.users?.phone || "0302000000"}`}
                      className="font-medium hover:text-blue-600 transition"
                    >
                      {property.users?.phone || "0302 000000"}
                    </a>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Mail className="w-5 h-5 mr-3" />
                    <a
                      href={`mailto:${property.users?.email || "support@dwellot.com"}`}
                      className="font-medium hover:text-blue-600 transition"
                    >
                      {property.users?.email || "support@dwellot.com"}
                    </a>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Send Message
                  </button>
                  <a
                    href={generateWhatsAppUrl({
                      id: property.id,
                      title: property.title,
                      location: property.location,
                      price: property.price,
                      bedrooms: property.bedrooms,
                      bathrooms: property.bathrooms,
                      area: property.area,
                      agent_phone: property.users?.phone,
                    }, true)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      if (property) {
                        analytics.trackAgentContact(property.users?.id || "unknown", "whatsapp")
                        trackEnquiry({ property_id: property.id, enquiry_type: "whatsapp", source_page: "property_detail" })
                      }
                    }}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </a>
                  <a
                    href={`tel:${property.users?.phone || "0302000000"}`}
                    onClick={() => {
                      if (property) {
                        analytics.trackAgentContact(property.users?.id || "unknown", "phone")
                        trackEnquiry({ property_id: property.id, enquiry_type: "phone_call", source_page: "property_detail" })
                      }
                    }}
                    className="w-full border-2 border-blue-600 text-blue-600 py-3 px-4 rounded-lg hover:bg-blue-50 transition font-medium flex items-center justify-center"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now
                  </a>
                  <button
                    onClick={() => {
                      if (property) {
                        trackEnquiry({ property_id: property.id, enquiry_type: "schedule_viewing", source_page: "property_detail" })
                      }
                    }}
                    className="w-full border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition font-medium flex items-center justify-center"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Visit
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Property Information</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      Views Today
                    </span>
                    <span className="font-semibold">{viewStats.views_today}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      Total Views
                    </span>
                    <span className="font-semibold">{viewStats.view_count}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Enquiries
                    </span>
                    <span className="font-semibold">{property.enquiry_count || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Listed
                    </span>
                    <span className="font-semibold">{formatDate(property.created_at)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Property ID</span>
                    <span className="font-semibold font-mono">#{property.id.slice(-6).toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Shield className="w-6 h-6 text-green-600 mr-3" />
                  <span className="font-bold text-green-800">Verified Property</span>
                </div>
                <p className="text-sm text-green-700">
                  This property has been verified by our team for accuracy and legitimacy. All information has been
                  confirmed with the property owner.
                </p>
              </div>
            </div>
          </div>
        </div>

        {showContactForm && (
          <ContactFormModal
            propertyId={property.id}
            propertyTitle={property.title}
            agentId={property.users?.id}
            onClose={() => setShowContactForm(false)}
          />
        )}
      </div>
    </>
  )
}
