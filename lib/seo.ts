import type { Metadata } from "next"

const BASE_URL = "https://dwellot.com"

// Known estate/building name prefixes — skip these to get the area name
const ESTATE_PREFIXES = [
  "the ", "arlo", "acacia", "palm hills", "eden heights", "knightsbridge",
  "sakora", "locus", "mo's", "casa", "grace courts", "park ridge",
  "selton", "akaya", "trasacco", "the oxford", "the edge", "the address",
  "the kharis", "block ", "phase ", "unit ", "plot ", "villa ",
]

// ---------------------------------------------------------------------------
// Shared interfaces
// ---------------------------------------------------------------------------

interface PropertySEO {
  id: number | string
  title: string
  description?: string | null
  property_type?: string | null
  listing_type?: string | null
  location?: string | null
  price?: number | null
  currency?: string | null
  bedrooms?: number | null
  bathrooms?: number | null
  area?: number | null
  parking?: number | null
  images?: string[] | null
  amenities?: string[] | null
  created_at?: string | null
  updated_at?: string | null
  region?: string | null
}

// ---------------------------------------------------------------------------
// Helper functions (exported for reuse in components)
// ---------------------------------------------------------------------------

/**
 * Normalise property_type to Title Case.
 * "house" -> "House", "APARTMENT" -> "Apartment", etc.
 */
export function normalizePropertyType(type: string | null | undefined): string {
  if (!type) return "Property"
  const lower = type.toLowerCase().trim()
  const map: Record<string, string> = {
    house: "House",
    apartment: "Apartment",
    townhouse: "Townhouse",
    villa: "Villa",
    penthouse: "Penthouse",
    studio: "Studio",
    commercial: "Commercial",
    land: "Land",
    mansion: "Mansion",
    duplex: "Duplex",
  }
  return map[lower] || lower.charAt(0).toUpperCase() + lower.slice(1)
}

/**
 * Extract the short neighbourhood / area name from a full location string.
 *
 * "Spintex, Manet, Behind Ghana International Mall, Accra" -> "Spintex"
 * "Acacia, East Legon Hills, Accra"                       -> "East Legon Hills"
 * "The Edge, Airport Residential, Accra"                   -> "Airport Residential"
 * "East Legon"                                             -> "East Legon"
 * "ARLO, Cantonments, Accra"                               -> "Cantonments"
 */
export function extractShortArea(location: string | null | undefined): string {
  if (!location) return "Ghana"

  const parts = location.split(",").map((p) => p.trim()).filter(Boolean)
  if (parts.length === 1) return parts[0]

  // Strip trailing city / country names
  const filtered = parts.filter(
    (p) =>
      !["accra", "ghana", "greater accra", "greater accra region"].includes(
        p.toLowerCase(),
      ),
  )

  if (filtered.length === 0) return parts[0]
  if (filtered.length === 1) return filtered[0]

  // If the first part looks like an estate / building name, use the second part
  const firstLower = filtered[0].toLowerCase()
  const isEstateName =
    ESTATE_PREFIXES.some((prefix) => firstLower.startsWith(prefix)) ||
    /^(block|phase|unit|plot)\s/i.test(filtered[0])

  if (isEstateName && filtered.length >= 2) {
    return filtered[1]
  }

  return filtered[0]
}

/**
 * Format price with commas and currency symbol.
 * 290000 -> "$290,000"
 */
export function formatPrice(
  price: number | null | undefined,
  currency?: string | null,
): string {
  if (!price) return ""
  const symbol = currency?.toUpperCase() === "GHS" ? "GH\u20B5" : "$"
  return `${symbol}${price.toLocaleString("en-US")}`
}

// ---------------------------------------------------------------------------
// Title generation — strict max 60 chars
// ---------------------------------------------------------------------------

/**
 * Pattern: [Beds] Bed [Type] for [Sale/Rent] in [Area] | Dwellot
 *
 * Examples:
 *   "3 Bed Townhouse for Sale in Spintex | Dwellot"  (47 chars)
 *   "Studio Apartment for Rent in Cantonments | Dwellot" (51 chars)
 */
export function generatePropertyTitle(property: PropertySEO): string {
  const type = normalizePropertyType(property.property_type)
  const listingAction = property.listing_type === "rent" ? "Rent" : "Sale"
  const area = extractShortArea(property.location)
  const suffix = " | Dwellot" // 10 chars

  let bedsPrefix: string
  if (property.bedrooms === 0 || type === "Studio") {
    bedsPrefix = "Studio Apartment"
  } else if (type === "Penthouse") {
    bedsPrefix = "Penthouse"
  } else if (type === "Land" || type === "Commercial") {
    bedsPrefix = type
  } else {
    bedsPrefix = `${property.bedrooms || ""} Bed ${type}`
  }

  // Full attempt
  let title = `${bedsPrefix} for ${listingAction} in ${area}${suffix}`

  // Over 60? Try first word of area only
  if (title.length > 60) {
    const shortArea = area.split(" ")[0]
    title = `${bedsPrefix} for ${listingAction} in ${shortArea}${suffix}`
  }

  // Still over? Drop location entirely
  if (title.length > 60) {
    title = `${bedsPrefix} for ${listingAction}${suffix}`
  }

  return title
}

