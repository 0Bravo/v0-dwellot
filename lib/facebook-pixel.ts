// Facebook Pixel tracking utility
// Docs: https://developers.facebook.com/docs/meta-pixel/reference

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void
    _fbq: unknown
  }
}

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID

// Check if FB Pixel is available
export const isPixelLoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.fbq === 'function'
}

// Initialize FB Pixel (called once on app load)
export const initPixel = (): void => {
  if (!FB_PIXEL_ID || typeof window === 'undefined') return
  
  // Prevent double initialization
  if (window.fbq) return

  // FB Pixel base code
  const n = (window.fbq = function (...args: unknown[]) {
    if ((n as { callMethod?: (...a: unknown[]) => void }).callMethod) {
      (n as { callMethod: (...a: unknown[]) => void }).callMethod(...args)
    } else {
      (n as { queue: unknown[] }).queue.push(args)
    }
  }) as typeof window.fbq & { push: (...a: unknown[]) => void; loaded: boolean; version: string; queue: unknown[] }
  
  if (!window._fbq) window._fbq = n
  n.push = n
  n.loaded = true
  n.version = '2.0'
  n.queue = []

  // Load the Pixel script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://connect.facebook.net/en_US/fbevents.js`
  document.head.appendChild(script)

  // Initialize the pixel
  window.fbq('init', FB_PIXEL_ID)
}

// PageView - fires on every page load (tracked automatically via FacebookPixel component)
export const trackPageView = (): void => {
  if (!isPixelLoaded()) return
  window.fbq('track', 'PageView')
}

// ViewContent - fires when a property/listing is viewed
export const trackViewContent = (params: {
  content_name: string // Property title
  content_ids: string[] // Property ID(s)
  content_type: string // 'property'
  value?: number // Property price
  currency?: string // 'USD'
}): void => {
  if (!isPixelLoaded()) return
  window.fbq('track', 'ViewContent', {
    content_name: params.content_name,
    content_ids: params.content_ids,
    content_type: params.content_type,
    value: params.value,
    currency: params.currency || 'USD',
  })
}

// Contact - fires when WhatsApp/phone button is clicked
export const trackContact = (params?: {
  content_name?: string // Property title (optional)
  content_category?: string // 'whatsapp' | 'phone' | 'email'
}): void => {
  if (!isPixelLoaded()) return
  window.fbq('track', 'Contact', params || {})
}

// Lead - fires on enquiry form submission
export const trackLead = (params?: {
  content_name?: string // Property title
  content_category?: string // 'enquiry_form' | 'contact_form'
  value?: number // Property price (optional)
  currency?: string
}): void => {
  if (!isPixelLoaded()) return
  window.fbq('track', 'Lead', {
    ...params,
    currency: params?.currency || 'USD',
  })
}

// Search - fires when search/filter is used
export const trackSearch = (params: {
  search_string?: string // Search query
  content_category?: string // Filter type
  content_ids?: string[] // Property type, location, etc.
}): void => {
  if (!isPixelLoaded()) return
  window.fbq('track', 'Search', params)
}

// Custom event tracking (for any other events)
export const trackCustomEvent = (eventName: string, params?: Record<string, unknown>): void => {
  if (!isPixelLoaded()) return
  window.fbq('trackCustom', eventName, params)
}
