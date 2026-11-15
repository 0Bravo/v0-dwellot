"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Calculator, Calendar, Home, Percent, Wallet } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  calculateMortgage,
  clampDeposit,
  currencyLabel,
  formatMoney,
  toMortgageCurrency,
} from "@/lib/mortgage/calc"
import { MORTGAGE_DEFAULTS, formatRateDate } from "@/lib/mortgage/rates"
import { useMortgageRates } from "@/hooks/use-mortgage-rates"

interface MortgageCalculatorProps {
  propertyPrice?: number
  /** Currency the property is priced in. Dwellot listings default to USD. */
  currency?: string | null
}

export default function MortgageCalculator({ propertyPrice = 0, currency }: MortgageCalculatorProps) {
  const loanCurrency = toMortgageCurrency(currency)
  const defaults = MORTGAGE_DEFAULTS[loanCurrency]
  const symbol = currencyLabel(loanCurrency)

  const [price, setPrice] = useState(propertyPrice)
  const [deposit, setDeposit] = useState(Math.round(propertyPrice * (defaults.depositPct / 100)))
  const [interestRate, setInterestRate] = useState(defaults.rate)
  const [loanTerm, setLoanTerm] = useState(defaults.termYears)

  const { grr, lenders } = useMortgageRates()
  const lenderRates = lenders[loanCurrency]

  const result = useMemo(
    () => calculateMortgage({ price, deposit, annualRatePct: interestRate, termYears: loanTerm }),
    [price, deposit, interestRate, loanTerm],
  )

  const handlePriceChange = (value: number) => {
    setPrice(value)
    setDeposit((current) => clampDeposit(current, value))
  }

  const setDepositPercent = (percent: number) => setDeposit(Math.round(price * (percent / 100)))

  const applyLender = (rate: number, maxTermYears: number) => {
    setInterestRate(rate)
    if (loanTerm > maxTermYears) setLoanTerm(maxTermYears)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-teal-600" />
          Mortgage Calculator
        </CardTitle>
        <CardDescription>
          Estimate monthly repayments on a {loanCurrency === "USD" ? "US dollar" : "Ghana cedi"} mortgage from a
          bank in Ghana
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Property Price */}
        <div className="space-y-2">
          <Label htmlFor="mc-price" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Property Price ({symbol})
          </Label>
          <Input
            id="mc-price"
            type="number"
            min={0}
            value={price || ""}
            onChange={(e) => handlePriceChange(Number(e.target.value))}
            placeholder="Enter property price"
          />
        </div>

        {/* Deposit */}
        <div className="space-y-2">
          <Label htmlFor="mc-deposit" className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Deposit ({symbol})
            </span>
            <span className="text-sm text-muted-foreground">{result.depositPercent.toFixed(1)}%</span>
          </Label>
          <Input
            id="mc-deposit"
            type="number"
            min={0}
            max={price}
            value={deposit || ""}
            onChange={(e) => setDeposit(clampDeposit(Number(e.target.value), price))}
            placeholder="Enter deposit"
          />
          <div className="flex gap-2">
            {[10, 20, 30].map((percent) => (
              <Button key={percent} type="button" variant="outline" size="sm" onClick={() => setDepositPercent(percent)}>
                {percent}%
              </Button>
            ))}
          </div>
        </div>

        {/* Interest Rate */}
        <div className="space-y-2">
          <Label htmlFor="mc-rate" className="flex items-center gap-2">
            <Percent className="w-4 h-4" />
            Interest Rate (% per year)
          </Label>
          <Input
            id="mc-rate"
            type="number"
            min={0}
            max={60}
            step="0.1"
            value={interestRate || ""}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            placeholder="Enter interest rate"
          />
          {lenderRates.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {lenderRates.slice(0, 4).map((lender) => (
                <Button
                  key={lender.id}
                  type="button"
                  variant={interestRate === lender.rate ? "default" : "outline"}
                  size="sm"
                  onClick={() => applyLender(lender.rate, lender.maxTermYears)}
                  title={`${lender.name}: ${lender.display}, up to ${lender.maxTermYears} years`}
                >
                  {lender.name} {lender.rate}%
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Loan Term */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Loan Term (years)
          </Label>
          <div className="flex flex-wrap gap-2">
            {defaults.terms.map((term) => (
              <Button
                key={term}
                type="button"
                variant={loanTerm === term ? "default" : "outline"}
                size="sm"
                onClick={() => setLoanTerm(term)}
              >
                {term} years
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="pt-4 border-t space-y-4">
          <div className="bg-teal-50 dark:bg-teal-950 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Estimated Monthly Payment</div>
            <div className="text-3xl font-bold text-teal-600">{formatMoney(result.monthlyPayment, loanCurrency)}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Loan Amount</div>
              <div className="text-lg font-semibold">{formatMoney(result.loanAmount, loanCurrency)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Total Interest</div>
              <div className="text-lg font-semibold">{formatMoney(result.totalInterest, loanCurrency)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Total Repaid</div>
              <div className="text-lg font-semibold">{formatMoney(result.totalPayment, loanCurrency)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Monthly Payments</div>
              <div className="text-lg font-semibold">{result.numberOfPayments}</div>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            Estimate only. Bank rates shown are indicative and exclude fees and insurance; your rate depends on the
            bank and your circumstances.
            {loanCurrency === "GHS" && (
              <>
                {" "}
                Ghana Reference Rate: {grr.rate}%
                {grr.effectiveDate ? ` (effective ${formatRateDate(grr.effectiveDate)})` : ""}.
              </>
            )}
          </p>
          <p>
            <Link href="/mortgage-calculator" className="text-teal-600 hover:text-teal-700 font-medium">
              Compare all bank rates in the full mortgage calculator
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
