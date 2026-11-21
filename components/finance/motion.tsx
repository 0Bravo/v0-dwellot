"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"

/**
 * Motion primitives for the finance section.
 *
 * Every one checks useReducedMotion and renders the final state immediately
 * when the visitor has asked for less movement, so nothing animates at them
 * against their system preference. The numbers also matter here: a figure
 * that counts up is still read by screen readers as its final value because
 * the element carries the finished text, not the intermediate frames.
 */

const EASE = [0.22, 1, 0.36, 1] as const

/** Fade and lift into place the first time it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/** Reveals its children one after another. Pair with StaggerItem. */
export function Stagger({
  children,
  className,
  gap = 0.07,
}: {
  children: ReactNode
  className?: string
  gap?: number
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "shown" : "hidden"}
      variants={{ shown: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 16 },
        shown: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Counts from zero to `value` when it first comes into view, then follows
 * any later change to `value` so it stays correct when inputs change.
 */
export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  durationMs = 900,
  className,
}: {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  durationMs?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const [shown, setShown] = useState(reduce ? value : 0)
  const fromRef = useRef(0)

  useEffect(() => {
    if (reduce || !inView) {
      setShown(value)
      fromRef.current = value
      return
    }

    const from = fromRef.current
    const delta = value - from
    if (delta === 0) {
      setShown(value)
      return
    }

    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      // easeOutCubic: fast first, settles gently, no overshoot past the real figure
      const eased = 1 - Math.pow(1 - t, 3)
      setShown(from + delta * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
      else fromRef.current = value
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, inView, reduce, durationMs])

  const text = `${prefix}${shown.toLocaleString("en-GB", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}${suffix}`

  // The accessible value is always the real one, never a mid-animation frame.
  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{text}</span>
      <span className="sr-only">
        {`${prefix}${value.toLocaleString("en-GB", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}${suffix}`}
      </span>
    </span>
  )
}
