"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowLeft, ArrowRight, Compass, Globe2, Home, RotateCcw, Sparkles, Wallet } from "lucide-react"
import { calculateAffordability, formatMoney } from "@/lib/mortgage/calc"
import { compareLenders } from "@/lib/mortgage/compare"
import { calculateBuyingCosts, DEFAULT_COSTS_INPUT } from "@/lib/finance/buying-costs"
import { AnimatedNumber } from "./motion"

/**
 * The guided entry to the finance section.
 *
 * Rather than a menu of six tools, it asks what the visitor is trying to do
 * and answers that question with the same engines the full pages use —
 * compareLenders, calculateAffordability and calculateBuyingCosts — then
 * hands off to the page that goes deeper. Nothing here is a separate
 * calculation, so it cannot disagree with the rest of the section.
 */

type Intent = "budget" | "found" | "abroad" | "browse"

interface Props {
  grrRate: number
  usdGhs: number
  gbpGhs: number | null
}

const EASE = [0.22, 1, 0.36, 1] as const
const TERM_YEARS = 15
const DSR_PCT = 50

const INTENTS: Array<{ id: Intent; icon: typeof Wallet; title: string; blurb: string }> = [
  { id: "budget", icon: Wallet, title: "Work out what I can afford", blurb: "Start from my income and savings" },
  { id: "found", icon: Home, title: "I've found a place", blurb: "Tell me what it really costs" },
  { id: "abroad", icon: Globe2, title: "I'm buying from abroad", blurb: "I earn in dollars or pounds" },
  { id: "browse", icon: Compass, title: "Just looking around", blurb: "Show me today's rates" },
]

const inputClass =
  "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"

