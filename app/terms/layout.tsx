import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Dwellot Ghana Property Marketplace",
  description: "Dwellot's terms of service. Rules for using our property listing platform, user responsibilities, and legal terms for property transactions in Ghana.",
  alternates: { canonical: "https://dwellot.com/terms" },
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
