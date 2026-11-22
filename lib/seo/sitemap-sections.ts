import type { MetadataRoute } from "next"
import { createAdminClient } from "@/lib/supabase/admin"
import {
  COLLECTION_BASE,
  listCollectionValues,
  listComboValues,
  type CollectionKind,
} from "@/lib/properties/collections"
import { listPosts } from "@/lib/blog/posts"

/**
 * The sitemap, split into sections.
 *
 * One flat file told us a number and nothing else. Search Console reports
 * coverage per submitted sitemap, so splitting by kind turns "229 URLs, some
 * indexed" into "the articles are in, the collection pages are not" — which
 * is the difference between knowing and guessing. The URLs are unchanged;
 * only how they are grouped and served is.
 *
 * Well under the 50,000 URL limit, so this is for diagnosis, not size.
 */

export const BASE_URL = "https://dwellot.com"

export const SECTIONS = ["pages", "articles", "collections", "listings"] as const
export type Section = (typeof SECTIONS)[number]

const now = () => new Date()

/** Hand-maintained pages: the site's own furniture. */
export function pagesSection(): MetadataRoute.Sitemap {
  const p = (
    path: string,
    changeFrequency: "daily" | "weekly" | "monthly" | "yearly",
    priority: number,
  ) => ({ url: `${BASE_URL}${path}`, lastModified: now(), changeFrequency, priority })

  return [
    { url: BASE_URL, lastModified: now(), changeFrequency: "daily" as const, priority: 1.0 },
    p("/ghana-property-finance-index", "daily", 0.95),
    p("/properties", "daily", 0.95),
    p("/finance/compare-mortgage-rates", "weekly", 0.9),
    p("/sell", "daily", 0.9),
    p("/rent", "daily", 0.9),
    p("/mortgage-calculator", "weekly", 0.85),
    p("/finance/cost-of-buying", "monthly", 0.85),
    p("/finance/ghana-reference-rate", "weekly", 0.85),
    p("/finance/mortgage-salary-requirements", "monthly", 0.85),
    p("/finance/cedi-or-dollar-mortgage", "monthly", 0.8),
    p("/locations", "weekly", 0.8),
    p("/estates", "weekly", 0.8),
    p("/developers", "weekly", 0.8),
    p("/agents", "weekly", 0.8),
    p("/blog", "weekly", 0.8),
    p("/about", "monthly", 0.7),
    p("/contact", "monthly", 0.7),
    p("/compare", "weekly", 0.6),
    p("/faq", "monthly", 0.6),
    p("/help", "monthly", 0.6),
    p("/brand", "monthly", 0.5),
    p("/privacy", "yearly", 0.3),
    p("/terms", "yearly", 0.3),
    p("/cookies", "yearly", 0.3),
  ]
}

export function articlesSection(): MetadataRoute.Sitemap {
  return listPosts().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.published),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))
}

/** Location, estate, developer and location x type pages. */
export async function collectionsSection(): Promise<MetadataRoute.Sitemap> {
  const out: MetadataRoute.Sitemap = []
  try {
    const kinds: CollectionKind[] = ["location", "estate", "developer"]
    const groups = await Promise.all(kinds.map((k) => listCollectionValues(k)))
    out.push(
      ...kinds.flatMap((kind, i) =>
        groups[i].map((v) => ({
          url: `${BASE_URL}${COLLECTION_BASE[kind]}/${v.slug}`,
          lastModified: now(),
          changeFrequency: "weekly" as const,
          priority: 0.75,
        })),
      ),
    )
  } catch {
    // A section short of some pages beats a sitemap that fails to build.
  }
  try {
    const combos = await listComboValues()
    out.push(
      ...combos.map((c) => ({
        url: `${BASE_URL}/property-search/${c.slug}`,
        lastModified: now(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    )
  } catch {
    // As above.
  }
  return out
}

/** Individual listings, plus the filtered views of them. */
export async function listingsSection(): Promise<MetadataRoute.Sitemap> {
  const filters: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/properties?listing_type=sale`, lastModified: now(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/properties?listing_type=rent`, lastModified: now(), changeFrequency: "daily", priority: 0.9 },
    ...["House", "Apartment", "Land", "Commercial", "Townhouse"].map((type) => ({
      url: `${BASE_URL}/properties?property_type=${encodeURIComponent(type)}`,
      lastModified: now(),
      changeFrequency: "daily" as const,
      priority: 0.85,
    })),
  ]

  try {
    const { data, error } = await createAdminClient()
      .from("properties")
      .select("id, updated_at, location")
      .eq("status", "active")
      .order("updated_at", { ascending: false })
    if (error || !data) return filters

    const listings: MetadataRoute.Sitemap = data.map((p) => ({
      url: `${BASE_URL}/properties/${p.id}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }))

    const locations = [...new Set(data.map((p) => p.location).filter(Boolean))]
    const locationFilters: MetadataRoute.Sitemap = locations.map((location) => ({
      url: `${BASE_URL}/properties?location=${encodeURIComponent(location)}`,
      lastModified: now(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    }))

    return [...filters, ...locationFilters, ...listings]
  } catch {
    return filters
  }
}

export async function getSection(section: Section): Promise<MetadataRoute.Sitemap> {
  switch (section) {
    case "pages":
      return pagesSection()
    case "articles":
      return articlesSection()
    case "collections":
      return collectionsSection()
    case "listings":
      return listingsSection()
  }
}

/** Minimal, correctly escaped urlset. */
export function renderUrlset(entries: MetadataRoute.Sitemap): string {
  const body = entries
    .map((e) => {
      const last =
        e.lastModified instanceof Date
          ? e.lastModified.toISOString()
          : e.lastModified
            ? new Date(e.lastModified).toISOString()
            : undefined
      return [
        "  <url>",
        `    <loc>${escapeXml(String(e.url))}</loc>`,
        last ? `    <lastmod>${last}</lastmod>` : "",
        e.changeFrequency ? `    <changefreq>${e.changeFrequency}</changefreq>` : "",
        e.priority != null ? `    <priority>${e.priority}</priority>` : "",
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n")
    })
    .join("\n")
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
}

export function renderSitemapIndex(sections: readonly string[]): string {
  const body = sections
    .map(
      (s) =>
        `  <sitemap>\n    <loc>${BASE_URL}/sitemaps/${s}.xml</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n  </sitemap>`,
    )
    .join("\n")
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`
}

/** & < > " ' in a URL would otherwise make the XML invalid. */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}
