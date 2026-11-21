import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Landmark, ShieldCheck } from "lucide-react"
import { PageHero } from "@/components/ui/PageHero"
import { getGhanaReferenceRate } from "@/lib/mortgage/grr"
import { RATES_REVIEWED, formatRateDate, resolveLenderRates } from "@/lib/mortgage/rates"
import { formatMoney } from "@/lib/mortgage/calc"
import { compareLenders } from "@/lib/mortgage/compare"
import CompareClient from "./CompareClient"

// Re-check the reference rate at most every 12 hours
export const revalidate = 43200

const PAGE_URL = "https://dwellot.com/finance/compare-mortgage-rates"

export async function generateMetadata(): Promise<Metadata> {
  const grr = await getGhanaReferenceRate()
  const cedi = resolveLenderRates("GHS", grr.rate)
  const usd = resolveLenderRates("USD", grr.rate)
  const lowestCedi = cedi[0]
  const lowestUsd = usd[0]

  const title = "Compare Mortgage Rates in Ghana: All Lenders Side by Side"
  const description =
    `Compare every mortgage lender in Ghana on your own numbers. Cedi rates from ${lowestCedi?.display ?? "8.4%"}` +
    `${lowestUsd ? ` and US dollar rates from ${lowestUsd.display}` : ""}, ` +
    `with monthly payments, total cost and deposit requirements. Reviewed ${formatRateDate(RATES_REVIEWED)}.`

  return {
    title,
    description,
    alternates: { canonical: PAGE_URL },
    openGraph: { title, description, url: PAGE_URL },
  }
}

