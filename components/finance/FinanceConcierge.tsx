"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowLeft, ArrowRight, Compass, Globe2, Home, RotateCcw, Sparkles, Wallet } from "lucide-react"
import { calculateAffordability, formatMoney } from "@/lib/mortgage/calc"
import { compareLenders } from "@/lib/mortgage/compare"
import { calculateBuyingCosts, DEFAULT_COSTS_INPUT } from "@/lib/finance/buying-costs"
import { AnimatedNumber } from "./motion"
import { RadialSlider } from "@/components/ui/RadialSlider"
import { compactMoney } from "@/lib/finance/format"

/**
 * The guided entry to the finance section.
 *
 * Rather than a menu of six tools, it asks what the visitor is trying to do
 * and answers that question with the same engines the full pages use —
 * compareLenders, calculateAffordability and calculateBuyingCosts — then
 * hands off to the page that goes deeper. Nothing here is a separate
 * calculation, so it cannot disagree with the rest of the section.
 *
 * It sits on a dark teal surface rather than another white card, so the
 * section opens with one thing to look at instead of six equal ones. Teal
 * is the site's own colour: #14b8a6 is the theme colour and teal outnumbers
 * green roughly four to one across the app.
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

const INTENTS: Array<{
  id: Intent
  icon: typeof Wallet
  title: string
  blurb: string
  chip: string
}> = [
  {
    id: "budget",
    icon: Wallet,
    title: "Work out what I can afford",
    blurb: "Start from my income and savings",
    chip: "bg-amber-400/20 text-amber-200 ring-amber-300/30",
  },
  {
    id: "found",
    icon: Home,
    title: "I've found a place",
    blurb: "Tell me what it really costs",
    chip: "bg-sky-400/20 text-sky-200 ring-sky-300/30",
  },
  {
    id: "abroad",
    icon: Globe2,
    title: "I'm buying from abroad",
    blurb: "I earn in dollars or pounds",
    chip: "bg-violet-400/20 text-violet-200 ring-violet-300/30",
  },
  {
    id: "browse",
    icon: Compass,
    title: "Just looking around",
    blurb: "Show me today's rates",
    chip: "bg-emerald-400/20 text-emerald-200 ring-emerald-300/30",
  },
]

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white text-gray-900 placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/70"

export default function FinanceConcierge({ grrRate, usdGhs, gbpGhs }: Props) {
  const reduce = useReducedMotion()
  const [intent, setIntent] = useState<Intent | null>(null)
  const [step, setStep] = useState(0)

  const [income, setIncome] = useState(8000)
  const [debts, setDebts] = useState(0)
  const [savings, setSavings] = useState(150_000)
  const [price, setPrice] = useState(1_000_000)
  const [depositPct, setDepositPct] = useState(20)
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

  const upside =
    cediLenders.cheapest && baseline && cediLenders.cheapest.rate < baseline.rate ? cediLenders.cheapest : null

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
    const lenders = compareLenders({ currency: "GHS", propertyPrice: price, deposit, termYears: TERM_YEARS, grrRate })
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
    const lenders = compareLenders({
      currency: "USD",
      propertyPrice: usdPrice,
      deposit: usdPrice * 0.3,
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
  const transition = reduce ? { duration: 0 } : { duration: 0.35, ease: EASE }

  return (
    <section
      className="relative overflow-hidden rounded-3xl bg-white/[0.07] ring-1 ring-white/15 backdrop-blur-md shadow-2xl shadow-teal-950/30"
      aria-labelledby="concierge-heading"
    >
      <div className="relative p-6 md:p-10">
        <div className="flex items-start justify-between gap-4 mb-7">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-200 bg-white/10 ring-1 ring-white/15 rounded-full px-3 py-1 mb-4">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              Guided
            </p>
            <h2
              id="concierge-heading"
              className="text-2xl md:text-3xl font-bold text-white text-balance"
            >
              {intent === null ? "What brings you here?" : "Let's work it out"}
            </h2>
            <p className="text-teal-100/90 mt-2 max-w-xl">
              {intent === null
                ? "Two questions and you get a real number, not a brochure."
                : "Figures come from the same engines as the full calculators."}
            </p>
          </div>

          {intent !== null && (
            <button
              type="button"
              onClick={restart}
              className="flex-shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-teal-100 hover:text-white transition"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Start again</span>
            </button>
          )}
        </div>

        {intent !== null && (
          <div className="flex items-center gap-2 mb-7" aria-hidden="true">
            {Array.from({ length: totalSteps + 1 }).map((_, i) => (
              <motion.span
                key={i}
                className={`h-1.5 rounded-full ${i <= step ? "bg-white" : "bg-white/25"}`}
                initial={false}
                animate={{ width: i === step ? 48 : 18 }}
                transition={transition}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={panelKey}
            initial={reduce ? false : { opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? undefined : { opacity: 0, x: -28 }}
            transition={transition}
          >
            {/* ---------- Choose intent ---------- */}
            {intent === null && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {INTENTS.map(({ id, icon: Icon, title, blurb, chip }, i) => (
                  <motion.button
                    key={id}
                    type="button"
                    onClick={() => choose(id)}
                    className="group relative text-left rounded-2xl bg-white/[0.10] ring-1 ring-white/15 p-5 md:p-6 hover:bg-white/[0.18] hover:ring-white/30 transition-colors"
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.45, delay: i * 0.07, ease: EASE }}
                    whileHover={reduce ? undefined : { y: -4 }}
                    whileTap={reduce ? undefined : { scale: 0.99 }}
                  >
                    <span className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ring-1 mb-4 ${chip}`}>
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </span>
                    <span className="block text-lg font-semibold text-white leading-snug">{title}</span>
                    <span className="block text-sm text-teal-100/80 mt-1">{blurb}</span>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                      Start
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </motion.button>
                ))}
              </div>
            )}

            {/* ---------- Budget ---------- */}
            {intent === "budget" && step === 0 && (
              <Questions prompt="What comes in, and what have you saved?" onBack={restart} onNext={() => setStep(1)}>
                {/* Dials to explore, fields below for exact figures. Both ends
                    follow the value, because the fields take any amount. */}
                <div className="grid grid-cols-2 gap-2 sm:gap-6 items-start">
                  <RadialSlider
                    label="Monthly income"
                    value={income}
                    min={0}
                    max={Math.max(50_000, Math.ceil(income / 500) * 500)}
                    step={500}
                    onChange={setIncome}
                    format={(v) => compactMoney(v)}
                    size={184}
                    tone="dark"
                  />
                  <RadialSlider
                    label="Deposit saved"
                    value={savings}
                    min={0}
                    max={Math.max(2_000_000, Math.ceil(savings / 10_000) * 10_000)}
                    step={10_000}
                    onChange={setSavings}
                    format={(v) => compactMoney(v)}
                    size={184}
                    tone="dark"
                    accentClass="stroke-emerald-400"
                  />
                </div>
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
                    <Figure label="You could be looking at homes up to">
                      <AnimatedNumber value={Math.round(affordability.maxPropertyPrice)} prefix="GH₵" />
                    </Figure>
                    <Stats
                      items={[
                        { label: "Mortgage needed", value: formatMoney(affordability.maxLoan, "GHS") },
                        { label: "Monthly repayment", value: formatMoney(affordability.maxMonthlyPayment, "GHS") },
                        { label: "Your deposit", value: formatMoney(savings, "GHS") },
                      ]}
                    />
                    <Body>
                      Over {TERM_YEARS} years at {baselineRate}% — the lowest rate a bank publishes on its own
                      terms ({baselineName}).
                      {upside && upsideAffordability && (
                        <>
                          {" "}
                          If you qualify for {upside.name} at {upside.display}, the same income and deposit
                          stretch to about{" "}
                          <strong className="text-white">
                            {formatMoney(upsideAffordability.maxPropertyPrice, "GHS")}
                          </strong>
                          {upside.note ? `. ${upside.note}.` : "."}
                        </>
                      )}
                    </Body>
                    <Caveat>
                      Worked at the {DSR_PCT}% of net income that Absa and Republic Bank both cap total debt
                      repayments at. That is their maximum, not a target — borrowing right at it leaves nothing
                      for rates, repairs or a bad month.
                    </Caveat>
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
                    <Figure label="On these figures, a mortgage would not clear a lender's test">
                      <span className="text-4xl">Not yet</span>
                    </Figure>
                    <Body>
                      Your existing repayments of {formatMoney(debts, "GHS")} already use the {DSR_PCT}% of{" "}
                      {formatMoney(income, "GHS")} that a lender would allow, so there is nothing left for a
                      mortgage payment. Clearing or reducing existing credit, or a larger deposit, changes this
                      quickly.
                    </Body>
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
              <Questions
                prompt="What is the asking price, and what can you put down?"
                onBack={restart}
                onNext={() => setStep(1)}
              >
                <div className="grid grid-cols-2 gap-2 sm:gap-6 items-start">
                  <RadialSlider
                    label="Asking price"
                    value={price}
                    min={Math.min(50_000, Math.max(0, price))}
                    max={Math.max(10_000_000, Math.ceil(price / 10_000) * 10_000)}
                    step={10_000}
                    onChange={setPrice}
                    format={(v) => compactMoney(v)}
                    size={184}
                    tone="dark"
                  />
                  <RadialSlider
                    label="Deposit"
                    value={depositPct}
                    min={5}
                    max={50}
                    step={1}
                    onChange={setDepositPct}
                    format={(v) => `${Math.round(v)}%`}
                    caption={formatMoney(Math.round((price * depositPct) / 100), "GHS")}
                    size={184}
                    tone="dark"
                    accentClass="stroke-emerald-400"
                  />
                </div>
                <Field label="Price (GH₵)" id="c-price">
                  <input id="c-price" type="number" min={0} value={price} className={inputClass}
                    onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))} />
                </Field>
              </Questions>
            )}

            {intent === "found" && step === 1 && (
              <Answer onBack={() => setStep(0)}>
                <Figure label="To complete, you need in cash">
                  <AnimatedNumber value={Math.round(foundResult.costs.cashNeeded)} prefix="GH₵" />
                </Figure>
                <Stats
                  items={[
                    { label: "Deposit", value: formatMoney(foundResult.deposit, "GHS") },
                    {
                      label: `Fees and taxes (${foundResult.costs.feesPctOfPrice}%)`,
                      value: formatMoney(foundResult.costs.feesTotal, "GHS"),
                    },
                    foundResult.lenders.cheapest
                      ? {
                          label: "Monthly, cheapest lender",
                          value: formatMoney(foundResult.lenders.cheapest.monthlyPayment, "GHS"),
                        }
                      : { label: "Monthly", value: "—" },
                  ]}
                />
                {foundResult.lenders.cheapest && (
                  <Body>
                    The cheapest lender we can source for the remaining{" "}
                    {formatMoney(foundResult.lenders.cheapest.loanAmount, "GHS")} is{" "}
                    <strong className="text-white">{foundResult.lenders.cheapest.name}</strong> at{" "}
                    {foundResult.lenders.cheapest.display} over {TERM_YEARS} years
                    {foundResult.lenders.cheapest.note ? ` — ${foundResult.lenders.cheapest.note.toLowerCase()}` : ""}.
                  </Body>
                )}
                {foundResult.lenders.spread > 0 && (
                  <Caveat>
                    Picking the dearest lender instead would cost {formatMoney(foundResult.lenders.spread, "GHS")}{" "}
                    more over the term.
                  </Caveat>
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
              <Questions
                prompt="What are you looking at, and where do you earn?"
                onBack={restart}
                onNext={() => setStep(1)}
              >
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
                <Figure label="The cash you need to complete, in your currency">
                  <AnimatedNumber
                    value={Math.round(abroadResult.costs.cashNeeded / abroadResult.divisor)}
                    prefix={abroadResult.symbol}
                  />
                </Figure>
                <Stats
                  items={[
                    { label: "In cedis", value: formatMoney(abroadResult.costs.cashNeeded, "GHS") },
                    { label: "Of which fees", value: formatMoney(abroadResult.costs.feesTotal, "GHS") },
                    abroadResult.lenders.cheapest
                      ? {
                          label: "Monthly, US dollar loan",
                          value: formatMoney(abroadResult.lenders.cheapest.monthlyPayment, "USD"),
                        }
                      : { label: "Monthly", value: "—" },
                  ]}
                />
                <Body>
                  On a {formatMoney(price, "GHS")} home with a 30% deposit — the larger deposit lenders typically
                  want from non-residents.
                  {abroadResult.lenders.cheapest && (
                    <>
                      {" "}
                      A US dollar mortgage is the usual route: the cheapest we can source is{" "}
                      <strong className="text-white">{abroadResult.lenders.cheapest.name}</strong> at{" "}
                      {abroadResult.lenders.cheapest.display}.
                    </>
                  )}
                </Body>
                <Caveat>
                  Stamp duty and Lands Commission fees are set in cedis, so the amount you send moves with the
                  exchange rate between now and completion. That risk is yours, not the seller&rsquo;s.
                </Caveat>
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
                <Figure label="The Ghana Reference Rate today">
                  <AnimatedNumber value={grrRate} decimals={2} suffix="%" />
                </Figure>
                <Stats
                  items={[
                    { label: "One US dollar", value: `GH₵${usdGhs.toFixed(2)}` },
                    cediLenders.cheapest
                      ? { label: "Cheapest cedi mortgage", value: cediLenders.cheapest.display }
                      : { label: "Cheapest cedi mortgage", value: "—" },
                    { label: "Lowest on bank's own terms", value: `${baselineRate}%` },
                  ]}
                />
                <Body>
                  The reference rate is the benchmark banks add their margin to when pricing a cedi loan, so it
                  sets the floor under every cedi mortgage in the country.
                </Body>
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
      <p className="text-lg font-medium text-white mb-5">{prompt}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{children}</div>
      <div className="flex items-center justify-between mt-8">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-100 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="group inline-flex items-center gap-2 px-6 py-3.5 bg-white text-teal-900 rounded-xl font-semibold hover:bg-teal-50 transition shadow-lg shadow-teal-950/20"
        >
          Show me
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

function Answer({ children, onBack }: { children: React.ReactNode; onBack: () => void }) {
  return (
    <div>
      <div className="space-y-5" aria-live="polite">
        {children}
      </div>
      <button
        type="button"
        onClick={onBack}
        className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-teal-100 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Change my answers
      </button>
    </div>
  )
}

function Figure({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-200">{label}</p>
      <p className="text-5xl md:text-6xl font-bold text-white tracking-tight mt-2 tabular-nums">{children}</p>
    </div>
  )
}

function Stats({ items }: { items: Array<{ label: string; value: string }> }) {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl bg-white/[0.08] ring-1 ring-white/10 px-4 py-3">
          <dt className="text-[11px] font-medium uppercase tracking-wider text-teal-200">{item.label}</dt>
          <dd className="text-lg font-semibold text-white mt-0.5 tabular-nums">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function Body({ children }: { children: React.ReactNode }) {
  return <p className="text-sm md:text-base text-teal-50/90 leading-relaxed">{children}</p>
}

function Caveat({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-teal-200/80 leading-relaxed border-t border-white/10 pt-4">{children}</p>
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-teal-100 mb-2">
        {label}
      </label>
      {children}
    </div>
  )
}

function Onward({ links }: { links: Array<{ href: string; label: string }> }) {
  return (
    <div className="flex flex-wrap gap-2.5 pt-1">
      {links.map((l, i) => (
        <Link
          key={l.href}
          href={l.href}
          className={`group inline-flex items-center gap-1.5 px-5 py-3 rounded-xl font-semibold text-sm transition ${
            i === 0
              ? "bg-white text-teal-900 hover:bg-teal-50 shadow-lg shadow-teal-950/20"
              : "bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20"
          }`}
        >
          {l.label}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      ))}
    </div>
  )
}
