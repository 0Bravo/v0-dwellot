"use client"

import { useCallback, useEffect, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  MessageCircle,
  Phone,
  Search,
  X,
} from "lucide-react"

/**
 * Leads worklist.
 *
 * The leads table has been collecting mortgage-calculator and campaign
 * enquiries with no screen to read them. Reads go through
 * /api/admin/leads because the rows are written by the service role and
 * sit behind RLS.
 */

type Lead = {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  whatsapp: string | null
  intent: string | null
  property_type: string | null
  budget_min: number | null
  budget_max: number | null
  bedrooms: number | null
  preferred_locations: string[] | string | null
  timeline: string | null
  source: string | null
  notes: string | null
  status: string | null
  created_at: string
  updated_at: string | null
}

const STATUSES = ["new", "contacted", "qualified", "viewing", "won", "lost"] as const

const STATUS_STYLES: Record<string, string> = {
  new: "bg-teal-100 text-teal-800",
  contacted: "bg-blue-100 text-blue-800",
  qualified: "bg-indigo-100 text-indigo-800",
  viewing: "bg-amber-100 text-amber-800",
  won: "bg-green-100 text-green-800",
  lost: "bg-gray-200 text-gray-700",
}

const SOURCE_LABELS: Record<string, string> = {
  mortgage_calculator: "Mortgage calculator",
  website_modal: "Website pop-up",
  "buy-property-ghana-campaign": "Ad campaign",
}

function sourceLabel(source: string | null): string {
  if (!source) return "Unknown"
  return SOURCE_LABELS[source] || source.replace(/[_-]/g, " ")
}

function budgetLabel(lead: Lead): string | null {
  const fmt = (n: number) => n.toLocaleString("en-GB")
  if (lead.budget_min && lead.budget_max) return `${fmt(lead.budget_min)} – ${fmt(lead.budget_max)}`
  if (lead.budget_max) return `up to ${fmt(lead.budget_max)}`
  if (lead.budget_min) return `from ${fmt(lead.budget_min)}`
  return null
}

function realEmail(lead: Lead): string | null {
  return lead.email && !lead.email.endsWith("@leads.dwellot.com") ? lead.email : null
}

