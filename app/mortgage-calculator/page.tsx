"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Calculator,
  Home,
  Percent,
  Calendar,
  DollarSign,
  TrendingUp,
  Building2,
  Phone,
  Info,
  ChevronRight,
} from "lucide-react"

const BANKS = [
  { name: "GCB Bank", rate: 27.5, maxTerm: 20 },
  { name: "Absa Ghana", rate: 26.0, maxTerm: 25 },
  { name: "Stanbic Bank", rate: 25.5, maxTerm: 20 },
  { name: "Ecobank Ghana", rate: 28.0, maxTerm: 15 },
  { name: "Fidelity Bank", rate: 27.0, maxTerm: 20 },
]

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function MortgageCalculatorPage() {
  const [propertyPrice, setPropertyPrice] = useState(500000)
  const [downPayment, setDownPayment] = useState(100000)
  const [interestRate, setInterestRate] = useState(26)
  const [loanTerm, setLoanTerm] = useState(15)

  const calculations = useMemo(() => {
    const principal = propertyPrice - downPayment
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12

    if (principal <= 0 || monthlyRate <= 0 || numberOfPayments <= 0) {
      return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0, principal: 0 }
    }

    const monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

    const totalPayment = monthlyPayment * numberOfPayments
    const totalInterest = totalPayment - principal

    return {
      monthlyPayment: isNaN(monthlyPayment) ? 0 : monthlyPayment,
      totalPayment: isNaN(totalPayment) ? 0 : totalPayment,
      totalInterest: isNaN(totalInterest) ? 0 : totalInterest,
      principal,
    }
  }, [propertyPrice, downPayment, interestRate, loanTerm])

  const downPaymentPercent = propertyPrice > 0 ? ((downPayment / propertyPrice) * 100).toFixed(1) : "0"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-teal-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-full mb-4">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 text-balance">
            Ghana Mortgage Calculator
          </h1>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto">
            Estimate your monthly mortgage payments for properties in Ghana
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Calculate Your Mortgage</h2>

              <div className="space-y-6">
                {/* Property Price */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Home className="w-4 h-4 text-teal-600" />
                    Property Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      GHS
                    </span>
                    <input
                      type="number"
                      value={propertyPrice}
                      onChange={(e) => setPropertyPrice(Number(e.target.value))}
                      className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      min={0}
                      step={10000}
                    />
                  </div>
                  <input
                    type="range"
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(Number(e.target.value))}
                    min={50000}
                    max={5000000}
                    step={10000}
                    className="w-full mt-2 accent-teal-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>GHS 50,000</span>
                    <span>GHS 5,000,000</span>
                  </div>
                </div>

                {/* Down Payment */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 text-teal-600" />
                    Down Payment ({downPaymentPercent}%)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      GHS
                    </span>
                    <input
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      min={0}
                      max={propertyPrice}
                      step={5000}
                    />
                  </div>
                  <input
                    type="range"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    min={0}
                    max={propertyPrice}
                    step={5000}
                    className="w-full mt-2 accent-teal-600"
                  />
                </div>

                {/* Interest Rate */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Percent className="w-4 h-4 text-teal-600" />
                    Annual Interest Rate
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      min={1}
                      max={50}
                      step={0.5}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                  <input
                    type="range"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    min={10}
                    max={40}
                    step={0.5}
                    className="w-full mt-2 accent-teal-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10%</span>
                    <span>40%</span>
                  </div>
                </div>

                {/* Loan Term */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    Loan Term
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[5, 10, 15, 20].map((term) => (
                      <button
                        key={term}
                        onClick={() => setLoanTerm(term)}
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
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-600" />
                Current Bank Mortgage Rates in Ghana
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 font-semibold text-gray-700">Bank</th>
                      <th className="text-center py-3 font-semibold text-gray-700">Interest Rate</th>
                      <th className="text-center py-3 font-semibold text-gray-700">Max Term</th>
                      <th className="text-right py-3 font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BANKS.map((bank) => (
                      <tr key={bank.name} className="border-b border-gray-100 last:border-0">
                        <td className="py-3 font-medium text-gray-900">{bank.name}</td>
                        <td className="py-3 text-center text-gray-700">{bank.rate}%</td>
                        <td className="py-3 text-center text-gray-700">{bank.maxTerm} years</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => {
                              setInterestRate(bank.rate)
                              if (loanTerm > bank.maxTerm) setLoanTerm(bank.maxTerm)
                            }}
                            className="text-teal-600 hover:text-teal-700 font-medium text-sm"
                          >
                            Apply Rate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-4 flex items-start gap-1.5">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                Rates are indicative only and subject to change. Contact banks directly for current offers.
              </p>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Your Estimate</h3>

              {/* Monthly Payment */}
              <div className="bg-teal-50 rounded-xl p-6 mb-6 text-center">
                <p className="text-sm text-teal-700 font-medium mb-1">Monthly Payment</p>
                <p className="text-3xl md:text-4xl font-bold text-teal-700">
                  {formatCurrency(calculations.monthlyPayment)}
                </p>
              </div>

              {/* Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Loan Amount</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(calculations.principal)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Total Interest</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(calculations.totalInterest)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Total Payment</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(calculations.totalPayment)}
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
                    style={{
                      width: `${(calculations.principal / calculations.totalPayment) * 100 || 50}%`,
                    }}
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
                <Link
                  href="/properties"
                  className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-teal-700 transition"
                >
                  Browse Properties
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://wa.me/233201578429?text=Hi%2C%20I%20used%20the%20mortgage%20calculator%20on%20Dwellot%20and%20would%20like%20to%20discuss%20financing%20options."
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
