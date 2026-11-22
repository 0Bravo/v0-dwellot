import { SECTIONS, renderSitemapIndex } from "@/lib/seo/sitemap-sections"

/**
 * The sitemap index.
 *
 * /sitemap.xml keeps its address — it is what robots.txt points at and what
 * Search Console already knows — but now lists the section files rather than
 * every URL, so coverage can be read per kind of page.
 */
export const revalidate = 3600

export function GET() {
  return new Response(renderSitemapIndex(SECTIONS), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
