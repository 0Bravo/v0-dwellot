"use client"

import { RadialSlider } from "@/components/ui/RadialSlider"
import type { MortgageCurrency } from "@/lib/mortgage/calc"

/**
 * The dials again, under the conversation.
 *
 * The card above an answer is a record: it is what the engine returned for
 * the question that was asked, and the prose beside it explains those
 * figures, so it must not move. This is the other thing — where you take
 * the answer next — and it drives the page's real calculator, so the dials
 * at the top and the figure in the results panel move with it.
 *
 * The lender list is here because picking a bank is how most people
 * actually choose a rate, and the rate dial alone invites a made-up
 * number. Choosing one also pulls the term in if that lender will not
 * lend for as long as the term currently set.
 */

export interface QuickAdjustLender {
  id: string
  name: string
  display: string
  rate: number
  maxTermYears: number
  basis: string
}

export function QuickAdjust({
  currency,
  symbol,
  lenders,
  price,
  priceMin,
  priceMax,
  priceStep,
  depositPercent,
  depositLabel,
  rate,
  termYears,
  monthlyLabel,
  basisLabel,
  formatPrice,
  formatRate,
  formatDepositPct,
  onPrice,
  onDepositPct,
  onRate,
  onTerm,
  onLender,
}: {
  currency: MortgageCurrency
  symbol: string
  lenders: QuickAdjustLender[]
  price: number
  priceMin: number
  priceMax: number
  priceStep: number
  depositPercent: number
  depositLabel: string
  rate: number
  termYears: number
  monthlyLabel: string
  basisLabel: (basis: string) => string
  formatPrice: (v: number) => string
  formatRate: (v: number) => string
  formatDepositPct: (v: number) => string
  onPrice: (v: number) => void
  onDepositPct: (pct: number) => void
  onRate: (v: number) => void
  onTerm: (v: number) => void
  onLender: (rate: number, maxTermYears: number) => void
}) {
  /* Matching on the rate rather than holding a selected id: the rate can be
     changed by the dial, by the assistant or by the fields at the top, and
     a stored id would keep claiming a lender the rate no longer belongs to. */
  const current = lenders.find((l) => Math.abs(l.rate - rate) < 0.005)

  return (
    <div className="mt-5 rounded-2xl ring-1 ring-gray-200 bg-gray-50 p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-gray-900">Change it from here</h3>
        <p className="text-sm text-gray-600">
          Now <span className="font-bold text-gray-900 tabular-nums">{monthlyLabel}</span> a month
        </p>
      </div>

      <div className="mt-3">
        <label htmlFor="quick-lender" className="block text-xs font-medium text-gray-700">
          Rate from a lender
        </label>
        <select
          id="quick-lender"
          value={current?.id ?? ""}
          onChange={(e) => {
            const picked = lenders.find((l) => l.id === e.target.value)
            if (picked) onLender(picked.rate, picked.maxTermYears)
          }}
          className="mt-1 w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        >
          <option value="">
            {current ? current.name : `Custom rate — ${formatRate(rate)}`}
          </option>
          {lenders.map((lender) => (
            <option key={lender.id} value={lender.id}>
              {lender.name} — {lender.display} ({basisLabel(lender.basis)}, up to{" "}
              {lender.maxTermYears} years)
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-xs text-gray-500">
          {current
            ? `${current.name}: ${basisLabel(current.basis)}, lends up to ${current.maxTermYears} years.`
            : "Not one of the published rates. Pick a lender to use theirs."}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 items-start gap-2 sm:gap-3">
        <RadialSlider
          label="Price"
          value={price}
          min={priceMin}
          max={priceMax}
          step={priceStep}
          onChange={onPrice}
          format={formatPrice}
          caption={symbol}
          size={150}
        />
        <RadialSlider
          label="Deposit"
          value={depositPercent}
          min={0}
          max={100}
          step={1}
          onChange={onDepositPct}
          format={formatDepositPct}
          caption={depositLabel}
          size={150}
          accentClass="stroke-emerald-500"
        />
        <RadialSlider
          label="Rate"
          value={rate}
          min={0}
          max={60}
          step={0.25}
          onChange={onRate}
          format={formatRate}
          caption="a year"
          size={150}
          accentClass="stroke-amber-500"
        />
        <RadialSlider
          label="Term"
          value={termYears}
          min={5}
          max={30}
          step={1}
          onChange={onTerm}
          format={(v) => `${Math.round(v)} yr`}
          caption={`${Math.round(termYears * 12)} payments`}
          size={150}
          accentClass="stroke-sky-500"
        />
      </div>

      <p className="mt-3 text-xs text-gray-500">
        These are the calculator&apos;s own dials, so the estimate at the top of the page moves
        with them. The card above each answer stays as it was answered, in {currency}.
      </p>
    </div>
  )
}
