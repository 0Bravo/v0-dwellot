"use client"

import useSWR from "swr"
import {
  GRR_FALLBACK,
  RATES_REVIEWED,
  resolveLenderRates,
  type GrrSnapshot,
  type LenderRate,
} from "@/lib/mortgage/rates"

export interface MortgageRatesData {
  grr: GrrSnapshot
  ratesReviewed: string
  lenders: { GHS: LenderRate[]; USD: LenderRate[] }
}

/** Built from the data shipped with the site; shown until the live call returns. */
const FALLBACK: MortgageRatesData = {
  grr: GRR_FALLBACK,
  ratesReviewed: RATES_REVIEWED,
  lenders: {
    GHS: resolveLenderRates("GHS", GRR_FALLBACK.rate),
    USD: resolveLenderRates("USD", GRR_FALLBACK.rate),
  },
}

async function fetchRates(url: string): Promise<MortgageRatesData> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Rates request failed: ${response.status}`)
  return response.json()
}

/**
 * Lender rates plus the live Ghana Reference Rate. Always returns usable
 * data: if the request fails, the calculators keep working on the fallback.
 */
export function useMortgageRates(): MortgageRatesData & { isLoading: boolean } {
  const { data, isLoading } = useSWR<MortgageRatesData>("/api/mortgage-rates", fetchRates, {
    fallbackData: FALLBACK,
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  })

  return { ...(data ?? FALLBACK), isLoading }
}
