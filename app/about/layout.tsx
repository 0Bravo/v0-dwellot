import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Dwellot | Ghana's Modern Property Marketplace",
  description: "Dwellot connects property buyers, sellers, and renters across Ghana with verified listings and trusted agents. Learn about our mission, values, and team.",
  alternates: { canonical: "https://dwellot.com/about" },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
