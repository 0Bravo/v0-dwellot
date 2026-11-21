import { createClient } from "@supabase/supabase-js"
import HomeClient from "./HomeClient"
import { buildFinanceIndexEdition } from "@/lib/finance/index-edition"
import type { MoneySnapshot } from "@/components/home/MoneyFirst"

// Rebuild at most once a minute; listings change rarely.
export const revalidate = 60

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
