/**
 * What it actually costs to buy a home in Ghana, on top of the price.
 *
 * Two kinds of figure live here and they are NOT equally reliable, so the UI
 * labels them differently:
 *
 * 1. STATUTORY — set by law or by a published government fee schedule.
 *    Computed, with the instrument named:
 *      - Stamp duty: Stamp Duty Act 2005 (Act 689), conveyance schedule.
 *        0.25% of consideration up to GH¢10,000, 0.5% from GH¢10,000 to
 *        GH¢50,000, 1% above GH¢50,000. Charged on the consideration, not
 *        on the slice above each threshold.
 *      - Lands Commission registration: per acre or part of an acre, so a
 *        single residential plot counts as one unit.
 *      - Lands Commission search: regional office fee.
 *
 * 2. MARKET — what practitioners charge. No published schedule binds these,
 *    so every one is a user-editable input with a stated typical range, and
 *    the defaults are deliberately mid-range rather than flattering:
 *      - Legal and conveyancing fees, quoted as a share of the price
 *      - Valuation, where a lender requires one
 *      - Lender arrangement or facility fee
 *      - Building insurance and mortgage life cover
 *
 * Nothing here is a quote or tax advice. The Lands Commission issues a fee
 * assessment for each application and the duty is assessed on the
 * instrument, so the real bill can differ. The page says so.
 *
 * Sources last reviewed: 2026-11-21.
 */

export const COSTS_REVIEWED = "2026-11-21"

/** Stamp duty bands for a conveyance on sale, Stamp Duty Act 2005 (Act 689). */
export const STAMP_DUTY_BANDS = [
  { upTo: 10_000, ratePct: 0.25 },
  { upTo: 50_000, ratePct: 0.5 },
  { upTo: Infinity, ratePct: 1 },
] as const

/**
 * Lands Commission fees, in cedis. Per acre or part of an acre, so one
 * ordinary plot is one unit. Ranges are published as a band; we use the
 * midpoint and show the band.
 */
export const LANDS_COMMISSION = {
  firstRegistrationPerAcre: { low: 1148, high: 1178 },
  /** Transfer of an already registered title, per acre or part of an acre */
  transferPerAcre: { low: 973, high: 973 },
  /** Consolidated administrative search, Greater Accra residential plot */
  search: { low: 132.5, high: 237.5 },
} as const

/** Typical market ranges, percent of price unless stated. */
export const MARKET_RANGES = {
  /** General Legal Council / Ghana Bar Association guideline territory */
  legalFeePct: { min: 1, max: 6, typical: 2 },
  /** Lender valuation, flat fee in cedis */
  valuationFee: { min: 1000, max: 5000, typical: 2500 },
  /** Lender arrangement or facility fee, percent of the loan */
  arrangementFeePct: { min: 0.5, max: 2, typical: 1 },
  /** Building insurance, percent of price per year */
  buildingInsurancePctPerYear: { min: 0.1, max: 0.5, typical: 0.25 },
  /** Mortgage life cover, percent of the loan per year */
  lifeCoverPctPerYear: { min: 0.3, max: 1, typical: 0.5 },
} as const

export type CostKind = "statutory" | "market"

export interface CostLine {
  id: string
  label: string
  amount: number
  kind: CostKind
  /** Who the money goes to */
  payableTo: string
  /** How the figure was arrived at, shown to the user */
  basis: string
  /** true when this only applies because the buyer is using a mortgage */
  mortgageOnly?: boolean
}

export interface BuyingCostsInput {
  /** Price in cedis. Convert before calling if the user works in dollars. */
  priceGhs: number
  /** Deposit in cedis; ignored when usingMortgage is false */
  depositGhs: number
  usingMortgage: boolean
  /** Plots or acres being registered; part of an acre counts as one */
  acres: number
  /** First registration of unregistered land, or transfer of a registered title */
  registrationType: "first" | "transfer"
  legalFeePct: number
  valuationFee: number
  arrangementFeePct: number
  buildingInsurancePctPerYear: number
  lifeCoverPctPerYear: number
  /** Include the first year of insurance premiums in the up-front total */
  includeFirstYearInsurance: boolean
}

export interface BuyingCostsResult {
  lines: CostLine[]
  statutoryTotal: number
  marketTotal: number
  /** Every fee, excluding the deposit and the price itself */
  feesTotal: number
  /** Fees as a percentage of the price */
  feesPctOfPrice: number
  /** Deposit plus fees: the cash needed to complete */
  cashNeeded: number
  loanAmount: number
}

/** Stamp duty on a conveyance on sale. Charged on the whole consideration. */
export function stampDuty(priceGhs: number): { amount: number; ratePct: number } {
  const price = Math.max(0, priceGhs)
  const band = STAMP_DUTY_BANDS.find((b) => price <= b.upTo) ?? STAMP_DUTY_BANDS[STAMP_DUTY_BANDS.length - 1]
  return { amount: round2((price * band.ratePct) / 100), ratePct: band.ratePct }
}

function round2(v: number): number {
  return Math.round(v * 100) / 100
}

function mid(range: { low: number; high: number }): number {
  return (range.low + range.high) / 2
}