export default async function CompareMortgageRatesPage() {
  const grr = await getGhanaReferenceRate()

  const cediLenders = resolveLenderRates("GHS", grr.rate)
  const usdLenders = resolveLenderRates("USD", grr.rate)

  // A worked example for the static copy, so the page says something concrete
  // to a reader (and to a crawler) before any JavaScript runs.
  const example = compareLenders({
    currency: "GHS",
    propertyPrice: 1_000_000,
    deposit: 200_000,
    termYears: 15,
    grrRate: grr.rate,
  })
  const cheapest = example.cheapest
  const dearest = example.dearest

  const faqs = [
    {
      q: "Which bank has the lowest mortgage rate in Ghana?",
      a:
        cediLenders[0] && cheapest
          ? `On cedi mortgages the lowest rate in our table is ${cediLenders[0].name} at ${cediLenders[0].display}, ` +
            `against a highest of ${cediLenders[cediLenders.length - 1].display}. On a ` +
            `GH₵ 1,000,000 home with a 20% deposit over 15 years, that difference is about ` +
            `${formatMoney(example.spread, "GHS")} in total cost. The lowest rate is not automatically the ` +
            `cheapest option for you, because lenders differ on maximum term, deposit and fees.`
          : "Rates vary by lender, deposit and term. Use the comparison above to rank them on your own numbers.",
    },
    {
      q: "Are US dollar mortgages cheaper than cedi mortgages in Ghana?",
      a: usdLenders[0]
        ? `The headline rate is much lower: US dollar mortgages in our table start at ${usdLenders[0].display} ` +
          `against ${cediLenders[0]?.display ?? "around 8-18%"} in cedis. That only works in your favour if you ` +
          `earn in dollars, pounds or euros. If you earn in cedis, every fall in the cedi makes a dollar ` +
          `repayment more expensive, and that risk sits with you for the whole term.`
        : "US dollar mortgages carry lower headline rates but move the exchange-rate risk onto the borrower.",
    },
    {
      q: "What deposit do banks in Ghana ask for?",
      a:
        "Commonly 20% for residents, and 20% to 30% for diaspora and non-resident buyers. Reported maximum " +
        "loans range from 80% of the price at several banks up to 100% under particular schemes. The " +
        "comparison flags any lender reported to need a larger deposit than the one you enter.",
    },
    {
      q: "Can I get a mortgage in Ghana while living abroad?",
      a:
        "Yes. Several banks in Ghana run diaspora mortgage products, usually in US dollars, and typically ask " +
        "for a larger deposit and proof of overseas income. The US dollar option in the comparison shows the " +
        "lenders that offer them.",
    },
    {
      q: "How often do mortgage rates in Ghana change?",
      a:
        `Cedi mortgages are usually priced as the Ghana Reference Rate plus the bank's margin, so they move ` +
        `when the reference rate does, which is monthly. It is ${grr.rate}%` +
        `${grr.effectiveDate ? ` effective ${formatRateDate(grr.effectiveDate)}` : ""}. Lenders in the table ` +
        `priced that way update here automatically; fixed and reported figures are reviewed by hand, last on ` +
        `${formatRateDate(RATES_REVIEWED)}.`,
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
        icon={Landmark}
        title="Compare mortgage rates in Ghana"
        subtitle="Every lender we can source, ranked on your price, deposit and term — in cedis or US dollars"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Static summary: readable before any JavaScript runs */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The market at a glance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Stat label="Cedi mortgages from" value={cediLenders[0]?.display ?? "—"} sub={cediLenders[0]?.name} />
            <Stat label="US dollar mortgages from" value={usdLenders[0]?.display ?? "—"} sub={usdLenders[0]?.name} />
            <Stat
              label="Ghana Reference Rate"
              value={`${grr.rate}%`}
              sub={grr.effectiveDate ? `Effective ${formatRateDate(grr.effectiveDate)}` : undefined}
            />
          </div>
          {cheapest && dearest && (
            <p className="text-gray-700 text-sm">
              On a GH₵1,000,000 home with a 20% deposit over 15 years, the cheapest cedi lender here (
              {cheapest.name} at {cheapest.display}) costs about{" "}
              <strong>{formatMoney(cheapest.monthlyPayment, "GHS")}</strong> a month, and the most expensive (
              {dearest.name} at {dearest.display}) about{" "}
              <strong>{formatMoney(dearest.monthlyPayment, "GHS")}</strong> — a difference of{" "}
              <strong>{formatMoney(example.spread, "GHS")}</strong> over the full term. Enter your own figures
              below to rank them properly.
            </p>
          )}
        </section>

        <CompareClient
          grrRate={grr.rate}
          grrEffectiveDate={grr.effectiveDate}
          ratesReviewed={RATES_REVIEWED}
        />

        {/* How to read it */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <div className="flex items-start gap-3 mb-4">
            <ShieldCheck className="w-6 h-6 text-teal-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-gray-900">How to read these figures</h2>
          </div>
          <ul className="space-y-3 text-sm text-gray-700 list-disc pl-5">
            <li>
              <strong>The lowest rate is not always the cheapest deal.</strong> A lender with a lower rate but a
              shorter maximum term has a higher monthly payment, and one with a tighter loan-to-value needs more
              cash up front.
            </li>
            <li>
              <strong>Most banks in Ghana do not publish a mortgage rate.</strong> Each row says where its
              figure comes from, so you can tell a bank&rsquo;s own published terms from a market estimate.
            </li>
            <li>
              <strong>Fees are not in these numbers.</strong> Arrangement, valuation and legal fees, plus the
              property and life insurance lenders usually require, are extra.
            </li>
            <li>
              <strong>Nothing here is an offer.</strong> Dwellot is a property marketplace, not a lender or a
              financial adviser. Only the lender can quote you.
            </li>
          </ul>
        </section>

        {/* FAQ */}
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

        {/* Onward links */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NextLink
            href="/mortgage-calculator"
            title="Mortgage calculator"
            body="Work one lender's figures through in detail, including affordability."
          />
          <NextLink
            href="/finance/ghana-reference-rate"
            title="Ghana Reference Rate"
            body={`The benchmark behind cedi pricing, currently ${grr.rate}%.`}
          />
          <NextLink
            href="/properties?listing_type=sale"
            title="Homes for sale"
            body="Browse houses, apartments and land across Ghana."
          />
        </section>

        <p className="text-xs text-gray-500">
          Dwellot is a property marketplace, not a lender or financial adviser. Nothing on this page is an offer
          of credit or financial advice. Confirm rates and terms with the lender before you commit.
        </p>
      </div>
    </div>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-bold text-teal-700 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
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
