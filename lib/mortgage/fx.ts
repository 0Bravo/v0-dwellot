/**
 * Cedi exchange rates. Server-side only.
 *
 * Primary source is the Bank of Ghana's daily interbank rates, which is the
 * reference Ghanaians recognise and the right one to cite on a Ghana site.
 * Falls back to a free market feed, then to a stored snapshot, so a page
 * always has a usable figure.
 *
 * Mirrors the shape of grr.ts: try each source in order, never throw.
 */

export const FX_REVALIDATE_SECONDS = 60 * 60 * 12 // 12 hours

/** Anything outside these bands is treated as a parsing error. */
const BOUNDS: Record<string, [number, number]> = {
  USD: [3, 60],
  GBP: [4, 80],
}

export interface FxSnapshot {
  /** Cedis per 1 unit of the foreign currency */
  usdGhs: number
  gbpGhs: number | null
  /** Date the rates apply to, as published (ISO where known) */
  asOf: string | null
  source: string
  sourceUrl: string
  /** true when fetched just now, false when using the stored fallback */
  live: boolean
}

/** Last manually verified rates; used when every source fails. */
export const FX_FALLBACK: FxSnapshot = {
  usdGhs: 11.78,
  gbpGhs: 15.51,
  asOf: "2026-11-18",
  source: "Bank of Ghana",
  sourceUrl: "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/",
  live: false,
}

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
}

function toText(html: string): string {
  return html
    .replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim()
}

function inBounds(code: keyof typeof BOUNDS, value: number): boolean {
  const [min, max] = BOUNDS[code]
  return Number.isFinite(value) && value >= min && value <= max
}

/** "18 Nov 2026" -> "2026-11-18" */
function parseDate(text: string): string | null {
  const m = text.match(/(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})/)
  if (!m) return null
  const month = MONTHS[m[2].slice(0, 3).toLowerCase()]
  if (!month) return null
  return `${m[3]}-${String(month).padStart(2, "0")}-${String(Number(m[1])).padStart(2, "0")}`
}

/**
 * Pull a pair's mid rate out of the Bank of Ghana table text, which reads
 * "... US Dollar USDGHS 11.7741 11.7859 11.7800 ..." (buying, selling, mid).
 */
export function parseBogPair(text: string, code: "USD" | "GBP"): number | null {
  const pattern = new RegExp(`${code}GHS\\s+([\\d.]+)\\s+([\\d.]+)\\s+([\\d.]+)`, "i")
  const m = text.match(pattern)
  if (!m) return null
  const mid = Number(m[3])
  return inBounds(code, mid) ? mid : null
}

async function fetchBog(): Promise<FxSnapshot | null> {
  const url = FX_FALLBACK.sourceUrl
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; DwellotRatesBot/1.0; +https://dwellot.com)",
        Accept: "text/html",
      },
      next: { revalidate: FX_REVALIDATE_SECONDS },
    })
    if (!response.ok) return null

    const text = toText(await response.text())
    const usd = parseBogPair(text, "USD")
    if (!usd) return null

    return {
      usdGhs: usd,
      gbpGhs: parseBogPair(text, "GBP"),
      asOf: parseDate(text),
      source: "Bank of Ghana",
      sourceUrl: url,
      live: true,
    }
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchMarketFeed(): Promise<FxSnapshot | null> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD", {
      signal: controller.signal,
      next: { revalidate: FX_REVALIDATE_SECONDS },
    })
    if (!response.ok) return null

    const data = (await response.json()) as {
      rates?: Record<string, number>
      time_last_update_utc?: string
    }
    const usd = data.rates?.GHS
    const gbpPerUsd = data.rates?.GBP
    if (!usd || !inBounds("USD", usd)) return null

    return {
      usdGhs: usd,
      gbpGhs: gbpPerUsd ? Number((usd / gbpPerUsd).toFixed(4)) : null,
      asOf: data.time_last_update_utc ? parseDate(data.time_last_update_utc) : null,
      source: "exchangerate-api.com",
      sourceUrl: "https://www.exchangerate-api.com",
      live: true,
    }
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

/** Current cedi rates from the first source that answers, else the fallback. */
export async function getCediRates(): Promise<FxSnapshot> {
  return (await fetchBog()) ?? (await fetchMarketFeed()) ?? FX_FALLBACK
}

/** "GH₵ 1,767,000" style conversion of a foreign amount into cedis. */
export function toCedis(amount: number, rate: number): number {
  return (Number(amount) || 0) * (Number(rate) || 0)
}
