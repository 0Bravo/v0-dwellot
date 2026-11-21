/**
 * Official Ghanaian benchmarks that are not fetched live.
 *
 * Everything here is maintained by hand and carries the date it applies from
 * and the institution that set it. If you cannot name both, it does not go in
 * this file: the index is only worth citing if every figure in it is
 * attributable.
 *
 * TO UPDATE after an MPC meeting: change `rate`, `effectiveFrom`, `meeting`
 * and move the old value into `previous`.
 */

export interface PolicyRate {
  /** Monetary Policy Rate, percent per annum */
  rate: number
  /** ISO date the Committee announced it */
  effectiveFrom: string
  /** Which MPC meeting set it */
  meeting: string
  /** The rate it replaced, for the change line */
  previous: number
  /** Monetary policy corridor either side of the rate, in basis points */
  corridorBp: number
  source: string
  sourceUrl: string
}

export const POLICY_RATE: PolicyRate = {
  rate: 11,
  effectiveFrom: "2026-11-18",
  meeting: "133rd MPC meeting, 16-18 November 2026",
  previous: 14,
  corridorBp: 100,
  source: "Bank of Ghana",
  sourceUrl: "https://www.bog.gov.gh/monetary-policy/policy-rate-trends/",
}

/**
 * Why a policy cut matters to a mortgage borrower here, in one place so the
 * page and the API say the same thing.
 *
 * Cedi mortgages are priced off the Ghana Reference Rate, not off the policy
 * rate directly, so a cut does not reach borrowers on the day it is announced.
 * The GRR is set monthly, so the pass-through shows up in later months, and
 * only for loans priced off it.
 */
export const POLICY_TO_MORTGAGE_NOTE =
  "Cedi mortgages are priced off the Ghana Reference Rate rather than the policy rate, " +
  "and the GRR is reset monthly. A policy cut therefore reaches borrowers with a lag, " +
  "and only on loans written on a GRR-linked basis. Fixed-rate loans do not move at all."
