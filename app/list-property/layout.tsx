import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "List Your Property for Free | Sell or Rent on Dwellot Ghana",
  description:
    "List your property for free on Dwellot. Reach thousands of buyers and renters across Ghana. Houses, apartments, land, commercial spaces. Submit in under 5 minutes.",
  alternates: { canonical: "https://dwellot.com/list-property" },
}

export default function ListPropertyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
