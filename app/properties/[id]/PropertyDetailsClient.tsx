"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"
import {
  ArrowLeft,
  Heart,
  Share2,
  Phone,
  MessageSquare,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Maximize2,
} from "lucide-react"
import {
  analytics,
  trackPropertyView as trackGA4PropertyView,
  trackWhatsAppClick,
  trackPhoneRevealed,
  trackScheduleVisit,
} from "@/lib/analytics"
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext"
import { generateWhatsAppUrl } from "@/lib/utils/whatsapp"
import { trackEnquiry } from "@/lib/utils/track-enquiry"

// Lazy-load heavy interactive components
const PropertyPrint = dynamic(() => import("@/components/PropertyPrint"), { ssr: false })
const PropertyPrintView = dynamic(() => import("@/components/PropertyPrintView"), { ssr: false })
const ImageGallery = dynamic(() => import("@/components/ImageGallery"), { ssr: false })
const ShareModal = dynamic(() => import("@/components/ShareModal"), { ssr: false })
const MortgageCalculator = dynamic(() => import("@/components/MortgageCalculator"), { ssr: false })
const ContactFormModal = dynamic(() => import("@/components/ContactFormModal"), { ssr: false })

interface PropertyDetailsClientProps {
  property: {
    id: string | number
    title: string
    location: string
    price: number
    currency?: string
    listing_type: string
    property_type: string
    bedrooms: number
    bathrooms: number
    area: number
    parking: number
    description: string
    images: string[]
    amenities?: string[]
    featured: boolean
    status: string
    agent?: string
    phone?: string
    agent_phone?: string
    agent_email?: string
    agent_whatsapp?: string
    view_count: number
    enquiry_count?: number
    created_at: string
    updated_at: string
    users?: {
      id: string
      name: string
      email: string
      phone: string
    }
    [key: string]: unknown
  }
}

interface ViewStats {
  view_count: number
  views_today: number
}

