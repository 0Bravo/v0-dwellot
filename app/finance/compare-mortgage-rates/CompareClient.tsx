"use client"

import { useMemo, useState } from "react"
import { AlertTriangle, ArrowDownUp, Check, ChevronDown, Info } from "lucide-react"
import {
  clampDeposit,
  currencyLabel,
  formatMoney,
  type MortgageCurrency,
} from "@/lib/mortgage/calc"
import { compareLenders, sortRows, type ComparisonRow, type SortKey } from "@/lib/mortgage/compare"
import { BASIS_LABEL, LTV_SOURCE, MORTGAGE_DEFAULTS, formatRateDate } from "@/lib/mortgage/rates"
import MortgageLeadForm from "@/components/mortgage/MortgageLeadForm"

interface CompareClientProps {
  grrRate: number
  grrEffectiveDate: string | null
  ratesReviewed: string
}

const TERMS = [5, 10, 15, 20]

const START: Record<MortgageCurrency, { price: number; depositPct: number }> = {
  GHS: { price: 1_000_000, depositPct: 20 },
  USD: { price: 120_000, depositPct: 20 },
}

const BASIS_STYLE: Record<string, string> = {
  published: "bg-green-100 text-green-800",
  "grr-linked": "bg-teal-100 text-teal-800",
  reported: "bg-amber-100 text-amber-800",
  estimate: "bg-gray-100 text-gray-700",
}

const inputClass =
  "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"

