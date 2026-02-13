import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Properties for Rent in Ghana | Apartments & Houses to Rent | Dwellot",
  description: "Find apartments, houses, and commercial spaces for rent in Accra, Kumasi, and across Ghana. Verified listings with photos, prices, and direct agent contact.",
  alternates: { canonical: "https://dwellot.com/rent" },
}

export default function RentLayout({ children }: { children: React.ReactNode }) {
  return children
}
