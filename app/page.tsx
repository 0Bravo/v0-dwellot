import type { Metadata } from "next"
import { createClient } from "@supabase/supabase-js"
import HomeClient from "./HomeClient"
import { buildFinanceIndexEdition } from "@/lib/finance/index-edition"
import type { MoneySnapshot } from "@/components/home/MoneyFirst"

// Rebuild at most once a minute; listings change rarely.
export const revalidate = 60

/* The layout's default still calls the site a property marketplace, which
   is the old positioning and the first thing a searcher reads. The homepage
   says what it now leads with; every other page keeps the default. */
export const metadata: Metadata = {
  /* The layout template does not reach the root page, so the brand is
     spelled out here: a title with no name in it is anonymous in a result. */
  title: "Ghana Property and Mortgages for Buyers Abroad | Dwellot",
  description:
    "Work out what you can afford in Ghana, what a purchase really costs once stamp duty, " +
    "Lands Commission and lender fees are counted, and which lender is cheapest \u2014 then browse " +
    "homes for sale and rent.",
  alternates: { canonical: "/" },
}

const LIST_FIELDS =
  "id, title, location, price, currency, property_type, listing_type, bedrooms, bathrooms, area, parking, description, images, featured, status, agent, phone, view_count, created_at"

/**
 * Load the listings on the server so the homepage HTML contains them.
 *
 * The page used to fetch these in the browser, which meant crawlers were
 * served the loading skeleton and nothing else.
 */
async function getHomeProperties() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return { featured: [], all: [], total: 0 }

  try {
    const supabase = createClient(url, key)

    const [featuredResult, allResult] = await Promise.all([
      supabase
        .from("properties")
        .select(LIST_FIELDS)
        .eq("status", "active")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(100),
      supabase
        .from("properties")
        .select(LIST_FIELDS, { count: "exact" })
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(500),
    ])

    return {
      featured: featuredResult.data ?? [],
      all: allResult.data ?? [],
      total: allResult.count ?? allResult.data?.length ?? 0,
    }
  } catch {
    // The client component falls back to fetching these itself.
    return { featured: [], all: [], total: 0 }
  }
}

/**
 * The index's own figures, so the homepage and the page we ask people to
 * cite cannot disagree. Never fatal: the homepage is not worth failing over
 * a rate fetch.
 */
async function getMoneySnapshot(): Promise<MoneySnapshot | null> {
  try {
    const e = await buildFinanceIndexEdition()
    return {
      policyRate: e.policy.rate,
      policyChangeBp: e.policy.changeBp,
      grr: e.grr.rate,
      usdGhs: e.fx.usdGhs,
      editionLabel: e.editionLabel,
      feesPctOfPrice: e.workedExample.feesPctOfPrice,
    }
  } catch {
    return null
  }
}

export default async function HomePage() {
  const [{ featured, all, total }, money] = await Promise.all([
    getHomeProperties(),
    getMoneySnapshot(),
  ])

  return (
    <HomeClient initialFeatured={featured} initialAll={all} initialTotal={total} money={money} />
  )
}
