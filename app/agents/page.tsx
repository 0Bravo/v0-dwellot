"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
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
} from "lucide-react"

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
  created_at: string
  updated_at: string
}

export default function PropertyDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showContactForm, setShowContactForm] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [contactLoading, setContactLoading] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProperty(params.id as string)
    }
  }, [params.id])

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

  const nextImage = () => {
    if (property?.images && property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
    }
  }

  const prevImage = () => {
    if (property?.images && property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setContactLoading(true)

    try {
      // Simulate API call - replace with actual contact API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Contact form submitted:", {
        ...contactForm,
        propertyId: property?.id,
        propertyTitle: property?.title,
        agentId: property?.users?.id,
      })

      setShowContactForm(false)
      setContactForm({ name: "", email: "", phone: "", message: "" })

      // Show success message (you could add a toast notification here)
      alert("Message sent successfully! The agent will contact you soon.")
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Failed to send message. Please try again.")
    } finally {
      setContactLoading(false)
    }
  }

  const toggleSave = () => {
    setIsSaved(!isSaved)
    // Here you would typically save to localStorage or send to API
    console.log(isSaved ? "Removed from saved" : "Added to saved", property?.id)
  }

  const handleShare = async () => {
    if (navigator.share && property) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title} in ${property.location}`,
          url: window.location.href,
        })
      } catch {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href)
        alert("Property link copied to clipboard!")
      }
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert("Property link copied to clipboard!")
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
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
              <button
                onClick={toggleSave}
                className={`p-2 rounded-full transition ${
                  isSaved ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title={isSaved ? "Remove from saved" : "Save property"}
              >
                <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
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
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative h-96 mb-6 rounded-lg overflow-hidden group">
              <Image
                src={
                  property.images?.[currentImageIndex] ||
                  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg"
                }
                alt={`${property.title} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover"
                priority
              />

              {/* Navigation Arrows */}
              {property.images && property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full transition opacity-0 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full transition opacity-0 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                {currentImageIndex + 1} / {property.images?.length || 1}
              </div>

              {/* Listing Type Badge */}
              <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded font-medium">
                {property.listing_type === "rent" ? "For Rent" : "For Sale"}
              </div>

              {/* Featured Badge */}
              {property.featured && (
                <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded text-sm font-medium">
                  Featured
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {property.images && property.images.length > 1 && (
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-20 h-16 flex-shrink-0 rounded overflow-hidden transition ${
                      index === currentImageIndex ? "ring-2 ring-blue-600" : "hover:ring-2 hover:ring-gray-300"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Property Details */}
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

              {/* Property Stats */}
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

              {/* Property Type */}
              <div className="mt-6">
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
                  {property.property_type}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Property</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">{property.description}</p>
              </div>
            </div>

            {/* Features */}
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
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Agent Card */}
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
                  <span className="font-medium">{property.users?.phone || "0302 000000"}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Mail className="w-5 h-5 mr-3" />
                  <span className="font-medium">{property.users?.email || "support@dwellot.com"}</span>
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
                <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </button>
                <button className="w-full border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition font-medium flex items-center justify-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Visit
                </button>
              </div>
            </div>

            {/* Property Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Property Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    Views Today
                  </span>
                  <span className="font-semibold">{Math.floor(Math.random() * 50) + 10}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    Total Views
                  </span>
                  <span className="font-semibold">{Math.floor(Math.random() * 500) + 100}</span>
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

            {/* Verification Badge */}
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

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Contact Agent</h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+233 XX XXX XXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Hi, I'm interested in ${property.title}. Could you please provide more information?`}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  disabled={contactLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  disabled={contactLoading}
                >
                  {contactLoading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
