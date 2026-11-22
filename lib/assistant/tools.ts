import { calculateMortgage, type MortgageCurrency } from "@/lib/mortgage/calc"
import { calculateBuyingCosts, DEFAULT_COSTS_INPUT } from "@/lib/finance/buying-costs"
import { buildFinanceIndexEdition } from "@/lib/finance/index-edition"

/**
 * The tools the calculator assistant may use.
 *
 * The point of giving it tools at all is that it must never do mortgage
 * arithmetic itself. A model that works out a repayment in its head is
 * confidently wrong at a rate nobody can audit; a model that calls
 * calculateMortgage() returns exactly what the page would have shown,
 * because it is the same function the page calls.
 *
 * Same reasoning for rates: it cannot recall a lender rate, only ask for
 * the published edition and quote from that.
 */

export const TOOLS = [
  {
    name: "calculate_mortgage",
    description:
      "Work out the monthly repayment, loan amount, total interest and deposit percentage. " +
      "Use this for EVERY repayment figure you give. Never work one out yourself. " +
      "Calling it also moves the calculator's dials on screen to the inputs you pass, so " +
      "always pass the complete set describing the visitor's situation, not a partial one.",
    input_schema: {
      type: "object" as const,
      properties: {
        currency: { type: "string", enum: ["GHS", "USD"], description: "Loan currency" },
        price: { type: "number", description: "Property price in the loan currency" },
        deposit: { type: "number", description: "Deposit in the loan currency" },
        annualRatePct: { type: "number", description: "Annual interest rate, e.g. 21 for 21%" },
        termYears: { type: "integer", description: "Loan term in years" },
      },
      required: ["currency", "price", "deposit", "annualRatePct", "termYears"],
    },
  },
  {
    name: "calculate_buying_costs",
    description:
      "Work out the up-front cost of a purchase in cedis: stamp duty, Lands Commission " +
      "charges, legal fees, valuation, arrangement fee and insurance, and the total cash " +
      "needed to complete. Cedis only — convert first if the visitor works in dollars, " +
      "using the exchange rate from list_index_rates.",
    input_schema: {
      type: "object" as const,
      properties: {
        priceGhs: { type: "number", description: "Price in cedis" },
        depositGhs: { type: "number", description: "Deposit in cedis" },
        usingMortgage: { type: "boolean", description: "False for a cash purchase" },
      },
      required: ["priceGhs", "depositGhs", "usingMortgage"],
    },
  },
  {
    name: "list_index_rates",
    description:
      "This month's published lender rates, the Ghana Reference Rate, the policy rate and " +
      "the exchange rates. Call this before naming any lender or any interest rate, and " +
      "before choosing a rate to assume on the visitor's behalf. Never state a lender rate " +
      "that did not come from here.",
    input_schema: { type: "object" as const, properties: {} },
  },
]

export interface ToolOutcome {
  result: string
  /** Set by calculate_mortgage: the inputs the page's dials should move to. */
  calculatorInputs?: {
    currency: MortgageCurrency
    price: number
    deposit: number
    annualRatePct: number
    termYears: number
  }
}

/** Guards against a model passing something absurd straight into the engine. */
function bounded(value: unknown, min: number, max: number): number | null {
  const n = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(n) || n < min || n > max) return null
  return n
}

export async function runTool(name: string, input: Record<string, unknown>): Promise<ToolOutcome> {
  if (name === "calculate_mortgage") {
    const currency: MortgageCurrency = input.currency === "USD" ? "USD" : "GHS"
    const price = bounded(input.price, 1, 1_000_000_000)
    const deposit = bounded(input.deposit, 0, 1_000_000_000)
    const annualRatePct = bounded(input.annualRatePct, 0, 100)
    const termYears = bounded(input.termYears, 1, 40)

    if (price === null || deposit === null || annualRatePct === null || termYears === null) {
      return { result: JSON.stringify({ error: "One of the inputs is outside a sensible range." }) }
    }
    if (deposit >= price) {
      return { result: JSON.stringify({ error: "The deposit is not less than the price, so there is no loan." }) }
    }

    const result = calculateMortgage({ price, deposit, annualRatePct, termYears })
    return {
      result: JSON.stringify({ currency, inputs: { price, deposit, annualRatePct, termYears }, ...result }),
      calculatorInputs: { currency, price, deposit, annualRatePct, termYears },
    }
  }

  if (name === "calculate_buying_costs") {
    const priceGhs = bounded(input.priceGhs, 1, 1_000_000_000)
    const depositGhs = bounded(input.depositGhs, 0, 1_000_000_000)
    if (priceGhs === null || depositGhs === null) {
      return { result: JSON.stringify({ error: "Price or deposit is outside a sensible range." }) }
    }
    const result = calculateBuyingCosts({
      ...DEFAULT_COSTS_INPUT,
      priceGhs,
      depositGhs,
      usingMortgage: input.usingMortgage !== false,
    })
    return { result: JSON.stringify(result) }
  }

  if (name === "list_index_rates") {
    const edition = await buildFinanceIndexEdition()
    /* Only the parts that bear on a rate or a conversion. The whole edition
       would be most of the context window, spent on figures it cannot use. */
    return {
      result: JSON.stringify({
        edition: edition.editionLabel,
        lenderTerms: edition.lenderTerms,
        grr: edition.grr,
        policy: edition.policy,
        fx: edition.fx,
      }),
    }
  }

  return { result: JSON.stringify({ error: `No tool named ${name}.` }) }
}
