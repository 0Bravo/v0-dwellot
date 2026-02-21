import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  generateEnhancedPropertyMetadata,
  generateEnhancedStructuredData,
  generateBreadcrumbSchema,
  normalizePropertyType,
  extractShortArea,
  formatPrice,
} from "@/lib/seo"
import { createAdminClient } from "@/lib/supabase/admin"
import PropertyDetailsClient from "./PropertyDetailsClient"

export const revalidate = 86400 // 24 hours ISR

// ---------------------------------------------------------------------------
// generateStaticParams: pre-render all active property pages at build time
// ---------------------------------------------------------------------------
export async function generateStaticParams() {
  try {
    const adminClient = createAdminClient()
    const { data } = await adminClient
      .from("properties")
      .select("id")
      .eq("status", "active")
      .limit(200)

    return (data || []).map((p) => ({ id: String(p.id) }))
  } catch {
    return []
  }
}

// ---------------------------------------------------------------------------
// Server data fetching
// ---------------------------------------------------------------------------
async function getProperty(id: string) {
  try {
    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from("properties")
      .select("*")
      .eq("id", Number.parseInt(id))
      .single()

    if (error || !data) return null
    return data
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// generateMetadata: full SEO metadata server-side
// ---------------------------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const property = await getProperty(id)

  if (!property) {
    return {
      title: "Property Not Found | Dwellot Ghana",
      description:
        "The property you are looking for could not be found. Browse other properties in Ghana.",
    }
  }

  return generateEnhancedPropertyMetadata(property)
}

// ---------------------------------------------------------------------------
// Server Component: renders all SEO-critical content as plain HTML
// ---------------------------------------------------------------------------
export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const property = await getProperty(id)

  if (!property) {
    notFound()
  }

  // Structured data
  const structuredData = generateEnhancedStructuredData(property)
  const breadcrumbData = generateBreadcrumbSchema([
    { name: "Home", url: "https://dwellot.com" },
    { name: "Properties", url: "https://dwellot.com/properties" },
    {
      name: extractShortArea(property.location),
      url: `https://dwellot.com/properties?location=${encodeURIComponent(property.location || "")}`,
    },
    {
      name: property.title,
      url: `https://dwellot.com/properties/${property.id}`,
    },
  ])

  const type = normalizePropertyType(property.property_type)
  const area = extractShortArea(property.location)
  const price = formatPrice(property.price, property.currency)
  const listingLabel = property.listing_type === "rent" ? "For Rent" : "For Sale"
  const heroImage = property.images?.[0] || "/placeholder.svg"

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      {/* ================================================================
          SERVER-RENDERED SEO CONTENT
          Everything below is in the initial HTML response.
          Google will see title, price, location, specs, description.
          ================================================================ */}
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb navigation */}
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
          <ol className="flex items-center gap-1.5 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-900 transition">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/properties" className="hover:text-gray-900 transition">Properties</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/properties?location=${encodeURIComponent(property.location || "")}`}
                className="hover:text-gray-900 transition"
              >
                {area}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-900 font-medium truncate max-w-[200px]">
              {property.title}
            </li>
          </ol>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ---- Left column: main content ---- */}
            <div className="lg:col-span-2">
              {/* Hero image - server rendered with priority loading */}
              <div className="relative h-[60vh] sm:h-[50vh] md:h-96 lg:h-[28rem] mb-6 rounded-lg overflow-hidden">
                <Image
                  src={heroImage}
                  alt={`${property.title} - ${type} ${listingLabel.toLowerCase()} in ${area}, Ghana`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded font-medium">
                  {listingLabel}
                </div>
                {property.featured && (
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded text-sm font-medium">
                    Featured
                  </div>
                )}
              </div>

              {/* Property header - plain text for SEO */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                  <div className="mb-4 lg:mb-0">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 text-balance">
                      {property.title}
                    </h1>
                    <p className="text-gray-600 text-lg">
                      {property.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {price}
                      {property.listing_type === "rent" ? (
                        <span className="text-lg font-normal text-gray-500">/month</span>
                      ) : null}
                    </div>
                    {property.listing_type === "sale" && (
                      <div className="text-gray-600">Negotiable</div>
                    )}
                  </div>
                </div>

                {/* Specs grid - visible text for crawlers */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-b">
                  <div className="text-center">
                    <div className="font-bold text-xl">{property.bedrooms ?? 0}</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-xl">{property.bathrooms ?? 0}</div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-xl">{property.area ?? "N/A"}</div>
                    <div className="text-sm text-gray-600">{'Area (m\u00B2)'}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-xl">{property.parking ?? 0}</div>
                    <div className="text-sm text-gray-600">Parking</div>
                  </div>
                </div>

                <div className="mt-6">
                  <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
                    {type}
                  </span>
                </div>
              </div>

              {/* Description - full text for SEO */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  About This Property
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {property.description}
                  </p>
                </div>
              </div>

              {/* Features / Amenities list */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Features & Amenities
                  </h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.amenities.map((amenity: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" aria-hidden="true">&#10003;</span>
                        <span className="text-gray-800 font-medium">{amenity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* ---- Right column: agent info (server-rendered) ---- */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-xl">
                      {(property.agent || "D").charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {property.agent || "Dwellot Agent"}
                    </h3>
                  </div>
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  Listed {new Date(property.created_at).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <span className="font-bold text-green-800">Verified Property</span>
                <p className="text-sm text-green-700 mt-1">
                  This property has been verified by our team for accuracy and
                  legitimacy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================
          CLIENT COMPONENT: interactive features that hydrate on the
          browser — gallery, CTAs, analytics, contact form, mortgage calc.
          Property data is passed as a prop, NOT fetched again.
          ================================================================ */}
      <PropertyDetailsClient property={property} />
    </>
  )
}
