// ── GA4 Conversion Event Tracking ──────────────────────────────────
// All events fire via window.gtag and silently no-op when GA is absent.
// Mark inquiry_sent, phone_revealed, whatsapp_click, schedule_visit as
// Conversions in GA4 → Admin → Events → Mark as conversion.

// ── Core helper ────────────────────────────────────────────────────
export function trackGA4Event(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params)
  }
}

// ── Property context (shared across events) ────────────────────────
interface PropertyContext {
  property_id: string | number
  property_type?: string
  listing_type?: string
  location?: string
  price?: number
  currency?: string
}

// ── Conversion events ──────────────────────────────────────────────

/** User submits an enquiry form (Send Message) */
export function trackInquirySent(ctx: PropertyContext) {
  trackGA4Event("inquiry_sent", {
    ...ctx,
    inquiry_method: "form",
  })
}

/** User clicks Call Now / reveals phone number */
export function trackPhoneRevealed(ctx: PropertyContext & { agent_name?: string }) {
  trackGA4Event("phone_revealed", ctx)
}

/** User clicks the WhatsApp CTA */
export function trackWhatsAppClick(ctx: PropertyContext & { agent_name?: string }) {
  trackGA4Event("whatsapp_click", ctx)
}

/** User clicks Schedule Visit */
export function trackScheduleVisit(ctx: PropertyContext) {
  trackGA4Event("schedule_visit", ctx)
}

/** Property detail page viewed */
export function trackPropertyView(ctx: PropertyContext & { bedrooms?: number }) {
  trackGA4Event("property_view", ctx)
}

/** User performs a search or applies filters */
export function trackSearchPerformed(params: {
  search_query?: string
  filters_applied?: string
  results_count?: number
}) {
  trackGA4Event("search_performed", params)
}

// ── Legacy analytics object (preserves existing call-sites) ────────
export const analytics = {
  trackPropertyView: (propertyId: string, propertyTitle: string) => {
    trackGA4Event("view_item", {
      event_category: "Property",
      event_label: propertyTitle,
      value: propertyId,
    })
  },

  trackInquiry: (propertyId: string, propertyTitle: string, inquiryType: string) => {
    trackGA4Event("generate_lead", {
      event_category: "Inquiry",
      event_label: `${inquiryType} - ${propertyTitle}`,
      value: propertyId,
    })
  },

  trackFavorite: (propertyId: string, action: "add" | "remove") => {
    trackGA4Event(action === "add" ? "add_to_wishlist" : "remove_from_wishlist", {
      event_category: "Engagement",
      event_label: propertyId,
    })
  },

  trackShare: (propertyId: string, method: string) => {
    trackGA4Event("share", {
      event_category: "Social",
      event_label: propertyId,
      method,
    })
  },

  trackSearch: (searchTerm: string, filters: Record<string, unknown>) => {
    trackGA4Event("search", {
      search_term: searchTerm,
      filters: JSON.stringify(filters),
    })
  },

  trackPageView: (url: string, title: string) => {
    trackGA4Event("page_view", {
      page_title: title,
      page_location: url,
      page_path: new URL(url).pathname,
    })
  },

  trackAgentContact: (agentId: string, contactMethod: string) => {
    trackGA4Event("contact", {
      event_category: "Agent",
      event_label: agentId,
      method: contactMethod,
    })
  },
}

// ── TypeScript declarations ────────────────────────────────────────
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}
