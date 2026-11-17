"use client"

import { useMemo, useState } from "react"
import { Banknote, CreditCard, PiggyBank, Wallet } from "lucide-react"
import { calculateAffordability, currencyLabel, formatMoney, type MortgageCurrency } from "@/lib/mortgage/calc"

interface AffordabilityCalculatorProps {
  currency: MortgageCurrency
  /** Rate and term carried over from the main calculator */
  interestRate: number
  termYears: number
  /** Send the result up so the main calculator can adopt it */
  onUseResult?: (price: number, deposit: number) => void
}

const START: Record<MortgageCurrency, { income: number; debts: number; deposit: number; step: number }> = {
  GHS: { income: 25000, debts: 0, deposit: 200000, step: 500 },
  USD: { income: 5000, debts: 0, deposit: 30000, step: 100 },
}

const DSR_OPTIONS = [30, 35, 40, 45, 50]

const inputClass =
  "w-full pl-14 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"

export default function AffordabilityCalculator({
  currency,
  interestRate,
  termYears,
  onUseResult,
}: AffordabilityCalculatorProps) {
  const start = START[currency]
  const [income, setIncome] = useState(start.income)
  const [debts, setDebts] = useState(start.debts)
  const [deposit, setDeposit] = useState(start.deposit)
  // Absa and Republic Bank both work to a 50% cap on total debt repayments.
  const [dsr, setDsr] = useState(50)
  const symbol = currencyLabel(currency)

  const result = useMemo(
    () =>
      calculateAffordability({
        monthlyIncome: income,
        monthlyDebts: debts,
        deposit,
        annualRatePct: interestRate,
        termYears,
        debtServiceRatioPct: dsr,
      }),
    [income, debts, deposit, interestRate, termYears, dsr],
  )

  const fields = [
    { id: "aff-income", label: "Net monthly income", icon: Banknote, value: income, set: setIncome },
    { id: "aff-debts", label: "Existing monthly loan repayments", icon: CreditCard, value: debts, set: setDebts },
    { id: "aff-deposit", label: "Deposit you have saved", icon: PiggyBank, value: deposit, set: setDeposit },
  ]

  return (
    <section id="affordability" className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 scroll-mt-24">
      <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
        <Wallet className="w-5 h-5 text-teal-600" />
        How much can I borrow?
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Work backwards from your income. Uses the {interestRate}% rate and {termYears}-year term chosen above, in{" "}
        {currency === "GHS" ? "Ghana cedis" : "US dollars"}.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-5">
          {fields.map(({ id, label, icon: Icon, value, set }) => (
            <div key={id}>
              <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Icon className="w-4 h-4 text-teal-600" />
                {label}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">{symbol}</span>
                <input
                  id={id}
                  type="number"
                  min={0}
                  step={start.step}
                  value={value || ""}
                  onChange={(e) => set(Math.max(0, Number(e.target.value)))}
                  className={inputClass}
                />
              </div>
            </div>
          ))}

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Share of income a lender allows for repayments
            </p>
            <div className="flex flex-wrap gap-2">
              {DSR_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setDsr(option)}
                  aria-pressed={dsr === option}
                  className={`py-2 px-4 rounded-lg border text-sm font-medium transition ${
                    dsr === option
                      ? "bg-teal-600 text-white border-teal-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-teal-300"
                  }`}
                >
                  {option}%
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Absa and Republic Bank both cap total debt repayments at 50% of net income. That is the maximum they
              allow, not a target: borrowing at the cap leaves nothing spare for rates, repairs or a change in
              circumstances. Ask your lender for its own limit.
            </p>
          </div>
        </div>

        <div>
          <div className="bg-teal-50 rounded-xl p-6 text-center mb-4">
            <p className="text-sm text-teal-700 font-medium mb-1">Property price you could afford</p>
            <p className="text-3xl md:text-4xl font-bold text-teal-700">
              {formatMoney(result.maxPropertyPrice, currency)}
            </p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Maximum loan</span>
              <span className="font-semibold text-gray-900">{formatMoney(result.maxLoan, currency)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Your deposit</span>
              <span className="font-semibold text-gray-900">{formatMoney(deposit, currency)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Monthly repayment</span>
              <span className="font-semibold text-gray-900">
                {formatMoney(result.maxMonthlyPayment, currency)}
              </span>
            </div>
          </div>

          {onUseResult && result.maxLoan > 0 && (
            <button
              type="button"
              onClick={() => onUseResult(Math.round(result.maxPropertyPrice), Math.round(deposit))}
              className="mt-5 w-full bg-white text-teal-700 border border-teal-600 py-3 px-4 rounded-lg font-medium hover:bg-teal-50 transition"
            >
              Use these figures in the calculator
            </button>
          )}

          <p className="text-xs text-gray-500 mt-4">
            A guide only. Lenders also look at your age, employment, credit history and the property itself, and add
            fees and insurance.
          </p>
        </div>
      </div>
    </section>
  )
}