// ---------------------------------------------------------------------------
// Description generation — strict max 155 chars
// ---------------------------------------------------------------------------

/**
 * Pattern: [Beds] bedroom [type] for [sale/rent] in [area], Ghana. $[price]. [sqm]m². [feature]. Browse verified properties on Dwellot.
 */
export function generatePropertyDescription(property: PropertySEO): string {
  const type = normalizePropertyType(property.property_type)?.toLowerCase()
  const listingAction = property.listing_type === "rent" ? "rent" : "sale"
  const area = extractShortArea(property.location)
  const tail = " Browse verified properties on Dwellot."

  // Beds prefix
  let bedsStr: string
  if (property.bedrooms === 0 || type === "studio") {
    bedsStr = "Studio apartment"
  } else {
    bedsStr = `${property.bedrooms} bedroom ${type}`
  }

  const priceStr = property.price
    ? ` ${formatPrice(property.price, property.currency)}.`
    : ""
  const sqmStr = property.area ? ` ${property.area}m\u00B2.` : ""

  // Pick one short amenity as a feature
  let featureStr = ""
  if (property.amenities && property.amenities.length > 0) {
    const shortAmenity = property.amenities.find((a) => a.length <= 25)
    if (shortAmenity) featureStr = ` ${shortAmenity}.`
  }

  // Progressive truncation to stay under 155 chars
  let desc = `${bedsStr} for ${listingAction} in ${area}, Ghana.${priceStr}${sqmStr}${featureStr}${tail}`

  if (desc.length > 155) {
    desc = `${bedsStr} for ${listingAction} in ${area}, Ghana.${priceStr}${sqmStr}${tail}`
  }
  if (desc.length > 155) {
    desc = `${bedsStr} for ${listingAction} in ${area}, Ghana.${priceStr}${tail}`
  }
  if (desc.length > 155) {
    const shortArea = area.split(" ")[0]
    desc = `${bedsStr} for ${listingAction} in ${shortArea}, Ghana.${priceStr}${tail}`
  }

  return desc
}

// ---------------------------------------------------------------------------
// Full Metadata object (used by generateMetadata in page.tsx)
// ---------------------------------------------------------------------------

export function generateEnhancedPropertyMetadata(property: PropertySEO): Metadata {
  const title = generatePropertyTitle(property)
  const description = generatePropertyDescription(property)
  const url = `${BASE_URL}/properties/${property.id}`
  const image = property.images?.[0] || `${BASE_URL}/og-default.jpg`
  const resolvedImage = image.startsWith("http") ? image : `${BASE_URL}${image}`
  const imageAlt = `${property.title} in ${extractShortArea(property.location)}, Ghana`

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "Dwellot",
      locale: "en_GH",
      images: [
        {
          url: resolvedImage,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@dwellot",
      creator: "@dwellot",
      title,
      description,
      images: [resolvedImage],
    },
  }
}

// ---------------------------------------------------------------------------
// JSON-LD Structured Data
// ---------------------------------------------------------------------------

export function generateEnhancedStructuredData(property: PropertySEO) {
  const description = generatePropertyDescription(property)
  const area = extractShortArea(property.location)
  const image = property.images?.[0]
  const resolvedImage = image
    ? image.startsWith("http")
      ? image
      : `${BASE_URL}${image}`
    : undefined

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description,
    url: `${BASE_URL}/properties/${property.id}`,
    ...(resolvedImage && { image: resolvedImage }),
    ...(property.created_at && { datePosted: property.created_at }),
    ...(property.updated_at && { dateModified: property.updated_at }),
    offers: {
      "@type": "Offer",
      price: property.price || undefined,
      priceCurrency: property.currency?.toUpperCase() || "USD",
      availability: "https://schema.org/InStock",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: area,
      addressRegion: property.region || "Greater Accra",
      addressCountry: "GH",
    },
    ...(property.bedrooms != null && { numberOfRooms: property.bedrooms }),
    ...(property.bathrooms != null && {
      numberOfBathroomsTotal: property.bathrooms,
    }),
    ...(property.area && {
      floorSize: {
        "@type": "QuantitativeValue",
        value: property.area,
        unitCode: "MTK",
      },
    }),
  }
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Dwellot",
    description:
      "Ghana's premier property marketplace connecting buyers, sellers, and renters across Accra, Kumasi, and beyond.",
    url: BASE_URL,
    logo: `${BASE_URL}/icon-512.png`,
    telephone: "+233-020-157-8429",
    email: "support@dwellot.com",
    address: {
      "@type": "PostalAddress",
      addressCountry: "Ghana",
      addressLocality: "Accra",
    },
    sameAs: [
      "https://facebook.com/dwellot",
      "https://twitter.com/dwellot",
      "https://instagram.com/dwellot",
      "https://linkedin.com/company/dwellot",
    ],
    areaServed: { "@type": "Country", name: "Ghana" },
  }
}

export function generateFAQSchema(
  faqs: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  }
}

export function generateSearchActionSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Dwellot",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/properties?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}
