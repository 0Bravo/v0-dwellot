"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  CheckCircle2,
  Circle,
  ArrowLeft,
  Settings2,
  Activity,
  CheckSquare,
  Loader2,
  Info,
  Eye,
  EyeOff,
  RefreshCw,
  ExternalLink,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

const STORAGE_KEY = "dwellot-pixel-checklist"

// Event tracking data
const trackingEvents = [
  {
    name: "PageView",
    description: "Fires on every page load",
    adTargeting: "Basic retargeting — visited Dwellot audience",
    defaultStatus: "active" as const,
  },
  {
    name: "ViewContent",
    description: "Fires when a listing is viewed",
    adTargeting: "Retarget people who viewed specific listings",
    defaultStatus: "not-implemented" as const,
  },
  {
    name: "Contact",
    description: "Fires when WhatsApp button is clicked",
    adTargeting: "Your most valuable audience — people who clicked to enquire",
    defaultStatus: "not-implemented" as const,
  },
  {
    name: "Lead",
    description: "Fires on enquiry form submission",
    adTargeting: "Track enquiry form completions",
    defaultStatus: "not-implemented" as const,
  },
  {
    name: "Search",
    description: "Fires when search/filter is used",
    adTargeting: "Understand what people are searching for",
    defaultStatus: "not-implemented" as const,
  },
]

// Checklist items
const checklistItems = [
  { id: "pixel-env", label: "Pixel ID added to environment variables" },
  { id: "pixel-component", label: "FacebookPixel component added to root layout" },
  { id: "pageview-event", label: "PageView event firing (verify with Meta Pixel Helper)" },
  { id: "viewcontent-event", label: "ViewContent event added to listing pages" },
  { id: "contact-event", label: "WhatsApp Contact event added to enquiry button" },
]

type EventStatus = "active" | "not-firing" | "not-implemented"

function getStatusBadge(status: EventStatus) {
  switch (status) {
    case "active":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Active
        </span>
      )
    case "not-firing":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Not Firing
        </span>
      )
    case "not-implemented":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          Not Implemented
        </span>
      )
  }
}

export default function FacebookPixelPage() {
  const [pixelId, setPixelId] = useState("")
  const [savedPixelId, setSavedPixelId] = useState("")
  const [showPixelId, setShowPixelId] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "active" | "not-detected">("idle")
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  // Load saved checklist state
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setChecked(JSON.parse(saved))
    } catch {
      // Ignore localStorage errors
    }

    // Check for existing pixel ID from environment
    const envPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID
    if (envPixelId) {
      setSavedPixelId(envPixelId)
      setPixelId(envPixelId)
    }
  }, [])

  const toggle = useCallback((id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // Ignore localStorage errors
      }
      return next
    })
  }, [])

  const handleSavePixelId = () => {
    setSavedPixelId(pixelId)
    // In a real implementation, this would save to environment variables or database
  }

  const handleTestConnection = async () => {
    setIsTesting(true)
    setConnectionStatus("idle")

    // Simulate connection test
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Check if pixel ID is valid (basic validation)
    if (savedPixelId && savedPixelId.match(/^\d{15,16}$/)) {
      setConnectionStatus("active")
    } else {
      setConnectionStatus("not-detected")
    }

    setIsTesting(false)
  }

  const maskPixelId = (id: string) => {
    if (!id || id.length < 8) return id
    return `${id.slice(0, 4)}...${id.slice(-4)}`
  }

  const completedCount = Object.values(checked).filter(Boolean).length
  const totalItems = checklistItems.length
  const percentage = Math.round((completedCount / totalItems) * 100)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Facebook Pixel Integration</h1>
        <p className="text-gray-500 mt-1">
          Configure your Meta Pixel for ad tracking and audience building
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: Pixel Configuration */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
            <span className="text-blue-500">
              <Settings2 className="w-5 h-5" />
            </span>
            <h2 className="font-semibold text-gray-900">Pixel Configuration</h2>
          </div>
          <div className="p-6 space-y-5">
            {/* Pixel ID Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Facebook Pixel ID
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type={showPixelId ? "text" : "password"}
                    value={pixelId}
                    onChange={(e) => setPixelId(e.target.value)}
                    placeholder="Enter your Pixel ID (e.g., 1234567890123456)"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPixelId(!showPixelId)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPixelId ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <button
                  onClick={handleSavePixelId}
                  disabled={!pixelId || pixelId === savedPixelId}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Current Saved ID */}
            {savedPixelId && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Current saved Pixel ID:</p>
                  <p className="text-sm font-mono font-medium text-gray-900">
                    {maskPixelId(savedPixelId)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Connection Status Badge */}
                  {connectionStatus === "active" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Pixel Active
                    </span>
                  )}
                  {connectionStatus === "not-detected" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Not Detected
                    </span>
                  )}
                  <button
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    {isTesting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    Test Connection
                  </button>
                </div>
              </div>
            )}

            {/* Info Note */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-700">
                Your Pixel ID is stored as{" "}
                <code className="px-1.5 py-0.5 bg-blue-100 rounded text-xs font-mono">
                  NEXT_PUBLIC_FB_PIXEL_ID
                </code>{" "}
                in your environment variables.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Event Tracking Status */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
            <span className="text-blue-500">
              <Activity className="w-5 h-5" />
            </span>
            <h2 className="font-semibold text-gray-900">Event Tracking Status</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Ad Targeting Benefit
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {trackingEvents.map((event) => (
                  <tr key={event.name} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono text-gray-800">
                        {event.name}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {event.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                      {event.adTargeting}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {getStatusBadge(event.defaultStatus)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile: Show ad targeting info */}
          <div className="md:hidden p-4 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500 mb-2 font-medium">Ad Targeting Benefits:</p>
            <ul className="space-y-1">
              {trackingEvents.map((event) => (
                <li key={event.name} className="text-xs text-gray-600">
                  <span className="font-medium">{event.name}:</span> {event.adTargeting}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 3: Setup Checklist */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
            <span className="text-blue-500">
              <CheckSquare className="w-5 h-5" />
            </span>
            <h2 className="font-semibold text-gray-900">Setup Checklist</h2>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {completedCount} of {totalItems} complete
              </span>
              <span className="text-sm font-bold text-gray-900">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-2" />
            {percentage === 100 && (
              <p className="text-sm text-emerald-600 font-medium mt-2">
                All done! Your Pixel setup is complete.
              </p>
            )}
          </div>

          {/* Checklist Items */}
          <ul className="divide-y divide-gray-50">
            {checklistItems.map((item, idx) => (
              <li key={item.id} className="group">
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-start gap-3 px-6 py-4 text-left hover:bg-gray-50 transition"
                >
                  <span className="mt-0.5 flex-shrink-0">
                    {checked[item.id] ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition" />
                    )}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span
                      className={`text-sm leading-relaxed ${
                        checked[item.id]
                          ? "text-gray-400 line-through"
                          : "text-gray-700"
                      }`}
                    >
                      <span className="text-gray-400 mr-2 font-mono text-xs">
                        {idx + 1}.
                      </span>
                      {item.label}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {/* Helpful Links */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500 mb-2 font-medium">Helpful Resources:</p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.facebook.com/events_manager2/list/pixel/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline"
              >
                Meta Events Manager
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://developers.facebook.com/docs/meta-pixel/get-started"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline"
              >
                Pixel Documentation
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline"
              >
                Meta Pixel Helper (Chrome)
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-xs text-gray-400 text-center">
          Checklist progress is saved in your browser. For full implementation, add the actual Pixel
          code and events to your codebase.
        </p>
      </div>
    </div>
  )
}
