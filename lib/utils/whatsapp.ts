const DEFAULT_DWELLOT_NUMBER = "233201578429"

function formatPhone(phone: string): string {
  return phone.replace(/[\s\-()]/g, "").replace(/^0/, "233")
}

export function generateWhatsAppUrl(
  property: {
    id: number | string
    title: string
    location: string
    price: number
    bedrooms?: number
    bathrooms?: number
    area?: number
    phone?: string
    agent_phone?: string
  },
  detailed: boolean = false
): string {
  const phone = property.agent_phone || property.phone
  const number = phone ? formatPhone(phone) : DEFAULT_DWELLOT_NUMBER

  const priceFormatted = `USD $${property.price?.toLocaleString() ?? "0"}`
  const propertyUrl = `https://dwellot.com/properties/${property.id}`

  let message: string

  if (detailed) {
    const parts = [
      `Hi Dwellot, I'm interested in this property:`,
      ``,
      `\u{1F3E0} ${property.title}`,
      `\u{1F4CD} ${property.location}`,
      `\u{1F4B0} ${priceFormatted}`,
    ]
    if (property.bedrooms != null || property.bathrooms != null) {
      const beds = property.bedrooms != null ? `\u{1F6CF}\uFE0F ${property.bedrooms} beds` : ""
      const baths = property.bathrooms != null ? `\u{1F6BF} ${property.bathrooms} baths` : ""
      parts.push([beds, baths].filter(Boolean).join(" | "))
    }
    if (property.area) {
      parts.push(`\u{1F4D0} ${property.area.toLocaleString()} sqft`)
    }
    parts.push(`\u{1F517} ${propertyUrl}`)
    parts.push(``)
    parts.push(`I'd like to arrange a viewing. Please contact me.`)
    message = parts.join("\n")
  } else {
    message = [
      `Hi Dwellot, I'm interested in this property:`,
      ``,
      `\u{1F3E0} ${property.title}`,
      `\u{1F4CD} ${property.location}`,
      `\u{1F4B0} ${priceFormatted}`,
      `\u{1F517} ${propertyUrl}`,
      ``,
      `Please send me more details.`,
    ].join("\n")
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function generateGeneralWhatsAppUrl(
  message: string = "Hi Dwellot! I'm looking for a property in Ghana. Can you help me find the right one?"
): string {
  return `https://wa.me/${DEFAULT_DWELLOT_NUMBER}?text=${encodeURIComponent(message)}`
}
