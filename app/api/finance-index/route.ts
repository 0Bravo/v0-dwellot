import { NextResponse } from "next/server"
import { buildFinanceIndexEdition } from "@/lib/finance/index-edition"

/**
 * The index as JSON, so it can be quoted, charted or re-published without
 * scraping the page. Being reusable is the point: a figure someone can pull
 * programmatically is a figure that gets cited.
 *
 * Open on purpose, including cross-origin.
 */
export const revalidate = 43200

export async function GET() {
  const edition = await buildFinanceIndexEdition()

  return NextResponse.json(
    {
      ...edition,
      licence: "CC BY 4.0",
      attribution: edition.citation,
      source: "https://dwellot.com/ghana-property-finance-index",
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=43200, stale-while-revalidate=86400",
      },
    },
  )
}
