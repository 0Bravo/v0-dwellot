import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Calculator, Info, Wallet } from "lucide-react"
import { FinanceHero } from "@/components/finance/surfaces"
import { calculateMortgage, formatMoney } from "@/lib/mortgage/calc"
import { getGhanaReferenceRate } from "@/lib/mortgage/grr"
import { RATES_REVIEWED, formatRateDate, resolveLenderRates } from "@/lib/mortgage/rates"

export const revalidate = 43200

const PAGE_URL = "https://dwellot.com/finance/mortgage-salary-requirements"

export const metadata: Metadata = {
  title: "What Salary Do You Need for a Mortgage in Ghana?",
  description:
    "Work out the net monthly income a bank in Ghana expects before approving a mortgage. Worked examples at current cedi rates, the 50% debt-service cap, and what changes the answer.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "What Salary Do You Need for a Mortgage in Ghana?",
    description:
      "The net monthly income banks in Ghana expect, with worked examples at current rates.",
    url: PAGE_URL,
  },
}

/** Property prices to work through, in cedis. */
const PRICES = [300000, 500000, 800000, 1200000]
const DEPOSIT_PCT = 20
const TERM_YEARS = 20
const DSR_PCT = 50

export default async function SalaryRequirementsPage() {
  const grr = await getGhanaReferenceRate()
  const lenders = resolveLenderRates("GHS", grr.rate)

  // Compare the cheapest rate we list against a typical commercial rate.
  const cheapest = lenders[0]
  const typical = lenders.find((l) => l.basis === "estimate") ?? lenders[lenders.length - 1]

  const scenarios = [cheapest, typical].filter(Boolean).map((lender) => ({
    lender,
    rows: PRICES.map((price) => {
      const deposit = price * (DEPOSIT_PCT / 100)
      const term = Math.min(TERM_YEARS, lender.maxTermYears)
      const { monthlyPayment, loanAmount } = calculateMortgage({
        price,
        deposit,
        annualRatePct: lender.rate,
        termYears: term,
      })
      return {
        price,
        deposit,
        loanAmount,
        monthlyPayment,
        term,
        requiredIncome: monthlyPayment / (DSR_PCT / 100),
      }
    }),
  }))

  const faqs = [
    {
      question: "What salary do you need for a mortgage in Ghana?",
      answer:
        `It depends on the price, your deposit and the rate. On a ${formatMoney(500000, "GHS")} home with a ` +
        `${DEPOSIT_PCT}% deposit over ${TERM_YEARS} years at ${typical?.rate}%, the repayment is about ` +
        `${formatMoney(scenarios[1]?.rows[1]?.monthlyPayment ?? 0, "GHS")} a month, so a lender working to a ` +
        `${DSR_PCT}% debt-service cap would expect net monthly income of around ` +
        `${formatMoney(scenarios[1]?.rows[1]?.requiredIncome ?? 0, "GHS")}.`,
    },
    {
      question: "What is a debt-service ratio?",
      answer:
        `The share of your net monthly income a lender will let you spend on all loan repayments combined. Absa and ` +
        `Republic Bank both work to a cap of ${DSR_PCT}%. Existing loans, including car and personal loans, come out ` +
        `of that same allowance, so they reduce what you can borrow for a home.`,
    },
    {
      question: "Does a bigger deposit reduce the salary you need?",
      answer:
        "Yes. The deposit is not borrowed, so it does not attract interest. Raising the deposit lowers the loan, the monthly repayment and therefore the income the lender needs to see.",
    },
    {
      question: "Does a longer term reduce the salary you need?",
      answer:
        "It lowers the monthly repayment, so it lowers the income required, but you pay interest for longer and the total cost rises. Most mortgages in Ghana run up to 20 years, and lenders also require the loan to be repaid before retirement age.",
    },
    {
      question: "Do banks count anything besides salary?",
      answer:
        "Yes. Lenders look at how steady the income is, your employment or business history, your credit record, your age at the end of the term and the property itself. A high salary does not guarantee approval.",
    },
  ]

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <FinanceHero
        icon={Wallet}
        title="What salary do you need for a mortgage in Ghana?"
        subtitle="Banks cap what you spend on repayments as a share of income. Here is what that works out to at today’s rates."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* The rule */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The rule banks apply</h2>
          <p className="text-gray-700 mb-4">
            A lender in Ghana will not let your loan repayments exceed a set share of your net monthly income. Absa and
            Republic Bank both work to a cap of <strong>{DSR_PCT}%</strong>. That allowance covers every loan you have,
            not just the mortgage, so a car loan or a personal loan reduces what is left for a home.
          </p>
          <p className="text-gray-700">
            So the question &quot;what salary do I need?&quot; is really: what is the monthly repayment, and what income
            makes that repayment fit inside the cap? Work out the first and the second follows.
          </p>
        </section>

        {/* Worked examples */}
        {scenarios.map(({ lender, rows }) => (
          <section key={lender.id} className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              At {lender.display} &mdash; {lender.name}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {DEPOSIT_PCT}% deposit, {rows[0]?.term}-year term, repayments capped at {DSR_PCT}% of net income.
              {lender.note ? ` ${lender.note}.` : ""}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="py-3 font-semibold text-gray-700">Property price</th>
                    <th className="py-3 font-semibold text-gray-700">Deposit</th>
                    <th className="py-3 font-semibold text-gray-700">Monthly repayment</th>
                    <th className="py-3 font-semibold text-gray-700">Net income needed</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.price} className="border-b border-gray-100 last:border-0">
                      <td className="py-3 font-medium text-gray-900 whitespace-nowrap">
                        {formatMoney(row.price, "GHS")}
                      </td>
                      <td className="py-3 text-gray-700 whitespace-nowrap">{formatMoney(row.deposit, "GHS")}</td>
                      <td className="py-3 text-gray-700 whitespace-nowrap">
                        {formatMoney(row.monthlyPayment, "GHS")}
                      </td>
                      <td className="py-3 font-semibold text-teal-700 whitespace-nowrap">
                        {formatMoney(row.requiredIncome, "GHS")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        {/* Why the gap */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why the two tables differ so much</h2>
          <p className="text-gray-700 mb-4">
            The rate does most of the work. The same house, the same deposit and the same term can need very different
            incomes depending on what you borrow at, because interest is charged on the whole outstanding balance every
            month for twenty years.
          </p>
          <p className="text-gray-700">
            This is why it pays to check whether you qualify for a scheme rather than assuming a commercial rate, and
            why the currency you borrow in matters as much as the lender you pick.{" "}
            <Link href="/finance/cedi-or-dollar-mortgage" className="text-teal-600 hover:text-teal-700 font-medium underline">
              Cedi or US dollar mortgage?
            </Link>
          </p>
        </section>

        {/* Reduce what you need */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Four ways to lower the income you need</h2>
          <ul className="space-y-3 text-gray-700 list-disc pl-5">
            <li>
              <strong>Put down more.</strong> The deposit is not borrowed and attracts no interest, so every cedi of it
              reduces the repayment directly.
            </li>
            <li>
              <strong>Clear other loans first.</strong> The cap covers all your repayments together, so a car or
              personal loan eats into the same allowance.
            </li>
            <li>
              <strong>Check scheme eligibility.</strong> Government-backed schemes and public-sector arrangements price
              well below commercial rates, but carry conditions.
            </li>
            <li>
              <strong>Consider a longer term.</strong> It lowers the monthly figure, though you pay interest for longer
              and the total cost rises.
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Common questions</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="font-semibold text-gray-900 mb-1">{faq.question}</h3>
                <p className="text-gray-700 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <Link
          href="/mortgage-calculator#affordability"
          className="inline-flex items-center gap-2 bg-teal-600 text-white py-3 px-5 rounded-lg font-medium hover:bg-teal-700 transition"
        >
          <Calculator className="w-4 h-4" />
          Work out your own figure
          <ArrowRight className="w-4 h-4" />
        </Link>

        <p className="text-xs text-gray-500 flex items-start gap-1.5">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            Figures are illustrative and exclude fees, insurance and taxes. Rates reviewed{" "}
            {formatRateDate(RATES_REVIEWED)}; Ghana Reference Rate {grr.rate}%
            {grr.effectiveDate ? `, effective ${formatRateDate(grr.effectiveDate)}` : ""}. Dwellot is a property
            marketplace, not a lender or financial adviser. Confirm every figure with the lender.
          </span>
        </p>
      </div>
    </div>
  )
}
