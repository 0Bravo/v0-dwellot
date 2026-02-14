"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Save, Loader2 } from "lucide-react"

interface Settings {
  [key: string]: string
}

const settingsFields = [
  { key: "site_name", label: "Site Name", type: "text", section: "General" },
  { key: "site_description", label: "Site Description", type: "textarea", section: "General" },
  { key: "contact_email", label: "Contact Email", type: "email", section: "Contact" },
  { key: "contact_phone", label: "Contact Phone", type: "text", section: "Contact" },
  { key: "contact_address", label: "Contact Address", type: "text", section: "Contact" },
  { key: "whatsapp_number", label: "WhatsApp Number", type: "text", section: "Contact" },
  { key: "facebook_url", label: "Facebook URL", type: "url", section: "Social Media" },
  { key: "instagram_url", label: "Instagram URL", type: "url", section: "Social Media" },
  { key: "twitter_url", label: "Twitter / X URL", type: "url", section: "Social Media" },
  { key: "linkedin_url", label: "LinkedIn URL", type: "url", section: "Social Media" },
  { key: "youtube_url", label: "YouTube URL", type: "url", section: "Social Media" },
  { key: "tiktok_url", label: "TikTok URL", type: "url", section: "Social Media" },
  { key: "default_currency", label: "Default Currency", type: "text", section: "Defaults" },
  { key: "default_country", label: "Default Country", type: "text", section: "Defaults" },
  { key: "properties_per_page", label: "Properties Per Page", type: "number", section: "Defaults" },
]

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function fetchSettings() {
      const supabase = createBrowserClient()
      if (!supabase) return
      const { data } = await supabase.from("site_settings").select("key, value")
      const map: Settings = {}
      data?.forEach((row: { key: string; value: string }) => { map[row.key] = row.value })
      setSettings(map)
      setLoading(false)
    }
    fetchSettings()
  }, [])

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    const supabase = createBrowserClient()
    if (!supabase) return
    setSaving(true)
    setMessage("")

    try {
      for (const field of settingsFields) {
        const value = settings[field.key] || ""
        await supabase
          .from("site_settings")
          .upsert({ key: field.key, value, updated_at: new Date().toISOString() }, { onConflict: "key" })
      }
      setMessage("Settings saved successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch {
      setMessage("Failed to save settings.")
    } finally {
      setSaving(false)
    }
  }

  const sections = [...new Set(settingsFields.map(f => f.section))]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your site configuration</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-3 rounded-lg text-sm ${message.includes("success") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        {sections.map(section => (
          <div key={section} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">{section}</h2>
            </div>
            <div className="p-6 grid gap-5">
              {settingsFields
                .filter(f => f.section === section)
                .map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                    {field.type === "textarea" ? (
                      <textarea
                        value={settings[field.key] || ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={settings[field.key] || ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
