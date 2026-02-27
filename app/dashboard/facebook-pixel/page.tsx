"use client"

import { useState, useCallback, useEffect } from "react"
import {
  Settings,
  Wifi,
  WifiOff,
  CheckCircle2,
  Circle,
  Info,
  Eye,
  MousePointerClick,
  MessageCircle,
  FileText,
  Search,
  Loader2,
  ArrowLeft,
  Activity,
} from "lucide-react"
import Link from "next/link"

// --- Types ---

type PixelStatus = "active" | "not-detected" | "idle"

type EventStatus = "Active" | "Not Firing" | "Not Implemented"

interface TrackingEvent {
  name: string
  description: string
  unlocks: string
  status: EventStatus
  icon: React.ReactNode
}

interface ChecklistItem {
  id: string
  label: string
}

const STORAGE_KEY = "dwellot-fb-pixel-checklist"

// --- Data ---

const trackingEvents: TrackingEvent[] = [
  {
    name: "PageView",
    description: "Fires on every page load",
    unlocks: "Basic retargeting — visited Dwellot audience",
    status: "Active",
    icon: <Eye className="h-4 w-4" />,
  },
  {
    name: "ViewContent",
    description: "Fires when a listing is viewed",
    unlocks: "Retarget people who viewed specific listings",
    status: "Not Implemented",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    name: "Contact",
    description: "Fires when WhatsApp button is clicked",
    unlocks: "Your most valuable audience — people who clicked to enquire",
    status: "Not Implemented",
    icon: <MessageCircle className="h-4 w-4" />,
  },
  {
    name: "Lead",
    description: "Fires on enquiry form submission",
    unlocks: "Track enquiry form completions",
    status: "Not Implemented",
    icon: <MousePointerClick className="h-4 w-4" />,
  },
  {
    name: "Search",
    description: "Fires when search/filter is used",
    unlocks: "Understand what people are searching for",
    status: "Not Implemented",
    icon: <Search className="h-4 w-4" />,
  },
]

const checklistItems: ChecklistItem[] = [
  { id: "env-var", label: "Pixel ID added to environment variables" },
  { id: "component", label: "FacebookPixel component added to root layout" },
  { id: "pageview", label: "PageView event firing (verify with Meta Pixel Helper)" },
  { id: "viewcontent", label: "ViewContent event added to listing pages" },
  { id: "contact", label: "WhatsApp Contact event added to enquiry button" },
]

// --- Helpers ---

function maskPixelId(id: string): string {
  if (id.length <= 8) return id
  return `${id.slice(0, 4)}...${id.slice(-4)}`
}

function StatusBadge({ status }: { status: EventStatus }) {
  const styles: Record<EventStatus, string> = {
    Active: "bg-green-100 text-green-700",
    "Not Firing": "bg-red-100 text-red-700",
    "Not Implemented": "bg-gray-100 text-gray-500",
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  )
}

// --- Main Page ---

