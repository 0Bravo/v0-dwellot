// ── Meta Pixel (Facebook/Instagram) ────────────────────────────────
// Pixel ID: 2273764416366824

const PIXEL_ID = "2273764416366824"

/** True when the pixel SDK is loaded */
function isReady(): boolean {
  return typeof window !== "undefined" && typeof window.fbq === "function"
}

/** Standard PageView event -- fired on every route change */
export function pageview() {
  if (!isReady()) return
  window.fbq("track", "PageView")
}

/** Fire a standard or custom Meta Pixel event */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (!isReady()) return
  window.fbq("track", eventName, params)
}

// ── Pre-built conversion helpers ───────────────────────────────────

/** Enquiry form submitted -- maps to Meta "Lead" */
export function trackLead(propertyTitle: string, value = 1, currency = "GBP") {
  trackEvent("Lead", {
    content_name: propertyTitle,
    content_category: "Property Enquiry",
    value,
    currency,
  })
}

/** WhatsApp CTA clicked -- maps to Meta "Contact" */
export function trackContact(propertyTitle: string) {
  trackEvent("Contact", {
    content_name: propertyTitle,
  })
}

/** Property detail page viewed -- maps to Meta "ViewContent" */
export function trackViewContent(propertyTitle: string, propertyType?: string) {
  trackEvent("ViewContent", {
    content_name: propertyTitle,
    content_type: propertyType || "property",
  })
}

// ── TypeScript declarations ────────────────────────────────────────
declare global {
  interface Window {
    fbq: (...args: unknown[]) => void
    _fbq: (...args: unknown[]) => void
  }
}
