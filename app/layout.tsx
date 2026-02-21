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
import GoogleAnalytics from "@/components/GoogleAnalytics"
import HotjarAnalytics from "@/components/HotjarAnalytics"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://dwellot.com"),
  title: {
    default: "Dwellot — Ghana Real Estate for Diaspora Buyers | UK, USA, Canada",
    template: "%s | Dwellot Ghana",
  },
  description:
    "Find verified properties in Ghana from the UK, USA or Canada. Browse houses, apartments and land in Accra and beyond. Prices shown in GBP, USD and CAD. Trusted by Ghanaian diaspora worldwide.",
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
    title: "Dwellot — Ghana Real Estate for Diaspora Buyers",
    description:
      "Find verified properties in Ghana from the UK, USA or Canada. Houses, apartments and land in Accra and beyond.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dwellot — Ghana Real Estate for Diaspora Buyers",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dwellot — Ghana Real Estate for Diaspora Buyers",
    description: "Find verified properties in Ghana from the UK, USA or Canada. Trusted by Ghanaian diaspora worldwide.",
    images: ["/og-image.jpg"],
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
    "@type": "Organization",
    name: "Dwellot",
    url: "https://dwellot.com",
    logo: "https://dwellot.com/logo.png",
    description:
      "Ghana real estate marketplace connecting diaspora buyers in UK, USA and Canada with verified properties in Ghana",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+233201578429",
      contactType: "customer service",
      availableLanguage: "English",
    },
    sameAs: [
      "https://www.facebook.com/dwellot",
      "https://www.instagram.com/dwellot",
      "https://www.linkedin.com/company/dwellot",
      "https://twitter.com/dwellot",
    ],
    areaServed: {
      "@type": "Country",
      name: "Ghana",
    },
    foundingDate: "2024",
    knowsAbout: [
      "Ghana real estate",
      "Property investment",
      "Diaspora property buying",
      "Accra property market",
    ],
  }

  const searchActionSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Dwellot",
    url: "https://dwellot.com",
    description:
      "Ghana real estate marketplace — verified properties for diaspora buyers in UK, USA and Canada",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://dwellot.com/properties?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
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
        <GoogleAnalytics />
        <HotjarAnalytics />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
