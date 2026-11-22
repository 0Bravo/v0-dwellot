import type { Metadata } from "next"
import Link from "next/link"
import { Article } from "@/components/blog/Article"
import { getPost } from "@/lib/blog/posts"
import { buildFinanceIndexEdition } from "@/lib/finance/index-edition"
import { calculateMortgage } from "@/lib/mortgage/calc"
import { formatRateDate } from "@/lib/mortgage/rates"

const SLUG = "salary-needed-for-a-mortgage-in-ghana"
export const revalidate = 43200

/** The share of net income Absa and Republic Bank both cap repayments at. */
const DSR_PCT = 50
const DEPOSIT_PCT = 20
const TERM_YEARS = 15
const PRICES = [500_000, 1_000_000, 2_000_000]

export const metadata: Metadata = {
  title: "What Salary Do You Need for a Mortgage in Ghana?",
  description:
    "Ghanaian banks cap repayments at a share of net income. Worked backwards from today's published rates, here is the monthly income a GH₵500,000, GH₵1m and GH₵2m home asks for.",
  alternates: { canonical: `/blog/${SLUG}` },
}

const ghs = (n: number) => `GH₵${Math.round(n).toLocaleString("en-GB")}`

export default async function Page() {
  const post = getPost(SLUG)!
  const e = await buildFinanceIndexEdition()

  /* The cheapest rate a bank publishes or prices by formula. Not the cheapest
     rate on the table: the National Homeownership Fund undercuts every bank
     but carries eligibility conditions, so quoting it here would tell most
     readers they can afford more than they can. */
  const rate = e.rateSensitivity.fromRate

  const rows = PRICES.map((price) => {
    const m = calculateMortgage({
      price,
      deposit: price * (DEPOSIT_PCT / 100),
      annualRatePct: rate,
      termYears: TERM_YEARS,
    })
    return {
      price,
      deposit: price * (DEPOSIT_PCT / 100),
      monthly: m.monthlyPayment,
      /* Invert the cap: if repayments may take DSR_PCT of net income, the
         income needed is the repayment divided by that share. */
      incomeNeeded: m.monthlyPayment / (DSR_PCT / 100),
    }
  })

  return (
    <Article post={post} asOfNote={`rates as at ${formatRateDate(e.generatedAt)}`}>
      <p>
        Ghanaian banks do not lend against the price of a house. They lend against your income, and
        they cap what the repayment may take of it. Absa and Republic Bank both work to{" "}
        {DSR_PCT}% of net monthly income, so the arithmetic runs backwards: the repayment decides
        the income, and the income decides the house.
      </p>
      <p>
        Everything below assumes a {DEPOSIT_PCT}% deposit over {TERM_YEARS} years at {rate}%, the
        cheapest rate a Ghanaian bank currently publishes, and no other loan repayments. Add a car
        loan or school fees on credit and the figure rises.
      </p>

      <h2>The income each price asks for</h2>
      <table>
        <thead>
          <tr>
            <th>Property price</th>
            <th>Deposit ({DEPOSIT_PCT}%)</th>
            <th>Monthly repayment</th>
            <th>Net monthly income needed</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.price}>
              <td>{ghs(r.price)}</td>
              <td>{ghs(r.deposit)}</td>
              <td>{ghs(r.monthly)}</td>
              <td>
                <strong>{ghs(r.incomeNeeded)}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        Those income figures are net, not gross, and they are monthly. They are also the minimum at
        which a bank would look at you, not a comfortable position to be in.
      </p>

      <h2>Why the numbers look severe</h2>
      <p>
        Because the rate is high. At {rate}% over {TERM_YEARS} years, interest is the larger part of
        what you repay, so the income test bites long before the price does. The same house at a
        European rate would ask for a fraction of this income. That is the cost of borrowing in
        cedis, and it is the single biggest reason diaspora buyers look at dollar loans.
      </p>
      <p>
        A dollar mortgage carries a visibly lower rate, and a risk the rate does not show: you earn
        and repay in different currencies. We set the two against each other in{" "}
        <Link href="/finance/cedi-or-dollar-mortgage">cedi or dollar mortgage</Link>.
      </p>

      <h2>Three things that change the answer</h2>
      <ol>
        <li>
          <strong>A bigger deposit.</strong> It cuts the loan, the repayment and the income test
          together. It is the only lever that moves all three.
        </li>
        <li>
          <strong>A longer term.</strong> Twenty years instead of fifteen lowers the monthly payment
          and therefore the income needed. It also costs considerably more in total interest.
        </li>
        <li>
          <strong>The National Homeownership Fund.</strong> It is cheaper than any bank here, but it
          carries eligibility conditions, which is why it is not the rate used above. Worth checking
          whether you qualify before you accept a bank's offer.
        </li>
      </ol>

      <h2>Before you take the figure as settled</h2>
      <p>
        The repayment is not the cost of buying. On a {ghs(e.workedExample.priceGhs)} purchase, fees
        add {ghs(e.workedExample.feesTotal)} on top of the price —{" "}
        {e.workedExample.feesPctOfPrice}% — so the cash needed to complete is{" "}
        {ghs(e.workedExample.cashNeeded)}, not just the deposit. Run your own figures with the{" "}
        <Link href="/finance">affordability tool</Link>, or work the fees through the{" "}
        <Link href="/finance/cost-of-buying">cost of buying calculator</Link>.
      </p>
    </Article>
  )
}
