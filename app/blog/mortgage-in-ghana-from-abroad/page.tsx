import type { Metadata } from "next"
import Link from "next/link"
import { Article } from "@/components/blog/Article"
import { getPost } from "@/lib/blog/posts"
import { buildFinanceIndexEdition } from "@/lib/finance/index-edition"
import { formatRateDate } from "@/lib/mortgage/rates"

const SLUG = "mortgage-in-ghana-from-abroad"
export const revalidate = 43200

export const metadata: Metadata = {
  title: "Can You Get a Mortgage in Ghana While Living Abroad?",
  description:
    "Which Ghanaian lenders consider diaspora applicants, what they ask for, whether to borrow in cedis or dollars, and the currency risk that only shows up after you have signed.",
  alternates: { canonical: `/blog/${SLUG}` },
}

export default async function Page() {
  const post = getPost(SLUG)!
  const e = await buildFinanceIndexEdition()

  const cedi = e.lenderTerms.published.filter((r) => r.currency === "GHS")
  const dollar = e.lenderTerms.published.filter((r) => r.currency === "USD")
  const cheapestCedi = [...cedi].sort((a, b) => a.rate - b.rate)[0]
  const cheapestDollar = [...dollar].sort((a, b) => a.rate - b.rate)[0]

  return (
    <Article post={post} asOfNote={`rates as at ${formatRateDate(e.generatedAt)}`}>
      <p>
        Yes, and it is more common than most people expect. Several Ghanaian banks lend in US
        dollars precisely because so many of their borrowers earn abroad. The harder questions are
        which currency to borrow in and what the bank will ask you for, and the first of those is
        worth more money than anything else on this page.
      </p>

      <h2>What lenders are charging right now</h2>
      <p>
        These are rates lenders publish or price by a stated formula. Figures we hold but cannot
        confirm with the lender are left out, which is why some banks are missing.
      </p>
      <table>
        <thead>
          <tr>
            <th>Lender</th>
            <th>Currency</th>
            <th>Rate</th>
            <th>Max term</th>
          </tr>
        </thead>
        <tbody>
          {e.lenderTerms.published.map((r) => (
            <tr key={`${r.id}-${r.currency}`}>
              <td>{r.name}</td>
              <td>{r.currency === "GHS" ? "Cedi" : "US dollar"}</td>
              <td>{r.display}</td>
              <td>{r.maxTermYears} years</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>The currency question</h2>
      {cheapestCedi && cheapestDollar ? (
        <p>
          The cheapest published cedi rate is {cheapestCedi.rate}% and the cheapest published dollar
          rate is {cheapestDollar.rate}%. On the face of it the dollar loan is obviously cheaper,
          and that gap is why most diaspora buyers take one.
        </p>
      ) : null}
      <p>
        The rate is not the whole price. A dollar loan is cheaper if you earn dollars. If you earn
        pounds or euros, you have swapped one currency mismatch for another. And if you ever move
        home and start earning cedis while still repaying dollars, a currency move works directly
        against you on every remaining payment, with no cap and no way out but refinancing.
      </p>
      <p>
        A cedi loan costs more in interest and removes that risk entirely. Which is right depends
        on what you earn and how long you expect to keep earning it — not on which rate is lower.
        We set the two against each other, per unit borrowed, in{" "}
        <Link href="/finance/cedi-or-dollar-mortgage">cedi or dollar mortgage</Link>.
      </p>

      <h2>What a bank will ask you for</h2>
      <p>
        Requirements differ by lender and this is not a substitute for asking them, but a diaspora
        application generally turns on four things.
      </p>
      <ul>
        <li>
          <strong>Proof of income abroad</strong>, usually six months of payslips and bank
          statements, sometimes audited accounts if you are self-employed.
        </li>
        <li>
          <strong>A Ghanaian bank account</strong>, and often a period of history on it before they
          will lend.
        </li>
        <li>
          <strong>Identification</strong>, typically a Ghana Card alongside your passport.
        </li>
        <li>
          <strong>A deposit of 20% or more</strong>, and a property with registered title. An
          unregistered plot is a much harder conversation.
        </li>
      </ul>
      <p>
        Expect the process to be slower than it would be where you live, and expect to be asked for
        the same document more than once.
      </p>

      <h2>The cost nobody quotes you</h2>
      <p>
        Fees on a {`GH₵`}
        {e.workedExample.priceGhs.toLocaleString("en-GB")} purchase come to{" "}
        {e.workedExample.feesPctOfPrice}% of the price on top of the deposit. Add the cost of
        moving money into cedis, and the exchange rate between agreeing a price and completing.
        That last one is usually the largest single variable in a diaspora purchase and the one
        least often budgeted for.
      </p>

      <h2>Before you commit</h2>
      <p>
        Two steps, in this order. Run your income through the{" "}
        <Link href="/">affordability tool</Link> to see what a Ghanaian bank would actually
        advance you, which is often less than you would expect at these rates. Then pay for an
        official Lands Commission search on the specific property before any money moves. It costs
        a few hundred cedis and it is the only step that tells you the seller can sell.
      </p>
      <p>
        Nothing here is advice on your own circumstances, and we are not brokers: we publish the
        figures and the sources so you can check them.
      </p>
    </Article>
  )
}
