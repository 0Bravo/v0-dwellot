import { getGhanaReferenceRate } from "@/lib/mortgage/grr"
import { getCediRates } from "@/lib/mortgage/fx"
import { resolveLenderRates, type LenderRate } from "@/lib/mortgage/rates"
import {
  DEFAULT_COSTS_INPUT,
  LANDS_COMMISSION,
  STAMP_DUTY_BANDS,
  calculateBuyingCosts,
} from "@/lib/finance/buying-costs"
import { POLICY_RATE, POLICY_TO_MORTGAGE_NOTE } from "@/lib/finance/benchmarks"
import { calculateMortgage } from "@/lib/mortgage/calc"

/**
 * One monthly edition of the Ghana Property Finance Index.
 *
 * Built in one place so the page and the JSON endpoint cannot drift apart,
 * which matters because the point of the thing is being quotable.
 *
 * The editorial rule, enforced below rather than left to whoever writes the
 * page: a lender rate appears in the index only when it came from the lender
 * or from a published formula. Estimates are carried separately and labelled
 * as unconfirmed. An index whose headline numbers are guesses is worth less
 * than no index, because the first bank to check it stops trusting the rest.
 */

/** Bases we are willing to publish as the index's own figures. */
const PUBLISHABLE = new Set(["published", "grr-linked", "reported"])

export const WORKED_EXAMPLE_PRICE = 1_000_000
export const WORKED_EXAMPLE_DEPOSIT_PCT = 20

export interface FinanceIndexEdition {
  /** ISO year-month, e.g. "2026-11" */
  edition: string
  editionLabel: string
  /** ISO date this edition was generated */
  generatedAt: string
  policy: {
    rate: number
    previous: number
    changeBp: number
    effectiveFrom: string
    meeting: string
    corridorBp: number
    source: string
    sourceUrl: string
    mortgageNote: string
  }
  grr: {
    rate: number
    effectiveDate: string | null
    source: string
    sourceUrl: string
    live: boolean
    /** True when the GRR predates the latest policy decision, so the
        pass-through has not reached it yet. */
    predatesPolicyChange: boolean
  }
  fx: {
    usdGhs: number
    gbpGhs: number | null
    asOf: string | null
    source: string
    sourceUrl: string
    live: boolean
  }
  statutory: {
    stampDutyBands: { upTo: number | null; ratePct: number }[]
    landsCommission: typeof LANDS_COMMISSION
    note: string
  }
  workedExample: {
    priceGhs: number
    depositPct: number
    statutoryTotal: number
    marketTotal: number
    feesTotal: number
    feesPctOfPrice: number
    cashNeeded: number
  }
  /** What a one percentage point change costs on the worked example. */
  rateSensitivity: {
    priceGhs: number
    loanGhs: number
    termYears: number
    fromRate: number
    toRate: number
    monthlyAtFrom: number
    monthlyAtTo: number
    monthlySaving: number
    lifetimeSaving: number
  }
  lenderTerms: {
    published: LenderRate[]
    unconfirmed: LenderRate[]
  }
  citation: string
  corrections: string
}

function monthLabel(iso: string): string {
  const [y, m] = iso.split("-").map(Number)
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]
  return `${months[(m || 1) - 1]} ${y}`
}

