import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

/**
 * The site's page hero.
 *
 * Started life in the finance section, which is why it was briefly called
 * FinanceHero, but nothing about it is finance-specific and three pages
 * outside that section need the same treatment. It lives here so there is
 * one hero in the codebase rather than one per page.
 *
 * A server component: no state, so pages using it stay static.
 */
export function PageHero({
  icon: Icon,
  title,
  subtitle,
  width = "narrow",
  children,
}: {
  /** Optional: some pages lead with the headline alone */
  icon?: LucideIcon
  title: string
  subtitle?: string
  /** "narrow" matches the finance section; "wide" matches the listings pages */
  width?: "narrow" | "wide"
  /** Figures, a rate pill, call-to-action buttons */
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
      <div
        className={`relative ${
          width === "wide" ? "max-w-7xl" : "max-w-5xl"
        } mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20`}
      >
        {Icon && (
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 ring-1 ring-white/15 mb-6">
            <Icon className="w-7 h-7 text-white" aria-hidden="true" />
          </span>
        )}
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight text-balance max-w-3xl">
          {title}
        </h1>
        {subtitle && <p className="text-teal-100/90 text-lg mt-3 max-w-2xl">{subtitle}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  )
}
