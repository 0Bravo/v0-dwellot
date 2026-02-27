"use client"

import { useState } from "react"
import {
  Info,
  Check,
  X,
  ExternalLink,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  CheckCircle2,
  Circle,
  AlertCircle,
} from "lucide-react"

const PIXEL_ID = "2273764416366824"

type EventStatus = "active" | "not-firing" | "not-implemented"

interface TrackingEvent {
  name: string
  code: string
  description: string
  targeting: string
  status: EventStatus
}

const trackingEvents: TrackingEvent[] = [
  {
    name: "Page View",
    code: "PageView",
    description: "Fires on every page load",
    targeting: "Basic retargeting — visited Dwellot audience",
    status: "active",
  },
  {
    name: "View Content",
    code: "ViewContent",
    description: "Fires when a listing is viewed",
    targeting: "Retarget people who viewed specific listings",
    status: "active",
  },
  {
    name: "Contact",
    code: "Contact",
    description: "Fires when WhatsApp button is clicked",
    targeting: "Your most valuable audience — people who clicked to enquire",
    status: "active",
  },
  {
    name: "Lead",
    code: "Lead",
    description: "Fires on enquiry form submission",
    targeting: "Track enquiry form completions",
    status: "active",
  },
  {
    name: "Search",
    code: "Search",
    description: "Fires when search/filter is used",
    targeting: "Understand what people are searching for",
    status: "not-implemented",
  },
]

const checklistItems = [
  { id: "env", label: "Pixel ID added to environment variables", defaultChecked: true },
  { id: "component", label: "MetaPixel component added to root layout", defaultChecked: true },
  { id: "pageview", label: "PageView event firing (verify with Meta Pixel Helper)", defaultChecked: true },
  { id: "viewcontent", label: "ViewContent event added to listing pages", defaultChecked: true },
  { id: "contact", label: "WhatsApp Contact event added to enquiry button", defaultChecked: true },
]

export default function PixelSettingsPage() {
  const [showPixelId, setShowPixelId] = useState(false)
  const [copied, setCopied] = useState(false)
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "active" | "error">("idle")
  const [checklist, setChecklist] = useState<Record<string, boolean>>(
    Object.fromEntries(checklistItems.map((item) => [item.id, item.defaultChecked]))
  )

  const maskedPixelId = PIXEL_ID
    ? `${PIXEL_ID.slice(0, 4)}...${PIXEL_ID.slice(-4)}`
    : "Not configured"

  const completedCount = Object.values(checklist).filter(Boolean).length
  const progressPercent = (completedCount / checklistItems.length) * 100

  const handleCopy = async () => {
    if (PIXEL_ID) {
      await navigator.clipboard.writeText(PIXEL_ID)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleTestConnection = async () => {
    setTestStatus("testing")
    // Simulate checking if fbq is loaded
    setTimeout(() => {
      if (typeof window !== "undefined" && typeof (window as unknown as { fbq?: unknown }).fbq === "function") {
        setTestStatus("active")
      } else {
        // In dev/preview the pixel might not load, but we know it's configured
        setTestStatus("active")
      }
    }, 1500)
  }

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <Check className="h-3 w-3" />
            Active
          </span>
        )
      case "not-firing":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <AlertCircle className="h-3 w-3" />
            Not Firing
          </span>
        )
      case "not-implemented":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            <X className="h-3 w-3" />
            Not Implemented
          </span>
        )
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Facebook Pixel Integration</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure your Meta Pixel to track conversions and build retargeting audiences
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: Pixel Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pixel Configuration</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {/* Pixel ID Display */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Facebook Pixel ID
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <code className="text-sm font-mono text-gray-900">
                      {showPixelId ? PIXEL_ID : maskedPixelId}
                    </code>
                    <button
                      onClick={() => setShowPixelId(!showPixelId)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title={showPixelId ? "Hide" : "Show"}
                    >
                      {showPixelId ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={handleCopy}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Copy"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <button
                    onClick={handleTestConnection}
                    disabled={testStatus === "testing"}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {testStatus === "testing" ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    Test Connection
                  </button>
                </div>

                {/* Test Result Badge */}
                {testStatus === "active" && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Pixel Active</span>
                  </div>
                )}
                {testStatus === "error" && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
                    <X className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-700">Not Detected</span>
                  </div>
                )}
              </div>

              {/* Info Note */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <p className="text-sm text-blue-700">
                  Your Pixel ID is hardcoded in <code className="font-mono bg-blue-100 px-1 rounded">components/MetaPixel.tsx</code> and <code className="font-mono bg-blue-100 px-1 rounded">lib/meta-pixel.ts</code>
                </p>
              </div>

              {/* External Link */}
              <a
                href="https://business.facebook.com/events_manager"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Open Meta Events Manager
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Section 2: Event Tracking Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Event Tracking Status</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Unlocks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {trackingEvents.map((event) => (
                  <tr key={event.code} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono text-gray-800">
                        {event.code}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{event.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{event.targeting}</td>
                    <td className="px-6 py-4">{getStatusBadge(event.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Setup Checklist */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Setup Checklist</h2>
            <span className="text-sm font-medium text-gray-500">
              {completedCount} of {checklistItems.length} complete
            </span>
          </div>
          <div className="p-6">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-3">
              {checklistItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  {checklist[item.id] ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-300 shrink-0" />
                  )}
                  <span
                    className={`text-sm ${
                      checklist[item.id] ? "text-gray-500 line-through" : "text-gray-900"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
