import type { Metadata } from "next"
import Link from "next/link"
import { Article } from "@/components/blog/Article"
import { getPost } from "@/lib/blog/posts"
import { buildFinanceIndexEdition } from "@/lib/finance/index-edition"
import { formatRateDate } from "@/lib/mortgage/rates"
import { compactMoney } from "@/lib/finance/format"

const SLUG = "bank-of-ghana-rate-cut-mortgage-impact"
export const revalidate = 43200

export const metadata: Metadata = {
  title: "Bank of Ghana Cut Rates to 11%: What It Does to a Mortgage",
  description:
    "The Bank of Ghana cut its policy rate by 300 basis points on 18 November 2026. What that is worth per month on a Ghanaian mortgage, and why it has not reached borrowers yet.",
  alternates: { canonical: `/blog/${SLUG}` },
}

const ghs = (n: number) => `GH₵${Math.round(n).toLocaleString("en-GB")}`

export default async function Page() {
  const post = getPost(SLUG)!
  const e = await buildFinanceIndexEdition()
  const s = e.rateSensitivity

  return (
    <Article post={post} asOfNote={`figures as at ${formatRateDate(e.generatedAt)}`}>
      <p>
        On 18 November 2026 the Bank of Ghana moved its policy rate from {e.policy.previous}% to{" "}
        {e.policy.rate}%, a cut of {Math.abs(e.policy.changeBp)} basis points, and narrowed the
        policy corridor to plus or minus {e.policy.corridorBp} basis points. It is the lowest the
        benchmark has been in decades.
      </p>
      <p>
        Most of the coverage stopped at the announcement. The question a household actually has is
        what it is worth, and that takes an amortisation calculation rather than a quote.
      </p>

      <h2>What a percentage point is worth</h2>
      <p>
        On a {ghs(s.loanGhs)} mortgage over {s.termYears} years, moving from {s.fromRate}% to{" "}
        {s.toRate}% takes the monthly payment from {ghs(s.monthlyAtFrom)} to {ghs(s.monthlyAtTo)}.
        That is <strong>{ghs(s.monthlySaving)} a month</strong>, and{" "}
        <strong>{compactMoney(s.lifetimeSaving)}</strong> over the life of the loan.
      </p>
      <p>
        The second figure is the one worth sitting with. A single percentage point, on a loan most
        people will hold for fifteen years, is roughly {compactMoney(s.lifetimeSaving)} — a
        meaningful fraction of the deposit that got you in.
      </p>

      <h2>Why your repayment has not changed</h2>
      <p>
        Here is the part the headline leaves out. Cedi mortgages in Ghana are not priced off the
        policy rate. They are priced off the{" "}
        <Link href="/finance/ghana-reference-rate">Ghana Reference Rate</Link>, which banks reset
        monthly and then add their own margin to.
      </p>
      <p>
        The Ghana Reference Rate in force is {e.grr.rate}%
        {e.grr.effectiveDate ? `, effective ${formatRateDate(e.grr.effectiveDate)}` : ""} — which
        {e.grr.predatesPolicyChange ? " predates the decision" : " already reflects the decision"}.
        So a cut on the eighteenth does not reach a borrower on the nineteenth. It arrives when the
        reference rate is next set, and only on loans written on a reference-rate basis. If your
        loan is fixed, it does not move at all.
      </p>

      <h2>What to do about it</h2>
      <ul>
        <li>
          If you are on a <strong>reference-rate-linked</strong> loan, nothing: the saving reaches
          you on the next reset, without you asking.
        </li>
        <li>
          If you are on a <strong>fixed rate</strong>, it will not reach you. Worth asking your
          lender what refinancing costs, and comparing that against the saving above before you
          move.
        </li>
        <li>
          If you are <strong>about to borrow</strong>, the gap between lenders is wider than the cut
          itself. We rank what every lender we can source is charging on{" "}
          <Link href="/finance/compare-mortgage-rates">the comparison page</Link>.
        </li>
      </ul>

      <h2>The thing a rate cut does not change</h2>
      <p>
        A cheaper rate lowers the monthly payment. It does nothing to the cash you need on the day,
        which is the deposit plus stamp duty, Lands Commission charges, legal and lender fees. On a{" "}
        {ghs(e.workedExample.priceGhs)} purchase with a {e.workedExample.depositPct}% deposit those
        fees come to {ghs(e.workedExample.feesTotal)}, or {e.workedExample.feesPctOfPrice}% of the
        price, and the total cash to complete is {ghs(e.workedExample.cashNeeded)}. Our{" "}
        <Link href="/finance/cost-of-buying">cost of buying calculator</Link> breaks that into what
        the law fixes and what you can push back on.
      </p>
    </Article>
  )
}