export function calculateBuyingCosts(input: BuyingCostsInput): BuyingCostsResult {
  const {
    priceGhs,
    depositGhs,
    usingMortgage,
    acres,
    registrationType,
    legalFeePct,
    valuationFee,
    arrangementFeePct,
    buildingInsurancePctPerYear,
    lifeCoverPctPerYear,
    includeFirstYearInsurance,
  } = input

  const price = Math.max(0, priceGhs)
  // Part of an acre counts as a whole unit, so round up, minimum one.
  const units = Math.max(1, Math.ceil(acres || 1))
  const deposit = usingMortgage ? Math.min(Math.max(0, depositGhs), price) : price
  const loanAmount = usingMortgage ? Math.max(0, price - deposit) : 0

  const duty = stampDuty(price)

  const registrationBand =
    registrationType === "first" ? LANDS_COMMISSION.firstRegistrationPerAcre : LANDS_COMMISSION.transferPerAcre
  const registration = round2(mid(registrationBand) * units)

  const lines: CostLine[] = [
    {
      id: "stamp-duty",
      label: "Stamp duty",
      amount: duty.amount,
      kind: "statutory",
      payableTo: "Ghana Revenue Authority",
      basis: `${duty.ratePct}% of the price, Stamp Duty Act 2005 (Act 689) conveyance schedule`,
    },
    {
      id: "registration",
      label: registrationType === "first" ? "Lands Commission first registration" : "Lands Commission transfer",
      amount: registration,
      kind: "statutory",
      payableTo: "Lands Commission",
      basis:
        registrationBand.low === registrationBand.high
          ? `GH₵${registrationBand.low.toLocaleString("en-GB")} per acre or part of an acre, × ${units}`
          : `GH₵${registrationBand.low.toLocaleString("en-GB")}–${registrationBand.high.toLocaleString("en-GB")} per acre or part of an acre, × ${units} (midpoint)`,
    },
    {
      id: "search",
      label: "Official title search",
      amount: round2(mid(LANDS_COMMISSION.search)),
      kind: "statutory",
      payableTo: "Lands Commission",
      basis: `GH₵${LANDS_COMMISSION.search.low}–${LANDS_COMMISSION.search.high} regional office fee (midpoint)`,
    },
    {
      id: "legal",
      label: "Legal and conveyancing fees",
      amount: round2((price * Math.max(0, legalFeePct)) / 100),
      kind: "market",
      payableTo: "Your lawyer",
      basis: `${legalFeePct}% of the price; practitioners commonly quote ${MARKET_RANGES.legalFeePct.min}–${MARKET_RANGES.legalFeePct.max}%`,
    },
  ]

  if (usingMortgage) {
    lines.push(
      {
        id: "valuation",
        label: "Valuation",
        amount: round2(Math.max(0, valuationFee)),
        kind: "market",
        payableTo: "Valuer, via the lender",
        basis: "Flat fee set by the lender's panel valuer",
        mortgageOnly: true,
      },
      {
        id: "arrangement",
        label: "Lender arrangement fee",
        amount: round2((loanAmount * Math.max(0, arrangementFeePct)) / 100),
        kind: "market",
        payableTo: "Your lender",
        basis: `${arrangementFeePct}% of the loan`,
        mortgageOnly: true,
      },
    )
  }

  if (includeFirstYearInsurance) {
    lines.push({
      id: "building-insurance",
      label: "Building insurance, first year",
      amount: round2((price * Math.max(0, buildingInsurancePctPerYear)) / 100),
      kind: "market",
      payableTo: "Insurer",
      basis: `${buildingInsurancePctPerYear}% of the price a year`,
    })

    if (usingMortgage) {
      lines.push({
        id: "life-cover",
        label: "Mortgage life cover, first year",
        amount: round2((loanAmount * Math.max(0, lifeCoverPctPerYear)) / 100),
        kind: "market",
        payableTo: "Insurer",
        basis: `${lifeCoverPctPerYear}% of the loan a year`,
        mortgageOnly: true,
      })
    }
  }

  const statutoryTotal = round2(lines.filter((l) => l.kind === "statutory").reduce((s, l) => s + l.amount, 0))
  const marketTotal = round2(lines.filter((l) => l.kind === "market").reduce((s, l) => s + l.amount, 0))
  const feesTotal = round2(statutoryTotal + marketTotal)

  return {
    lines,
    statutoryTotal,
    marketTotal,
    feesTotal,
    feesPctOfPrice: price > 0 ? round2((feesTotal / price) * 100) : 0,
    cashNeeded: round2(deposit + feesTotal),
    loanAmount,
  }
}

export const DEFAULT_COSTS_INPUT: Omit<BuyingCostsInput, "priceGhs" | "depositGhs"> = {
  usingMortgage: true,
  acres: 1,
  registrationType: "transfer",
  legalFeePct: MARKET_RANGES.legalFeePct.typical,
  valuationFee: MARKET_RANGES.valuationFee.typical,
  arrangementFeePct: MARKET_RANGES.arrangementFeePct.typical,
  buildingInsurancePctPerYear: MARKET_RANGES.buildingInsurancePctPerYear.typical,
  lifeCoverPctPerYear: MARKET_RANGES.lifeCoverPctPerYear.typical,
  includeFirstYearInsurance: true,
}
