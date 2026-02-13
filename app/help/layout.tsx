import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Help Centre | Dwellot Property Support & FAQs",
  description: "Get help with buying, selling, or renting property on Dwellot. Live chat, phone support, email assistance. Common questions answered.",
  alternates: { canonical: "https://dwellot.com/help" },
}

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return children
}
