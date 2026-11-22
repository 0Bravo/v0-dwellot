import { SECTIONS, getSection, renderUrlset, type Section } from "@/lib/seo/sitemap-sections"

export const revalidate = 3600

export function generateStaticParams() {
  return SECTIONS.map((section) => ({ section: `${section}.xml` }))
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ section: string }> },
) {
  const { section } = await params
  const name = section.replace(/\.xml$/, "") as Section
  if (!SECTIONS.includes(name)) {
    return new Response("Not found", { status: 404 })
  }

  const entries = await getSection(name)
  return new Response(renderUrlset(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
