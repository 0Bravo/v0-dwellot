import type { Metadata } from "next"
import Link from "next/link"
import { Activity, Landmark, Scale, TrendingDown } from "lucide-react"
import { PageHero, HeroOverlap } from "@/components/ui/PageHero"
import { buildFinanceIndexEdition } from "@/lib/finance/index-edition"
import { formatRateDate } from "@/lib/mortgage/rates"

/* Twice a day: the GRR and FX legs move, the rest is monthly. */
export const revalidate = 43200

const PATH = "/ghana-property-finance-index"

export async function generateMetadata(): Promise<Metadata> {
  const e = await buildFinanceIndexEdition()
  /* The layout template already appends the brand. */
  const title = `Ghana Property Finance Index, ${e.editionLabel}`
  const description =
    `Ghana's property finance benchmarks for ${e.editionLabel}: policy rate ${e.policy.rate}%, ` +
    `Ghana Reference Rate ${e.grr.rate}%, mortgage terms by lender, stamp duty and Lands ` +
    `Commission charges, and the cash needed to buy a GH₵${(e.workedExample.priceGhs / 1_000_000).toFixed(0)}m home.`
  return {
    title,
    description,
    alternates: { canonical: PATH },
    openGraph: { title, description, url: PATH, type: "article" },
  }
}

const ghs = (n: number) =>
  `GH₵${Math.round(n).toLocaleString("en-GB")}`