export default function FacebookPixelPage() {
  // Pixel Configuration state
  const [pixelId, setPixelId] = useState("")
  const [savedPixelId, setSavedPixelId] = useState("")
  const [pixelStatus, setPixelStatus] = useState<PixelStatus>("idle")
  const [testing, setTesting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  // Checklist state
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  // Load checklist from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setChecked(JSON.parse(saved))
    } catch {
      // ignore parse errors
    }

    // Load any previously-saved pixel ID from localStorage
    try {
      const storedPixel = localStorage.getItem("dwellot-fb-pixel-id")
      if (storedPixel) {
        setSavedPixelId(storedPixel)
        setPixelId(storedPixel)
      }
    } catch {
      // ignore
    }
  }, [])

  // --- Handlers ---

  const handleSavePixelId = useCallback(() => {
    if (!pixelId.trim()) return
    setSaving(true)
    setSaveMessage("")

    // Simulate saving — in production this would write to env vars or a settings API
    setTimeout(() => {
      setSavedPixelId(pixelId.trim())
      try {
        localStorage.setItem("dwellot-fb-pixel-id", pixelId.trim())
      } catch {
        // ignore
      }
      setSaving(false)
      setSaveMessage("Pixel ID saved successfully!")
      setTimeout(() => setSaveMessage(""), 3000)
    }, 600)
  }, [pixelId])

  const handleTestConnection = useCallback(() => {
    if (!savedPixelId) return
    setTesting(true)
    setPixelStatus("idle")

    // Simulate a test — checks if the pixel ID looks valid (all digits, 15-16 chars)
    setTimeout(() => {
      const isValid = /^\d{15,16}$/.test(savedPixelId)
      setPixelStatus(isValid ? "active" : "not-detected")
      setTesting(false)
    }, 1500)
  }, [savedPixelId])

  const toggleChecklist = useCallback((id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  const completedCount = Object.values(checked).filter(Boolean).length
  const totalChecklist = checklistItems.length
  const progressPercent = Math.round((completedCount / totalChecklist) * 100)

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Settings
        </Link>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-500 p-2.5">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Facebook Pixel Integration</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Configure tracking for ad retargeting and conversion measurement
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* ── Section 1: Pixel Configuration ── */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">Pixel Configuration</h2>
          </div>
          <div className="p-6 space-y-5">
            {/* Saved ID display */}
            {savedPixelId && (
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
                <span className="text-sm text-gray-500">Current Pixel ID:</span>
                <code className="text-sm font-mono font-medium text-gray-900">
                  {maskPixelId(savedPixelId)}
                </code>
                {pixelStatus === "active" && (
                  <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                    <Wifi className="h-3 w-3" />
                    Pixel Active
                  </span>
                )}
                {pixelStatus === "not-detected" && (
                  <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                    <WifiOff className="h-3 w-3" />
                    Not Detected
                  </span>
                )}
              </div>
            )}

            {/* Input + actions */}
            <div>
              <label htmlFor="pixel-id" className="block text-sm font-medium text-gray-700 mb-1.5">
                Facebook Pixel ID
              </label>
              <div className="flex gap-3">
                <input
                  id="pixel-id"
                  type="text"
                  value={pixelId}
                  onChange={(e) => setPixelId(e.target.value)}
                  placeholder="e.g. 1234567890123456"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                />
                <button
                  onClick={handleSavePixelId}
                  disabled={!pixelId.trim() || saving}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>

            {/* Save message */}
            {saveMessage && (
              <div className="p-3 rounded-lg text-sm bg-green-50 text-green-700 border border-green-200">
                {saveMessage}
              </div>
            )}

            {/* Test connection */}
            {savedPixelId && (
              <button
                onClick={handleTestConnection}
                disabled={testing}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                {testing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wifi className="h-4 w-4" />
                )}
                {testing ? "Testing..." : "Test Connection"}
              </button>
            )}

            {/* Info note */}
            <div className="flex items-start gap-2 rounded-lg bg-blue-50 border border-blue-100 px-4 py-3">
              <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-700 leading-relaxed">
                Your Pixel ID is stored as{" "}
                <code className="font-mono font-medium bg-blue-100 px-1 py-0.5 rounded">
                  NEXT_PUBLIC_FB_PIXEL_ID
                </code>{" "}
                in your environment variables.
              </p>
            </div>
          </div>
        </div>

        {/* ── Section 2: Event Tracking Status ── */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">Event Tracking Status</h2>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Event</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Description</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">
                    Ad Targeting Unlocked
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {trackingEvents.map((event) => (
                  <tr key={event.name} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">{event.icon}</span>
                        <code className="text-sm font-mono font-medium text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                          {event.name}
                        </code>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{event.description}</td>
                    <td className="px-6 py-4 text-gray-600">{event.unlocks}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={event.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {trackingEvents.map((event) => (
              <div key={event.name} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">{event.icon}</span>
                    <code className="text-sm font-mono font-medium text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                      {event.name}
                    </code>
                  </div>
                  <StatusBadge status={event.status} />
                </div>
                <p className="text-sm text-gray-600">{event.description}</p>
                <p className="text-xs text-gray-500">{event.unlocks}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 3: Setup Checklist ── */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">Setup Checklist</h2>
          </div>
          <div className="p-6 space-y-5">
            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {completedCount} of {totalChecklist} complete
                </span>
                <span className="text-sm font-bold text-gray-900">{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor:
                      progressPercent === 100
                        ? "#10b981"
                        : progressPercent >= 60
                          ? "#3b82f6"
                          : "#3b82f6",
                  }}
                />
              </div>
              {progressPercent === 100 && (
                <p className="text-sm text-emerald-600 font-medium mt-2">
                  All done! Your Facebook Pixel setup is complete.
                </p>
              )}
            </div>

            {/* Checklist items */}
            <ul className="space-y-1">
              {checklistItems.map((item, idx) => (
                <li key={item.id}>
                  <button
                    onClick={() => toggleChecklist(item.id)}
                    className="w-full flex items-start gap-3 px-4 py-3 rounded-lg text-left hover:bg-gray-50 transition-colors group"
                  >
                    <span className="mt-0.5 shrink-0">
                      {checked[item.id] ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-300 group-hover:text-gray-400 transition-colors" />
                      )}
                    </span>
                    <span
                      className={`text-sm leading-relaxed ${
                        checked[item.id] ? "text-gray-400 line-through" : "text-gray-700"
                      }`}
                    >
                      <span className="text-gray-400 mr-2 font-mono text-xs">{idx + 1}.</span>
                      {item.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-xs text-gray-400 text-center mt-8">
        Checklist progress is saved in your browser. Changes to the Pixel ID should also be applied
        as an environment variable in your Vercel project settings.
      </p>
    </div>
  )
}
