import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ghana Mortgage Calculator: Cedi and US Dollar Home Loans",
  alternates: { canonical: "https://dwellot.com/mortgage-calculator" },
  description:
    "Calculate monthly mortgage payments for properties in Ghana in cedis or US dollars. Compare rates from Republic Bank, Absa, Stanbic and more, with the current Ghana Reference Rate.",
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