export default async function FinanceIndexPage() {
  const e = await buildFinanceIndexEdition()

  /* Dataset markup, because the whole point is being cited and reused. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `Ghana Property Finance Index, ${e.editionLabel}`,
    description:
      "Monthly benchmarks for buying property in Ghana: policy rate, Ghana Reference Rate, " +
      "lender mortgage terms, statutory transaction costs and exchange rates.",
    creator: { "@type": "Organization", name: "Dwellot", url: "https://dwellot.com" },
    datePublished: e.generatedAt,
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by/4.0/",
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: "https://dwellot.com/api/finance-index",
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        icon={Activity}
        eyebrow={`Edition ${e.editionLabel}`}
        title="Ghana Property Finance Index"
        subtitle="What it costs to borrow and to buy in Ghana this month, with every figure dated and attributed."
        width="wide"
        overlap
      />

      <HeroOverlap>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Headline benchmarks */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat
              label="Policy rate"
              value={`${e.policy.rate}%`}
              foot={`${e.policy.changeBp}bp on ${formatRateDate(e.policy.effectiveFrom)}`}
              accent
            />
            <Stat
              label="Ghana Reference Rate"
              value={`${e.grr.rate}%`}
              foot={e.grr.effectiveDate ? `effective ${formatRateDate(e.grr.effectiveDate)}` : e.grr.source}
            />
            <Stat label="US dollar" value={`₵${e.fx.usdGhs.toFixed(2)}`} foot={e.fx.asOf ? formatRateDate(e.fx.asOf) : e.fx.source} />
            <Stat
              label="Pound sterling"
              value={e.fx.gbpGhs ? `₵${e.fx.gbpGhs.toFixed(2)}` : "—"}
              foot={e.fx.asOf ? formatRateDate(e.fx.asOf) : e.fx.source}
            />
          </div>

          {/* The month's story */}
          <section className="mt-10 bg-white rounded-2xl ring-1 ring-gray-200 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-teal-600" aria-hidden="true" />
              This month: a {Math.abs(e.policy.changeBp)} basis point cut
            </h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              The Bank of Ghana moved the policy rate from {e.policy.previous}% to {e.policy.rate}% at its{" "}
              {e.policy.meeting}, and narrowed the policy corridor to plus or minus {e.policy.corridorBp} basis
              points.
            </p>
            <p className="mt-3 text-gray-700 leading-relaxed">{e.policy.mortgageNote}</p>
            {e.grr.predatesPolicyChange && (
              <p className="mt-3 text-sm text-amber-800 bg-amber-50 ring-1 ring-amber-200 rounded-lg px-4 py-3">
                The Ghana Reference Rate in force is {e.grr.rate}%, effective{" "}
                {formatRateDate(e.grr.effectiveDate)} — before this decision. Cedi mortgage pricing has not
                yet moved.
              </p>
            )}

            <div className="mt-6 rounded-xl bg-teal-50 ring-1 ring-teal-100 p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">
                What one percentage point is worth
              </p>
              <p className="mt-2 text-gray-800 leading-relaxed">
                On a {ghs(e.rateSensitivity.loanGhs)} mortgage over {e.rateSensitivity.termYears} years, going
                from {e.rateSensitivity.fromRate}% to {e.rateSensitivity.toRate}% takes the monthly payment
                from {ghs(e.rateSensitivity.monthlyAtFrom)} to {ghs(e.rateSensitivity.monthlyAtTo)} — a saving
                of <strong>{ghs(e.rateSensitivity.monthlySaving)} a month</strong> and{" "}
                <strong>{ghs(e.rateSensitivity.lifetimeSaving)}</strong> over the life of the loan.
              </p>
              <p className="mt-2 text-xs text-teal-900/70">
                Baseline is the cheapest rate a bank publishes or prices by formula, not the cheapest rate
                available: subsidised schemes carry eligibility conditions.
              </p>
            </div>
          </section>

          {/* Lender terms */}
          <section className="mt-8 bg-white rounded-2xl ring-1 ring-gray-200 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-teal-600" aria-hidden="true" />
              Mortgage terms by lender
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Published rates, rates priced off the Ghana Reference Rate by a stated formula, and terms
              reported to us. Each row carries the month it was last checked.
            </p>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-200">
                    <th className="py-2 pr-4 font-semibold">Lender</th>
                    <th className="py-2 pr-4 font-semibold">Currency</th>
                    <th className="py-2 pr-4 font-semibold">Rate</th>
                    <th className="py-2 pr-4 font-semibold">Max term</th>
                    <th className="py-2 pr-4 font-semibold">Basis</th>
                    <th className="py-2 font-semibold">Checked</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {e.lenderTerms.published.map((r) => (
                    <tr key={`${r.id}-${r.currency}`}>
                      <td className="py-2.5 pr-4 font-medium text-gray-900">
                        {r.name}
                        {r.note && (
                          <span className="block text-xs font-normal text-gray-500">{r.note}</span>
                        )}
                      </td>
                      <td className="py-2.5 pr-4 text-gray-600">{r.currency}</td>
                      <td className="py-2.5 pr-4 text-gray-900 tabular-nums">{r.display}</td>
                      <td className="py-2.5 pr-4 text-gray-600 tabular-nums">{r.maxTermYears} yr</td>
                      <td className="py-2.5 pr-4 text-gray-600">{r.basis}</td>
                      <td className="py-2.5 text-gray-600">{formatRateDate(r.asOf)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {e.lenderTerms.unconfirmed.length > 0 && (
              <p className="mt-5 text-sm text-gray-600 border-t border-gray-100 pt-4">
                <strong className="text-gray-900">Not published in this edition.</strong> We hold working
                estimates for{" "}
                {Array.from(new Set(e.lenderTerms.unconfirmed.map((r) => r.name))).join(", ")}, but they are
                not confirmed by the lender and so are left out of the index rather than presented as fact.
                Any of these lenders can have their current terms included by sending them.
              </p>
            )}
          </section>

          {/* Statutory costs */}
          <section className="mt-8 bg-white rounded-2xl ring-1 ring-gray-200 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-teal-600" aria-hidden="true" />
              What the state charges
            </h2>
            <p className="mt-2 text-sm text-gray-600">{e.statutory.note}</p>

            <div className="mt-5 grid sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Stamp duty on a conveyance</h3>
                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                  {e.statutory.stampDutyBands.map((b, i) => (
                    <li key={i} className="flex justify-between gap-4">
                      <span>{b.upTo == null ? "Above the previous band" : `Up to ${ghs(b.upTo)}`}</span>
                      <span className="tabular-nums font-medium text-gray-900">{b.ratePct}%</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Lands Commission, per acre</h3>
                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                  <li className="flex justify-between gap-4">
                    <span>Transfer of a registered title</span>
                    <span className="tabular-nums font-medium text-gray-900">
                      {ghs(e.statutory.landsCommission.transferPerAcre.low)}
                    </span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span>First registration</span>
                    <span className="tabular-nums font-medium text-gray-900">
                      {ghs(e.statutory.landsCommission.firstRegistrationPerAcre.low)}
                      {"–"}
                      {ghs(e.statutory.landsCommission.firstRegistrationPerAcre.high)}
                    </span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span>Official search</span>
                    <span className="tabular-nums font-medium text-gray-900">
                      {ghs(e.statutory.landsCommission.search.low)}
                      {"–"}
                      {ghs(e.statutory.landsCommission.search.high)}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-gray-50 ring-1 ring-gray-100 p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                Buying a {ghs(e.workedExample.priceGhs)} home with a {e.workedExample.depositPct}% deposit
              </p>
              <dl className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <Cell term="Statutory" value={ghs(e.workedExample.statutoryTotal)} />
                <Cell term="Professional and lender" value={ghs(e.workedExample.marketTotal)} />
                <Cell
                  term="Fees in total"
                  value={`${ghs(e.workedExample.feesTotal)} (${e.workedExample.feesPctOfPrice}%)`}
                />
                <Cell term="Cash to complete" value={ghs(e.workedExample.cashNeeded)} />
              </dl>
              <p className="mt-3 text-xs text-gray-500">
                Only the statutory part is fixed by law. The rest is professional and lender fees, where the
                quotes vary and you can push back.
              </p>
            </div>
          </section>

          {/* Method and reuse */}
          <section className="mt-8 bg-white rounded-2xl ring-1 ring-gray-200 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900">Method, sources and reuse</h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li>
                Policy rate: {e.policy.source},{" "}
                <a className="text-teal-700 underline" href={e.policy.sourceUrl} rel="nofollow">
                  policy rate trends
                </a>
                .
              </li>
              <li>
                Ghana Reference Rate: {e.grr.source}
                {e.grr.live ? ", read today" : ", last verified figure"}.
              </li>
              <li>
                Exchange rates: {e.fx.source}
                {e.fx.asOf ? `, ${formatRateDate(e.fx.asOf)}` : ""}.
              </li>
              <li>Stamp duty: Stamp Duty Act 2005 (Act 689). Land registration: Land Act 2020 (Act 1036).</li>
              <li>
                Mortgage terms: taken from the lender, or priced from the Ghana Reference Rate by the
                lender&apos;s stated formula. Estimates we have not confirmed are excluded.
              </li>
            </ul>
            <p className="mt-4 text-sm text-gray-700">
              Free to quote with attribution: <em>{e.citation}</em> The same figures are available as{" "}
              <Link className="text-teal-700 underline" href="/api/finance-index">
                JSON
              </Link>
              .
            </p>
            <p className="mt-3 text-sm text-gray-600">{e.corrections}</p>
            <p className="mt-4 text-xs text-gray-500">
              Published {formatRateDate(e.generatedAt)}. Figures describe market conditions and are not
              advice on a particular purchase or loan.
            </p>
          </section>
        </div>
      </HeroOverlap>
    </>
  )
}

function Stat({
  label,
  value,
  foot,
  accent = false,
}: {
  label: string
  value: string
  foot?: string
  accent?: boolean
}) {
  return (
    <div
      className={`rounded-2xl p-5 ring-1 ${
        accent ? "bg-teal-600 ring-teal-500 text-white" : "bg-white ring-gray-200"
      }`}
    >
      <p
        className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${
          accent ? "text-teal-50/80" : "text-gray-500"
        }`}
      >
        {label}
      </p>
      <p className={`mt-1 text-3xl font-bold tabular-nums ${accent ? "text-white" : "text-gray-900"}`}>
        {value}
      </p>
      {foot && (
        <p className={`mt-1 text-xs ${accent ? "text-teal-50/80" : "text-gray-500"}`}>{foot}</p>
      )}
    </div>
  )
}

function Cell({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-gray-500">{term}</dt>
      <dd className="mt-0.5 font-semibold text-gray-900 tabular-nums">{value}</dd>
    </div>
  )
}
