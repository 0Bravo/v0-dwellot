import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeftRight, ArrowRight, Calculator, Info } from "lucide-react"
import { calculateMortgage, formatMoney } from "@/lib/mortgage/calc"
import { getGhanaReferenceRate } from "@/lib/mortgage/grr"
import { RATES_REVIEWED, formatRateDate, resolveLenderRates } from "@/lib/mortgage/rates"

export const revalidate = 43200

const PAGE_URL = "https://dwellot.com/finance/cedi-or-dollar-mortgage"

export const metadata: Metadata = {
  title: "Cedi or US Dollar Mortgage in Ghana: Which Should You Take?",
  description:
    "Cedi and US dollar mortgages in Ghana are priced very differently. What each costs per unit borrowed, who each suits, and the exchange-rate risk that decides it.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Cedi or US Dollar Mortgage in Ghana?",
    description: "What each costs, who each suits, and the exchange-rate risk that decides it.",
    url: PAGE_URL,
  },
}

/** A round loan figure, used in each currency so the rates compare like for like. */
const LOAN_UNITS = 100000
const TERM_YEARS = 15

export default async function CediOrDollarPage() {
  const grr = await getGhanaReferenceRate()

  const pickTypical = (currency: "GHS" | "USD") => {
    const list = resolveLenderRates(currency, grr.rate)
    // Skip restricted schemes; compare what an ordinary borrower would be offered.
    const commercial = list.filter((l) => l.basis !== "reported" || l.id !== "nhf")
    return commercial.find((l) => l.basis === "estimate") ?? commercial[commercial.length - 1] ?? list[0]
  }

  const ghs = pickTypical("GHS")
  const usd = pickTypical("USD")

  const build = (rate: number, maxTerm: number) => {
    const term = Math.min(TERM_YEARS, maxTerm)
    const r = calculateMortgage({ price: LOAN_UNITS, deposit: 0, annualRatePct: rate, termYears: term })
    return { term, monthly: r.monthlyPayment, totalInterest: r.totalInterest, totalPaid: r.totalPayment }
  }

  const cedi = ghs ? build(ghs.rate, ghs.maxTermYears) : null
  const dollar = usd ? build(usd.rate, usd.maxTermYears) : null

  // How much more of each borrowed unit the cedi loan costs per month.
  const ratio = cedi && dollar && dollar.monthly > 0 ? cedi.monthly / dollar.monthly : null

  const faqs = [
    {
      question: "Is a dollar mortgage cheaper than a cedi mortgage in Ghana?",
      answer:
        `The interest rate is much lower. A typical US dollar mortgage is around ${usd?.rate}% against roughly ` +
        `${ghs?.rate}% in cedis. On the same size of loan over ${cedi?.term ?? TERM_YEARS} years that is a large ` +
        "difference in the monthly repayment. Whether it is cheaper for you depends on the currency you earn in, " +
        "because a dollar loan repaid from cedi income costs more every time the cedi weakens.",
    },
    {
      question: "Who should take a US dollar mortgage?",
      answer:
        "Someone whose income is already in dollars, pounds or euros. If the money you repay with is in the same currency as the loan, the lower rate is a real saving and the exchange rate does not affect your repayment. This is why dollar mortgages suit diaspora buyers.",
    },
    {
      question: "Who should take a cedi mortgage?",
      answer:
        "Someone earning in cedis. The rate is higher, but the repayment is fixed in the currency of your salary, so a weaker cedi does not raise what you owe each month. Variable cedi rates can also fall when the Ghana Reference Rate falls.",
    },
    {
      question: "What happens to a dollar mortgage if the cedi weakens?",
      answer:
        "The repayment stays the same in dollars, but it takes more cedis to make it. If you earn in cedis, every period of depreciation permanently raises the share of your income the mortgage consumes, and lenders assess that risk when deciding whether to approve you.",
    },
    {
      question: "How is a cedi mortgage rate set in Ghana?",
      answer:
        `Usually as the Ghana Reference Rate plus the bank's own margin. The reference rate is published monthly by ` +
        `the Ghana Association of Banks and currently stands at ${grr.rate}%` +
        `${grr.effectiveDate ? `, effective ${formatRateDate(grr.effectiveDate)}` : ""}. The margin reflects the ` +
        "bank's costs and its view of your risk, so the rate you are offered sits well above the benchmark.",
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

      <section className="bg-teal-700 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-full mb-4">
            <ArrowLeftRight className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 text-balance">
            Cedi or US dollar mortgage?
          </h1>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto">
            The rates are not close. Neither is the risk. Which matters more depends on the currency you are paid in.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Side by side */}
        {cedi && dollar && ghs && usd && (
          <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">The same size of loan, priced both ways</h2>
            <p className="text-sm text-gray-600 mb-6">
              {formatMoney(LOAN_UNITS, "GHS")} borrowed in cedis against ${LOAN_UNITS.toLocaleString("en-US")}{" "}
              borrowed in dollars, each over {cedi.term} years. Comparing equal numbers of units isolates the effect of
              the rate; it is not a currency conversion.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-sm font-medium text-gray-600 mb-1">Cedi mortgage at {ghs.rate}%</p>
                <p className="text-3xl font-bold text-gray-900 mb-3">
                  {formatMoney(cedi.monthly, "GHS")}
                  <span className="text-base font-medium text-gray-600"> a month</span>
                </p>
                <p className="text-sm text-gray-600">
                  Total interest {formatMoney(cedi.totalInterest, "GHS")} over {cedi.term} years
                </p>
              </div>
              <div className="bg-teal-50 rounded-xl p-6">
                <p className="text-sm font-medium text-teal-700 mb-1">US dollar mortgage at {usd.rate}%</p>
                <p className="text-3xl font-bold text-teal-700 mb-3">
                  {formatMoney(dollar.monthly, "USD")}
                  <span className="text-base font-medium text-teal-700"> a month</span>
                </p>
                <p className="text-sm text-teal-700">
                  Total interest {formatMoney(dollar.totalInterest, "USD")} over {dollar.term} years
                </p>
              </div>
            </div>
            {ratio && (
              <p className="text-gray-700 mt-6">
                Per unit borrowed, the cedi mortgage costs about{" "}
                <strong>{ratio.toFixed(1)} times</strong> as much each month as the dollar one. That gap is the whole
                argument for borrowing in dollars &mdash; and the reason the exchange rate matters so much if you do.
              </p>
            )}
          </section>
        )}

        {/* The trade-off */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The trade-off in one line</h2>
          <p className="text-gray-700 mb-6">
            Borrow in the currency you are paid in, unless you have a strong reason not to. The lower dollar rate is
            only a saving if the money you repay with is also in dollars. If you earn cedis and borrow dollars, you
            have taken on a currency bet alongside the mortgage, and it runs for twenty years.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">A cedi mortgage suits you if</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>Your salary or business income is in cedis</li>
                <li>You want the repayment fixed in the currency you earn</li>
                <li>You expect reference rates to keep falling and are on a variable rate</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">A dollar mortgage suits you if</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>You are paid in dollars, pounds or euros</li>
                <li>You are buying from abroad and will keep earning abroad</li>
                <li>You can carry the repayment even if your own currency weakens</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Risk */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What the exchange rate does to a dollar loan</h2>
          <p className="text-gray-700 mb-4">
            A dollar mortgage repayment never changes in dollars. What changes is how many cedis it takes to make that
            payment. If you earn in cedis, a weaker cedi raises the real cost of every remaining payment, and the
            effect compounds over the life of the loan rather than passing.
          </p>
          <p className="text-gray-700">
            That is why lenders assess currency risk when they decide whether to approve a dollar facility for someone
            on local income, and why the cheaper rate is not automatically the cheaper mortgage.
          </p>
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

        <div className="flex flex-wrap gap-3">
          <Link
            href="/mortgage-calculator"
            className="inline-flex items-center gap-2 bg-teal-600 text-white py-3 px-5 rounded-lg font-medium hover:bg-teal-700 transition"
          >
            <Calculator className="w-4 h-4" />
            Compare both in the calculator
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/finance/mortgage-salary-requirements"
            className="inline-flex items-center gap-2 bg-white text-teal-700 border border-teal-600 py-3 px-5 rounded-lg font-medium hover:bg-teal-50 transition"
          >
            What salary do you need?
          </Link>
        </div>

        <p className="text-xs text-gray-500 flex items-start gap-1.5">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            Figures are illustrative and exclude fees and insurance. This page compares equal numbers of currency
            units and does not convert between currencies. Rates reviewed {formatRateDate(RATES_REVIEWED)}. Dwellot is
            a property marketplace, not a lender or financial adviser.
          </span>
        </p>
      </div>
    </div>
  )
}
