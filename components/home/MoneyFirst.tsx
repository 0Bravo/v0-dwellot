import Link from "next/link"
import { ArrowRight, Calculator, Receipt, Scale } from "lucide-react"

/**
 * The money question, placed above the listings.
 *
 * Buying from abroad starts with what it costs, not with which house. The
 * listings stay where they are, further down: this section moves the front
 * door, it does not close the old one.
 *
 * Figures come from the index so the homepage cannot drift away from the
 * page people are asked to cite.
 */

export interface MoneySnapshot {
  policyRate: number
  policyChangeBp: number
  grr: number
  usdGhs: number
  editionLabel: string
  feesPctOfPrice: number
}

const STEPS = [
  {
    href: "/finance",
    icon: Calculator,
    step: "First",
    title: "What you can afford",
    body: "Income, savings and existing repayments against what lenders here will actually advance.",
  },
  {
    href: "/finance/cost-of-buying",
    icon: Receipt,
    step: "Then",
    title: "What it really costs",
    body: "Stamp duty, Lands Commission charges, legal and lender fees — the part that catches people out.",
  },
  {
    href: "/finance/compare-mortgage-rates",
    icon: Scale,
    step: "And",
    title: "Which lender is cheapest",
    body: "Every lender we can source, in cedis or dollars, ranked over the same term.",
  },
]

export function MoneyFirst({ snapshot }: { snapshot: MoneySnapshot | null }) {
  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Start with the money, not the house
          </h2>
          <p className="mt-3 text-gray-600 leading-relaxed">
            Most people buying from abroad work out the financing last, and find the fees after they
            have committed. We publish the numbers first{snapshot ? `, and keep them current` : ""}.
          </p>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {STEPS.map(({ href, icon: Icon, step, title, body }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-2xl ring-1 ring-gray-200 hover:ring-teal-300 bg-white p-6 transition"
            >
              <div className="flex items-center gap-2 text-teal-700">
                <Icon className="w-5 h-5" aria-hidden="true" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">{step}</span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-gray-900">{title}</h3>
              <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{body}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-700">
                Open
                <ArrowRight
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>

        {snapshot && (
          <Link
            href="/ghana-property-finance-index"
            className="mt-6 block rounded-2xl bg-teal-900 text-white p-6 hover:bg-teal-800 transition"
          >
            <div className="flex flex-wrap items-center gap-x-10 gap-y-4 justify-between">
              <Figure label="Policy rate" value={`${snapshot.policyRate}%`} foot={`${snapshot.policyChangeBp}bp this month`} />
              <Figure label="Ghana Reference Rate" value={`${snapshot.grr}%`} />
              <Figure label="US dollar" value={`₵${snapshot.usdGhs.toFixed(2)}`} />
              <Figure
                label="Fees on a purchase"
                value={`${snapshot.feesPctOfPrice}%`}
                foot="on top of the price"
              />
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal-100">
                {snapshot.editionLabel} index
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </span>
            </div>
          </Link>
        )}
      </div>
    </section>
  )
}

function Figure({ label, value, foot }: { label: string; value: string; foot?: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-200/80">{label}</p>
      <p className="mt-0.5 text-2xl font-bold tabular-nums">{value}</p>
      {foot && <p className="text-xs text-teal-100/70">{foot}</p>}
    </div>
  )
}
