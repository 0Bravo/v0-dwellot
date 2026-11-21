/**
 * Short money for places with no room for a full figure, such as the middle
 * of a dial: GH₵ 1.2M, GH₵ 950K, $45K.
 *
 * Only for display where the exact figure is available elsewhere on screen.
 * It rounds, so it is never the right thing to show on its own.
 */
export function compactMoney(value: number, symbol = "GH₵"): string {
  const abs = Math.abs(value)
  if (abs >= 1_000_000) {
    const m = value / 1_000_000
    return `${symbol} ${(m >= 10 ? Math.round(m) : Number(m.toFixed(1))).toLocaleString()}M`
  }
  if (abs >= 1_000) return `${symbol} ${Math.round(value / 1_000).toLocaleString()}K`
  return `${symbol} ${Math.round(value).toLocaleString()}`
}

/**
 * A percentage that reads as a whole number when it is one, and keeps a
 * decimal when a calculation has left it fractional, so a dial never shows a
 * rounded figure that contradicts the exact one printed beside it.
 */
export function formatPct(value: number, maxDecimals = 1): string {
  const factor = 10 ** maxDecimals
  const r = Math.round(value * factor) / factor
  return `${Number.isInteger(r) ? r : r.toFixed(maxDecimals)}%`
}
