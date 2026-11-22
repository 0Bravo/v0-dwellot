import type { Metadata } from "next"
import Link from "next/link"
import { Article } from "@/components/blog/Article"
import { getPost } from "@/lib/blog/posts"
import { buildFinanceIndexEdition } from "@/lib/finance/index-edition"
import { formatRateDate } from "@/lib/mortgage/rates"

const SLUG = "cost-of-buying-a-house-in-ghana"
export const revalidate = 43200

export const metadata: Metadata = {
  title: "What It Really Costs to Buy a House in Ghana, Beyond the Price",
  description:
    "Stamp duty, Lands Commission charges, legal and lender fees on a Ghanaian purchase. Which are fixed by law, which are negotiable, and what they add up to on a GH₵1m home.",
  alternates: { canonical: `/blog/${SLUG}` },
}

const ghs = (n: number) => `GH₵${Math.round(n).toLocaleString("en-GB")}`

export default async function Page() {
  const post = getPost(SLUG)!
  const e = await buildFinanceIndexEdition()
  const w = e.workedExample
  const lc = e.statutory.landsCommission

  return (
    <Article post={post} asOfNote={`figures as at ${formatRateDate(e.generatedAt)}`}>
      <p>
        The price is the number people plan around. It is not the number they need. On a{" "}
        {ghs(w.priceGhs)} purchase with a {w.depositPct}% deposit, the fees on top come to{" "}
        <strong>{ghs(w.feesTotal)}</strong>, or {w.feesPctOfPrice}% of the price, so the cash you
        need to complete is <strong>{ghs(w.cashNeeded)}</strong> rather than the{" "}
        {ghs((w.priceGhs * w.depositPct) / 100)} deposit alone.
      </p>
      <p>
        The useful distinction is not big fees against small ones. It is the fees the state sets,
        which you cannot argue with, against the fees people quote you, which you can.
      </p>

      <h2>What the state charges, and will not negotiate</h2>
      <p>
        On this purchase the statutory part is {ghs(w.statutoryTotal)}. Two things make it up.
      </p>
      <h3>Stamp duty</h3>
      <p>
        Set by the Stamp Duty Act 2005 (Act 689), charged on the whole consideration in bands:
      </p>
      <ul>
        {e.statutory.stampDutyBands.map((b, i) => (
          <li key={i}>
            {b.upTo == null ? "Above the previous band" : `Up to ${ghs(b.upTo)}`}: {b.ratePct}%
          </li>
        ))}
      </ul>
      <h3>Lands Commission</h3>
      <p>
        Charged per acre or part of an acre, so a single plot counts as one. Transferring a title
        already registered runs about {ghs(lc.transferPerAcre.low)}. First registration of land
        that has never been registered runs {ghs(lc.firstRegistrationPerAcre.low)} to{" "}
        {ghs(lc.firstRegistrationPerAcre.high)}. An official search, which you should pay for
        before anything else, is {ghs(lc.search.low)} to {ghs(lc.search.high)}.
      </p>
      <p>
        That search is the cheapest money you will spend on the whole purchase, and the only step
        that tells you whether the person selling can actually sell.
      </p>

      <h2>What people quote you, and will negotiate</h2>
      <p>
        The market part of this purchase is {ghs(w.marketTotal)} — several times the statutory
        part. It is legal fees, valuation, the lender&apos;s arrangement fee, and the first year of
        building and life cover if you are borrowing. No schedule binds any of it.
      </p>
      <p>
        Legal fees are usually quoted as a percentage of the price, which means the work does not
        change but the bill does. Ask for the figure in writing before you instruct anyone, and ask
        what it covers: a firm quoting a percentage is not necessarily doing more searching than
        one quoting a fee.
      </p>

      <h2>The order that saves you money</h2>
      <ol>
        <li>
          <strong>Official search first</strong>, before any deposit changes hands. It costs under{" "}
          {ghs(lc.search.high)} and it is the step that catches land sold twice.
        </li>
        <li>
          <strong>Get the legal quote in writing</strong>, and a second one. This is the largest
          negotiable line.
        </li>
        <li>
          <strong>Ask the lender for the arrangement fee as a cash figure</strong>, not a
          percentage, so you can compare it against another lender&apos;s.
        </li>
        <li>
          <strong>Budget the insurance</strong>. Building and life cover are usually conditions of
          the loan rather than optional, and the first year is payable up front.
        </li>
      </ol>

      <h2>If you are buying from abroad</h2>
      <p>
        Every figure above is in cedis, and you will be converting into them. A purchase agreed
        today and completed in three months is exposed to whatever the rate does in between, on the
        whole amount. That risk is usually larger than any fee on this page.
      </p>
      <p>
        Work your own numbers through the{" "}
        <Link href="/finance/cost-of-buying">cost of buying calculator</Link>, which separates the
        statutory from the negotiable and shows both in cedis, dollars or pounds.
      </p>
    </Article>
  )
}
