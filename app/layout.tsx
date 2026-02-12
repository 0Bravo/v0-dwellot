import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { AuthProvider } from "@/lib/auth-context"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ToastProvider } from "@/components/Toast"
import { CompareProvider } from "@/contexts/CompareContext"
import { RecentlyViewedProvider } from "@/contexts/RecentlyViewedContext"
import NewsletterModal from "@/components/NewsletterModal"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://dwellot.com"),
  title: {
    default: "Dwellot - Ghana's #1 Property Marketplace | Houses, Apartments for Sale & Rent",
    template: "%s | Dwellot Ghana",
  },
  description:
    "Find your dream property in Ghana. Browse thousands of verified houses, apartments, and commercial properties for sale and rent in Accra, Kumasi, East Legon, Airport Hills, Appolonia City, and across Ghana. Ghana's most trusted property marketplace.",
  keywords: [
    // Primary keywords (High volume)
    "Ghana property",
    "Ghana real estate",
    "houses for sale Ghana",
    "apartments for rent Ghana",
    "property Ghana",
    "buy property Ghana",
    "rent property Ghana",
    // Location-specific (High intent)
    "Accra properties",
    "East Legon houses",
    "Airport Hills apartments",
    "Kumasi real estate",
    "Appolonia City properties",
    "Tema properties",
    "Cantonments properties",
    "Labone houses",
    "properties in Ghana",
    "properties in Accra",
    "Devtraco Woodlands",
    "Devtraco properties",
    // Property types
    "houses for sale in Ghana",
    "apartments for rent in Accra",
    "commercial property Ghana",
    "land for sale Ghana",
    "luxury homes Ghana",
    "townhouses Ghana",
    "serviced plots Ghana",
    "gated community Ghana",
    // Long-tail keywords (Conversion)
    "find property in Ghana",
    "buy house in Accra",
    "rent apartment in East Legon",
    "Ghana property marketplace",
    "real estate agents Ghana",
    "Ghana property listings",
    "verified properties Ghana",
    "property investment Ghana",
    "expat housing Ghana",
    "affordable homes Ghana",
    // Developer specific
    "Appolonia City homes",
    "Devtraco Woodlands plots",
    "Kharis Properties",
    "gated estates Ghana",
  ].join(", "),
  authors: [{ name: "Dwellot", url: "https://dwellot.com" }],
  creator: "Dwellot",
  publisher: "Dwellot",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Dwellot",
  },
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: "https://dwellot.com",
    siteName: "Dwellot",
    title: "Dwellot - Ghana's #1 Property Marketplace",
    description:
      "Discover your perfect home in Ghana. Thousands of verified properties for sale and rent in Accra, Kumasi, and across Ghana.",
    images: [
      {
        url: "/images/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Dwellot - Ghana's Premier Property Marketplace",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dwellot - Ghana's #1 Property Marketplace",
    description: "Find your dream property in Ghana. Browse thousands of verified listings.",
    images: ["/images/hero-bg.jpg"],
    creator: "@dwellot",
    site: "@dwellot",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    other: {
      "msvalidate.01": "your-bing-verification-code",
    },
  },
  category: "Real Estate",
  alternates: {
    canonical: "https://dwellot.com",
    languages: {
      "en-GH": "https://dwellot.com",
    },
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Dwellot",
    description: "Ghana's premier property marketplace connecting buyers, sellers, and renters.",
    url: "https://dwellot.com",
    logo: "https://dwellot.com/icon-512.png",
    address: {
      "@type": "PostalAddress",
      addressCountry: "Ghana",
      addressLocality: "Accra",
    },
    areaServed: {
      "@type": "Country",
      name: "Ghana",
    },
  }

  const searchActionSchema = {
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

  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Dwellot" />
        <meta name="theme-color" content="#14b8a6" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(searchActionSchema) }} />
      </head>
      <body className={inter.className}>
        <ToastProvider>
          <RecentlyViewedProvider>
            <CompareProvider>
              <AuthProvider>
                <Navbar />
                <main className="pt-16">{children}</main>
                <Footer />
                <NewsletterModal />
              </AuthProvider>
            </CompareProvider>
          </RecentlyViewedProvider>
        </ToastProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