export async function buildFinanceIndexEdition(now = new Date()): Promise<FinanceIndexEdition> {
  const [grr, fx] = await Promise.all([getGhanaReferenceRate(), getCediRates()])

  const edition = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`

  const cedi = resolveLenderRates("GHS", grr.rate)
  const dollar = resolveLenderRates("USD", grr.rate)
  const all = [...cedi, ...dollar]

  const costs = calculateBuyingCosts({
    ...DEFAULT_COSTS_INPUT,
    priceGhs: WORKED_EXAMPLE_PRICE,
    depositGhs: (WORKED_EXAMPLE_PRICE * WORKED_EXAMPLE_DEPOSIT_PCT) / 100,
  })

  /* What one percentage point is worth, on the same example. This is the
     figure a policy cut actually turns into for a household, and the one
     nobody else publishes because it needs an amortisation engine. */
  const loan = WORKED_EXAMPLE_PRICE * (1 - WORKED_EXAMPLE_DEPOSIT_PCT / 100)
  const termYears = 15
  /* Baseline is the cheapest rate a lender publishes or prices by formula,
     not the cheapest rate on the table. The National Homeownership Fund is
     cheaper than any bank but carries eligibility conditions, so quoting it
     as the going rate overstates what an ordinary buyer is offered. */
  const cheapestCedi = [...cedi]
    .filter((r) => r.basis === "published" || r.basis === "grr-linked")
    .sort((a, b) => a.rate - b.rate)[0]
  const fromRate = cheapestCedi ? cheapestCedi.rate : grr.rate + 8
  const toRate = Math.max(0, fromRate - 1)
  const at = (rate: number) =>
    calculateMortgage({
      price: WORKED_EXAMPLE_PRICE,
      deposit: WORKED_EXAMPLE_PRICE * (WORKED_EXAMPLE_DEPOSIT_PCT / 100),
      annualRatePct: rate,
      termYears,
    })
  const high = at(fromRate)
  const low = at(toRate)

  return {
    edition,
    editionLabel: monthLabel(edition),
    generatedAt: now.toISOString().slice(0, 10),
    policy: {
      rate: POLICY_RATE.rate,
      previous: POLICY_RATE.previous,
      changeBp: Math.round((POLICY_RATE.rate - POLICY_RATE.previous) * 100),
      effectiveFrom: POLICY_RATE.effectiveFrom,
      meeting: POLICY_RATE.meeting,
      corridorBp: POLICY_RATE.corridorBp,
      source: POLICY_RATE.source,
      sourceUrl: POLICY_RATE.sourceUrl,
      mortgageNote: POLICY_TO_MORTGAGE_NOTE,
    },
    grr: {
      rate: grr.rate,
      effectiveDate: grr.effectiveDate,
      source: grr.source,
      sourceUrl: grr.sourceUrl,
      live: grr.live,
      predatesPolicyChange:
        grr.effectiveDate != null && grr.effectiveDate < POLICY_RATE.effectiveFrom,
    },
    fx: {
      usdGhs: fx.usdGhs,
      gbpGhs: fx.gbpGhs,
      asOf: fx.asOf,
      source: fx.source,
      sourceUrl: fx.sourceUrl,
      live: fx.live,
    },
    statutory: {
      stampDutyBands: STAMP_DUTY_BANDS.map((b) => ({
        upTo: Number.isFinite(b.upTo) ? b.upTo : null,
        ratePct: b.ratePct,
      })),
      landsCommission: LANDS_COMMISSION,
      note:
        "Stamp duty bands are set by the Stamp Duty Act 2005 (Act 689). Lands Commission " +
        "charges are per acre or part of an acre, so a single plot counts as one.",
    },
    workedExample: {
      priceGhs: WORKED_EXAMPLE_PRICE,
      depositPct: WORKED_EXAMPLE_DEPOSIT_PCT,
      statutoryTotal: Math.round(costs.statutoryTotal),
      marketTotal: Math.round(costs.marketTotal),
      feesTotal: Math.round(costs.feesTotal),
      feesPctOfPrice: Number(costs.feesPctOfPrice.toFixed(2)),
      cashNeeded: Math.round(costs.cashNeeded),
    },
    rateSensitivity: {
      priceGhs: WORKED_EXAMPLE_PRICE,
      loanGhs: loan,
      termYears,
      fromRate: Number(fromRate.toFixed(2)),
      toRate: Number(toRate.toFixed(2)),
      monthlyAtFrom: Math.round(high.monthlyPayment),
      monthlyAtTo: Math.round(low.monthlyPayment),
      monthlySaving: Math.round(high.monthlyPayment - low.monthlyPayment),
      lifetimeSaving: Math.round(high.totalPayment - low.totalPayment),
    },
    lenderTerms: {
      published: all.filter((r) => PUBLISHABLE.has(r.basis)),
      unconfirmed: all.filter((r) => !PUBLISHABLE.has(r.basis)),
    },
    citation: `Dwellot Ghana Property Finance Index, ${monthLabel(edition)}.`,
    corrections:
      "Lenders and regulators can have any figure corrected: send the current terms and " +
      "we will publish the change with the next edition, or sooner if it is material.",
  }
}
