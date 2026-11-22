/**
 * The articles that exist.
 *
 * The blog index used to hold three hardcoded cards — "10 Tips for
 * First-Time Home Buyers in Ghana" and two others — that were not links,
 * because the articles behind them were never written. Meanwhile the one
 * real article was not linked from anywhere. A reader who clicked expecting
 * a post got nothing, and Google saw an index pointing at no content.
 *
 * Everything listed here resolves to a page. Adding a card without the page
 * is the bug this file exists to prevent, so the index renders from this
 * list and nothing else.
 */

export interface Post {
  slug: string
  title: string
  excerpt: string
  /** ISO date */
  published: string
  readMinutes: number
  /** Short label for grouping on the index */
  category: string
}

export const POSTS: Post[] = [
  {
    slug: "bank-of-ghana-rate-cut-mortgage-impact",
    title: "The Bank of Ghana cut rates to 11%. What that does to a mortgage",
    excerpt:
      "A 300 basis point cut sounds like cheaper borrowing. Here is what it is actually worth per month on a Ghanaian mortgage, and why nothing has reached borrowers yet.",
    published: "2026-11-22",
    readMinutes: 5,
    category: "Mortgages",
  },
  {
    slug: "salary-needed-for-a-mortgage-in-ghana",
    title: "What salary do you need for a mortgage in Ghana?",
    excerpt:
      "Banks here lend against a share of your income. Worked backwards from today's published rates, this is the monthly income a GH₵500,000, GH₵1m and GH₵2m home asks for.",
    published: "2026-11-22",
    readMinutes: 6,
    category: "Mortgages",
  },
  {
    slug: "cost-of-buying-a-house-in-ghana",
    title: "What it really costs to buy a house in Ghana, beyond the price",
    excerpt:
      "Stamp duty, Lands Commission charges, legal and lender fees. Which are fixed by law, which are negotiable, and what they add up to on a GH₵1m purchase.",
    published: "2026-11-22",
    readMinutes: 7,
    category: "Buying",
  },
  {
    /* Written before this registry existed, and linked from nowhere until
       now. Dated to its own publication, not to today. */
    slug: "buying-property-ghana-2026",
    title: "The complete guide to buying property in Ghana",
    excerpt:
      "The legal process end to end: title types, the Lands Commission search, what a solicitor does for you, and the steps where purchases go wrong.",
    published: "2026-01-15",
    readMinutes: 12,
    category: "Buying",
  },
  {
    slug: "mortgage-in-ghana-from-abroad",
    title: "Can you get a mortgage in Ghana while living abroad?",
    excerpt:
      "Which lenders consider diaspora applicants, what they ask for, whether to borrow in cedis or dollars, and the currency risk nobody mentions until you have signed.",
    published: "2026-11-22",
    readMinutes: 8,
    category: "Diaspora",
  },
]

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug)
}

/** Newest first. */
export function listPosts(): Post[] {
  return [...POSTS].sort((a, b) => b.published.localeCompare(a.published))
}
