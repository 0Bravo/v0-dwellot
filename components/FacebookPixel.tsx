"use client"

import { Suspense, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { initPixel, trackPageView, FB_PIXEL_ID } from "@/lib/facebook-pixel"

function FacebookPixelTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize pixel on mount
  useEffect(() => {
    if (!FB_PIXEL_ID) return
    initPixel()
    // Track initial page view
    trackPageView()
  }, [])

  // Track page views on route changes
  useEffect(() => {
    if (!FB_PIXEL_ID) return
    trackPageView()
  }, [pathname, searchParams])

  // No-script fallback for users with JS disabled
  if (!FB_PIXEL_ID) return null

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  )
}

export default function FacebookPixel() {
  return (
    <Suspense fallback={null}>
      <FacebookPixelTracker />
    </Suspense>
  )
}
