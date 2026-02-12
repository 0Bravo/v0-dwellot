"use client"

import Image from "next/image"
import { MapPin, Bed, Bath, Square, Car, Phone, Mail, Globe } from "lucide-react"

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
  users: {
    name: string
    email: string
    phone: string
  }
}

interface PropertyPrintViewProps {
  property: Property
}

export default function PropertyPrintView({ property }: PropertyPrintViewProps) {
  const formatPrice = (price: number, listingType: string) => {
    return `$ ${price.toLocaleString()}${listingType === "rent" ? "/month" : ""}`
  }

  return (
    <div className="print:block hidden">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content,
          .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>

      <div className="print-content bg-white p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 pb-6 border-b-2 border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <p className="text-gray-600 flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5" />
                {property.location}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {formatPrice(property.price, property.listing_type)}
              </div>
              <div className="text-gray-600">{property.listing_type === "rent" ? "For Rent" : "For Sale"}</div>
            </div>
          </div>
        </div>

        {/* Main Image */}
        {property.images && property.images[0] && (
          <div className="relative w-full h-96 mb-6">
            <Image
              src={property.images[0] || "/placeholder.svg"}
              alt={property.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}

        {/* Property Details Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
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

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Property</h2>
          <p className="text-gray-700 leading-relaxed">{property.description}</p>
        </div>

        {/* Features */}
        {property.features && property.features.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Features & Amenities</h2>
            <div className="grid grid-cols-2 gap-3">
              {property.features.map((feature, index) => (
                <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3" />
                  <span className="text-gray-800">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Property Type */}
        <div className="mb-8">
          <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
            {property.property_type}
          </div>
        </div>

        {/* Agent Contact */}
        <div className="border-t-2 border-gray-200 pt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="mb-4">
              <div className="font-bold text-lg text-gray-900 mb-2">{property.users?.name || "Dwellot Agent"}</div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <Phone className="w-5 h-5 mr-3" />
                <span className="font-medium">{property.users?.phone || "0302 000000"}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Mail className="w-5 h-5 mr-3" />
                <span className="font-medium">{property.users?.email || "support@dwellot.com"}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Globe className="w-5 h-5 mr-3" />
                <span className="font-medium">www.dwellot.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>This property listing was generated from Dwellot - Ghana's Premier Property Marketplace</p>
          <p className="mt-2">Visit www.dwellot.com for more properties</p>
          <p className="mt-2">Property ID: #{property.id.slice(-6).toUpperCase()}</p>
        </div>
      </div>
    </div>
  )
}
