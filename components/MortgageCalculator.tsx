"use client"

import { useState } from "react"
import { Calculator, DollarSign, Percent, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface MortgageCalculatorProps {
  propertyPrice?: number
}

export default function MortgageCalculator({ propertyPrice = 0 }: MortgageCalculatorProps) {
  const [price, setPrice] = useState(propertyPrice)
  const [downPayment, setDownPayment] = useState(propertyPrice * 0.2) // 20% default
  const [interestRate, setInterestRate] = useState(6.5)
  const [loanTerm, setLoanTerm] = useState(30)

  const loanAmount = price - downPayment
  const monthlyRate = interestRate / 100 / 12
  const numberOfPayments = loanTerm * 12

  // Calculate monthly payment using mortgage formula
  const monthlyPayment =
    loanAmount > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      : 0

  const totalPayment = monthlyPayment * numberOfPayments
  const totalInterest = totalPayment - loanAmount

  const downPaymentPercent = price > 0 ? (downPayment / price) * 100 : 0

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-teal-600" />
          Mortgage Calculator
        </CardTitle>
        <CardDescription>Estimate your monthly mortgage payments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Property Price */}
        <div className="space-y-2">
          <Label htmlFor="price" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Property Price
          </Label>
          <Input
            id="price"
            type="number"
            value={price || ""}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Enter property price"
          />
        </div>

        {/* Down Payment */}
        <div className="space-y-2">
          <Label htmlFor="downPayment" className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Down Payment
            </span>
            <span className="text-sm text-muted-foreground">{downPaymentPercent.toFixed(1)}%</span>
          </Label>
          <Input
            id="downPayment"
            type="number"
            value={downPayment || ""}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            placeholder="Enter down payment"
          />
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setDownPayment(price * 0.1)}>
              10%
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setDownPayment(price * 0.2)}>
              20%
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setDownPayment(price * 0.3)}>
              30%
            </Button>
          </div>
        </div>

        {/* Interest Rate */}
        <div className="space-y-2">
          <Label htmlFor="interestRate" className="flex items-center gap-2">
            <Percent className="w-4 h-4" />
            Interest Rate (Annual)
          </Label>
          <Input
            id="interestRate"
            type="number"
            step="0.1"
            value={interestRate || ""}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            placeholder="Enter interest rate"
          />
        </div>

        {/* Loan Term */}
        <div className="space-y-2">
          <Label htmlFor="loanTerm" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Loan Term (Years)
          </Label>
          <Input
            id="loanTerm"
            type="number"
            value={loanTerm || ""}
            onChange={(e) => setLoanTerm(Number(e.target.value))}
            placeholder="Enter loan term"
          />
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setLoanTerm(15)}>
              15 years
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setLoanTerm(20)}>
              20 years
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setLoanTerm(30)}>
              30 years
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="pt-4 border-t space-y-4">
          <div className="bg-teal-50 dark:bg-teal-950 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Monthly Payment</div>
            <div className="text-3xl font-bold text-teal-600">
              ${monthlyPayment.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Loan Amount</div>
              <div className="text-lg font-semibold">
                ${loanAmount.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Total Interest</div>
              <div className="text-lg font-semibold">
                ${totalInterest.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Total Payment</div>
              <div className="text-lg font-semibold">
                ${totalPayment.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Number of Payments</div>
              <div className="text-lg font-semibold">{numberOfPayments}</div>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          * This is an estimate. Actual payments may vary based on property taxes, insurance, and other factors.
        </div>
      </CardContent>
    </Card>
  )
}
