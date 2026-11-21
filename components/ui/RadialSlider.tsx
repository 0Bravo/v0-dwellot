"use client"

import { useCallback, useId, useRef, useState } from "react"

/**
 * A value dial: drag the handle around the arc, read the value in the middle.
 *
 * Built as an SVG arc rather than a rotated div so the track, the fill and the
 * handle all scale cleanly and the hit area can be generous without affecting
 * the drawing.
 *
 * Three things custom drag controls usually get wrong, handled here:
 *
 * - Keyboard. The handle is focusable with role="slider" and the usual
 *   arrow / Page / Home / End keys, so it works without a pointer.
 * - Touch. touch-action: none on the control stops a drag turning into a
 *   page scroll on a phone, and pointer capture keeps the drag alive when
 *   the finger leaves the arc.
 * - The gap at the bottom. Angles wrap, so a pointer below the dial would
 *   otherwise snap the value from one end of the range to the other. Input
 *   inside the gap is clamped to whichever end is nearer.
 */

const START_ANGLE = 135 // degrees, clockwise from 3 o'clock
const SWEEP = 270 // leaves a 90 degree gap at the bottom

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v))
}

/**
 * Map a pointer angle (degrees, clockwise from 3 o'clock) onto a value.
 * Exported so the wrap-around behaviour at the bottom gap can be tested
 * without a browser, which is where this kind of control usually breaks.
 */
export function angleToValue(
  deg: number,
  { min, max, step = 1 }: { min: number; max: number; step?: number },
): number {
  const range = max - min || 1
  let d = deg % 360
  if (d < 0) d += 360

  let offset = d - START_ANGLE
  if (offset < 0) offset += 360

  if (offset > SWEEP) {
    // In the gap at the bottom: clamp to the nearer end instead of jumping
    // across the range. Dead bottom is exactly equidistant from both ends,
    // and that tie resolves to min.
    const pastEnd = offset - SWEEP
    const gap = 360 - SWEEP
    return pastEnd < gap / 2 ? max : min
  }

  const raw = min + (offset / SWEEP) * range
  const stepped = Math.round((raw - min) / step) * step + min
  return Number(clamp(stepped, min, max).toFixed(6))
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function arcPath(cx: number, cy: number, r: number, fromDeg: number, toDeg: number) {
  const a = polar(cx, cy, r, fromDeg)
  const b = polar(cx, cy, r, toDeg)
  const large = Math.abs(toDeg - fromDeg) > 180 ? 1 : 0
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${large} 1 ${b.x} ${b.y}`
}

export interface RadialSliderProps {
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  /** Shown above the figure, e.g. "Property price" */
  label: string
  /** Formats the figure in the middle */
  format: (value: number) => string
  /** Optional line under the figure, e.g. "20% of the price" */
  caption?: string
  size?: number
  /** Tailwind stroke class for the filled arc */
  accentClass?: string
  disabled?: boolean
}

export function RadialSlider({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  format,
  caption,
  size = 240,
  accentClass = "stroke-teal-500",
  disabled = false,
}: RadialSliderProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dragging, setDragging] = useState(false)
  const id = useId()

  const cx = size / 2
  const cy = size / 2
  const thickness = Math.max(10, size * 0.055)
  const r = size / 2 - thickness

  const range = max - min || 1
  const ratio = clamp((value - min) / range, 0, 1)
  const angle = START_ANGLE + ratio * SWEEP
  const handle = polar(cx, cy, r, angle)

  const quantise = useCallback(
    (raw: number) => {
      const stepped = Math.round((raw - min) / step) * step + min
      // Trailing float noise from the division shows up in the readout.
      return Number(clamp(stepped, min, max).toFixed(6))
    },
    [min, max, step],
  )

  const valueFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const svg = svgRef.current
      if (!svg) return null
      const rect = svg.getBoundingClientRect()
      const px = clientX - rect.left - (rect.width * cx) / size
      const py = clientY - rect.top - (rect.height * cy) / size

      const deg = (Math.atan2(py, px) * 180) / Math.PI
      return angleToValue(deg, { min, max, step })
    },
    [cx, cy, size, min, max, step],
  )

  const handlePointer = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return
      const next = valueFromPointer(e.clientX, e.clientY)
      if (next != null && next !== value) onChange(next)
    },
    [disabled, valueFromPointer, onChange, value],
  )

  function onPointerDown(e: React.PointerEvent) {
    if (disabled) return
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
    setDragging(true)
    handlePointer(e)
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return
    handlePointer(e)
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!dragging) return
    ;(e.currentTarget as Element).releasePointerCapture(e.pointerId)
    setDragging(false)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (disabled) return
    const big = Math.max(step, Math.round(range / 20))
    let next: number | null = null

    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        next = value + step
        break
      case "ArrowLeft":
      case "ArrowDown":
        next = value - step
        break
      case "PageUp":
        next = value + big
        break
      case "PageDown":
        next = value - big
        break
      case "Home":
        next = min
        break
      case "End":
        next = max
        break
      default:
        return
    }

    e.preventDefault()
    onChange(quantise(next))
  }

  return (
    <div className="relative inline-flex select-none" style={{ width: size, height: size }}>
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={`touch-none ${disabled ? "opacity-60" : "cursor-pointer"}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="presentation"
      >
        {/* Track */}
        <path
          d={arcPath(cx, cy, r, START_ANGLE, START_ANGLE + SWEEP)}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          className="stroke-gray-200"
        />
        {/* Fill. A zero-length arc would not render, so nudge the minimum. */}
        <path
          d={arcPath(cx, cy, r, START_ANGLE, START_ANGLE + Math.max(ratio, 0.001) * SWEEP)}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          className={accentClass}
        />
        {/* Handle */}
        <circle
          cx={handle.x}
          cy={handle.y}
          r={thickness * 0.78}
          className={`fill-white ${dragging ? "stroke-teal-600" : "stroke-teal-500"}`}
          strokeWidth={3}
          tabIndex={disabled ? -1 : 0}
          role="slider"
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={format(value)}
          aria-disabled={disabled || undefined}
          aria-describedby={`${id}-caption`}
          onKeyDown={onKeyDown}
          style={{ outlineOffset: 4 }}
        />
      </svg>

      {/* The readout sits outside the SVG so it inherits page type properly,
          and is absolutely positioned so it stays centred at any size. */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[18%] pointer-events-none">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">{label}</p>
        <p className="text-2xl md:text-3xl font-bold text-gray-900 tabular-nums mt-0.5">{format(value)}</p>
        {caption && (
          <p id={`${id}-caption`} className="text-xs text-gray-500 mt-0.5">
            {caption}
          </p>
        )}
      </div>
    </div>
  )
}