export default function CompareClient({ grrRate, grrEffectiveDate, ratesReviewed }: CompareClientProps) {
  const [currency, setCurrency] = useState<MortgageCurrency>("GHS")
  const [price, setPrice] = useState(START.GHS.price)
  const [deposit, setDeposit] = useState(Math.round(START.GHS.price * 0.2))
  const [termYears, setTermYears] = useState(15)
  const [sortKey, setSortKey] = useState<SortKey>("monthly")
  const [expanded, setExpanded] = useState<string | null>(null)

  const safeDeposit = clampDeposit(deposit, price)
  const depositPct = price > 0 ? (safeDeposit / price) * 100 : 0

  const result = useMemo(
    () => compareLenders({ currency, propertyPrice: price, deposit: safeDeposit, termYears, grrRate }),
    [currency, price, safeDeposit, termYears, grrRate],
  )

  const visibleRows = useMemo(() => sortRows(result.rows, sortKey), [result.rows, sortKey])

  function switchCurrency(next: MortgageCurrency) {
    if (next === currency) return
    setCurrency(next)
    const start = START[next]
    setPrice(start.price)
    setDeposit(Math.round(start.price * (start.depositPct / 100)))
    setTermYears(Math.min(termYears, MORTGAGE_DEFAULTS[next].termYears === 15 ? 20 : 20))
  }

  const money = (v: number) => formatMoney(v, currency)
  const cheapest = result.cheapest

  return (
    <div className="space-y-8">
      {/* ---- Inputs ---- */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Your numbers</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <span className="block text-sm font-medium text-gray-700 mb-2">Mortgage currency</span>
            <div className="grid grid-cols-2 gap-3">
              {(["GHS", "USD"] as MortgageCurrency[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => switchCurrency(c)}
                  aria-pressed={currency === c}
                  className={`px-4 py-3 rounded-lg border text-left transition ${
                    currency === c
                      ? "border-teal-600 bg-teal-50 ring-2 ring-teal-500"
                      : "border-gray-300 hover:border-teal-300"
                  }`}
                >
                  <span className="block font-semibold text-gray-900">
                    {c === "GHS" ? "Ghana cedi" : "US dollar"}
                  </span>
                  <span className="block text-xs text-gray-600">
                    {c === "GHS" ? "If you earn in cedis" : "Common for diaspora buyers"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="cmp-price" className="block text-sm font-medium text-gray-700 mb-1">
              Property price
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm w-10">{currencyLabel(currency)}</span>
              <input
                id="cmp-price"
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="cmp-deposit" className="block text-sm font-medium text-gray-700 mb-1">
              Deposit ({depositPct.toFixed(1)}%)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm w-10">{currencyLabel(currency)}</span>
              <input
                id="cmp-deposit"
                type="number"
                min={0}
                max={price}
                value={safeDeposit}
                onChange={(e) => setDeposit(Math.max(0, Number(e.target.value)))}
                className={inputClass}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <span className="block text-sm font-medium text-gray-700 mb-2">Term</span>
            <div className="grid grid-cols-4 gap-2">
              {TERMS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTermYears(t)}
                  aria-pressed={termYears === t}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${
                    termYears === t
                      ? "border-teal-600 bg-teal-50 text-teal-800 ring-2 ring-teal-500"
                      : "border-gray-300 text-gray-700 hover:border-teal-300"
                  }`}
                >
                  {t} yrs
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-5">
          Borrowing <strong className="text-gray-900">{money(result.loanAmount)}</strong> over {termYears} years.
          Compared across {result.rows.length} {currency === "GHS" ? "cedi" : "US dollar"} lenders.
        </p>
      </section>

      {/* ---- The headline: what the choice is worth ---- */}
      {cheapest && result.spread > 0 && (
        <section className="bg-teal-700 rounded-xl p-6 md:p-8 text-white">
          <p className="text-teal-100 text-sm mb-1">On these numbers, the lender you pick is worth</p>
          <p className="text-3xl md:text-4xl font-bold mb-3">{money(result.spread)}</p>
          <p className="text-teal-50 text-sm">
            That is the difference in total cost between the cheapest option here (
            {cheapest.name}, {cheapest.display}) and the most expensive, over the full term — about{" "}
            {money(result.monthlySpread)} a month.
          </p>
        </section>
      )}

      {/* ---- Comparison table ---- */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Lenders compared</h2>
          <label className="inline-flex items-center gap-2 text-sm">
            <ArrowDownUp className="w-4 h-4 text-gray-500" aria-hidden="true" />
            <span className="text-gray-700">Sort by</span>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
              aria-label="Sort lenders by"
            >
              <option value="monthly">Monthly payment</option>
              <option value="total">Total cost</option>
              <option value="rate">Interest rate</option>
              <option value="name">Lender name</option>
            </select>
          </label>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">Lender</th>
                <th className="px-4 py-3">Rate</th>
                <th className="px-4 py-3">Monthly</th>
                <th className="px-4 py-3">Total interest</th>
                <th className="px-4 py-3">Total cost</th>
                <th className="px-4 py-3">vs cheapest</th>
                <th className="px-4 py-3">Term</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {visibleRows.map((row) => (
                <tr key={row.id} className={row.rank === 1 ? "bg-teal-50/60" : "hover:bg-gray-50"}>
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      {row.rank === 1 && (
                        <Check className="w-4 h-4 text-teal-700 mt-0.5 flex-shrink-0" aria-label="Cheapest" />
                      )}
                      <div>
                        <span className="font-medium text-gray-900">{row.name}</span>
                        <span
                          className={`ml-2 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            BASIS_STYLE[row.basis] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {BASIS_LABEL[row.basis]}
                        </span>
                        <Flags row={row} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{row.display}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
                    {money(row.monthlyPayment)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{money(row.totalInterest)}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{money(row.totalPayment)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {row.rank === 1 ? (
                      <span className="text-teal-700 font-medium">cheapest</span>
                    ) : row.rank === 0 ? (
                      <span className="text-gray-500">not ranked</span>
                    ) : (
                      <span className="text-gray-600">+{money(row.extraVsCheapest)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {row.termYears} yrs
                    {row.termCapped && <span className="block text-xs text-amber-700">their max</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {visibleRows.map((row) => (
            <div
              key={row.id}
              className={`bg-white rounded-xl border p-4 ${
                row.rank === 1 ? "border-teal-300 ring-1 ring-teal-200" : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{row.name}</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {row.display} · {row.termYears} yrs
                    {row.termCapped && " (their max)"}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-gray-900">{money(row.monthlyPayment)}</p>
                  <p className="text-xs text-gray-500">a month</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    BASIS_STYLE[row.basis] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {BASIS_LABEL[row.basis]}
                </span>
                {row.rank === 1 ? (
                  <span className="text-xs font-medium text-teal-700">Cheapest overall</span>
                ) : row.rank === 0 ? (
                  <span className="text-xs text-gray-500">Not ranked: shorter term</span>
                ) : (
                  <span className="text-xs text-gray-600">+{money(row.extraVsCheapest)} in total</span>
                )}
              </div>

              <Flags row={row} />

              <button
                type="button"
                onClick={() => setExpanded(expanded === row.id ? null : row.id)}
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-700"
                aria-expanded={expanded === row.id}
              >
                Details
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${expanded === row.id ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>

              {expanded === row.id && (
                <dl className="mt-3 pt-3 border-t border-gray-200 space-y-1.5 text-sm">
                  <Detail label="Total interest" value={money(row.totalInterest)} />
                  <Detail label="Total cost" value={money(row.totalPayment)} />
                  <Detail label="Loan amount" value={money(row.loanAmount)} />
                  <Detail label="Lender's maximum term" value={`${row.maxTermYears} years`} />
                  {row.maxLtvPct != null && (
                    <Detail
                      label="Reported max loan"
                      value={`${row.maxLtvPct}% of price (${row.minDepositPct}% deposit)`}
                    />
                  )}
                  <Detail label="Figure dates from" value={formatRateDate(row.asOf)} />
                  {row.note && <p className="text-gray-600 pt-1">{row.note}</p>}
                </dl>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2 text-xs text-gray-500">
          {result.unrankedCount > 0 && (
            <p>
              {result.unrankedCount === 1 ? "One lender is" : `${result.unrankedCount} lenders are`} shown but
              not ranked, because {result.unrankedCount === 1 ? "its" : "their"} maximum term is shorter than{" "}
              {termYears} years. A shorter term always means less total interest and a bigger monthly payment,
              so ranking it alongside the others would make it look cheaper than it is.
            </p>
          )}
          <p>
            Rates reviewed {formatRateDate(ratesReviewed)}. Ghana Reference Rate {grrRate}%
            {grrEffectiveDate ? `, effective ${formatRateDate(grrEffectiveDate)}` : ""}. Lenders priced as
            &ldquo;GRR + margin&rdquo; move with it automatically.
          </p>
          <p>
            Only rows marked &ldquo;Published by bank&rdquo; or &ldquo;Live: tracks GRR&rdquo; come from a
            bank&rsquo;s own published terms. &ldquo;Reported&rdquo; and &ldquo;Estimate&rdquo; rows are
            indicative market figures, and an estimate is calculated at the middle of its range. Deposit limits
            are {LTV_SOURCE.label.toLowerCase()} from {formatRateDate(LTV_SOURCE.asOf)}, not quotes.
          </p>
          <p>
            Every figure excludes arrangement fees, valuation fees, legal fees and the property and life
            insurance most lenders require, which together typically add a few percent of the price up front.
            Confirm the current offer with the lender.
          </p>
        </div>
      </section>

      {/* ---- Lead capture ---- */}
      {cheapest && (
        <section id="quotes" className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <MortgageLeadForm
            source="mortgage_comparison"
            context={{
              currency,
              propertyPrice: price,
              deposit: safeDeposit,
              loanAmount: result.loanAmount,
              monthlyPayment: cheapest.monthlyPayment,
              interestRate: cheapest.rate,
              termYears: cheapest.termYears,
            }}
          />
        </section>
      )}
    </div>
  )
}

function Flags({ row }: { row: ComparisonRow }) {
  if (!row.termCapped && !row.depositShort) return null
  return (
    <div className="mt-1.5 space-y-1">
      {row.termCapped && (
        <p className="flex items-start gap-1.5 text-xs text-amber-700">
          <Info className="w-3.5 h-3.5 mt-px flex-shrink-0" aria-hidden="true" />
          Quoted over {row.termYears} years, this lender&rsquo;s maximum, so it is not ranked against the rest
        </p>
      )}
      {row.depositShort && (
        <p className="flex items-start gap-1.5 text-xs text-amber-700">
          <AlertTriangle className="w-3.5 h-3.5 mt-px flex-shrink-0" aria-hidden="true" />
          Reported to need about {row.minDepositPct}% deposit
        </p>
      )}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-gray-900 text-right">{value}</dd>
    </div>
  )
}
