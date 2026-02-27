import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mortgage Calculator | Dwellot",
  description:
    "Calculate your monthly mortgage payments for properties in Ghana. Compare rates from GCB Bank, Absa, Stanbic, and more. Free mortgage calculator tool.",
  openGraph: {
    title: "Ghana Mortgage Calculator | Dwellot",
    description:
      "Estimate your monthly mortgage payments and compare rates from Ghana's leading banks.",
  },
}

export default function MortgageCalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
