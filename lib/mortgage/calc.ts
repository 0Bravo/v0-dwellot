/**
 * Shared mortgage maths for Dwellot.
 *
 * Used by the /mortgage-calculator page and the calculator embedded on
 * property pages, so both always produce the same numbers.
 */

export type MortgageCurrency = "GHS" | "USD"

export interface MortgageInput {
  /** Property price in the loan currency */
  price: number
  /** Deposit / down payment in the loan currency */
  deposit: number
  /** Annual interest rate as a percentage, e.g. 22 for 22% */
  annualRatePct: number
  /** Loan term in years */
  termYears: number
}

export interface MortgageResult {
  loanAmount: number
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  numberOfPayments: number
  /** Deposit as a percentage of the price (0-100) */
  depositPercent: number
  /** Share of total repayments that is principal (0-100) */
  principalSharePct: number
}

const EMPTY_RESULT: MortgageResult = {
  loanAmount: 0,
  monthlyPayment: 0,
  totalPayment: 0,
  totalInterest: 0,
  numberOfPayments: 0,
  depositPercent: 0,
  principalSharePct: 0,
}

function safe(value: number): number {
  return Number.isFinite(value) ? value : 0
}

/** Keep a deposit between zero and the property price. */
export function clampDeposit(deposit: number, price: number): number {
  const p = Math.max(0, safe(price))
  return Math.min(Math.max(0, safe(deposit)), p)
}

/**
 * Standard amortising (reducing balance) repayment mortgage with monthly
 * payments. Returns zeros for inputs that cannot produce a loan.
 */
export function calculateMortgage(input: MortgageInput): MortgageResult {
  const price = Math.max(0, safe(input.price))
  const deposit = clampDeposit(input.deposit, price)
  const rate = Math.max(0, safe(input.annualRatePct))
  const termYears = Math.max(0, safe(input.termYears))

  const loanAmount = price - deposit
  const numberOfPayments = Math.round(termYears * 12)
  const depositPercent = price > 0 ? (deposit / price) * 100 : 0

  if (loanAmount <= 0 || numberOfPayments <= 0) {
    return { ...EMPTY_RESULT, depositPercent }
  }

  const monthlyRate = rate / 100 / 12
  let monthlyPayment: number

  if (monthlyRate === 0) {
    // Interest-free: straight-line repayment
    monthlyPayment = loanAmount / numberOfPayments
  } else {
    const growth = Math.pow(1 + monthlyRate, numberOfPayments)
    monthlyPayment = (loanAmount * monthlyRate * growth) / (growth - 1)
  }

  monthlyPayment = safe(monthlyPayment)
  const totalPayment = monthlyPayment * numberOfPayments
  const totalInterest = Math.max(0, totalPayment - loanAmount)

  return {
    loanAmount,
    monthlyPayment,
    totalPayment,
    totalInterest,
    numberOfPayments,
    depositPercent,
    principalSharePct: totalPayment > 0 ? (loanAmount / totalPayment) * 100 : 0,
  }
}

/** Normalise whatever is stored on a property to a supported loan currency. */
export function toMortgageCurrency(currency?: string | null): MortgageCurrency {
  const c = (currency || "").trim().toUpperCase()
  return c === "GHS" || c === "GHC" || c === "GH₵" ? "GHS" : "USD"
}

/** Whole-number money formatting: "GH₵ 500,000" or "$140,000". */
export function formatMoney(amount: number, currency: MortgageCurrency): string {
  const rounded = Math.round(safe(amount)).toLocaleString("en-US")
  return currency === "GHS" ? `GH₵ ${rounded}` : `$${rounded}`
}

export function currencyLabel(currency: MortgageCurrency): string {
  return currency === "GHS" ? "GH₵" : "$"
}
