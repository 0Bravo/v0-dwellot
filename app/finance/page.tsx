import type { Metadata } from "next"
import Link from "next/link"
import { Activity, ArrowRight, Calculator, Home, Landmark, Wallet } from "lucide-react"
import { getGhanaReferenceRate } from "@/lib/mortgage/grr"
import { formatRateDate, resolveLenderRates } from "@/lib/mortgage/rates"

export const revalidate = 43200

export const metadata: Metadata = {
  title: "Property Finance in Ghana: Mortgages, Rates and Calculators",
  description:
    "How to pay for a home in Ghana from Ghana or abroad. Mortgage calculator, cedi and US dollar bank rates, the current Ghana Reference Rate and an affordability check.",
  alternates: { canonical: "https://dwellot.com/finance" },
  openGraph: {
    title: "Property Finance in Ghana | Dwellot",
    description: "Mortgage calculator, bank rates and the current Ghana Reference Rate, in one place.",
    url: "https://dwellot.com/finance",
  },
}

export default async function FinanceHubPage() {
  const grr = await getGhanaReferenceRate()
  const cheapestGhs = resolveLenderRates("GHS", grr.rate)[0]
  const cheapestUsd = resolveLenderRates("USD", grr.rate)[0]

  const tools = [
    {
      href: "/mortgage-calculator",
      icon: Calculator,
      title: "Mortgage calculator",
      text: "Monthly repayments on a cedi or US dollar mortgage, with rates from banks in Ghana.",
      cta: "Calculate repayments",
    },
    {
      href: "/mortgage-calculator#affordability",
      icon: Wallet,
      title: "How much can I borrow?",
      text: "Work backwards from your income and deposit to the property price you could afford.",
      cta: "Check affordability",
    },
    {
      href: "/finance/ghana-reference-rate",
      icon: Activity,
      title: "Ghana Reference Rate",
      text: `The benchmark behind cedi loan pricing, currently ${grr.rate}%, checked automatically.`,
      cta: "See the current rate",
    },
    {
      href: "/properties?listing_type=sale",
      icon: Home,
      title: "Homes for sale",
      text: "Browse houses, apartments and land across Ghana, with a calculator on every listing.",
      cta: "Browse properties",
    },
  ]

  const facts = [
    {
      label: "Ghana Reference Rate",
      value: `${grr.rate}%`,
      note: grr.effectiveDate ? `Effective ${formatRateDate(grr.effectiveDate)}` : "Current published rate",
    },
    cheapestGhs && {
      label: "Cedi mortgages from",
      value: `${cheapestGhs.rate}%`,
      note: `${cheapestGhs.name}, ${formatRateDate(cheapestGhs.asOf)}`,
    },
    cheapestUsd && {
      label: "US dollar mortgages from",
      value: `${cheapestUsd.rate}%`,
      note: `${cheapestUsd.name}, ${formatRateDate(cheapestUsd.asOf)}`,
    },
  ].filter(Boolean) as Array<{ label: string; value: string; note: string }>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-teal-700 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-full mb-4">
            <Landmark className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 text-balance">
            Paying for a home in Ghana
          </h1>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto">
            Mortgage rates, calculators and guides for buyers in Ghana and in the diaspora
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Key figures */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {facts.map((fact) => (
            <div key={fact.label} className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-600">{fact.label}</p>
              <p className="text-3xl font-bold text-teal-700 mt-1">{fact.value}</p>
              <p className="text-xs text-gray-500 mt-1">{fact.note}</p>
            </div>
          ))}
        </section>
        <p className="text-xs text-gray-500 -mt-6">
          Bank figures are indicative and exclude fees and insurance. See the calculator for how each figure is sourced.
        </p>

        {/* Tools */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map(({ href, icon: Icon, title, text, cta }) => (
              <Link
                key={href}
                href={href}
                className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-teal-300 hover:shadow-sm transition"
              >
                <Icon className="w-6 h-6 text-teal-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-600 mb-3">{text}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 group-hover:gap-2 transition-all">
                  {cta}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Cedi vs dollar */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cedi or US dollar mortgage?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Ghana cedi mortgage</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>Repayments match a cedi salary, so there is no exchange-rate risk for residents.</li>
                <li>Rates are higher, and usually priced as the Ghana Reference Rate plus the bank&apos;s margin.</li>
                <li>Variable rates can fall when the reference rate falls.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">US dollar mortgage</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>Rates are much lower than cedi rates.</li>
                <li>Suits buyers who earn in dollars, pounds or euros, including the diaspora.</li>
                <li>If you earn in cedis, a weaker cedi makes every repayment more expensive.</li>
              </ul>
            </div>
          </div>
        </section>

        <p className="text-xs text-gray-500">
          Dwellot is a property marketplace, not a lender or financial adviser. Nothing on this page is an offer of
          credit or financial advice. Confirm rates and terms with the lender before you commit.
        </p>
      </div>
    </div>
  )
}
