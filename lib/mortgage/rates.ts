/**
 * Ghana mortgage rate data for Dwellot.
 *
 * HOW THIS WORKS
 * - The Ghana Reference Rate (GRR) is the benchmark banks price cedi loans
 *   from. It is published monthly by the Ghana Association of Banks and is
 *   fetched live by lib/mortgage/grr.ts. GRR_FALLBACK is used if that fails.
 * - Ghana's banks do not publish a live feed of mortgage rates, and most do
 *   not publish a mortgage rate at all. Each lender below therefore records
 *   WHERE its figure comes from ("basis") and WHEN it was last checked.
 * - A lender priced as "GRR + margin" updates automatically with the live GRR.
 *
 * TO UPDATE: edit the figures below, set `asOf` for the lender you changed,
 * and bump RATES_REVIEWED.
 */

import type { MortgageCurrency } from "./calc"

/** Date this table was last reviewed end to end (ISO, YYYY-MM-DD). */
export const RATES_REVIEWED = "2026-11-15"

export interface GrrSnapshot {
  /** Ghana Reference Rate, percent per annum */
  rate: number
  /** Effective date (ISO, YYYY-MM-DD) when known */
  effectiveDate: string | null
  /** Where the figure was read from */
  source: string
  sourceUrl: string
  /** true when fetched from the source just now, false when using the fallback */
  live: boolean
}

/** Last manually verified GRR; used when the live fetch fails. */
export const GRR_FALLBACK: GrrSnapshot = {
  rate: 10.01,
  effectiveDate: "2026-11-04",
  source: "Ghana Association of Banks",
  sourceUrl: "https://www.gab.com.gh/",
  live: false,
}

/**
 * published  - the bank states this rate on its own website or tariff guide
 * grr-linked - the bank publishes a margin over the GRR; rate = GRR + margin
 * reported   - a rate attributed to the bank by third parties, not confirmed
 *              on the bank's own site at review time
 * estimate   - the bank publishes no rate; this is a market estimate range
 */
export type RateBasis = "published" | "grr-linked" | "reported" | "estimate"

interface RateSpec {
  basis: RateBasis
  /** Fixed figure, percent per annum (published / reported) */
  rate?: number
  /** Margin over GRR in percentage points (grr-linked) */
  marginOverGrr?: number
  /** Estimate range, percent per annum (estimate) */
  range?: [number, number]
  /** Maximum term in years */
  maxTermYears: number
  /** Month the figure dates from (ISO YYYY-MM) */
  asOf: string
  note?: string
}

export interface LenderDefinition {
  id: string
  name: string
  rates: Partial<Record<MortgageCurrency, RateSpec>>
}

export const LENDERS: LenderDefinition[] = [
  {
    id: "republic",
    name: "Republic Bank",
    rates: {
      GHS: { basis: "published", rate: 18, maxTermYears: 20, asOf: "2026-09", note: "Fixed, individuals" },
      USD: { basis: "published", rate: 11.5, maxTermYears: 15, asOf: "2026-09", note: "Fixed" },
    },
  },
  {
    id: "first-atlantic",
    name: "First Atlantic Bank",
    rates: {
      GHS: {
        basis: "grr-linked",
        marginOverGrr: 8,
        maxTermYears: 7,
        asOf: "2026-08",
        note: "GRR + minimum 8% margin",
      },
      USD: { basis: "published", rate: 12, maxTermYears: 7, asOf: "2026-08" },
    },
  },
  {
    id: "absa",
    name: "Absa Bank Ghana",
    rates: {
      GHS: { basis: "reported", rate: 22, maxTermYears: 20, asOf: "2026-05" },
      USD: { basis: "reported", rate: 10.5, maxTermYears: 20, asOf: "2026-05" },
    },
  },
  {
    id: "stanbic",
    name: "Stanbic Bank",
    rates: {
      GHS: { basis: "estimate", range: [22, 26], maxTermYears: 20, asOf: "2026-05" },
      USD: { basis: "estimate", range: [11, 12], maxTermYears: 20, asOf: "2026-05" },
    },
  },
  {
    id: "fnb",
    name: "First National Bank",
    rates: {
      GHS: { basis: "estimate", range: [22, 25], maxTermYears: 20, asOf: "2026-05" },
      USD: { basis: "estimate", range: [10.5, 12], maxTermYears: 20, asOf: "2026-05" },
    },
  },
  {
    id: "fidelity",
    name: "Fidelity Bank",
    rates: {
      GHS: { basis: "estimate", range: [22, 25], maxTermYears: 20, asOf: "2026-05" },
    },
  },
  {
    id: "calbank",
    name: "CalBank",
    rates: {
      GHS: { basis: "estimate", range: [23, 26], maxTermYears: 20, asOf: "2026-05" },
    },
  },
  {
    id: "ecobank",
    name: "Ecobank Ghana",
    rates: {
      GHS: { basis: "estimate", range: [24, 26], maxTermYears: 15, asOf: "2026-05" },
    },
  },
]

