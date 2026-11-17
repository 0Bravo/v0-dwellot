/**
 * Price display for listings.
 *
 * Listings are priced in US dollars unless their `currency` says otherwise
 * (the properties table defaults `currency` to 'USD'). Use these helpers
 * instead of hard-coding "$" so cedi-priced listings show correctly.
 */

export type ListingCurrency = "USD" | "GHS"

export function normaliseCurrency(currency?: string | null): ListingCurrency {
  const c = (currency || "").trim().toUpperCase()
  return c === "GHS" || c === "GHC" || c === "GH₵" ? "GHS" : "USD"
}

export function currencySymbol(currency?: string | null): string {
  return normaliseCurrency(currency) === "GHS" ? "GH₵" : "$"
}

/** "$140,000" or "GH₵ 1,500,000". */
export function formatPrice(price: number | null | undefined, currency?: string | null): string {
  const amount = Math.round(Number(price) || 0).toLocaleString("en-US")
  return normaliseCurrency(currency) === "GHS" ? `GH₵ ${amount}` : `$${amount}`
}

/** Price with a rental suffix when the listing is for rent: "$1,200/month". */
export function formatListingPrice(
  price: number | null | undefined,
  currency?: string | null,
  listingType?: string | null,
  rentSuffix = "/month",
): string {
  return `${formatPrice(price, currency)}${listingType === "rent" ? rentSuffix : ""}`
}
