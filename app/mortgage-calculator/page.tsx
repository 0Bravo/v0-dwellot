"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  Calculator,
  Home,
  Percent,
  Calendar,
  Wallet,
  TrendingUp,
  Building2,
  Phone,
  Info,
  ChevronRight,
  Activity,
} from "lucide-react"
import { PageHero } from "@/components/ui/PageHero"
import { RadialSlider } from "@/components/ui/RadialSlider"

/**
 * Whole percentages read as whole; a percentage left fractional by a price
 * change keeps one decimal rather than rounding to a figure that contradicts
 * the deposit shown elsewhere on the page.
 */
function formatDepositPct(value: number) {
  const r = Math.round(value * 10) / 10
  return `${Number.isInteger(r) ? r : r.toFixed(1)}%`
}

/** Short money for the middle of a dial: GH₵ 1.2M, GH₵ 950K. */
function compactMoney(value: number, symbol: string) {
  const abs = Math.abs(value)
  if (abs >= 1_000_000) {
    const m = value / 1_000_000
    return `${symbol} ${(m >= 10 ? Math.round(m) : Number(m.toFixed(1))).toLocaleString()}M`
  }
  if (abs >= 1_000) return `${symbol} ${Math.round(value / 1_000).toLocaleString()}K`
  return `${symbol} ${Math.round(value).toLocaleString()}`
}
import {
  calculateMortgage,
  clampDeposit,
  currencyLabel,
  formatMoney,
  type MortgageCurrency,
} from "@/lib/mortgage/calc"
import { BASIS_LABEL, MORTGAGE_DEFAULTS, formatRateDate, type RateBasis } from "@/lib/mortgage/rates"
import { useMortgageRates } from "@/hooks/use-mortgage-rates"
import AffordabilityCalculator from "@/components/mortgage/AffordabilityCalculator"
import MortgageLeadForm from "@/components/mortgage/MortgageLeadForm"

const PRICE_LIMITS: Record<MortgageCurrency, { min: number; max: number; step: number; start: number }> = {
  GHS: { min: 50000, max: 10000000, step: 10000, start: 1000000 },
  USD: { min: 20000, max: 2000000, step: 5000, start: 150000 },
}

const CURRENCY_OPTIONS: Array<{ value: MortgageCurrency; label: string; hint: string }> = [
  { value: "GHS", label: "Ghana cedi mortgage", hint: "For buyers earning in cedis" },
  { value: "USD", label: "US dollar mortgage", hint: "Common for diaspora buyers" },
]

const BASIS_STYLE: Record<RateBasis, string> = {
  published: "bg-teal-50 text-teal-700",
  "grr-linked": "bg-green-50 text-green-700",
  reported: "bg-amber-50 text-amber-700",
  estimate: "bg-gray-100 text-gray-600",
}