/** A lender's rate for one currency, resolved against the current GRR. */
export interface LenderRate {
  id: string
  name: string
  currency: MortgageCurrency
  basis: RateBasis
  /** Single rate used when the user clicks "Apply" */
  rate: number
  /** Text for the table, e.g. "18%", "22-26%", "18.01% (GRR + 8%)" */
  display: string
  maxTermYears: number
  asOf: string
  note?: string
}

function trimPct(value: number): string {
  return `${Number(value.toFixed(2))}%`
}

/** Resolve every lender that offers `currency` into concrete rates. */
export function resolveLenderRates(currency: MortgageCurrency, grrRate: number): LenderRate[] {
  const resolved: LenderRate[] = []

  for (const lender of LENDERS) {
    const spec = lender.rates[currency]
    if (!spec) continue

    let rate: number
    let display: string

    if (spec.basis === "grr-linked" && spec.marginOverGrr != null) {
      rate = Number((grrRate + spec.marginOverGrr).toFixed(2))
      display = `${trimPct(rate)} (GRR + ${spec.marginOverGrr}%)`
    } else if (spec.range) {
      rate = Number(((spec.range[0] + spec.range[1]) / 2).toFixed(2))
      display = `${Number(spec.range[0])}–${trimPct(spec.range[1])}`
    } else if (spec.rate != null) {
      rate = spec.rate
      display = trimPct(rate)
    } else {
      continue
    }

    resolved.push({
      id: lender.id,
      name: lender.name,
      currency,
      basis: spec.basis,
      rate,
      display,
      maxTermYears: spec.maxTermYears,
      asOf: spec.asOf,
      note: spec.note,
    })
  }

  return resolved.sort((a, b) => a.rate - b.rate)
}

export const BASIS_LABEL: Record<RateBasis, string> = {
  published: "Published by bank",
  "grr-linked": "Live: tracks GRR",
  reported: "Reported",
  estimate: "Estimate",
}

/** Starting values for the calculators, per loan currency. */
export const MORTGAGE_DEFAULTS: Record<
  MortgageCurrency,
  { rate: number; termYears: number; depositPct: number; terms: number[] }
> = {
  GHS: { rate: 22, termYears: 15, depositPct: 20, terms: [5, 10, 15, 20] },
  USD: { rate: 11.5, termYears: 15, depositPct: 20, terms: [5, 10, 15, 20] },
}

/** "2026-11-04" -> "4 Nov 2026"; "2026-09" -> "Sep 2026". */
export function formatRateDate(iso: string | null | undefined): string {
  if (!iso) return ""
  const [y, m, d] = iso.split("-").map(Number)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  if (!y || !m || m < 1 || m > 12) return iso
  return d ? `${d} ${months[m - 1]} ${y}` : `${months[m - 1]} ${y}`
}
