import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

/**
 * The finance section's shared surfaces.
 *
 * Before this, every page hand-rolled its own hero and figure tiles, which is
 * why the section looked like five pages rather than one. The design language
 * lives here: a dark teal gradient surface with a dot texture, an 11px
 * uppercase label, and figures set in tabular numerals so columns line up.
 *
 * Server components on purpose — nothing here needs state, so the pages that
 * use them stay static and keep rendering their content without JavaScript.
 */

export function FinanceHero({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: LucideIcon
  title: string
  subtitle: string
  /** Optional figures strip rendered inside the hero */
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-800">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-32 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl"
      />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 ring-1 ring-white/15 mb-6">
          <Icon className="w-7 h-7 text-white" aria-hidden="true" />
        </span>
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight text-balance max-w-3xl">
          {title}
        </h1>
        <p className="text-teal-100/90 text-lg mt-3 max-w-2xl">{subtitle}</p>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  )
}

/** Figures strip for use inside FinanceHero. */
export function HeroStats({ items }: { items: Array<{ label: string; value: ReactNode; note?: string }> }) {
  return (
    <dl className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl bg-white/[0.08] ring-1 ring-white/10 px-4 py-3">
          <dt className="text-[11px] font-medium uppercase tracking-wider text-teal-200">{item.label}</dt>
          <dd className="text-xl md:text-2xl font-bold text-white mt-0.5 tabular-nums">{item.value}</dd>
          {item.note && <p className="text-[11px] text-teal-200/70 mt-1">{item.note}</p>}
        </div>
      ))}
    </dl>
  )
}

/** Section heading used down the page, so every page steps type the same way. */
export function SectionHeading({
  eyebrow,
  title,
  blurb,
}: {
  eyebrow?: string
  title: string
  blurb?: string
}) {
  return (
    <div className="mb-5">
      {eyebrow && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-700 mb-1.5">{eyebrow}</p>
      )}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{title}</h2>
      {blurb && <p className="text-gray-600 mt-1.5">{blurb}</p>}
    </div>
  )
}

/** A light card for page body content. */
export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-6 md:p-8 ${className}`}>{children}</div>
  )
}

/** Small print, consistently placed and weighted. */
export function FinePrint({ children }: { children: ReactNode }) {
  return <p className="text-xs text-gray-500 leading-relaxed">{children}</p>
}
