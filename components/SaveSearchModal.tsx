"use client"

import { useState } from "react"
import { X, Bell, BellOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SaveSearchModalProps {
  isOpen: boolean
  onClose: () => void
  filters: any
  onSave: (name: string, emailAlerts: boolean, alertFrequency: string) => Promise<void>
}

export default function SaveSearchModal({ isOpen, onClose, filters, onSave }: SaveSearchModalProps) {
  const [name, setName] = useState("")
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [alertFrequency, setAlertFrequency] = useState("daily")
  const [saving, setSaving] = useState(false)

  if (!isOpen) return null

  const handleSave = async () => {
    if (!name.trim()) return

    setSaving(true)
    try {
      await onSave(name, emailAlerts, alertFrequency)
      setName("")
      onClose()
    } catch (error) {
      console.error("Error saving search:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Save Search</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="searchName">Search Name</Label>
            <Input
              id="searchName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., 3-bed apartments in East Legon"
              className="mt-2"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              {emailAlerts ? <Bell className="w-5 h-5 text-blue-600" /> : <BellOff className="w-5 h-5 text-gray-400" />}
              <div>
                <div className="font-medium text-gray-900">Email Alerts</div>
                <div className="text-sm text-gray-600">Get notified of new matching properties</div>
              </div>
            </div>
            <button
              onClick={() => setEmailAlerts(!emailAlerts)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                emailAlerts ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  emailAlerts ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {emailAlerts && (
            <div>
              <Label>Alert Frequency</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {["instant", "daily", "weekly"].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setAlertFrequency(freq)}
                    className={`px-3 py-2 text-sm rounded-lg border transition ${
                      alertFrequency === freq
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                    }`}
                  >
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Current filters:</strong>
              {filters.location && ` ${filters.location}`}
              {filters.minPrice && ` • Min $${filters.minPrice}`}
              {filters.maxPrice && ` • Max $${filters.maxPrice}`}
              {filters.bedrooms && ` • ${filters.bedrooms}+ beds`}
              {filters.propertyType && ` • ${filters.propertyType}`}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent" disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1" disabled={!name.trim() || saving}>
            {saving ? "Saving..." : "Save Search"}
          </Button>
        </div>
      </div>
    </div>
  )
}
