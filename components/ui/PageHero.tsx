import Image from "next/image"
import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

/**
 * The site's page hero.
 *
 * Started life in the finance section, which is why it was briefly called
 * FinanceHero, but nothing about it is finance-specific and pages outside
 * that section need the same treatment.
 *
 * The depth comes from three offset radial gradients drifting slowly against
 * each other (.hero-mesh in globals.css) rather than a flat linear fill,
 * with a fine dot grid over the top and a soft fade into the page below.
 * All CSS, so this stays a server component and pages using it stay static,
 * and all of it stops under prefers-reduced-motion.
 */
export function PageHero({
  icon: Icon,
  eyebrow,
  title,
  subtitle,
  width = "narrow",
  overlap = false,
  image,
  children,
}: {
  /** Optional: some pages lead with the headline alone */
  icon?: LucideIcon
  /** Small label above the headline */
  eyebrow?: string
  title: string
  subtitle?: string
  /** "narrow" matches the finance section; "wide" matches the listings pages */
  width?: "narrow" | "wide"
  /** Leaves room for the next section to pull up into the hero */
  overlap?: boolean
  /** A photograph behind the hero, under a scrim heavy enough to keep text legible */
  image?: { src: string; alt: string }
  children?: ReactNode
}) {
  return (
    <section
      className={`${image ? "hero-mesh-soft" : "hero-mesh"} relative isolate overflow-hidden bg-teal-900 ${
        overlap ? "pb-28 md:pb-36" : ""
      }`}
    >
      {image && (
        <>
          {/* The photograph sits under everything. priority because on pages
              that use one it is the largest contentful paint. */}
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_72%]"
          />
          {/* Scrim: heavier on the left, where the text sits, so the headline
              keeps its contrast while the picture stays readable on the right. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-teal-950/90 via-teal-950/55 to-teal-950/15"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-teal-950/70 via-transparent to-transparent"
          />
        </>
      )}

      {/* Fine dot grid, over the wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]"
      />
      {/* Fade into whatever follows, so the edge is not a hard line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-16 bg-gradient-to-b from-transparent to-gray-50/70"
      />

      <div
        className={`relative z-[2] ${
          width === "wide" ? "max-w-7xl" : "max-w-5xl"
        } mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 ${overlap ? "pb-0" : "pb-16 md:pb-24"}`}
      >
        {Icon && (
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm mb-6 shadow-lg shadow-teal-950/30">
            <Icon className="w-7 h-7 text-teal-50" aria-hidden="true" />
          </span>
        )}

        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-300 mb-3">{eyebrow}</p>
        )}

        <h1 className="text-4xl md:text-6xl font-extrabold text-white text-balance max-w-3xl leading-[1.05]">
          {title}
        </h1>

        {subtitle && (
          <p className="text-lg md:text-xl text-teal-100/80 mt-4 max-w-2xl leading-relaxed">{subtitle}</p>
        )}

        {children && <div className="mt-9">{children}</div>}
      </div>
    </section>
  )
}

/**
 * Pulls the following section up into a hero rendered with overlap, so the
 * two interlock instead of stacking as separate bands.
 */
export function HeroOverlap({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative z-10 -mt-20 md:-mt-28 ${className}`}>{children}</div>
  )
}
