import type { Metadata } from "next"
import Link from "next/link"
import { Activity, ArrowRight, Calculator, Home, Landmark, Receipt, Scale, Wallet } from "lucide-react"
import { FinanceHero } from "@/components/finance/surfaces"
import FinanceConcierge from "@/components/finance/FinanceConcierge"
import { AnimatedNumber, Reveal, Stagger, StaggerItem } from "@/components/finance/motion"
import { getGhanaReferenceRate } from "@/lib/mortgage/grr"
import { getCediRates } from "@/lib/mortgage/fx"
import { formatRateDate, resolveLenderRates } from "@/lib/mortgage/rates"

export const revalidate = 43200

export const metadata: Metadata = {
  title: "Property Finance in Ghana: Mortgages, Costs and Calculators",
  description:
    "How to pay for a home in Ghana from Ghana or abroad. Compare every mortgage lender, work out what you can afford, and see every fee and tax on top of the price — on live Ghana Reference Rate and Bank of Ghana figures.",
  alternates: { canonical: "https://dwellot.com/finance" },
  openGraph: {
    title: "Property Finance in Ghana | Dwellot",
    description:
      "Compare lenders, check affordability and budget the full cost of buying, on live official rates.",
    url: "https://dwellot.com/finance",
  },
}

export default async function FinanceHubPage() {
  const [grr, fx] = await Promise.all([getGhanaReferenceRate(), getCediRates()])
  const cheapestGhs = resolveLenderRates("GHS", grr.rate)[0]
  const cheapestUsd = resolveLenderRates("USD", grr.rate)[0]

  // Grouped by where the buyer actually is, not by what kind of page it is.
  const stages = [
    {
      step: "1",
      title: "Work out what you can afford",
      blurb: "Start from your income and savings, before you fall in love with a listing.",
      tools: [
        {
          href: "/mortgage-calculator#affordability",
          icon: Wallet,
          title: "How much can I borrow?",
          text: "Work backwards from your income, debts and deposit to a property price.",
          cta: "Check affordability",
        },
        {
          href: "/finance/mortgage-salary-requirements",
          icon: Wallet,
          title: "What salary do you need?",
          text: "The net monthly income banks expect at each price, at current cedi rates.",
          cta: "See the figures",
        },
      ],
    },
    {
      step: "2",
      title: "Choose how to borrow",
      blurb: "Rates differ by more than you would expect, and the currency you borrow in matters even more.",
      tools: [
        {
          href: "/finance/compare-mortgage-rates",
          icon: Scale,
          title: "Compare every lender",
          text: "Rank all the lenders we can source on your price, deposit and term, side by side.",
          cta: "Compare lenders",
        },
        {
          href: "/mortgage-calculator",
          icon: Calculator,
          title: "Mortgage calculator",
          text: "Monthly repayments on a cedi or US dollar mortgage, in detail.",
          cta: "Calculate repayments",
        },
        {
          href: "/finance/cedi-or-dollar-mortgage",
          icon: Landmark,
          title: "Cedi or US dollar?",
          text: "What each costs per unit borrowed, and the exchange-rate risk that decides it.",
          cta: "Compare the two",
        },
        {
          href: "/finance/ghana-reference-rate",
          icon: Activity,
          title: "Ghana Reference Rate",
          text: `The benchmark behind cedi loan pricing, currently ${grr.rate}%, checked automatically.`,
          cta: "See the current rate",
        },
      ],
    },
    {
      step: "3",
      title: "Budget the whole purchase",
      blurb: "The price is not the cost. Stamp duty, registration, legal and lender fees all land on top.",
      tools: [
        {
          href: "/finance/cost-of-buying",
          icon: Receipt,
          title: "The real cost of buying",
          text: "Every fee and tax on top of the price, in cedis, dollars or pounds.",
          cta: "Add up the costs",
        },
        {
          href: "/properties?listing_type=sale",
          icon: Home,
          title: "Homes for sale",
          text: "Browse houses, apartments and land across Ghana, with a calculator on every listing.",
          cta: "Browse properties",
        },
      ],
    },
  ]

  // Decimals follow the figure: 8.4% should not render as 8.40%.
  const dp = (v: number) => (Number.isInteger(v) ? 0 : Number.isInteger(v * 10) ? 1 : 2)

  const facts = [
    {
      label: "Ghana Reference Rate",
      value: grr.rate,
      decimals: dp(grr.rate),
      suffix: "%",
      note: grr.effectiveDate ? `Effective ${formatRateDate(grr.effectiveDate)}` : "Current published rate",
    },
    cheapestGhs && {
      label: "Cedi mortgages from",
      value: cheapestGhs.rate,
      decimals: dp(cheapestGhs.rate),
      suffix: "%",
      note: `${cheapestGhs.name}, ${formatRateDate(cheapestGhs.asOf)}`,
    },
    cheapestUsd && {
      label: "US dollar mortgages from",
      value: cheapestUsd.rate,
      decimals: dp(cheapestUsd.rate),
      suffix: "%",
      note: `${cheapestUsd.name}, ${formatRateDate(cheapestUsd.asOf)}`,
    },
    {
      label: "Cedi to the US dollar",
      value: fx.usdGhs,
      decimals: 2,
      suffix: "",
      note: `${fx.source}${fx.asOf ? `, ${formatRateDate(fx.asOf)}` : ""}`,
    },
  ].filter(Boolean) as Array<{ label: string; value: number; decimals: number; suffix: string; note: string }>

  return (
    <div className="min-h-screen bg-gray-50">
      <FinanceHero
        icon={Landmark}
        title="Paying for a home in Ghana"
        subtitle="Work out what you can afford, compare every lender, and see the full cost before you commit"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Guided entry */}
        <FinanceConcierge grrRate={grr.rate} usdGhs={fx.usdGhs} gbpGhs={fx.gbpGhs} />

        {/* Live figures */}
        <section>
          <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {facts.map((fact) => (
              <StaggerItem key={fact.label}>
                <div className="h-full bg-white rounded-xl border border-gray-200 p-5 transition hover:border-teal-300 hover:shadow-sm">
                  <p className="text-sm text-gray-600">{fact.label}</p>
                  <p className="text-2xl md:text-3xl font-bold text-teal-700 mt-1">
                    <AnimatedNumber value={fact.value} decimals={fact.decimals} suffix={fact.suffix} />
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{fact.note}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="text-xs text-gray-500 mt-3">
            The reference rate is read automatically from {grr.source}, and the exchange rate from{" "}
            {fx.source}. Bank mortgage figures are indicative and exclude fees and insurance; each one shows
            its source on the comparison.
          </p>
        </section>

        {/* Journey */}
        {stages.map((stage) => (
          <Reveal key={stage.step}>
            <section>
            <div className="flex items-start gap-3 mb-4">
              <span className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-teal-700 text-white text-sm font-bold">
                {stage.step}
              </span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{stage.title}</h2>
                <p className="text-sm text-gray-600 mt-0.5">{stage.blurb}</p>
              </div>
            </div>
            <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stage.tools.map(({ href, icon: Icon, title, text, cta }) => (
                <StaggerItem key={href} className="h-full">
                <Link
                  href={href}
                  className="group flex h-full flex-col bg-white rounded-xl border border-gray-200 p-6 hover:border-teal-300 hover:shadow-sm hover:-translate-y-0.5 transition"
                >
                  <Icon className="w-6 h-6 text-teal-600 mb-3" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{text}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 group-hover:gap-2 transition-all">
                    {cta}
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                </Link>
                </StaggerItem>
              ))}
            </Stagger>
            </section>
          </Reveal>
        ))}

        {/* Diaspora note */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Buying from abroad</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What works in your favour</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>
                  US dollar mortgages are priced far below cedi ones, from{" "}
                  {cheapestUsd ? `${cheapestUsd.rate}%` : "around 10.5%"}, and several banks run products
                  aimed at the diaspora.
                </li>
                <li>Earning in a harder currency means a cedi-priced purchase gets cheaper if the cedi slips.</li>
                <li>Foreign buyers pay the same stamp duty as Ghanaians. There is no non-citizen surcharge.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What to watch</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>Deposits are usually larger for non-residents, commonly 20% to 30%.</li>
                <li>
                  Stamp duty and Lands Commission fees are set in cedis, so the amount you send moves with the
                  exchange rate.
                </li>
                <li>
                  Registering your interest is what makes you the owner, not paying the seller. Budget for it
                  up front.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <p className="text-xs text-gray-500">
          Dwellot is a property marketplace, not a lender, law firm or financial adviser. Nothing on this page
          is an offer of credit, tax advice or financial advice. Confirm rates, fees and terms with the lender
          and your own lawyer before you commit.
        </p>
      </div>
    </div>
  )
}
