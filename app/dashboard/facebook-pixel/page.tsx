"use client"

import { useState } from "react"
import { 
  Settings, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Info,
  Eye,
  EyeOff,
  Loader2,
  ExternalLink
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type EventStatus = "active" | "not-firing" | "not-implemented"

interface TrackingEvent {
  name: string
  description: string
  targeting: string
  status: EventStatus
}

interface ChecklistItem {
  id: string
  label: string
  completed: boolean
}

const initialEvents: TrackingEvent[] = [
  {
    name: "PageView",
    description: "Fires on every page load",
    targeting: "Basic retargeting — visited Dwellot audience",
    status: "active",
  },
  {
    name: "ViewContent",
    description: "Fires when a listing is viewed",
    targeting: "Retarget people who viewed specific listings",
    status: "not-implemented",
  },
  {
    name: "Contact",
    description: "Fires when WhatsApp button is clicked",
    targeting: "Your most valuable audience — people who clicked to enquire",
    status: "not-implemented",
  },
  {
    name: "Lead",
    description: "Fires on enquiry form submission",
    targeting: "Track enquiry form completions",
    status: "not-implemented",
  },
  {
    name: "Search",
    description: "Fires when search/filter is used",
    targeting: "Understand what people are searching for",
    status: "not-implemented",
  },
]

const initialChecklist: ChecklistItem[] = [
  { id: "env-var", label: "Pixel ID added to environment variables", completed: false },
  { id: "component", label: "FacebookPixel component added to root layout", completed: false },
  { id: "pageview", label: "PageView event firing (verify with Meta Pixel Helper)", completed: false },
  { id: "viewcontent", label: "ViewContent event added to listing pages", completed: false },
  { id: "contact", label: "WhatsApp Contact event added to enquiry button", completed: false },
]

function getStatusBadge(status: EventStatus) {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Active
        </Badge>
      )
    case "not-firing":
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
          <XCircle className="h-3 w-3 mr-1" />
          Not Firing
        </Badge>
      )
    case "not-implemented":
      return (
        <Badge className="bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100">
          <AlertCircle className="h-3 w-3 mr-1" />
          Not Implemented
        </Badge>
      )
  }
}

function maskPixelId(pixelId: string): string {
  if (!pixelId || pixelId.length < 8) return pixelId
  return `${pixelId.slice(0, 4)}...${pixelId.slice(-4)}`
}

