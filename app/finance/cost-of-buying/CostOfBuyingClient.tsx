"use client"

import { useMemo, useState } from "react"
import { Landmark, Scale } from "lucide-react"
import {
  DEFAULT_COSTS_INPUT,
  MARKET_RANGES,
  calculateBuyingCosts,
  type CostLine,
} from "@/lib/finance/buying-costs"
import MortgageLeadForm from "@/components/mortgage/MortgageLeadForm"
import { RadialSlider } from "@/components/ui/RadialSlider"
import { compactMoney } from "@/lib/finance/format"

interface CostOfBuyingClientProps {
  /** Cedis per US dollar, for display conversion only */
  usdGhs: number
  /** Cedis per pound, null when the Bank of Ghana feed does not carry it */
  gbpGhs: number | null
  fxAsOf: string
  fxSource: string
  fxLive: boolean
}

type Display = "GHS" | "USD" | "GBP"

const DISPLAY_SYMBOL: Record<Display, string> = { GHS: "GH₵", USD: "$", GBP: "£" }

const inputClass =
  "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"

export default function CostOfBuyingClient({
  usdGhs,
  gbpGhs,
  fxAsOf,
  fxSource,
  fxLive,
}: CostOfBuyingClientProps) {
  const [price, setPrice] = useState(1_000_000)
  const [depositPct, setDepositPct] = useState(20)
  const [usingMortgage, setUsingMortgage] = useState(true)
  const [acres, setAcres] = useState(1)
  const [registrationType, setRegistrationType] = useState<"first" | "transfer">("transfer")
  const [legalFeePct, setLegalFeePct] = useState(DEFAULT_COSTS_INPUT.legalFeePct)
  const [includeInsurance, setIncludeInsurance] = useState(true)
  const [display, setDisplay] = useState<Display>("GHS")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [valuationFee, setValuationFee] = useState(DEFAULT_COSTS_INPUT.valuationFee)
  const [arrangementFeePct, setArrangementFeePct] = useState(DEFAULT_COSTS_INPUT.arrangementFeePct)

  const deposit = Math.round((price * depositPct) / 100)

  const result = useMemo(
    () =>
      calculateBuyingCosts({
        ...DEFAULT_COSTS_INPUT,
        priceGhs: price,
        depositGhs: deposit,
        usingMortgage,
        acres,
        registrationType,
        legalFeePct,
        valuationFee,
        arrangementFeePct,
        includeFirstYearInsurance: includeInsurance,
      }),
    [price, deposit, usingMortgage, acres, registrationType, legalFeePct, valuationFee, arrangementFeePct, includeInsurance],
  )

  // Display conversion only: every underlying figure is a cedi amount, because
  // the statutory fees are set in cedis.
  const divisor = display === "GHS" ? 1 : display === "USD" ? usdGhs : (gbpGhs ?? usdGhs)
  const fmt = (ghs: number) => {
    const v = ghs / divisor
    return `${DISPLAY_SYMBOL[display]}${v.toLocaleString("en-GB", { maximumFractionDigits: v < 100 ? 2 : 0 })}`
  }

  const statutory = result.lines.filter((l) => l.kind === "statutory")
  const market = result.lines.filter((l) => l.kind === "market")

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <h2 className="text-xl font-bold text-gray-900">Your purchase</h2>
          <label className="inline-flex items-center gap-2 text-sm">
            <span className="text-gray-700">Show in</span>
            <select
              value={display}
              onChange={(e) => setDisplay(e.target.value as Display)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
              aria-label="Display currency"
            >
              <option value="GHS">Ghana cedi</option>
              <option value="USD">US dollar</option>
              {gbpGhs != null && <option value="GBP">Pound sterling</option>}
            </select>
          </label>
        </div>

        {/* Drag to explore; the fields below take exact figures. The price
            field accepts any amount, so the dial's ends follow the value
            rather than pinning it to a ceiling a typed price can exceed. */}
        <div
          className={`grid ${
            usingMortgage ? "grid-cols-2 gap-2 sm:gap-6" : "grid-cols-1 max-w-[220px] mx-auto"
          } items-start rounded-2xl bg-gray-50 ring-1 ring-gray-100 px-3 sm:px-4 py-3 mb-5`}
        >
          <RadialSlider
            label="Property price"
            value={price}
            min={Math.min(50_000, Math.max(0, price))}
            max={Math.max(10_000_000, Math.ceil(price / 10_000) * 10_000)}
            step={10_000}
            onChange={setPrice}
            format={(v) => compactMoney(v)}
            caption="Drag to explore"
            size={200}
          />
          {usingMortgage && (
            <RadialSlider
              label="Deposit"
              value={depositPct}
              min={5}
              max={50}
              step={1}
              onChange={setDepositPct}
              format={(v) => `${Math.round(v)}%`}
              caption={fmt(deposit)}
              size={200}
              accentClass="stroke-emerald-500"
            />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label htmlFor="cob-price" className="block text-sm font-medium text-gray-700 mb-1">
              Property price (GH₵)
            </label>
            <input
              id="cob-price"
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
              className={inputClass}
            />
            {display !== "GHS" && (
              <p className="text-xs text-gray-500 mt-1">
                About {fmt(price)} at {(display === "USD" ? usdGhs : (gbpGhs ?? usdGhs)).toFixed(2)} cedis
                to the {display === "USD" ? "dollar" : "pound"}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <span className="block text-sm font-medium text-gray-700 mb-2">How are you paying?</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUsingMortgage(true)}
                aria-pressed={usingMortgage}
                className={`px-4 py-3 rounded-lg border text-left transition ${
                  usingMortgage ? "border-teal-600 bg-teal-50 ring-2 ring-teal-500" : "border-gray-300 hover:border-teal-300"
                }`}
              >
                <span className="block font-semibold text-gray-900">With a mortgage</span>
                <span className="block text-xs text-gray-600">Adds lender fees</span>
              </button>
              <button
                type="button"
                onClick={() => setUsingMortgage(false)}
                aria-pressed={!usingMortgage}
                className={`px-4 py-3 rounded-lg border text-left transition ${
                  !usingMortgage ? "border-teal-600 bg-teal-50 ring-2 ring-teal-500" : "border-gray-300 hover:border-teal-300"
                }`}
              >
                <span className="block font-semibold text-gray-900">Cash</span>
                <span className="block text-xs text-gray-600">Paying the full price</span>
              </button>
            </div>
          </div>

          {usingMortgage && (
            <div className="sm:col-span-2">
              <label htmlFor="cob-deposit" className="block text-sm font-medium text-gray-700 mb-1">
                Deposit: {depositPct}% ({fmt(deposit)})
              </label>
              <input
                id="cob-deposit"
                type="range"
                min={5}
                max={50}
                step={1}
                value={depositPct}
                onChange={(e) => setDepositPct(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
            </div>
          )}

          <div>
            <label htmlFor="cob-reg" className="block text-sm font-medium text-gray-700 mb-1">
              Title status
            </label>
            <select
              id="cob-reg"
              value={registrationType}
              onChange={(e) => setRegistrationType(e.target.value as "first" | "transfer")}
              className={inputClass}
            >
              <option value="transfer">Already registered (transfer)</option>
              <option value="first">Not registered (first registration)</option>
            </select>
          </div>

          <div>
            <label htmlFor="cob-acres" className="block text-sm font-medium text-gray-700 mb-1">
              Land size (acres)
            </label>
            <input
              id="cob-acres"
              type="number"
              min={0}
              step={0.25}
              value={acres}
              onChange={(e) => setAcres(Math.max(0, Number(e.target.value)))}
              className={inputClass}
            />
            <p className="text-xs text-gray-500 mt-1">
              Charged per acre or part of an acre, so one plot counts as one.
            </p>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="cob-legal" className="block text-sm font-medium text-gray-700 mb-1">
              Legal fees: {legalFeePct}% of the price ({fmt((price * legalFeePct) / 100)})
            </label>
            <input
              id="cob-legal"
              type="range"
              min={MARKET_RANGES.legalFeePct.min}
              max={MARKET_RANGES.legalFeePct.max}
              step={0.5}
              value={legalFeePct}
              onChange={(e) => setLegalFeePct(Number(e.target.value))}
              className="w-full accent-teal-600"
            />
            <p className="text-xs text-gray-500">
              No fixed schedule binds this. Get the quote in writing before you instruct.
            </p>
          </div>

          <label className="sm:col-span-2 inline-flex items-start gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={includeInsurance}
              onChange={(e) => setIncludeInsurance(e.target.checked)}
              className="mt-1 accent-teal-600"
            />
            <span>
              Include the first year of building insurance{usingMortgage ? " and mortgage life cover" : ""}.
              Lenders normally require both from day one.
            </span>
          </label>

          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="text-sm font-medium text-teal-700"
              aria-expanded={showAdvanced}
            >
              {showAdvanced ? "Hide" : "Adjust"} lender fees
            </button>
            {showAdvanced && usingMortgage && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <div>
                  <label htmlFor="cob-val" className="block text-sm font-medium text-gray-700 mb-1">
                    Valuation fee (GH₵)
                  </label>
                  <input
                    id="cob-val"
                    type="number"
                    min={0}
                    value={valuationFee}
                    onChange={(e) => setValuationFee(Math.max(0, Number(e.target.value)))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="cob-arr" className="block text-sm font-medium text-gray-700 mb-1">
                    Arrangement fee (% of loan)
                  </label>
                  <input
                    id="cob-arr"
                    type="number"
                    min={0}
                    step={0.1}
                    value={arrangementFeePct}
                    onChange={(e) => setArrangementFeePct(Math.max(0, Number(e.target.value)))}
                    className={inputClass}
                  />
                </div>
              </div>
            )}
            {showAdvanced && !usingMortgage && (
              <p className="text-sm text-gray-600 mt-2">No lender fees apply to a cash purchase.</p>
            )}
          </div>
        </div>
      </section>

      {/* Headline */}
      <section className="bg-teal-700 rounded-xl p-6 md:p-8 text-white">
        <p className="text-teal-100 text-sm mb-1">On top of the price, you need</p>
        <p className="text-3xl md:text-4xl font-bold mb-3">{fmt(result.feesTotal)}</p>
        <p className="text-teal-50 text-sm">
          That is {result.feesPctOfPrice}% of the price in fees, taxes and insurance.{" "}
          {usingMortgage ? (
            <>
              With a {depositPct}% deposit of {fmt(deposit)}, you need{" "}
              <strong>{fmt(result.cashNeeded)}</strong> in cash to complete, and borrow{" "}
              {fmt(result.loanAmount)}.
            </>
          ) : (
            <>
              Paying cash, the total out of pocket is <strong>{fmt(result.cashNeeded)}</strong>.
            </>
          )}
        </p>
      </section>

      {/* Breakdown */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold text-gray-900">Where it goes</h2>

        <CostGroup
          title="Government and statutory"
          icon={<Landmark className="w-5 h-5 text-teal-600" aria-hidden="true" />}
          blurb="Set by law or by a published fee schedule. The Lands Commission issues its own assessment for each application, so treat these as close rather than exact."
          lines={statutory}
          total={result.statutoryTotal}
          fmt={fmt}
        />

        <CostGroup
          title="Professional and lender"
          icon={<Scale className="w-5 h-5 text-teal-600" aria-hidden="true" />}
          blurb="Negotiated, not fixed. These are the figures you can actually shop around on, and the ones above are the figures you cannot."
          lines={market}
          total={result.marketTotal}
          fmt={fmt}
        />

        <div className="bg-gray-900 text-white rounded-xl p-5 flex items-center justify-between">
          <span className="font-semibold">Total on top of the price</span>
          <span className="text-xl font-bold">{fmt(result.feesTotal)}</span>
        </div>

        <div className="space-y-2 text-xs text-gray-500">
          <p>
            Figures convert at{" "}
            {fxLive ? "the latest" : "the last recorded"} rate from {fxSource}, {usdGhs.toFixed(2)} to the
            dollar{gbpGhs != null ? ` and ${gbpGhs.toFixed(2)} to the pound` : ""}
            {fxAsOf ? `, ${fxAsOf}` : ""}. Statutory fees are set in cedis, so a buyer earning abroad carries
            the exchange-rate risk on all of this.
          </p>
          <p>
            Not tax or legal advice. Stamp duty is assessed on the instrument and the Lands Commission assesses
            each application on its own facts, so your bill can differ. Confirm with your lawyer and the
            relevant authority.
          </p>
        </div>
      </section>

      {/* Lead capture */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
        <MortgageLeadForm
          source="cost_of_buying"
          context={{
            currency: "GHS",
            propertyPrice: price,
            deposit: usingMortgage ? deposit : price,
            loanAmount: result.loanAmount,
            monthlyPayment: 0,
            interestRate: 0,
            termYears: 0,
          }}
        />
      </section>
    </div>
  )
}

function CostGroup({
  title,
  icon,
  blurb,
  lines,
  total,
  fmt,
}: {
  title: string
  icon: React.ReactNode
  blurb: string
  lines: CostLine[]
  total: number
  fmt: (v: number) => string
}) {
  if (lines.length === 0) return null
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <h3 className="font-bold text-gray-900">{title}</h3>
        </div>
        <p className="text-sm text-gray-600">{blurb}</p>
      </div>
      <ul className="divide-y divide-gray-200">
        {lines.map((line) => (
          <li key={line.id} className="p-4 sm:px-5 flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-gray-900">{line.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{line.basis}</p>
              <p className="text-xs text-gray-500">Paid to {line.payableTo}</p>
            </div>
            <span className="font-semibold text-gray-900 whitespace-nowrap">{fmt(line.amount)}</span>
          </li>
        ))}
      </ul>
      <div className="px-5 py-3 bg-gray-50 flex items-center justify-between text-sm">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-semibold text-gray-900">{fmt(total)}</span>
      </div>
    </div>
  )
}