function whenLabel(iso: string): string {
  const then = new Date(iso).getTime()
  const mins = Math.round((Date.now() - then) / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  if (mins < 48 * 60) return `${Math.round(mins / 60)}h ago`
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({})
  const [sources, setSources] = useState<string[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState("all")
  const [source, setSource] = useState("all")
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Lead | null>(null)
  const [saving, setSaving] = useState(false)
  const perPage = 25

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const params = new URLSearchParams({ page: String(page), perPage: String(perPage), status, source })
      if (search) params.set("search", search)
      const res = await fetch(`/api/admin/leads?${params.toString()}`)
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `Request failed (${res.status})`)
      const data = await res.json()
      setLeads(data.leads)
      setTotal(data.total)
      setStatusCounts(data.statusCounts || {})
      setSources(data.sources || [])
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Could not load leads")
      setLeads([])
    } finally {
      setLoading(false)
    }
  }, [page, status, source, search])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const updateLead = async (id: string, changes: { status?: string; notes?: string }) => {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...changes }),
      })
      if (!res.ok) throw new Error("Update failed")
      const { lead } = await res.json()
      setLeads((prev) => prev.map((l) => (l.id === id ? lead : l)))
      setSelected((prev) => (prev && prev.id === id ? lead : prev))
      // Status counts shift when a status changes.
      if (changes.status) fetchLeads()
    } catch {
      alert("Could not save that change. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const newCount = statusCounts.new || 0

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <p className="text-sm text-gray-600 mt-1">
          Enquiries from the mortgage calculator, campaigns and site forms.
          {newCount > 0 && (
            <span className="ml-1 font-medium text-teal-700">
              {newCount} waiting to be contacted.
            </span>
          )}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => {
            setStatus("all")
            setPage(1)
          }}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
            status === "all" ? "bg-gray-900 text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          All
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatus(s)
              setPage(1)
            }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition ${
              status === s ? "bg-gray-900 text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {s}
            {statusCounts[s] ? <span className="ml-1.5 opacity-70">{statusCounts[s]}</span> : null}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setSearch(searchInput.trim())
            setPage(1)
          }}
          className="relative flex-1"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search name, email or number"
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </form>
        <select
          value={source}
          onChange={(e) => {
            setSource(e.target.value)
            setPage(1)
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
        >
          <option value="all">All sources</option>
          {sources.map((s) => (
            <option key={s} value={s}>
              {sourceLabel(s)}
            </option>
          ))}
        </select>
      </div>

      {loadError && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-sm mb-4">{loadError}</div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500 text-sm">Loading leads…</div>
        ) : leads.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-gray-900 font-medium">No leads here yet</p>
            <p className="text-sm text-gray-600 mt-1">
              {status === "all" && !search ? "New enquiries will appear here." : "Try a different filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3">Lead</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Budget</th>
                  <th className="px-4 py-3">Timeline</th>
                  <th className="px-4 py-3">Received</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leads.map((lead) => {
                  const email = realEmail(lead)
                  const wa = lead.whatsapp ? String(lead.whatsapp).replace(/\D/g, "") : ""
                  return (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <button onClick={() => setSelected(lead)} className="text-left">
                          <span className="font-medium text-gray-900 hover:text-teal-700">
                            {lead.name || email || lead.whatsapp || "Unnamed"}
                          </span>
                          {email && <span className="block text-xs text-gray-500">{email}</span>}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{sourceLabel(lead.source)}</td>
                      <td className="px-4 py-3 text-gray-600">{budgetLabel(lead) || "—"}</td>
                      <td className="px-4 py-3 text-gray-600">{lead.timeline?.replace(/_/g, " ") || "—"}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{whenLabel(lead.created_at)}</td>
                      <td className="px-4 py-3">
                        <select
                          value={lead.status || "new"}
                          onChange={(e) => updateLead(lead.id, { status: e.target.value })}
                          disabled={saving}
                          className={`text-xs font-medium rounded-full px-2.5 py-1 border-0 capitalize cursor-pointer ${
                            STATUS_STYLES[lead.status || "new"] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          {email && (
                            <a
                              href={`mailto:${email}`}
                              title="Email"
                              className="p-1.5 text-gray-500 hover:text-teal-700 hover:bg-teal-50 rounded"
                            >
                              <Mail className="w-4 h-4" />
                            </a>
                          )}
                          {wa && (
                            <a
                              href={`https://wa.me/${wa}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="WhatsApp"
                              className="p-1.5 text-gray-500 hover:text-green-700 hover:bg-green-50 rounded"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}
                          {lead.phone && (
                            <a
                              href={`tel:${lead.phone}`}
                              title="Call"
                              className="p-1.5 text-gray-500 hover:text-teal-700 hover:bg-teal-50 rounded"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Page {page} of {totalPages} · {total} leads
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 border border-gray-300 rounded bg-white disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 border border-gray-300 rounded bg-white disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between p-5 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selected.name || realEmail(selected) || "Unnamed lead"}
                </h2>
                <p className="text-sm text-gray-500">
                  {sourceLabel(selected.source)} · {whenLabel(selected.created_at)}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-1 text-gray-400 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-sm">
              <dl className="grid grid-cols-3 gap-y-2">
                {[
                  ["Email", realEmail(selected)],
                  ["WhatsApp", selected.whatsapp],
                  ["Phone", selected.phone],
                  ["Looking to", selected.intent],
                  ["Property type", selected.property_type],
                  ["Budget", budgetLabel(selected)],
                  ["Bedrooms", selected.bedrooms != null ? String(selected.bedrooms) : null],
                  [
                    "Areas",
                    Array.isArray(selected.preferred_locations)
                      ? selected.preferred_locations.join(", ")
                      : selected.preferred_locations,
                  ],
                  ["Timeline", selected.timeline?.replace(/_/g, " ")],
                ]
                  .filter(([, value]) => value)
                  .map(([label, value]) => (
                    <div key={label as string} className="col-span-3 grid grid-cols-3 gap-2">
                      <dt className="text-gray-500">{label}</dt>
                      <dd className="col-span-2 text-gray-900 break-words">{value as string}</dd>
                    </div>
                  ))}
              </dl>

              <div>
                <label htmlFor="lead-notes" className="block text-gray-500 mb-1">
                  Notes
                </label>
                <textarea
                  id="lead-notes"
                  defaultValue={selected.notes || ""}
                  rows={5}
                  onBlur={(e) => {
                    if (e.target.value !== (selected.notes || "")) {
                      updateLead(selected.id, { notes: e.target.value })
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="What was discussed, which lender, next step…"
                />
                <p className="text-xs text-gray-500 mt-1">Saved when you click away.</p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {realEmail(selected) && (
                  <a
                    href={`mailto:${realEmail(selected)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700"
                  >
                    <Mail className="w-4 h-4" /> Email
                  </a>
                )}
                {selected.whatsapp && (
                  <a
                    href={`https://wa.me/${String(selected.whatsapp).replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
