/**
 * Which listings Dwellot has actually verified.
 *
 * The badge used to appear on every published listing, which said nothing and
 * claimed everything. It now appears only where a check has really been done.
 *
 * This is a stopgap in two ways, and both are worth fixing:
 *
 * 1. It matches on developer and location text, because there is no column
 *    saying whether a listing was checked. A boolean on the properties table,
 *    set when the check happens, would be right: then adding a developer is a
 *    data change rather than a deploy, and the badge cannot drift from reality
 *    because someone renamed an estate.
 * 2. "Verified" is doing unexplained work. A buyer reads it as "this cannot be
 *    a fraud", which is a heavy promise. Whatever was actually checked — the
 *    developer's standing, the title, the documents — should be what the badge
 *    says.
 */

/** Developers whose listings have been checked, as `developer` is stored. */
const VERIFIED_DEVELOPERS = ["Bestworld Real Estate"] as const

/** Developments checked as a whole, matched against `location`. */
const VERIFIED_LOCATIONS = ["Appolonia City"] as const

export interface VerifiableListing {
  developer?: string | null
  location?: string | null
  estate_name?: string | null
}

export function isVerifiedListing(property: VerifiableListing | null | undefined): boolean {
  if (!property) return false

  const developer = (property.developer ?? "").trim().toLowerCase()
  if (developer && VERIFIED_DEVELOPERS.some((d) => d.toLowerCase() === developer)) return true

  const haystack = `${property.location ?? ""} ${property.estate_name ?? ""}`.toLowerCase()
  return VERIFIED_LOCATIONS.some((l) => haystack.includes(l.toLowerCase()))
}
