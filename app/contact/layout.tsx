import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Dwellot | Ghana & UK Property Support | Get in Touch",
  description: "Contact Dwellot for property enquiries. Ghana office: Accra. UK office: London. Phone, email, WhatsApp support available. We respond within 24 hours.",
  alternates: { canonical: "https://dwellot.com/contact" },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
