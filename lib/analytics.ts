// Analytics utility for tracking events
export const analytics = {
  // Track property view
  trackPropertyView: (propertyId: string, propertyTitle: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "view_item", {
        event_category: "Property",
        event_label: propertyTitle,
        value: propertyId,
      })
    }
  },

  // Track property inquiry
  trackInquiry: (propertyId: string, propertyTitle: string, inquiryType: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "generate_lead", {
        event_category: "Inquiry",
        event_label: `${inquiryType} - ${propertyTitle}`,
        value: propertyId,
      })
    }
  },

  // Track property favorite
  trackFavorite: (propertyId: string, action: "add" | "remove") => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", action === "add" ? "add_to_wishlist" : "remove_from_wishlist", {
        event_category: "Engagement",
        event_label: propertyId,
      })
    }
  },

  // Track property share
  trackShare: (propertyId: string, method: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "share", {
        event_category: "Social",
        event_label: propertyId,
        method: method,
      })
    }
  },

  // Track search
  trackSearch: (searchTerm: string, filters: Record<string, any>) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "search", {
        search_term: searchTerm,
        filters: JSON.stringify(filters),
      })
    }
  },

  // Track page view
  trackPageView: (url: string, title: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "page_view", {
        page_title: title,
        page_location: url,
        page_path: new URL(url).pathname,
      })
    }
  },

  // Track agent contact
  trackAgentContact: (agentId: string, contactMethod: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "contact", {
        event_category: "Agent",
        event_label: agentId,
        method: contactMethod,
      })
    }
  },
}

// Type declaration for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}