export default function PropertyDetailsClient({ property }: PropertyDetailsClientProps) {
  const router = useRouter()
  const { addToRecentlyViewed } = useRecentlyViewed()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [viewStats, setViewStats] = useState<ViewStats>({
    view_count: property.view_count || 0,
    views_today: 0,
  })
  const [showLightbox, setShowLightbox] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  // Track view + add to recently viewed on mount
  useEffect(() => {
    // Track view via API
    fetch(`/api/properties/${property.id}/view`, { method: "POST" })
      .then((r) => r.json())
      .then((data) => {
        if (data.view_count != null) {
          setViewStats({ view_count: data.view_count, views_today: data.views_today || 0 })
        }
      })
      .catch(() => {})

    // GA4 + analytics
    analytics.trackPropertyView(String(property.id), property.title)
    trackGA4PropertyView({
      property_id: property.id,
      property_type: property.property_type,
      listing_type: property.listing_type,
      location: property.location,
      price: property.price,
      currency: property.currency || "USD",
      bedrooms: property.bedrooms,
    })

    // Recently viewed
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property.id])

  const nextImage = useCallback(() => {
    if (property.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
    }
  }, [property.images])

  const prevImage = useCallback(() => {
    if (property.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
    }
  }, [property.images])

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    analytics.trackFavorite(String(property.id), isFavorite ? "remove" : "add")
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title} in ${property.location}`,
          url: window.location.href,
        })
        analytics.trackShare(String(property.id), "native")
      } catch {
        setShowShareModal(true)
      }
    } else {
      setShowShareModal(true)
    }
  }

  const agentName = property.users?.name || property.agent || "Dwellot Agent"
  const agentPhone = property.users?.phone || property.agent_phone || property.phone || ""
  const agentEmail = property.users?.email || property.agent_email || "support@dwellot.com"

  return (
    <>
      {/* Hidden print view */}
      <PropertyPrintView property={property} />

      {/* Lightbox */}
      {showLightbox && (
        <ImageGallery
          images={property.images}
          title={property.title}
          initialIndex={currentImageIndex}
          onClose={() => setShowLightbox(false)}
        />
      )}

      {/* Share modal */}
      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          url={typeof window !== "undefined" ? window.location.href : ""}
          title={property.title}
          description={`${property.listing_type === "sale" ? "For Sale" : "For Rent"} - ${property.location}. ${property.bedrooms} bed, ${property.bathrooms} bath. $${property.price.toLocaleString()}`}
          imageUrl={property.images?.[0]}
          onShare={(platform: string) => analytics.trackShare(String(property.id), platform)}
        />
      )}

      {/* ----------------------------------------------------------------
          INTERACTIVE TOOLBAR: back, print, favorite, share
          ---------------------------------------------------------------- */}
      <div className="bg-white shadow-sm print-hide sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="sr-only sm:not-sr-only">Back to Properties</span>
            </button>
            <div className="flex items-center gap-3">
              <PropertyPrint propertyId={String(property.id)} />
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

      {/* ----------------------------------------------------------------
          IMAGE CAROUSEL with navigation + lightbox trigger
          This enhances the static hero image rendered server-side.
          ---------------------------------------------------------------- */}
      {property.images && property.images.length > 1 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
          <div className="lg:w-2/3">
            {/* Carousel overlay on hero image is handled via CSS positioning */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentImageIndex(index)
                    setShowLightbox(true)
                  }}
                  className={`relative w-24 h-20 sm:w-20 sm:h-16 flex-shrink-0 rounded overflow-hidden transition ${
                    index === currentImageIndex
                      ? "ring-2 ring-blue-600"
                      : "hover:ring-2 hover:ring-gray-300"
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
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------
          CTA BUTTONS: WhatsApp, Call, Send Message, Schedule Visit
          These are the interactive conversion elements.
          ---------------------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: mortgage calculator */}
          <div className="lg:col-span-2">
            {property.listing_type === "sale" && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Mortgage Calculator</h2>
                <MortgageCalculator propertyPrice={property.price} />
              </div>
            )}
          </div>

          {/* Right: CTA buttons */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-16">
              <h3 className="font-bold text-lg text-gray-900 mb-4">
                Contact {agentName}
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Send Message
                </button>
                <a
                  href={generateWhatsAppUrl(
                    {
                      id: property.id,
                      title: property.title,
                      location: property.location,
                      price: property.price,
                      bedrooms: property.bedrooms,
                      bathrooms: property.bathrooms,
                      area: property.area,
                      agent_phone: agentPhone,
                    },
                    true,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    analytics.trackAgentContact(property.users?.id || "unknown", "whatsapp")
                    trackEnquiry({ property_id: property.id, enquiry_type: "whatsapp", source_page: "property_detail" })
                    trackWhatsAppClick({
                      property_id: property.id,
                      property_type: property.property_type,
                      listing_type: property.listing_type,
                      location: property.location,
                      price: property.price,
                      currency: property.currency || "USD",
                      agent_name: agentName,
                    })
                  }}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </a>
                {agentPhone && (
                  <a
                    href={`tel:${agentPhone}`}
                    onClick={() => {
                      analytics.trackAgentContact(property.users?.id || "unknown", "phone")
                      trackEnquiry({ property_id: property.id, enquiry_type: "phone_call", source_page: "property_detail" })
                      trackPhoneRevealed({
                        property_id: property.id,
                        property_type: property.property_type,
                        listing_type: property.listing_type,
                        location: property.location,
                        price: property.price,
                        currency: property.currency || "USD",
                        agent_name: agentName,
                      })
                    }}
                    className="w-full border-2 border-blue-600 text-blue-600 py-3 px-4 rounded-lg hover:bg-blue-50 transition font-medium flex items-center justify-center"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now
                  </a>
                )}
                <button
                  onClick={() => {
                    trackEnquiry({ property_id: property.id, enquiry_type: "schedule_viewing", source_page: "property_detail" })
                    trackScheduleVisit({
                      property_id: property.id,
                      property_type: property.property_type,
                      listing_type: property.listing_type,
                      location: property.location,
                      price: property.price,
                      currency: property.currency || "USD",
                    })
                  }}
                  className="w-full border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition font-medium flex items-center justify-center"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Visit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact form modal */}
      {showContactForm && (
        <ContactFormModal
          propertyId={String(property.id)}
          propertyTitle={property.title}
          agentId={property.users?.id}
          onClose={() => setShowContactForm(false)}
        />
      )}
    </>
  )
}
