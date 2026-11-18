"use client"

import Script from "next/script"
import { Suspense, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

/**
 * Google Analytics 4.
 *
 * The measurement ID lives in NEXT_PUBLIC_GA_ID. If it is unset this renders
 * nothing, so previews and local development stay out of the property.
 *
 * lib/analytics.ts has had gtag event helpers all along, but without this
 * script window.gtag was never defined and every one of those events was a
 * no-op. Page views are sent here on each route change, because the App
 * Router does not reload the page between navigations.
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""

function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_ID || typeof window === "undefined" || typeof window.gtag !== "function") return
    const query = searchParams?.toString()
    window.gtag("event", "page_view", {
      page_path: query ? `${pathname}?${query}` : pathname,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [pathname, searchParams])

  return null
}

export default function GoogleAnalytics() {
  if (!GA_ID) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          // Route changes are reported by PageViewTracker instead.
          gtag('config', '${GA_ID}', { send_page_view: false });
          gtag('event', 'page_view', {
            page_path: window.location.pathname + window.location.search,
            page_location: window.location.href,
            page_title: document.title
          });
        `}
      </Script>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  )
}
