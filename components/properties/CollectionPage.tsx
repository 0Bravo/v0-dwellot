import Link from "next/link"
import { ArrowRight, Building2, MapPin } from "lucide-react"
import { PageHero, HeroOverlap } from "@/components/ui/PageHero"
import { PropertyListCard } from "@/components/PropertyCard"
import { COLLECTION_BASE, slugify, type Collection } from "@/lib/properties/collections"
import { calculateBuyingCosts, DEFAULT_COSTS_INPUT } from "@/lib/finance/buying-costs"
import { calculateMortgage } from "@/lib/mortgage/calc"
import { getGhanaReferenceRate } from "@/lib/mortgage/grr"
import { getCediRates } from "@/lib/mortgage/fx"
import { resolveLenderRates } from "@/lib/mortgage/rates"
import { compactMoney } from "@/lib/finance/format"

/**
 * One page for a location, an estate or a developer.
 *
 * The listings alone would make this another portal page. What no other
 * Ghanaian portal puts here is the money: at the entry price on this page,
 * what the deposit and fees come to and what the monthly repayment would be
 * at a rate a bank actually publishes today. That is the reason to read it,
 * and the reason to link to it.
 */

const KIND_LABEL = {
  location: "Location",
  estate: "Development",
  developer: "Developer",
} as const

function money(value: number, currency: string) {
  const symbol = currency === "GHS" ? "GH₵" : "$"
  return `${symbol}${Math.round(value).toLocaleString("en-GB")}`
}

export async function CollectionPage({ collection }: { collection: Collection }) {
  const { kind, name, properties, forSale, forRent, minPrice, maxPrice, currency } = collection

  /* The entry price anchors the worked example: the cheapest thing on the
     page is what a reader checks affordability against. */
  const [grr, fx] = await Promise.all([getGhanaReferenceRate(), getCediRates()])
  const entry = minPrice
  const entryGhs = entry != null ? (currency === "GHS" ? entry : entry * fx.usdGhs) : null

  const cedi = resolveLenderRates("GHS", grr.rate)
  const cheapest = cedi
    .filter((r) => r.basis === "published" || r.basis === "grr-linked")
    .sort((a, b) => a.rate - b.rate)[0]

  const costs =
    entryGhs != null
      ? calculateBuyingCosts({
          ...DEFAULT_COSTS_INPUT,
          priceGhs: entryGhs,
          depositGhs: entryGhs * 0.2,
        })
      : null

  const repayment =
    entryGhs != null && cheapest
      ? calculateMortgage({
          price: entryGhs,
          deposit: entryGhs * 0.2,
          annualRatePct: cheapest.rate,
          termYears: 15,
        })
      : null

  const subtitle =
    forSale && forRent
      ? `${forSale} for sale and ${forRent} to rent`
      : forSale
        ? `${forSale} ${forSale === 1 ? "property" : "properties"} for sale`
        : `${forRent} to rent`

  return (
    <>
      <PageHero
        icon={kind === "developer" ? Building2 : MapPin}
        eyebrow={KIND_LABEL[kind]}
        title={kind === "developer" ? name : `Property in ${name}`}
        subtitle={subtitle}
        width="wide"
        overlap
      />

      <HeroOverlap>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* The money, which is why this page exists */}
          {entry != null && costs && repayment && cheapest ? (
            <div className="bg-white rounded-2xl ring-1 ring-gray-200 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900">
                What the entry price here actually costs
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                On the cheapest listing on this page, {money(entry, currency)}, with a 20% deposit
                over 15 years at {cheapest.rate}% from {cheapest.name}.
              </p>
              <dl className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-5">
                <Figure term="Entry price" value={money(entry, currency)} />
                <Figure
                  term="Cash to complete"
                  value={compactMoney(costs.cashNeeded)}
                  foot={`deposit plus ${costs.feesPctOfPrice}% fees`}
                />
                <Figure
                  term="Fees on top"
                  value={compactMoney(costs.feesTotal)}
                  foot="stamp duty, Lands Commission, legal"
                />
                <Figure
                  term="Monthly repayment"
                  value={compactMoney(repayment.monthlyPayment)}
                  foot={`at ${cheapest.rate}%`}
                />
              </dl>
              <p className="mt-5 text-xs text-gray-500">
                Figures from the{" "}
                <Link className="text-teal-700 underline" href="/ghana-property-finance-index">
                  Ghana Property Finance Index
                </Link>
                . Work your own numbers with the{" "}
                <Link className="text-teal-700 underline" href="/finance/cost-of-buying">
                  cost of buying calculator
                </Link>
                .
              </p>
            </div>
          ) : null}

          {maxPrice != null && minPrice != null && maxPrice !== minPrice && (
            <p className="mt-6 text-gray-700">
              Listings {kind === "developer" ? "from" : "in"} {name} run from{" "}
              <strong>{money(minPrice, currency)}</strong> to{" "}
              <strong>{money(maxPrice, currency)}</strong>.
            </p>
          )}

          {/* The listings */}
          <h2 className="mt-10 text-2xl font-bold text-gray-900">
            {properties.length} {properties.length === 1 ? "listing" : "listings"}
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              <PropertyListCard key={p.id} property={p as any} />
            ))}
          </div>

          {/* Internal links: the thing that makes a set of pages worth more
              than the sum of them */}
          <RelatedLinks collection={collection} />
        </div>
      </HeroOverlap>
    </>
  )
}

function Figure({ term, value, foot }: { term: string; value: string; foot?: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-gray-500">{term}</dt>
      <dd className="mt-0.5 text-xl font-bold text-gray-900 tabular-nums">{value}</dd>
      {foot && <p className="text-xs text-gray-500 mt-0.5">{foot}</p>}
    </div>
  )
}

function RelatedLinks({ collection }: { collection: Collection }) {
  const { kind, relatedLocations, relatedDevelopers } = collection
  const locations = kind === "location" ? [] : relatedLocations.slice(0, 6)
  const developers = kind === "developer" ? [] : relatedDevelopers.slice(0, 6)
  if (!locations.length && !developers.length) return null

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      {locations.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Where these are
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {locations.map((l) => (
              <Link
                key={l}
                href={`${COLLECTION_BASE.location}/${slugify(l)}`}
                className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm text-gray-800"
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      )}
      {developers.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Who builds here
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {developers.map((d) => (
              <Link
                key={d}
                href={`${COLLECTION_BASE.developer}/${slugify(d)}`}
                className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm text-gray-800"
              >
                {d}
              </Link>
            ))}
          </div>
        </div>
      )}
      <Link
        href="/finance"
        className="mt-8 inline-flex items-center gap-1.5 font-semibold text-teal-700"
      >
        Work out what you can afford
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </Link>
    </div>
  )
}