export default function MortgageCalculatorPage() {
  const [currency, setCurrency] = useState<MortgageCurrency>("GHS")
  const [propertyPrice, setPropertyPrice] = useState(PRICE_LIMITS.GHS.start)
  const [downPayment, setDownPayment] = useState(
    PRICE_LIMITS.GHS.start * (MORTGAGE_DEFAULTS.GHS.depositPct / 100),
  )
  const [interestRate, setInterestRate] = useState(MORTGAGE_DEFAULTS.GHS.rate)
  const [loanTerm, setLoanTerm] = useState(MORTGAGE_DEFAULTS.GHS.termYears)

  const { grr, lenders, ratesReviewed } = useMortgageRates()
  const lenderRates = lenders[currency]
  const limits = PRICE_LIMITS[currency]
  const defaults = MORTGAGE_DEFAULTS[currency]
  const symbol = currencyLabel(currency)

  const calculations = useMemo(
    () =>
      calculateMortgage({
        price: propertyPrice,
        deposit: downPayment,
        annualRatePct: interestRate,
        termYears: loanTerm,
      }),
    [propertyPrice, downPayment, interestRate, loanTerm],
  )

  const switchCurrency = (next: MortgageCurrency) => {
    if (next === currency) return
    const nextDefaults = MORTGAGE_DEFAULTS[next]
    const nextPrice = PRICE_LIMITS[next].start
    setCurrency(next)
    setPropertyPrice(nextPrice)
    setDownPayment(nextPrice * (nextDefaults.depositPct / 100))
    setInterestRate(nextDefaults.rate)
    setLoanTerm(nextDefaults.termYears)
  }

  const handlePriceChange = (value: number) => {
    setPropertyPrice(value)
    setDownPayment((current) => clampDeposit(current, value))
  }

  const applyLender = (rate: number, maxTermYears: number) => {
    setInterestRate(rate)
    if (loanTerm > maxTermYears) setLoanTerm(maxTermYears)
  }

  const whatsappMessage = encodeURIComponent(
    `Hi, I used the mortgage calculator on Dwellot (${formatMoney(propertyPrice, currency)} property, ` +
      `${formatMoney(calculations.loanAmount, currency)} loan over ${loanTerm} years at ${interestRate}%) ` +
      `and would like to discuss financing options.`,
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <PageHero
        icon={Calculator}
        title="Ghana Mortgage Calculator"
        subtitle="Estimate your monthly repayments on a property in Ghana, in cedis or US dollars"
      >
        <p className="inline-flex flex-wrap items-center gap-2 px-4 py-2 rounded-full bg-white/10 ring-1 ring-white/15 text-teal-50 text-sm">
          <Activity className="w-4 h-4" aria-hidden="true" />
          Ghana Reference Rate: <span className="font-semibold text-white">{grr.rate}%</span>
          {grr.effectiveDate && <span className="text-teal-200">effective {formatRateDate(grr.effectiveDate)}</span>}
        </p>
      </PageHero>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Calculate Your Mortgage</h2>

              <div className="space-y-6">
                {/* Loan Currency */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Mortgage Currency</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {CURRENCY_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => switchCurrency(option.value)}
                        aria-pressed={currency === option.value}
                        className={`py-3 px-4 rounded-lg border text-left transition ${
                          currency === option.value
                            ? "bg-teal-600 text-white border-teal-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-teal-300"
                        }`}
                      >
                        <span className="block font-medium">{option.label}</span>
                        <span className={`block text-xs ${currency === option.value ? "text-teal-100" : "text-gray-500"}`}>
                          {option.hint}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dials. Drag to explore; the fields below stay for exact
                    figures, because a dial spanning the whole price range
                    cannot land on a specific asking price. */}
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-2xl bg-gray-50 ring-1 ring-gray-100 px-4 py-3">
                  <RadialSlider
                    label="Property price"
                    value={propertyPrice}
                    min={limits.min}
                    max={limits.max}
                    step={limits.step}
                    onChange={handlePriceChange}
                    format={(v) => compactMoney(v, symbol)}
                    caption="Drag to explore"
                    size={200}
                  />
                  <RadialSlider
                    label="Deposit"
                    value={calculations.depositPercent}
                    /* clampDeposit holds the deposit in 0..price, so the real
                       range is the full 0-100%. Declaring a narrower band let
                       the value fall outside it when raising the price pushed
                       the percentage down, which parks the handle at the wrong
                       end and reports an aria-valuenow below aria-valuemin. */
                    min={0}
                    max={100}
                    step={1}
                    onChange={(pct) => setDownPayment(clampDeposit(Math.round((propertyPrice * pct) / 100), propertyPrice))}
                    format={formatDepositPct}
                    caption={formatMoney(downPayment, currency)}
                    size={200}
                    accentClass="stroke-emerald-500"
                  />
                </div>

                {/* Property Price */}
                <div>
                  <label htmlFor="property-price" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Home className="w-4 h-4 text-teal-600" />
                    Property Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      {symbol}
                    </span>
                    <input
                      id="property-price"
                      type="number"
                      value={propertyPrice || ""}
                      onChange={(e) => handlePriceChange(Number(e.target.value))}
                      className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      min={0}
                      step={limits.step}
                    />
                  </div>
                  <input
                    type="range"
                    aria-label="Property price"
                    value={propertyPrice}
                    onChange={(e) => handlePriceChange(Number(e.target.value))}
                    min={limits.min}
                    max={limits.max}
                    step={limits.step}
                    className="w-full mt-2 accent-teal-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{formatMoney(limits.min, currency)}</span>
                    <span>{formatMoney(limits.max, currency)}</span>
                  </div>
                </div>

                {/* Down Payment */}
                <div>
                  <label htmlFor="down-payment" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Wallet className="w-4 h-4 text-teal-600" />
                    Down Payment ({calculations.depositPercent.toFixed(1)}%)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      {symbol}
                    </span>
                    <input
                      id="down-payment"
                      type="number"
                      value={downPayment || ""}
                      onChange={(e) => setDownPayment(clampDeposit(Number(e.target.value), propertyPrice))}
                      className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      min={0}
                      max={propertyPrice}
                      step={limits.step / 2}
                    />
                  </div>
                  <input
                    type="range"
                    aria-label="Down payment"
                    value={downPayment}
                    onChange={(e) => setDownPayment(clampDeposit(Number(e.target.value), propertyPrice))}
                    min={0}
                    max={propertyPrice}
                    step={limits.step / 2}
                    className="w-full mt-2 accent-teal-600"
                  />
                  <div className="flex gap-2 mt-2">
                    {[10, 20, 30].map((percent) => (
                      <button
                        key={percent}
                        type="button"
                        onClick={() => setDownPayment(Math.round(propertyPrice * (percent / 100)))}
                        className="px-3 py-1 text-xs font-medium rounded-full border border-gray-300 text-gray-700 hover:border-teal-300"
                      >
                        {percent}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interest Rate */}
                <div>
                  <label htmlFor="interest-rate" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Percent className="w-4 h-4 text-teal-600" />
                    Annual Interest Rate
                  </label>
                  <div className="relative">
                    <input
                      id="interest-rate"
                      type="number"
                      value={interestRate || ""}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      min={0}
                      max={60}
                      step={0.25}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                  <input
                    type="range"
                    aria-label="Annual interest rate"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    min={5}
                    max={40}
                    step={0.25}
                    className="w-full mt-2 accent-teal-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5%</span>
                    <span>40%</span>
                  </div>
                </div>

                {/* Loan Term */}
                <div>
                  <p className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    Loan Term
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {defaults.terms.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setLoanTerm(term)}
                        aria-pressed={loanTerm === term}
                        className={`py-3 px-4 rounded-lg border font-medium transition ${
                          loanTerm === term
                            ? "bg-teal-600 text-white border-teal-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-teal-300"
                        }`}
                      >
                        {term} years
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Rates Reference */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-600" />
                {currency === "GHS" ? "Cedi" : "US Dollar"} Mortgage Rates from Banks in Ghana
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Rates reviewed {formatRateDate(ratesReviewed)}. Ghana Reference Rate {grr.rate}%
                {grr.effectiveDate ? `, effective ${formatRateDate(grr.effectiveDate)}` : ""} (source:{" "}
                <a
                  href={grr.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-700 underline"
                >
                  {grr.source}
                </a>
                {grr.live ? ", live" : ""}).
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 font-semibold text-gray-700">Bank</th>
                      <th className="text-left py-3 font-semibold text-gray-700">Interest Rate</th>
                      <th className="text-left py-3 font-semibold text-gray-700">Basis</th>
                      <th className="text-center py-3 font-semibold text-gray-700">Max Term</th>
                      <th className="text-right py-3 font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lenderRates.map((lender) => (
                      <tr key={lender.id} className="border-b border-gray-100 last:border-0">
                        <td className="py-3 font-medium text-gray-900">
                          {lender.name}
                          {lender.note && <span className="block text-xs font-normal text-gray-500">{lender.note}</span>}
                        </td>
                        <td className="py-3 text-gray-700 whitespace-nowrap">{lender.display}</td>
                        <td className="py-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${BASIS_STYLE[lender.basis]}`}
                          >
                            {BASIS_LABEL[lender.basis]}
                          </span>
                          <span className="block text-xs text-gray-500 mt-0.5">{formatRateDate(lender.asOf)}</span>
                        </td>
                        <td className="py-3 text-center text-gray-700 whitespace-nowrap">{lender.maxTermYears} years</td>
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            onClick={() => applyLender(lender.rate, lender.maxTermYears)}
                            className="text-teal-600 hover:text-teal-700 font-medium text-sm whitespace-nowrap"
                          >
                            Apply {lender.rate}%
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-xs text-gray-500 mt-4 flex items-start gap-1.5">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>
                  Most banks in Ghana do not publish a mortgage rate, so only rows marked &quot;Published by bank&quot; or
                  &quot;Live: tracks GRR&quot; come from a bank&apos;s own published terms. &quot;Reported&quot; and
                  &quot;Estimate&quot; rows are indicative market figures; applying an estimate uses the middle of its
                  range. Cedi mortgages are usually priced as the Ghana Reference Rate plus the bank&apos;s margin. Rates
                  exclude fees and insurance. Always confirm the current offer with the bank.
                </p>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Your Estimate</h3>

              {/* Monthly Payment */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-800 p-6 mb-6">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]"
                />
                <div className="relative">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-200">
                    Monthly payment
                  </p>
                  <p className="text-4xl md:text-5xl font-bold text-white tracking-tight tabular-nums mt-1.5">
                    {formatMoney(calculations.monthlyPayment, currency)}
                  </p>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Loan Amount</span>
                  <span className="font-semibold text-gray-900 tabular-nums">
                    {formatMoney(calculations.loanAmount, currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Total Interest</span>
                  <span className="font-semibold text-gray-900 tabular-nums">
                    {formatMoney(calculations.totalInterest, currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Total Payment</span>
                  <span className="font-semibold text-gray-900 tabular-nums">
                    {formatMoney(calculations.totalPayment, currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">Loan Term</span>
                  <span className="font-semibold text-gray-900">{loanTerm} years</span>
                </div>
              </div>

              {/* Visual Breakdown */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Payment Breakdown</p>
                <div className="h-4 rounded-full overflow-hidden flex">
                  <div
                    className="bg-teal-600"
                    style={{ width: `${calculations.totalPayment > 0 ? calculations.principalSharePct : 50}%` }}
                  />
                  <div className="bg-orange-400 flex-1" />
                </div>
                <div className="flex justify-between text-xs mt-2">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-teal-600 rounded-full" />
                    Principal
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-orange-400 rounded-full" />
                    Interest
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <a
                  href="#mortgage-options"
                  className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-teal-700 transition"
                >
                  Get My Mortgage Options
                  <ChevronRight className="w-4 h-4" />
                </a>
                <Link
                  href="/properties"
                  className="w-full flex items-center justify-center gap-2 bg-white text-teal-700 border border-teal-600 py-3 px-4 rounded-lg font-medium hover:bg-teal-50 transition"
                >
                  Browse Properties
                </Link>
                <a
                  href={`https://wa.me/447576368312?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition"
                >
                  <Phone className="w-4 h-4" />
                  Get Expert Help
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Affordability */}
        <div className="mt-8">
          <AffordabilityCalculator
            key={currency}
            currency={currency}
            interestRate={interestRate}
            termYears={loanTerm}
            onUseResult={(price, deposit) => {
              setPropertyPrice(price)
              setDownPayment(clampDeposit(deposit, price))
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
          />
        </div>

        {/* Lead capture */}
        <div className="mt-8" id="mortgage-options">
          <MortgageLeadForm
            context={{
              currency,
              propertyPrice,
              deposit: downPayment,
              loanAmount: calculations.loanAmount,
              monthlyPayment: calculations.monthlyPayment,
              interestRate,
              termYears: loanTerm,
            }}
          />
        </div>

        <p className="mt-6 text-sm text-gray-600">
          Want every lender ranked on these numbers at once?{" "}
          <Link
            href="/finance/compare-mortgage-rates"
            className="text-teal-600 hover:text-teal-700 font-medium underline"
          >
            Compare mortgage rates side by side
          </Link>
          .
        </p>

        <p className="mt-3 text-sm text-gray-600">
          More on financing a home in Ghana:{" "}
          <Link href="/finance" className="text-teal-600 hover:text-teal-700 font-medium underline">
            Dwellot property finance hub
          </Link>{" "}
          and the{" "}
          <Link href="/finance/ghana-reference-rate" className="text-teal-600 hover:text-teal-700 font-medium underline">
            current Ghana Reference Rate
          </Link>
          .
        </p>

        {/* Info Section */}
        <section className="mt-12 bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-teal-600" />
            Understanding Mortgages in Ghana
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Eligibility Requirements</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-1.5 flex-shrink-0" />
                  Minimum age of 21, maximum 60 at loan maturity
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-1.5 flex-shrink-0" />
                  Proof of steady income (employment or business)
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-1.5 flex-shrink-0" />
                  Minimum down payment of 10-30% depending on bank
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-1.5 flex-shrink-0" />
                  Valid Ghana Card or passport
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Required Documents</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-1.5 flex-shrink-0" />
                  6 months bank statements
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-1.5 flex-shrink-0" />
                  Employment letter or business registration
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-1.5 flex-shrink-0" />
                  Property valuation report
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-1.5 flex-shrink-0" />
                  Land title documents
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
