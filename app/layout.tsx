import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ToastProvider } from "@/components/Toast"
import { CompareProvider } from "@/contexts/CompareContext"
import { RecentlyViewedProvider } from "@/contexts/RecentlyViewedContext"
import FacebookPixel from "@/components/FacebookPixel"
import GoogleAnalytics from "@/components/GoogleAnalytics"
import SiteShell from "@/components/SiteShell"

// Both faces are served from the repo rather than fetched from Google at
// build time. next/font/google downloads the files during the build, so a
// blip at Google's end fails the whole deploy, which it already did once.
// These are the upstream variable woff2 files, vendored.
const inter = localFont({
  src: "./fonts/inter-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-body",
  display: "swap",
})

// Headings get their own face. Inter everywhere reads as a default rather
// than a decision; a second family gives the page a voice without costing
// legibility in body copy, which stays Inter.
const display = localFont({
  src: "./fonts/plus-jakarta-sans-latin-wght-normal.woff2",
  weight: "200 800",
  variable: "--font-display",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://dwellot.com"),
  title: {
    /* Was "Ghana's #1 Property Marketplace", on a site with 90 listings and
        no ranking to point at. It sat in the site title, so it was in every
        page's title and every search result. The replacement says what the
        site is actually for and targets the money question the homepage now
        leads with. */
    default: "Dwellot - Ghana Mortgage Rates, Buying Costs and Property Listings",
    template: "%s | Dwellot Ghana",
  },
  description:
    "Compare Ghanaian mortgage rates in cedis and dollars, see the deposit, stamp duty and Lands Commission fees a purchase needs, and browse houses, apartments and land for sale and rent in Accra, Kumasi, East Legon, Airport Hills and Appolonia City.",
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
    "Ghana mortgage rates",
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
    title: "Dwellot - Ghana Mortgage Rates and Property Listings",
    description:
      "Properties for sale and rent across Ghana, with the mortgage rate, deposit, duties and monthly repayment a purchase actually needs.",
    images: [
      {
        url: "/images/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Rooftops of a residential neighbourhood in Ghana",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dwellot - Ghana Mortgage Rates and Property Listings",
    description: "Ghanaian mortgage rates, the real cost of buying, and listings across Accra and beyond.",
    images: ["/images/hero-bg.jpg"],
    creator: "@dwellot",
    site: "@dwellot",
  },
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_YANDEX_VERIFICATION
      ? { yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_BING_VERIFICATION
      ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION } }
      : {}),
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
    description:
      "Ghana property listings alongside the mortgage rates, deposit, duties and fees a purchase needs.",
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
      <body className={`${inter.variable} ${display.variable} ${inter.className}`}>
        <ToastProvider>
          <RecentlyViewedProvider>
            <CompareProvider>
              <AuthProvider>
                <SiteShell>{children}</SiteShell>
              </AuthProvider>
            </CompareProvider>
          </RecentlyViewedProvider>
        </ToastProvider>
        <Analytics />
        <SpeedInsights />
        <FacebookPixel />
        <GoogleAnalytics />
      </body>
    </html>
  )
}
