export type EnquiryType = "whatsapp" | "phone_call" | "email" | "contact_form" | "schedule_viewing"

interface TrackEnquiryParams {
  property_id: number
  enquiry_type: EnquiryType
  source_page: string
  visitor_name?: string
  visitor_email?: string
  visitor_phone?: string
}

/**
 * Fire-and-forget enquiry tracker.
 * Sends a POST to /api/track-enquiry — never blocks the UI or throws.
 */
export function trackEnquiry(params: TrackEnquiryParams): void {
  fetch("/api/track-enquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  }).catch(() => {
    // Silently fail — tracking should never break the user experience
  })
}
