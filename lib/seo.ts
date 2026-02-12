import type { Metadata } from "next"

interface PropertySEO {
  id: string
  title: string
  description: string
  price: number
  location: string
  images: string[]
  property_type: string
  bedrooms: number
  bathrooms: number
  listing_type: string
  area?: number
}

export function generatePropertyMetadata(property: PropertySEO): Metadata {
  const url = `https://dwellot.com/properties/${property.id}`
  const imageUrl = property.images[0] || "/images/hero-bg.jpg"

  return {
    title: `${property.title} - ${property.location} | Dwellot`,
    description: `${property.listing_type === "sale" ? "Buy" : "Rent"} this ${property.bedrooms} bedroom ${property.property_type} in ${property.location} for $${property.price.toLocaleString()}. ${property.description?.slice(0, 150)}`,
    keywords: `${property.location}, ${property.property_type}, ${property.bedrooms} bedroom, property for ${property.listing_type}, Ghana real estate`,
    openGraph: {
      title: property.title,
      description: property.description?.slice(0, 200),
      url,
      siteName: "Dwellot",
      images: [
        {
          url: imageUrl.startsWith("http") ? imageUrl : `https://dwellot.com${imageUrl}`,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
      locale: "en_GH",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: property.title,
      description: property.description?.slice(0, 200),
      images: [imageUrl.startsWith("http") ? imageUrl : `https://dwellot.com${imageUrl}`],
    },
    alternates: {
      canonical: url,
    },
  }
}

export function generateStructuredData(property: PropertySEO) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: `https://dwellot.com/properties/${property.id}`,
    image: property.images.map((img) => (img.startsWith("http") ? img : `https://dwellot.com${img}`)),
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: property.price,
        priceCurrency: "USD",
      },
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: property.location,
      addressCountry: "GH",
    },
    numberOfRooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
  }
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Dwellot",
    description:
      "Ghana's premier property marketplace connecting buyers, sellers, and renters across Accra, Kumasi, and beyond.",
    url: "https://dwellot.com",
    logo: "https://dwellot.com/icon-512.png",
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
    areaServed: {
      "@type": "Country",
      name: "Ghana",
    },
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
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

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

export function generateSearchActionSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Dwellot",
    url: "https://dwellot.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://dwellot.com/properties?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }
}

export function generateEnhancedPropertyMetadata(property: PropertySEO): Metadata {
  const url = `https://dwellot.com/properties/${property.id}`
  const imageUrl = property.images[0] || "/images/hero-bg.jpg"

  const aiOptimizedDescription = `${property.listing_type === "sale" ? "Purchase" : "Rent"} this beautiful ${property.bedrooms}-bedroom ${property.property_type} located in ${property.location}, Ghana. Priced at $${property.price.toLocaleString()}, this property features ${property.bathrooms} bathroom${property.bathrooms > 1 ? "s" : ""} and offers excellent value. ${property.description?.slice(0, 120)}... Available for immediate viewing.`

  return {
    title: `${property.title} - ${property.listing_type === "sale" ? "For Sale" : "For Rent"} in ${property.location}, Ghana | Dwellot`,
    description: aiOptimizedDescription,
    keywords: [
      `${property.location} property`,
      `${property.property_type} ${property.location}`,
      `${property.bedrooms} bedroom ${property.location}`,
      `property for ${property.listing_type} Ghana`,
      `${property.location} real estate`,
      "Ghana property marketplace",
      "houses in Ghana",
      "apartments in Ghana",
    ].join(", "),
    authors: [{ name: "Dwellot" }],
    openGraph: {
      title: `${property.title} - ${property.location}`,
      description: aiOptimizedDescription,
      url,
      siteName: "Dwellot",
      images: [
        {
          url: imageUrl.startsWith("http") ? imageUrl : `https://dwellot.com${imageUrl}`,
          width: 1200,
          height: 630,
          alt: `${property.title} in ${property.location}, Ghana`,
        },
      ],
      locale: "en_GH",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: property.title,
      description: aiOptimizedDescription,
      images: [imageUrl.startsWith("http") ? imageUrl : `https://dwellot.com${imageUrl}`],
      creator: "@dwellot",
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  }
}

export function generateEnhancedStructuredData(property: PropertySEO) {
  return {
    "@context": "https://schema.org",
    "@type": ["RealEstateListing", "Product", "Place"],
    name: property.title,
    description: property.description,
    url: `https://dwellot.com/properties/${property.id}`,
    image: property.images.map((img) => (img.startsWith("http") ? img : `https://dwellot.com${img}`)),
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: property.price,
        priceCurrency: "USD",
        unitText: property.listing_type === "sale" ? "SALE" : "MONTH",
      },
      seller: {
        "@type": "RealEstateAgent",
        name: "Dwellot",
        url: "https://dwellot.com",
      },
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: property.location,
      addressCountry: "Ghana",
      addressRegion: "Greater Accra",
    },
    geo: {
      "@type": "GeoCoordinates",
      addressCountry: "GH",
    },
    numberOfRooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    floorSize: {
      "@type": "QuantitativeValue",
      value: property.area || 0,
      unitCode: "SQM",
    },
    category: property.property_type,
    additionalType: property.listing_type === "sale" ? "Sale" : "Rental",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "1",
    },
  }
}
