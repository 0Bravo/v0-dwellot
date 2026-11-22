import { formatMoney } from "@/lib/mortgage/calc"
import type { AssistantFigures } from "@/lib/assistant/tools"

/**
 * The engine's output, drawn rather than described.
 *
 * The tools already return every one of these numbers structured. Before
 * this they were flattened into a paragraph by the model and rendered as
 * text, which threw away the structure and, worse, made an engine result
 * look like something the model had said. A figure in a card is visibly
 * the calculator's; the same figure in a sentence is not.
 *
 * The prose above still carries the reasoning and the caveats. These only
 * carry numbers.
 */

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline gap-4 py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900 tabular-nums">{value}</span>
    </div>
  )
}

function MortgageCard({ m }: { m: NonNullable<AssistantFigures["mortgage"]> }) {
  const { currency, inputs } = m
  const money = (n: number) => formatMoney(n, currency)

  return (
    <div className="rounded-2xl ring-1 ring-gray-200 overflow-hidden bg-white">
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-800 p-5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]"
        />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-200">
            Monthly payment
          </p>
          <p className="mt-1 text-3xl font-bold text-white tabular-nums">
            {money(m.monthlyPayment)}
          </p>
          <p className="mt-1 text-sm text-teal-100">
            {money(inputs.price)} property · {inputs.annualRatePct}% · {inputs.termYears} years
          </p>
        </div>
      </div>

      <div className="p-5 text-sm">
        <Row label="Loan amount" value={money(m.loanAmount)} />
        <Row label="Deposit" value={`${money(inputs.deposit)} (${m.depositPercent.toFixed(1)}%)`} />
        <Row label="Total interest" value={money(m.totalInterest)} />
        <Row label="Total repaid" value={money(m.totalPayment)} />

        <div className="mt-4">
          <div className="h-3 rounded-full overflow-hidden flex" aria-hidden="true">
            <div className="bg-teal-600" style={{ width: `${m.principalSharePct}%` }} />
            <div className="bg-orange-400 flex-1" />
          </div>
          <div className="flex justify-between text-xs mt-2 text-gray-600">
            <span>Principal {m.principalSharePct.toFixed(0)}%</span>
            <span>Interest {(100 - m.principalSharePct).toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CostsCard({ c }: { c: NonNullable<AssistantFigures["costs"]> }) {
  const money = (n: number) => formatMoney(n, "GHS")
  const statutory = c.lines.filter((l) => l.kind === "statutory")
  const market = c.lines.filter((l) => l.kind === "market")

  return (
    <div className="rounded-2xl ring-1 ring-gray-200 bg-white p-5 text-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
        Cash needed to complete
      </p>
      <p className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">{money(c.cashNeeded)}</p>
      <p className="mt-1 text-gray-600">
        {money(c.depositGhs)} deposit plus {money(c.feesTotal)} in fees, which is{" "}
        {c.feesPctOfPrice.toFixed(1)}% of the price.
      </p>

      {/* Split by who sets the price, because one half is negotiable and the
          other is not, and that is the useful thing to know about a fee. */}
      {[
        { title: "Set by law", lines: statutory, total: c.statutoryTotal },
        { title: "Set by the market", lines: market, total: c.marketTotal },
      ].map((group) =>
        group.lines.length === 0 ? null : (
          <div key={group.title} className="mt-5">
            <div className="flex justify-between items-baseline">
              <h4 className="font-semibold text-gray-900">{group.title}</h4>
              <span className="text-gray-600 tabular-nums">{money(group.total)}</span>
            </div>
            <dl className="mt-1">
              {group.lines.map((line) => (
                <div
                  key={line.id}
                  className="flex justify-between items-baseline gap-4 py-2 border-b border-gray-100 last:border-0"
                >
                  <dt>
                    <span className="text-gray-800">{line.label}</span>
                    <span className="block text-xs text-gray-500">{line.basis}</span>
                  </dt>
                  <dd className="font-medium text-gray-900 tabular-nums shrink-0">
                    {money(line.amount)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ),
      )}

      <p className="mt-4 text-xs text-gray-500">
        Market fees vary by who you instruct. The statutory lines do not.
      </p>
    </div>
  )
}

export function AssistantFigureCards({ figures }: { figures: AssistantFigures }) {
  if (!figures.mortgage && !figures.costs) return null
  return (
    <div className="mt-3 space-y-3 max-w-md">
      {figures.mortgage && <MortgageCard m={figures.mortgage} />}
      {figures.costs && <CostsCard c={figures.costs} />}
    </div>
  )
}
