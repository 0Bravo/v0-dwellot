import type { Metadata } from "next"
import Link from "next/link"
import { Activity, ArrowRight, Calculator, Info, TrendingDown, TrendingUp } from "lucide-react"
import { PageHero } from "@/components/ui/PageHero"
import { getGhanaReferenceRate } from "@/lib/mortgage/grr"
import {
  BASIS_LABEL,
  GRR_HISTORY,
  RATES_REVIEWED,
  formatRateDate,
  resolveLenderRates,
  type GrrHistoryEntry,
} from "@/lib/mortgage/rates"
import { calculateMortgage, formatMoney } from "@/lib/mortgage/calc"

// Re-check the rate at most every 12 hours
export const revalidate = 43200

const PAGE_URL = "https://dwellot.com/finance/ghana-reference-rate"

export async function generateMetadata(): Promise<Metadata> {
  const grr = await getGhanaReferenceRate()
  const when = grr.effectiveDate ? formatRateDate(grr.effectiveDate.slice(0, 7)) : ""
  const title = `Ghana Reference Rate Today: ${grr.rate}%${when ? ` (${when})` : ""}`
  const description =
    `The Ghana Reference Rate (GRR) is ${grr.rate}%` +
    `${grr.effectiveDate ? `, effective ${formatRateDate(grr.effectiveDate)}` : ""}. ` +
    "See what it means for mortgage rates in Ghana, how banks add their margin, and recent monthly rates."

  return {
    title,
    description,
    alternates: { canonical: PAGE_URL },
    openGraph: { title, description, url: PAGE_URL },
  }
}

/** History with the live figure added on top when it is newer than the stored list. */
function buildHistory(liveRate: number, liveEffective: string | null): GrrHistoryEntry[] {
  const liveMonth = liveEffective?.slice(0, 7)
  if (liveMonth && !GRR_HISTORY.some((entry) => entry.month === liveMonth)) {
    return [{ month: liveMonth, rate: liveRate, effectiveDate: liveEffective ?? undefined }, ...GRR_HISTORY]
  }
  return GRR_HISTORY
}

