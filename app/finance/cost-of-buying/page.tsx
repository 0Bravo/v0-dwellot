import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Receipt } from "lucide-react"
import { PageHero } from "@/components/ui/PageHero"
import { getCediRates } from "@/lib/mortgage/fx"
import { formatRateDate } from "@/lib/mortgage/rates"
import {
  COSTS_REVIEWED,
  DEFAULT_COSTS_INPUT,
  calculateBuyingCosts,
} from "@/lib/finance/buying-costs"
import CostOfBuyingClient from "./CostOfBuyingClient"

// Re-check the exchange rate at most every 12 hours
export const revalidate = 43200

const PAGE_URL = "https://dwellot.com/finance/cost-of-buying"

const ghs = (v: number) => `GH₵${Math.round(v).toLocaleString("en-GB")}`

export const metadata: Metadata = {
  title: "The Real Cost of Buying Property in Ghana: Every Fee and Tax",
  description:
    "Stamp duty, Lands Commission registration, legal fees, valuation, lender fees and insurance — what you pay on top of the price in Ghana, worked out on your own numbers in cedis, dollars or pounds.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "The Real Cost of Buying Property in Ghana",
    description: "Every fee and tax on top of the price, calculated on your own numbers.",
    url: PAGE_URL,
  },
}

export default async function CostOfBuyingPage() {
  const fx = await getCediRates()

  // Worked example in the static copy, so the page says something concrete
  // before any JavaScript runs.
  const example = calculateBuyingCosts({
    ...DEFAULT_COSTS_INPUT,
    priceGhs: 1_000_000,
    depositGhs: 200_000,
  })
  const cashExample = calculateBuyingCosts({
    ...DEFAULT_COSTS_INPUT,
    priceGhs: 1_000_000,
    depositGhs: 0,
    usingMortgage: false,
  })

  const faqs = [
    {
      q: "How much are closing costs when buying property in Ghana?",
      a:
        `On a GH₵1,000,000 home bought with a mortgage and a 20% deposit, the fees, taxes and first-year ` +
        `insurance come to about ${ghs(example.feesTotal)}, or ${example.feesPctOfPrice}% of the price, so you ` +
        `need roughly ${ghs(example.cashNeeded)} in cash to complete. Paying cash instead, the extras are ` +
        `about ${ghs(cashExample.feesTotal)} because the lender's fees fall away. Legal fees are the largest ` +
        `single item and the most negotiable.`,
    },
    {
      q: "What is stamp duty on property in Ghana?",
      a:
        "Under the conveyance schedule of the Stamp Duty Act 2005 (Act 689), duty is 0.25% of the " +
        "consideration up to GH₵10,000, 0.5% from GH₵10,000 to GH₵50,000, and 1% above " +
        "GH₵50,000. Nearly every residential purchase falls in the 1% band. Foreign buyers pay the same " +
        "rate as Ghanaians; there is no surcharge for being a non-citizen.",
    },
    {
      q: "What does the Lands Commission charge to register a property?",
      a:
        "Registration is charged per acre or part of an acre, so an ordinary residential plot counts as one " +
        "unit. First registration of unregistered land costs more than transferring a title that is already " +
        "registered. An official search before you commit is a modest separate fee. The Commission issues a " +
        "fee assessment for each application, so confirm the figure for yours.",
    },
    {
      q: "How much are legal fees for buying property in Ghana?",
      a:
        "Commonly 1% to 6% of the price, with 2% to 3% usual for a straightforward residential purchase and a " +
        "negotiated flat fee on high-value deals. No fixed schedule binds it, which is why it is the one cost " +
        "on this page worth shopping around on. Get the quote in writing before you instruct anyone.",
    },
    {
      q: "Do I pay these costs in cedis if I live abroad?",
      a:
        "Yes. Stamp duty and the Lands Commission fees are set in cedis, and legal fees are normally quoted in " +
        "cedis too, so the amount you send from abroad moves with the exchange rate. This page converts at the " +
        "Bank of Ghana interbank mid rate so you can see the figure in dollars or pounds, but the liability " +
        "itself stays in cedis.",
    },
    {
      q: "Is registration really necessary after I have paid?",
      a:
        "Yes. Signing an agreement and paying the seller does not make you the legal owner in Ghana — " +
        "registering your interest at the Lands Commission is what does, under the Land Act 2020 (Act 1036). " +
        "Budgeting for it as an afterthought is how buyers end up paying for a property they cannot prove they " +
        "own.",
    },
  ]

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <PageHero
        icon={Receipt}
        title="What buying a home in Ghana really costs"
        subtitle="Every fee and tax on top of the price — stamp duty, registration, legal, lender and insurance"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">The short answer</h2>
          <p className="text-gray-700 text-sm mb-4">
            Budget roughly <strong>3% to 5% of the price</strong> on top of the price itself. On a
            GH₵1,000,000 home with a mortgage and a 20% deposit, that is about{" "}
            <strong>{ghs(example.feesTotal)}</strong> in fees, taxes and first-year insurance — so you need
            around <strong>{ghs(example.cashNeeded)}</strong> in cash to complete, not the{" "}
            {ghs(200_000)} deposit on its own. Paying cash, the extras come to about{" "}
            <strong>{ghs(cashExample.feesTotal)}</strong>.
          </p>
          <p className="text-gray-700 text-sm">
            The split matters more than the total. {ghs(example.statutoryTotal)} of it is statutory — stamp
            duty and Lands Commission fees you cannot negotiate. The rest is professional and lender fees,
            where the quotes vary and you can push back. Figures reviewed {formatRateDate(COSTS_REVIEWED)}.
          </p>
        </section>

        <CostOfBuyingClient
          usdGhs={fx.usdGhs}
          gbpGhs={fx.gbpGhs}
          fxAsOf={formatRateDate(fx.asOf)}
          fxSource={fx.source}
          fxLive={fx.live}
        />

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Common questions</h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="bg-white rounded-xl border border-gray-200 p-5">
                <summary className="font-semibold text-gray-900 cursor-pointer">{f.q}</summary>
                <p className="text-sm text-gray-700 mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NextLink
            href="/finance/compare-mortgage-rates"
            title="Compare lenders"
            body="Rank every mortgage lender in Ghana on your price, deposit and term."
          />
          <NextLink
            href="/mortgage-calculator"
            title="Mortgage calculator"
            body="Monthly repayments and what you can afford to borrow."
          />
          <NextLink
            href="/properties?listing_type=sale"
            title="Homes for sale"
            body="Browse houses, apartments and land across Ghana."
          />
        </section>

        <p className="text-xs text-gray-500">
          Dwellot is a property marketplace, not a lender, law firm, tax adviser or financial adviser. The
          figures here are estimates to help you budget, not a quote, a tax assessment or legal advice.
          Statutory rates are taken from the Stamp Duty Act 2005 (Act 689) and published Lands Commission
          fees; confirm your own position with your lawyer and the relevant authority.
        </p>
      </div>
    </div>
  )
}

function NextLink({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-teal-300 hover:shadow-sm transition"
    >
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600 mb-3">{body}</p>
      <span className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 group-hover:gap-2 transition-all">
        Open
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </span>
    </Link>
  )
}
