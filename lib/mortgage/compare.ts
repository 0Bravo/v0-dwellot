/**
 * Side-by-side lender comparison.
 *
 * Takes one set of buyer numbers and runs them through every lender that
 * offers the chosen currency, so the rows are directly comparable. The
 * maths comes from calculateMortgage, the same function the calculators
 * use, so the two can never disagree.
 *
 * Two lender limits change the answer and are surfaced rather than hidden:
 * - a lender whose maximum term is shorter than the one asked for is
 *   quoted at its own maximum, flagged, because a 20-year quote from a
 *   lender that only lends for 7 is a fiction
 * - a lender whose reported maximum loan-to-value needs a bigger deposit
 *   than the buyer has is still shown, flagged, because LTV is negotiable
 *   and reported figures are not promises
 */

import { calculateMortgage, type MortgageCurrency } from "./calc"
import { resolveLenderRates, LENDERS, type RateBasis } from "./rates"

export interface CompareInput {
  currency: MortgageCurrency
  propertyPrice: number
  deposit: number
  termYears: number
  /** Live Ghana Reference Rate, for lenders priced as GRR + margin */
  grrRate: number
}

export interface ComparisonRow {
  id: string
  name: string
  basis: RateBasis
  /** Annual rate used for this row's maths */
  rate: number
  /** Rate as shown, e.g. "18%", "22–26%", "18.01% (GRR + 8%)" */
  display: string
  note?: string
  asOf: string

  /** Term actually quoted: the term asked for, or the lender's maximum */
  termYears: number
  /** true when the lender's maximum term is shorter than the one asked for */
  termCapped: boolean
  maxTermYears: number

  monthlyPayment: number
  totalInterest: number
  totalPayment: number
  loanAmount: number

  /** Reported maximum loan-to-value, when known */
  maxLtvPct?: number
  /** Deposit percentage this lender's reported LTV implies, when known */
  minDepositPct?: number
  /** true when the buyer's deposit is below that figure */
  depositShort: boolean

  /** Extra total cost against the cheapest row, in currency units */
  extraVsCheapest: number
  /** Extra monthly payment against the cheapest row */
  extraMonthlyVsCheapest: number
  /** 1 = cheapest by total cost among lenders offering the full term; 0 = not ranked */
  rank: number
}

export type SortKey = "monthly" | "rate" | "total" | "name"

export interface ComparisonResult {
  rows: ComparisonRow[]
  /** Cheapest and dearest by total cost, among lenders offering the full term */
  cheapest?: ComparisonRow
  dearest?: ComparisonRow
  /** Lenders shown but not ranked, because their maximum term is shorter */
  unrankedCount: number
  /** Total-cost gap between them */
  spread: number
  /** Monthly gap between them */
  monthlySpread: number
  loanAmount: number
  depositPct: number
}

const LTV_BY_LENDER: Record<string, number | undefined> = Object.fromEntries(
  LENDERS.map((l) => [l.id, l.reportedMaxLtvPct]),
)

export function compareLenders(input: CompareInput): ComparisonResult {
  const { currency, propertyPrice, deposit, termYears, grrRate } = input

  const loanAmount = Math.max(0, propertyPrice - deposit)
  const depositPct = propertyPrice > 0 ? (deposit / propertyPrice) * 100 : 0

  const rates = resolveLenderRates(currency, grrRate)

  const rows: ComparisonRow[] = rates.map((lender) => {
    const quotedTerm = Math.min(termYears, lender.maxTermYears)

    const result = calculateMortgage({
      price: propertyPrice,
      deposit,
      annualRatePct: lender.rate,
      termYears: quotedTerm,
    })

    const maxLtvPct = LTV_BY_LENDER[lender.id]
    const minDepositPct = maxLtvPct != null ? 100 - maxLtvPct : undefined

    return {
      id: lender.id,
      name: lender.name,
      basis: lender.basis,
      rate: lender.rate,
      display: lender.display,
      note: lender.note,
      asOf: lender.asOf,

      termYears: quotedTerm,
      termCapped: quotedTerm < termYears,
      maxTermYears: lender.maxTermYears,

      monthlyPayment: result.monthlyPayment,
      totalInterest: result.totalInterest,
      totalPayment: result.totalPayment,
      loanAmount: result.loanAmount,

      maxLtvPct,
      minDepositPct,
      // Only flagged when we have a figure and the deposit is genuinely under it.
      depositShort: minDepositPct != null && depositPct + 0.01 < minDepositPct,

      extraVsCheapest: 0,
      extraMonthlyVsCheapest: 0,
      rank: 0,
    }
  })

  // Ranking compares like with like, which means only lenders that can
  // actually offer the term asked for.
  //
  // A shorter term always means less total interest and a higher monthly
  // payment, so ranking every row together by total cost puts a lender
  // capped at 7 years above one offering 15 at half the monthly payment.
  // That reads as "cheapest" and is the opposite of the truth, so a
  // term-capped lender is shown and flagged but left out of the ranking and
  // out of the cheapest-to-dearest gap. If every lender is capped there is
  // nothing to compare against, so they are ranked among themselves.
  const comparable = rows.filter((r) => !r.termCapped)
  const ranked = comparable.length > 0 ? comparable : rows

  const byTotal = [...ranked].sort((a, b) => a.totalPayment - b.totalPayment)
  const cheapest = byTotal[0]
  const dearest = byTotal[byTotal.length - 1]

  if (cheapest) {
    for (const row of rows) {
      const position = byTotal.findIndex((r) => r.id === row.id)
      // rank 0 means "not ranked": shown for reference, on a shorter term
      row.rank = position + 1
      if (position === -1) continue
      row.extraVsCheapest = Math.max(0, Math.round(row.totalPayment - cheapest.totalPayment))
      row.extraMonthlyVsCheapest = Math.max(0, Math.round(row.monthlyPayment - cheapest.monthlyPayment))
    }
  }

  return {
    rows,
    cheapest,
    dearest,
    unrankedCount: rows.filter((r) => r.rank === 0).length,
    spread: cheapest && dearest ? Math.round(dearest.totalPayment - cheapest.totalPayment) : 0,
    monthlySpread: cheapest && dearest ? Math.round(dearest.monthlyPayment - cheapest.monthlyPayment) : 0,
    loanAmount,
    depositPct,
  }
}

export function sortRows(rows: ComparisonRow[], key: SortKey): ComparisonRow[] {
  const sorted = [...rows]
  switch (key) {
    case "monthly":
      return sorted.sort((a, b) => a.monthlyPayment - b.monthlyPayment)
    case "rate":
      return sorted.sort((a, b) => a.rate - b.rate)
    case "total":
      return sorted.sort((a, b) => a.totalPayment - b.totalPayment)
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
  }
}