export default async function GhanaReferenceRatePage() {
  const grr = await getGhanaReferenceRate()
  const history = buildHistory(grr.rate, grr.effectiveDate)
  const currentMonth = grr.effectiveDate?.slice(0, 7) ?? history[0]?.month
  const previous = history.find((entry) => entry.month !== currentMonth)
  const change = previous ? Number((grr.rate - previous.rate).toFixed(2)) : 0
  const lenders = resolveLenderRates("GHS", grr.rate)

  // Worked example: GH₵ 800,000 loan over 15 years at GRR + 8% and GRR + 12%
  const exampleLoan = 800000
  const examples = [8, 12].map((margin) => {
    const rate = Number((grr.rate + margin).toFixed(2))
    const result = calculateMortgage({ price: exampleLoan, deposit: 0, annualRatePct: rate, termYears: 15 })
    return { margin, rate, monthly: result.monthlyPayment }
  })

  const faqs = [
    {
      question: "What is the Ghana Reference Rate?",
      answer:
        "The Ghana Reference Rate (GRR) is the benchmark that banks in Ghana use to price cedi loans. " +
        "It was introduced in 2017 by the Bank of Ghana and the Ghana Association of Banks to replace individual bank base rates with one transparent figure.",
    },
    {
      question: `What is the Ghana Reference Rate today?`,
      answer:
        `The Ghana Reference Rate is ${grr.rate}%` +
        `${grr.effectiveDate ? `, effective ${formatRateDate(grr.effectiveDate)}` : ""}, as published by the ${grr.source}.`,
    },
    {
      question: "How does the GRR affect my mortgage rate?",
      answer:
        "A cedi mortgage is usually priced as the GRR plus the bank's margin. The margin reflects the bank's costs and its view of your risk, so the rate you are offered is well above the GRR itself. When the GRR falls, variable-rate loans can become cheaper at their next repricing date; fixed-rate loans do not change.",
    },
    {
      question: "How often does the GRR change?",
      answer:
        "It is recalculated and published monthly by the Ghana Association of Banks, and each rate stays in place for about a month.",
    },
    {
      question: "Does the GRR apply to US dollar mortgages?",
      answer:
        "No. The GRR is a cedi benchmark. US dollar mortgages from banks in Ghana are priced separately and are typically much lower than cedi rates, but they carry exchange-rate risk if you earn in cedis.",
    },
  ]

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <PageHero
        icon={Activity}
        title="Ghana Reference Rate"
        subtitle="The benchmark banks price cedi loans from, read automatically from the published figure."
      >
        <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
          <p className="text-6xl md:text-7xl font-bold text-white tracking-tight tabular-nums">{grr.rate}%</p>
          <div className="pb-2">
            <p className="text-teal-100">
              {grr.effectiveDate ? `Effective ${formatRateDate(grr.effectiveDate)}` : "Current published rate"}
            </p>
            {previous && change !== 0 && (
              <p className="inline-flex items-center gap-1.5 text-sm text-teal-200 mt-1">
                {change < 0 ? (
                  <TrendingDown className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <TrendingUp className="w-4 h-4" aria-hidden="true" />
                )}
                {change < 0 ? "Down" : "Up"} {Math.abs(change).toFixed(2)} points from {previous.rate}% in{" "}
                {formatRateDate(previous.month)}
              </p>
            )}
          </div>
        </div>
        <p className="text-sm text-teal-200/80 mt-5">
          Source:{" "}
          <a href={grr.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
            {grr.source}
          </a>
          . This page checks the published rate automatically.
        </p>
      </PageHero>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* What it means */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What the rate means for a mortgage</h2>
          <p className="text-gray-700 mb-4">
            Banks in Ghana price cedi loans as the Ghana Reference Rate plus their own margin. The GRR is the starting
            point, not the rate you pay. As an illustration, on a {formatMoney(exampleLoan, "GHS")} loan over 15 years:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {examples.map((example) => (
              <div key={example.margin} className="bg-teal-50 rounded-xl p-5">
                <p className="text-sm text-teal-700 font-medium">
                  GRR + {example.margin}% margin = {example.rate}%
                </p>
                <p className="text-2xl font-bold text-teal-700 mt-1">
                  {formatMoney(example.monthly, "GHS")} <span className="text-base font-medium">a month</span>
                </p>
              </div>
            ))}
          </div>
          <Link
            href="/mortgage-calculator"
            className="inline-flex items-center gap-2 bg-teal-600 text-white py-3 px-5 rounded-lg font-medium hover:bg-teal-700 transition"
          >
            <Calculator className="w-4 h-4" />
            Work out your own repayments
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Lender rates */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Cedi mortgage rates at this GRR</h2>
          <p className="text-sm text-gray-600 mb-4">Lender table reviewed {formatRateDate(RATES_REVIEWED)}.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-3 font-semibold text-gray-700">Bank</th>
                  <th className="py-3 font-semibold text-gray-700">Rate</th>
                  <th className="py-3 font-semibold text-gray-700">Basis</th>
                  <th className="py-3 font-semibold text-gray-700">Max term</th>
                </tr>
              </thead>
              <tbody>
                {lenders.map((lender) => (
                  <tr key={lender.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 font-medium text-gray-900">{lender.name}</td>
                    <td className="py-3 text-gray-700 whitespace-nowrap">{lender.display}</td>
                    <td className="py-3 text-gray-700">
                      {BASIS_LABEL[lender.basis]}, {formatRateDate(lender.asOf)}
                    </td>
                    <td className="py-3 text-gray-700 whitespace-nowrap">{lender.maxTermYears} years</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-4 flex items-start gap-1.5">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Most banks in Ghana do not publish a mortgage rate. Rows marked Reported or Estimate are indicative
              market figures, not quotes. Always confirm the current offer with the bank.
            </span>
          </p>
        </section>

        {/* History */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Ghana Reference Rates</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="py-3 font-semibold text-gray-700">Month</th>
                <th className="py-3 font-semibold text-gray-700">Rate</th>
                <th className="py-3 font-semibold text-gray-700">Effective from</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr key={entry.month} className="border-b border-gray-100 last:border-0">
                  <td className="py-3 font-medium text-gray-900">{formatRateDate(entry.month)}</td>
                  <td className="py-3 text-gray-700">{entry.rate}%</td>
                  <td className="py-3 text-gray-700">
                    {entry.effectiveDate ? formatRateDate(entry.effectiveDate) : "Not recorded"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-4">Months not listed have not been recorded on this page.</p>
        </section>

        {/* FAQ */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Questions about the Ghana Reference Rate</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="font-semibold text-gray-900 mb-1">{faq.question}</h3>
                <p className="text-gray-700 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="text-sm text-gray-600">
          Back to the{" "}
          <Link href="/finance" className="text-teal-600 hover:text-teal-700 font-medium underline">
            Dwellot property finance hub
          </Link>
          . Dwellot is a property marketplace, not a lender or financial adviser.
        </p>
      </div>
    </div>
  )
}
