/**
 * Live Ghana Reference Rate (GRR) lookup. Server-side only.
 *
 * The GRR is published monthly by the Ghana Association of Banks (GAB) and
 * repeated on individual banks' websites. There is no official API, so this
 * reads the figure from those public pages, trying each source in order and
 * falling back to the last manually verified value in rates.ts.
 *
 * Results are cached by Next.js for REVALIDATE_SECONDS, so the source sites
 * are hit at most a few times a day.
 */

import { GRR_FALLBACK, type GrrSnapshot } from "./rates"

export const REVALIDATE_SECONDS = 60 * 60 * 12 // 12 hours

/** Anything outside this band is treated as a parsing error, not a real rate. */
const MIN_PLAUSIBLE = 3
const MAX_PLAUSIBLE = 45

interface GrrSource {
  name: string
  url: string
}

const SOURCES: GrrSource[] = [
  { name: "Ghana Association of Banks", url: "https://www.gab.com.gh/" },
  { name: "GCB Bank", url: "https://www.gcbbank.com.gh/" },
  { name: "Bank of Africa Ghana", url: "https://boaghana.com/" },
]

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
}

/** Strip scripts, styles and tags, leaving readable text. */
export function htmlToText(html: string): string {
  return html
    .replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#0?37;|&percnt;/gi, "%")
    .replace(/\s+/g, " ")
    .trim()
}

function toIso(year: number, month: number, day: number): string | null {
  if (!year || !month || !day || day > 31) return null
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

/** Find an effective date in text following the rate, in the formats banks use. */
function parseEffectiveDate(text: string): string | null {
  // "Effective 4th November, 2026" / "Effective Date: Wednesday, 4th November 2026"
  const dayFirst = text.match(/(\d{1,2})(?:st|nd|rd|th)?[\s-]+([A-Za-z]{3,9})[\s,-]+(\d{4})/)
  // "November 04, 2026"
  const monthFirst = text.match(/([A-Za-z]{3,9})\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})/)

  const candidates: Array<{ index: number; iso: string | null }> = []
  if (dayFirst?.index != null) {
    const month = MONTHS[dayFirst[2].slice(0, 3).toLowerCase()]
    candidates.push({ index: dayFirst.index, iso: toIso(Number(dayFirst[3]), month, Number(dayFirst[1])) })
  }
  if (monthFirst?.index != null) {
    const month = MONTHS[monthFirst[1].slice(0, 3).toLowerCase()]
    candidates.push({ index: monthFirst.index, iso: toIso(Number(monthFirst[3]), month, Number(monthFirst[2])) })
  }

  const valid = candidates.filter((c) => c.iso).sort((a, b) => a.index - b.index)
  return valid[0]?.iso ?? null
}

/**
 * Pull the GRR out of page text. Looks for "Reference Rate" followed shortly
 * by a figure with two decimals such as "10.01%".
 */
export function parseGrr(text: string): { rate: number; effectiveDate: string | null } | null {
  const pattern = /Reference\s+Rate[^%]{0,90}?(\d{1,2}\.\d{1,2})\s*%/gi
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    const rate = Number(match[1])
    if (!Number.isFinite(rate) || rate < MIN_PLAUSIBLE || rate > MAX_PLAUSIBLE) continue

    // Look for the date just before and after the figure
    const windowStart = Math.max(0, match.index)
    const window = text.slice(windowStart, match.index + match[0].length + 120)
    return { rate, effectiveDate: parseEffectiveDate(window) }
  }
  return null
}

async function fetchFromSource(source: GrrSource): Promise<GrrSnapshot | null> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  try {
    const response = await fetch(source.url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; DwellotRatesBot/1.0; +https://dwellot.com)",
        Accept: "text/html",
      },
      next: { revalidate: REVALIDATE_SECONDS },
    })
    if (!response.ok) return null

    const parsed = parseGrr(htmlToText(await response.text()))
    if (!parsed) return null

    return {
      rate: parsed.rate,
      effectiveDate: parsed.effectiveDate,
      source: source.name,
      sourceUrl: source.url,
      live: true,
    }
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

/** Current GRR from the first source that answers, else the verified fallback. */
export async function getGhanaReferenceRate(): Promise<GrrSnapshot> {
  for (const source of SOURCES) {
    const snapshot = await fetchFromSource(source)
    if (snapshot) return snapshot
  }
  return GRR_FALLBACK
}