export default function FacebookPixelPage() {
  const [pixelId, setPixelId] = useState("")
  const [savedPixelId, setSavedPixelId] = useState("")
  const [showPixelId, setShowPixelId] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<"active" | "not-detected" | null>(null)
  const [saveMessage, setSaveMessage] = useState("")
  const [events] = useState<TrackingEvent[]>(initialEvents)
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist)

  const completedCount = checklist.filter((item) => item.completed).length
  const progressPercentage = (completedCount / checklist.length) * 100

  const handleSave = async () => {
    if (!pixelId.trim()) return
    setIsSaving(true)
    setSaveMessage("")

    // Simulate saving
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSavedPixelId(pixelId)
    setPixelId("")
    setSaveMessage("Pixel ID saved successfully!")
    setIsSaving(false)

    setTimeout(() => setSaveMessage(""), 3000)
  }

  const handleTestConnection = async () => {
    setIsTesting(true)
    setTestResult(null)

    // Simulate testing connection
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For demo, show active if there's a saved pixel ID
    setTestResult(savedPixelId ? "active" : "not-detected")
    setIsTesting(false)
  }

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Facebook Pixel Integration</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure your Meta Pixel for ad tracking and audience building
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: Pixel Configuration */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200 pb-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">Pixel Configuration</CardTitle>
            </div>
            <CardDescription>
              Enter your Facebook Pixel ID to enable tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Current Pixel ID Display */}
            {savedPixelId && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-blue-900">Current Pixel ID:</span>
                    <code className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-mono">
                      {showPixelId ? savedPixelId : maskPixelId(savedPixelId)}
                    </code>
                    <button
                      onClick={() => setShowPixelId(!showPixelId)}
                      className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                      aria-label={showPixelId ? "Hide Pixel ID" : "Show Pixel ID"}
                    >
                      {showPixelId ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {testResult === "active" && (
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Pixel Active
                    </Badge>
                  )}
                  {testResult === "not-detected" && (
                    <Badge className="bg-red-100 text-red-700 border-red-200">
                      <XCircle className="h-3 w-3 mr-1" />
                      Not Detected
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Pixel ID Input */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="pixel-id"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  {savedPixelId ? "Update Pixel ID" : "Facebook Pixel ID"}
                </label>
                <input
                  type="text"
                  id="pixel-id"
                  value={pixelId}
                  onChange={(e) => setPixelId(e.target.value)}
                  placeholder="e.g., 1234567890123456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleSave}
                  disabled={!pixelId.trim() || isSaving}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Settings className="h-4 w-4" />
                  )}
                  {isSaving ? "Saving..." : "Save Pixel ID"}
                </button>

                {savedPixelId && (
                  <button
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-300"
                  >
                    {isTesting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Zap className="h-4 w-4" />
                    )}
                    {isTesting ? "Testing..." : "Test Connection"}
                  </button>
                )}
              </div>

              {saveMessage && (
                <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm">
                  {saveMessage}
                </div>
              )}

              {/* Info Note */}
              <div className="flex items-start gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <Info className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-600">
                  Your Pixel ID is stored as{" "}
                  <code className="px-1.5 py-0.5 bg-gray-200 text-gray-800 rounded text-xs font-mono">
                    NEXT_PUBLIC_FB_PIXEL_ID
                  </code>{" "}
                  in your environment variables.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Event Tracking Status */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200 pb-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">Event Tracking Status</CardTitle>
            </div>
            <CardDescription>
              Monitor which events are configured and firing
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">Event</TableHead>
                  <TableHead className="font-semibold text-gray-900">Description</TableHead>
                  <TableHead className="font-semibold text-gray-900 hidden md:table-cell">
                    Ad Targeting Unlocked
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.name}>
                    <TableCell>
                      <code className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-mono">
                        {event.name}
                      </code>
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">
                      {event.description}
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm hidden md:table-cell">
                      {event.targeting}
                    </TableCell>
                    <TableCell className="text-right">
                      {getStatusBadge(event.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Mobile targeting info */}
            <div className="md:hidden mt-4 space-y-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Ad Targeting Details
              </p>
              {events.map((event) => (
                <div
                  key={event.name}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <code className="text-xs font-mono text-gray-800">
                    {event.name}
                  </code>
                  <p className="text-sm text-gray-600 mt-1">{event.targeting}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Setup Checklist */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-lg">Setup Checklist</CardTitle>
              </div>
              <span className="text-sm font-medium text-gray-600">
                {completedCount} of {checklist.length} complete
              </span>
            </div>
            <CardDescription>
              Complete these steps to fully configure Facebook Pixel tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Progress Bar */}
            <div className="mb-6">
              <Progress
                value={progressPercentage}
                className="h-2 bg-gray-200 [&>[data-slot=progress-indicator]]:bg-blue-500"
              />
            </div>

            {/* Checklist Items */}
            <div className="space-y-3">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    item.completed
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => toggleChecklistItem(item.id)}
                    className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />
                  <span
                    className={`text-sm ${
                      item.completed
                        ? "text-green-700 line-through"
                        : "text-gray-700"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Meta Pixel Helper Link */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Tip:</span> Use the{" "}
                <a
                  href="https://www.facebook.com/business/help/1056057314398043"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-700 inline-flex items-center gap-1"
                >
                  Meta Pixel Helper
                  <ExternalLink className="h-3 w-3" />
                </a>{" "}
                Chrome extension to verify that your events are firing correctly.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