export default function FinanceConcierge({ grrRate, usdGhs, gbpGhs }: Props) {
  const reduce = useReducedMotion()
  const [intent, setIntent] = useState<Intent | null>(null)
  const [step, setStep] = useState(0)

  // Budget branch
  const [income, setIncome] = useState(8000)
  const [debts, setDebts] = useState(0)
  const [savings, setSavings] = useState(150_000)

  // Found-a-place branch
  const [price, setPrice] = useState(1_000_000)
  const [depositPct, setDepositPct] = useState(20)

  // Abroad branch
  const [earnIn, setEarnIn] = useState<"USD" | "GBP">("GBP")

  const cediLenders = useMemo(
    () => compareLenders({ currency: "GHS", propertyPrice: 1_000_000, deposit: 200_000, termYears: TERM_YEARS, grrRate }),
    [grrRate],
  )
  // Affordability is quoted at the cheapest rate a bank publishes on its own
  // terms, not the cheapest rate in the table. The lowest figure we can source
  // is a government scheme with eligibility conditions, and sizing someone's
  // budget on a rate they may not qualify for overstates what they can buy.
  const ownTermsRows = cediLenders.rows
    .filter((r) => r.basis === "published" || r.basis === "grr-linked")
    .sort((x, y) => x.rate - y.rate)
  const baseline = ownTermsRows[0] ?? cediLenders.cheapest
  const baselineRate = baseline?.rate ?? 18
  const baselineName = baseline?.name ?? "the cheapest lender"

  // Shown as an upside only, when a cheaper scheme exists.
  const upside =
    cediLenders.cheapest && baseline && cediLenders.cheapest.rate < baseline.rate
      ? cediLenders.cheapest
      : null

  const affordability = useMemo(
    () =>
      calculateAffordability({
        monthlyIncome: income,
        monthlyDebts: debts,
        deposit: savings,
        annualRatePct: baselineRate,
        termYears: TERM_YEARS,
        debtServiceRatioPct: DSR_PCT,
      }),
    [income, debts, savings, baselineRate],
  )

  const upsideAffordability = useMemo(
    () =>
      upside
        ? calculateAffordability({
            monthlyIncome: income,
            monthlyDebts: debts,
            deposit: savings,
            annualRatePct: upside.rate,
            termYears: TERM_YEARS,
            debtServiceRatioPct: DSR_PCT,
          })
        : null,
    [income, debts, savings, upside],
  )

  const foundResult = useMemo(() => {
    const deposit = Math.round((price * depositPct) / 100)
    const lenders = compareLenders({
      currency: "GHS",
      propertyPrice: price,
      deposit,
      termYears: TERM_YEARS,
      grrRate,
    })
    const costs = calculateBuyingCosts({
      ...DEFAULT_COSTS_INPUT,
      priceGhs: price,
      depositGhs: deposit,
      usingMortgage: true,
    })
    return { deposit, lenders, costs }
  }, [price, depositPct, grrRate])

  const abroadResult = useMemo(() => {
    const deposit = Math.round(price * 0.3)
    const usdPrice = price / usdGhs
    const usdDeposit = usdPrice * 0.3
    const lenders = compareLenders({
      currency: "USD",
      propertyPrice: usdPrice,
      deposit: usdDeposit,
      termYears: TERM_YEARS,
      grrRate,
    })
    const costs = calculateBuyingCosts({
      ...DEFAULT_COSTS_INPUT,
      priceGhs: price,
      depositGhs: deposit,
      usingMortgage: true,
    })
    const divisor = earnIn === "USD" ? usdGhs : (gbpGhs ?? usdGhs)
    const symbol = earnIn === "USD" ? "$" : "£"
    return { lenders, costs, divisor, symbol, usdPrice }
  }, [price, usdGhs, gbpGhs, earnIn, grrRate])

  function choose(next: Intent) {
    setIntent(next)
    setStep(next === "browse" ? 1 : 0)
  }

  function restart() {
    setIntent(null)
    setStep(0)
  }

  const totalSteps = intent === "browse" ? 1 : 2
  const panelKey = `${intent ?? "start"}-${step}`

  const transition = reduce
    ? { duration: 0 }
    : { duration: 0.35, ease: EASE }

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-teal-100 bg-gradient-to-br from-white via-white to-teal-50/60 shadow-sm"
      aria-labelledby="concierge-heading"
    >
      {/* Soft moving wash behind the panel. Decorative only. */}
      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.75, 0.5] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <div className="relative p-6 md:p-8">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-700 bg-teal-100 rounded-full px-2.5 py-1 mb-3">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              Guided
            </p>
            <h2 id="concierge-heading" className="text-2xl md:text-3xl font-bold text-gray-900 text-balance">
              {intent === null ? "What brings you here?" : "Let's work it out"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {intent === null
                ? "Two questions and you get a real number, not a brochure."
                : "Figures come from the same engines as the full calculators."}
            </p>
          </div>

          {intent !== null && (
            <button
              type="button"
              onClick={restart}
              className="flex-shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-teal-700"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              Start again
            </button>
          )}
        </div>

        {/* Progress */}
        {intent !== null && (
          <div className="flex items-center gap-1.5 mb-5" aria-hidden="true">
            {Array.from({ length: totalSteps + 1 }).map((_, i) => (
              <motion.span
                key={i}
                className={`h-1.5 rounded-full ${i <= step ? "bg-teal-600" : "bg-gray-200"}`}
                initial={false}
                animate={{ width: i === step ? 40 : 16 }}
                transition={transition}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={panelKey}
            initial={reduce ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? undefined : { opacity: 0, x: -24 }}
            transition={transition}
          >
            {/* ---------- Step: choose intent ---------- */}
            {intent === null && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INTENTS.map(({ id, icon: Icon, title, blurb }, i) => (
                  <motion.button
                    key={id}
                    type="button"
                    onClick={() => choose(id)}
                    className="group text-left rounded-xl border border-gray-200 bg-white p-5 hover:border-teal-400 hover:shadow-md transition"
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.4, delay: i * 0.06, ease: EASE }}
                    whileHover={reduce ? undefined : { y: -3 }}
                  >
                    <Icon className="w-6 h-6 text-teal-600 mb-3" aria-hidden="true" />
                    <span className="block font-semibold text-gray-900">{title}</span>
                    <span className="block text-sm text-gray-600 mt-0.5">{blurb}</span>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-600 group-hover:gap-2 transition-all">
                      Start
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </motion.button>
                ))}
              </div>
            )}

            {/* ---------- Budget branch ---------- */}
            {intent === "budget" && step === 0 && (
              <Questions
                prompt="What comes in, and what have you saved?"
                onBack={restart}
                onNext={() => setStep(1)}
              >
                <Field label="Net monthly income (GH₵)" id="c-income">
                  <input id="c-income" type="number" min={0} value={income} className={inputClass}
                    onChange={(e) => setIncome(Math.max(0, Number(e.target.value)))} />
                </Field>
                <Field label="Existing monthly loan repayments (GH₵)" id="c-debts">
                  <input id="c-debts" type="number" min={0} value={debts} className={inputClass}
                    onChange={(e) => setDebts(Math.max(0, Number(e.target.value)))} />
                </Field>
                <Field label="Deposit saved (GH₵)" id="c-savings">
                  <input id="c-savings" type="number" min={0} value={savings} className={inputClass}
                    onChange={(e) => setSavings(Math.max(0, Number(e.target.value)))} />
                </Field>
              </Questions>
            )}

            {intent === "budget" && step === 1 && (
              <Answer onBack={() => setStep(0)}>
                {affordability.maxLoan > 0 ? (
                  <>
                    <Headline label="You could be looking at homes up to">
                      <AnimatedNumber value={Math.round(affordability.maxPropertyPrice)} prefix="GH₵" />
                    </Headline>
                    <p className="text-sm text-gray-700">
                      That is a loan of about {formatMoney(affordability.maxLoan, "GHS")} on top of your{" "}
                      {formatMoney(savings, "GHS")} deposit, repaying roughly{" "}
                      <strong>{formatMoney(affordability.maxMonthlyPayment, "GHS")} a month</strong> over{" "}
                      {TERM_YEARS} years at {baselineRate}% — the lowest rate a bank publishes on its own
                      terms ({baselineName}).
                    </p>
                    {upside && upsideAffordability && (
                      <p className="text-sm text-gray-700">
                        If you qualify for {upside.name} at {upside.display}, the same income and deposit
                        stretch to about{" "}
                        <strong>{formatMoney(upsideAffordability.maxPropertyPrice, "GHS")}</strong>
                        {upside.note ? `. ${upside.note}.` : "."}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Worked at the {DSR_PCT}% of net income that Absa and Republic Bank both cap total debt
                      repayments at. That is their maximum, not a target — borrowing right at it leaves nothing
                      for rates, repairs or a bad month.
                    </p>
                    <Onward
                      links={[
                        { href: "/mortgage-calculator#affordability", label: "Refine the affordability check" },
                        { href: "/finance/compare-mortgage-rates", label: "See which lenders fit" },
                        { href: "/properties?listing_type=sale", label: "Browse homes in this range" },
                      ]}
                    />
                  </>
                ) : (
                  <>
                    <Headline label="On these figures, a mortgage would not clear a lender's test">
                      <span>—</span>
                    </Headline>
                    <p className="text-sm text-gray-700">
                      Your existing repayments of {formatMoney(debts, "GHS")} already use the{" "}
                      {DSR_PCT}% of {formatMoney(income, "GHS")} that a lender would allow, so there is nothing
                      left for a mortgage payment. Clearing or reducing existing credit, or a larger deposit,
                      changes this quickly.
                    </p>
                    <Onward
                      links={[
                        { href: "/mortgage-calculator#affordability", label: "Try different figures" },
                        { href: "/finance/cost-of-buying", label: "See what buying costs on top" },
                      ]}
                    />
                  </>
                )}
              </Answer>
            )}

            {/* ---------- Found a place ---------- */}
            {intent === "found" && step === 0 && (
              <Questions prompt="What is the asking price, and what can you put down?" onBack={restart} onNext={() => setStep(1)}>
                <Field label="Price (GH₵)" id="c-price">
                  <input id="c-price" type="number" min={0} value={price} className={inputClass}
                    onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))} />
                </Field>
                <Field label={`Deposit: ${depositPct}% (${formatMoney(Math.round((price * depositPct) / 100), "GHS")})`} id="c-dep">
                  <input id="c-dep" type="range" min={5} max={50} step={1} value={depositPct}
                    className="w-full accent-teal-600"
                    onChange={(e) => setDepositPct(Number(e.target.value))} />
                </Field>
              </Questions>
            )}

            {intent === "found" && step === 1 && (
              <Answer onBack={() => setStep(0)}>
                <Headline label="To complete, you need in cash">
                  <AnimatedNumber value={Math.round(foundResult.costs.cashNeeded)} prefix="GH₵" />
                </Headline>
                <p className="text-sm text-gray-700">
                  That is your {formatMoney(foundResult.deposit, "GHS")} deposit plus{" "}
                  {formatMoney(foundResult.costs.feesTotal, "GHS")} in fees, taxes and first-year insurance —{" "}
                  {foundResult.costs.feesPctOfPrice}% of the price on top of the price.
                  {foundResult.lenders.cheapest && (
                    <>
                      {" "}
                      The cheapest lender we can source for the remaining{" "}
                      {formatMoney(foundResult.lenders.cheapest.loanAmount, "GHS")} is{" "}
                      <strong>{foundResult.lenders.cheapest.name}</strong> at{" "}
                      {foundResult.lenders.cheapest.display}, about{" "}
                      {formatMoney(foundResult.lenders.cheapest.monthlyPayment, "GHS")} a month over{" "}
                      {TERM_YEARS} years
                      {foundResult.lenders.cheapest.note ? ` — ${foundResult.lenders.cheapest.note.toLowerCase()}` : ""}.
                    </>
                  )}
                </p>
                {foundResult.lenders.spread > 0 && (
                  <p className="text-xs text-gray-500">
                    Picking the dearest lender instead would cost{" "}
                    {formatMoney(foundResult.lenders.spread, "GHS")} more over the term.
                  </p>
                )}
                <Onward
                  links={[
                    { href: "/finance/cost-of-buying", label: "Break the costs down" },
                    { href: "/finance/compare-mortgage-rates", label: "Compare every lender" },
                  ]}
                />
              </Answer>
            )}

            {/* ---------- Abroad ---------- */}
            {intent === "abroad" && step === 0 && (
              <Questions prompt="What are you looking at, and where do you earn?" onBack={restart} onNext={() => setStep(1)}>
                <Field label="Price (GH₵)" id="c-aprice">
                  <input id="c-aprice" type="number" min={0} value={price} className={inputClass}
                    onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))} />
                </Field>
                <Field label="You earn in" id="c-earn">
                  <select id="c-earn" value={earnIn} className={inputClass}
                    onChange={(e) => setEarnIn(e.target.value as "USD" | "GBP")}>
                    <option value="GBP">Pounds</option>
                    <option value="USD">US dollars</option>
                  </select>
                </Field>
              </Questions>
            )}

            {intent === "abroad" && step === 1 && (
              <Answer onBack={() => setStep(0)}>
                <Headline label="The cash you need to complete, in your currency">
                  <AnimatedNumber
                    value={Math.round(abroadResult.costs.cashNeeded / abroadResult.divisor)}
                    prefix={abroadResult.symbol}
                  />
                </Headline>
                <p className="text-sm text-gray-700">
                  On a {formatMoney(price, "GHS")} home with a 30% deposit — the larger deposit lenders
                  typically want from non-residents — that is {formatMoney(abroadResult.costs.cashNeeded, "GHS")}{" "}
                  in cedis, including {formatMoney(abroadResult.costs.feesTotal, "GHS")} of fees and taxes.
                  {abroadResult.lenders.cheapest && (
                    <>
                      {" "}
                      A US dollar mortgage is the usual route: the cheapest we can source is{" "}
                      <strong>{abroadResult.lenders.cheapest.name}</strong> at{" "}
                      {abroadResult.lenders.cheapest.display}, roughly{" "}
                      {formatMoney(abroadResult.lenders.cheapest.monthlyPayment, "USD")} a month.
                    </>
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  Stamp duty and Lands Commission fees are set in cedis, so the amount you send moves with the
                  exchange rate between now and completion. That risk is yours, not the seller&rsquo;s.
                </p>
                <Onward
                  links={[
                    { href: "/finance/cedi-or-dollar-mortgage", label: "Cedi or dollar mortgage?" },
                    { href: "/finance/cost-of-buying", label: "See every cost in your currency" },
                    { href: "/finance/compare-mortgage-rates", label: "Compare dollar lenders" },
                  ]}
                />
              </Answer>
            )}

            {/* ---------- Browse ---------- */}
            {intent === "browse" && (
              <Answer onBack={restart}>
                <Headline label="The Ghana Reference Rate today">
                  <AnimatedNumber value={grrRate} decimals={2} suffix="%" />
                </Headline>
                <p className="text-sm text-gray-700">
                  That is the benchmark banks add their margin to when pricing a cedi loan, so it sets the floor
                  under every cedi mortgage in the country. One US dollar is about{" "}
                  {usdGhs.toFixed(2)} cedis.
                </p>
                <Onward
                  links={[
                    { href: "/finance/ghana-reference-rate", label: "How the reference rate works" },
                    { href: "/finance/compare-mortgage-rates", label: "What lenders charge on top" },
                    { href: "/properties?listing_type=sale", label: "Browse homes for sale" },
                  ]}
                />
              </Answer>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

function Questions({
  prompt,
  children,
  onBack,
  onNext,
}: {
  prompt: string
  children: React.ReactNode
  onBack: () => void
  onNext: () => void
}) {
  return (
    <div>
      <p className="text-base font-medium text-gray-900 mb-4">{prompt}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 px-5 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
        >
          Show me
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

function Answer({ children, onBack }: { children: React.ReactNode; onBack: () => void }) {
  return (
    <div>
      <div className="space-y-3" aria-live="polite">
        {children}
      </div>
      <button
        type="button"
        onClick={onBack}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Change my answers
      </button>
    </div>
  )
}

function Headline({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-3xl md:text-4xl font-bold text-teal-700 mt-1">{children}</p>
    </div>
  )
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children}
    </div>
  )
}

function Onward({ links }: { links: Array<{ href: string; label: string }> }) {
  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {links.map((l, i) => (
        <Link
          key={l.href}
          href={l.href}
          className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-medium text-sm transition ${
            i === 0
              ? "bg-teal-600 text-white hover:bg-teal-700"
              : "border border-gray-300 text-gray-800 hover:border-teal-400"
          }`}
        >
          {l.label}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      ))}
    </div>
  )
}
