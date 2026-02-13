import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sell Your Property in Ghana | List on Dwellot | Free Property Listing",
  description: "Sell your property fast on Ghana's modern property marketplace. Free listings, wide buyer network, professional support. List your house, apartment, or land today.",
  alternates: { canonical: "https://dwellot.com/sell" },
}

export default function SellLayout({ children }: { children: React.ReactNode }) {
  return children
}
