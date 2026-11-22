import { createAdminClient } from "@/lib/supabase/admin"

/**
 * Landing pages built from the listings we already hold.
 *
 * A search for "Trasacco Valley prices" or "Clifton Homes Ghana" currently
 * finds nothing of ours worth ranking, because every listing lives behind one
 * generic /properties page. Grouping the same rows by where they are, which
 * estate they sit in and who built them turns 90 listings into a few dozen
 * pages that each answer a question somebody actually types.
 *
 * The three collections differ only in which column they group by, so they
 * share everything below.
 */

export type CollectionKind = "location" | "estate" | "developer"

export const COLLECTION_COLUMN: Record<CollectionKind, string> = {
  location: "location",
  estate: "estate_name",
  developer: "developer",
}

export const COLLECTION_BASE: Record<CollectionKind, string> = {
  location: "/locations",
  estate: "/estates",
  developer: "/developers",
}

export interface CollectionProperty {
  id: string | number
  title: string
  location: string | null
  price: number | null
  currency: string | null
  property_type: string | null
  listing_type: string | null
  bedrooms: number | null
  bathrooms: number | null
  area: number | null
  images: string[] | null
  developer?: string | null
  estate_name?: string | null
}

export interface Collection {
  kind: CollectionKind
  /** The value as stored, e.g. "East Legon" */
  name: string
  slug: string
  properties: CollectionProperty[]
  forSale: number
  forRent: number
  /** Sale prices only; rent would make the range meaningless */
  minPrice: number | null
  maxPrice: number | null
  currency: string
  /** Other values that appear alongside this one, for internal links */
  relatedLocations: string[]
  relatedDevelopers: string[]
}

const SELECT =
  "id, title, location, price, currency, property_type, listing_type, bedrooms, bathrooms, area, images, developer, estate_name"

/** "East Legon Hills" -> "east-legon-hills" */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

/**
 * Every value of a column that has at least `min` active listings.
 *
 * Below that a page has nothing to say, and a thin page that ranks for
 * nothing is worse than no page: it spends crawl budget and dilutes the
 * pages that do have something on them.
 */
export async function listCollectionValues(
  kind: CollectionKind,
  min = 2,
): Promise<{ name: string; slug: string; count: number }[]> {
  const column = COLLECTION_COLUMN[kind]
  try {
    const { data, error } = await createAdminClient()
      .from("properties")
      .select(column)
      .eq("status", "active")
    if (error || !data) return []

    const counts = new Map<string, number>()
    for (const row of data as unknown as Record<string, string | null>[]) {
      const value = (row[column] ?? "").trim()
      if (!value) continue
      counts.set(value, (counts.get(value) ?? 0) + 1)
    }

    return [...counts.entries()]
      .filter(([, count]) => count >= min)
      .map(([name, count]) => ({ name, slug: slugify(name), count }))
      .sort((a, b) => b.count - a.count)
  } catch {
    return []
  }
}

/** One collection by slug, or null when nothing matches. */
export async function getCollection(
  kind: CollectionKind,
  slug: string,
): Promise<Collection | null> {
  const values = await listCollectionValues(kind)
  const match = values.find((v) => v.slug === slug)
  if (!match) return null

  const column = COLLECTION_COLUMN[kind]
  try {
    const { data, error } = await createAdminClient()
      .from("properties")
      .select(SELECT)
      .eq("status", "active")
      .eq(column, match.name)
      .order("price", { ascending: true })
    if (error || !data) return null

    const properties = data as unknown as CollectionProperty[]
    const sale = properties.filter((p) => p.listing_type === "sale" && typeof p.price === "number")
    const prices = sale.map((p) => p.price as number).filter((n) => n > 0)

    return {
      kind,
      name: match.name,
      slug,
      properties,
      forSale: properties.filter((p) => p.listing_type === "sale").length,
      forRent: properties.filter((p) => p.listing_type === "rent").length,
      minPrice: prices.length ? Math.min(...prices) : null,
      maxPrice: prices.length ? Math.max(...prices) : null,
      currency: properties.find((p) => p.currency)?.currency ?? "USD",
      relatedLocations: unique(properties.map((p) => p.location)).filter((l) => l !== match.name),
      relatedDevelopers: unique(properties.map((p) => p.developer)).filter((d) => d !== match.name),
    }
  } catch {
    return null
  }
}

function unique(values: (string | null | undefined)[]): string[] {
  return [...new Set(values.map((v) => (v ?? "").trim()).filter(Boolean))]
}

/* ---------------------------------------------------------------------------
 * Location x property type
 *
 * "3-bedroom houses in East Legon" is a real query with real inventory behind
 * it, and it is where honest scale comes from: each page is differentiated by
 * data rather than by rewording the same prose. The same two-listing floor
 * applies, which is what stops this turning into a thousand empty pages.
 * ------------------------------------------------------------------------ */

export interface ComboValue {
  location: string
  propertyType: string
  slug: string
  count: number
}

/** "east-legon/house" style slug, one segment each. */
export function comboSlug(location: string, propertyType: string): string {
  return `${slugify(location)}--${slugify(propertyType)}`
}

export async function listComboValues(min = 2): Promise<ComboValue[]> {
  try {
    const { data, error } = await createAdminClient()
      .from("properties")
      .select("location, property_type")
      .eq("status", "active")
    if (error || !data) return []

    const counts = new Map<string, { location: string; propertyType: string; count: number }>()
    for (const row of data as unknown as { location: string | null; property_type: string | null }[]) {
      const location = (row.location ?? "").trim()
      const propertyType = (row.property_type ?? "").trim()
      if (!location || !propertyType) continue
      const key = comboSlug(location, propertyType)
      const existing = counts.get(key)
      if (existing) existing.count += 1
      else counts.set(key, { location, propertyType, count: 1 })
    }

    return [...counts.entries()]
      .filter(([, v]) => v.count >= min)
      .map(([slug, v]) => ({ ...v, slug }))
      .sort((a, b) => b.count - a.count)
  } catch {
    return []
  }
}

export async function getCombo(slug: string): Promise<Collection | null> {
  const values = await listComboValues()
  const match = values.find((v) => v.slug === slug)
  if (!match) return null

  try {
    const { data, error } = await createAdminClient()
      .from("properties")
      .select(SELECT)
      .eq("status", "active")
      .eq("location", match.location)
      .eq("property_type", match.propertyType)
      .order("price", { ascending: true })
    if (error || !data) return null

    const properties = data as unknown as CollectionProperty[]
    const sale = properties.filter((p) => p.listing_type === "sale" && typeof p.price === "number")
    const prices = sale.map((p) => p.price as number).filter((n) => n > 0)

    return {
      kind: "location",
      name: `${titleCase(match.propertyType)}s in ${match.location}`,
      slug,
      properties,
      forSale: properties.filter((p) => p.listing_type === "sale").length,
      forRent: properties.filter((p) => p.listing_type === "rent").length,
      minPrice: prices.length ? Math.min(...prices) : null,
      maxPrice: prices.length ? Math.max(...prices) : null,
      currency: properties.find((p) => p.currency)?.currency ?? "USD",
      relatedLocations: [match.location],
      relatedDevelopers: unique(properties.map((p) => p.developer)),
    }
  } catch {
    return null
  }
}

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}
