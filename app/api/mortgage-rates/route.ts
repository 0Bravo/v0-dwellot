import { NextResponse } from "next/server"
import { getGhanaReferenceRate } from "@/lib/mortgage/grr"
import { RATES_REVIEWED, resolveLenderRates } from "@/lib/mortgage/rates"

// Re-check the Ghana Reference Rate at most every 12 hours
// (keep in sync with REVALIDATE_SECONDS in lib/mortgage/grr.ts).
export const revalidate = 43200

export async function GET() {
  const grr = await getGhanaReferenceRate()

  return NextResponse.json(
    {
      grr,
      ratesReviewed: RATES_REVIEWED,
      lenders: {
        GHS: resolveLenderRates("GHS", grr.rate),
        USD: resolveLenderRates("USD", grr.rate),
      },
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=43200, stale-while-revalidate=86400",
      },
    },
  )
}
