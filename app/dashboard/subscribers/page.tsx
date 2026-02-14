"use client"

import { useState, useEffect, useCallback } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Search, Trash2, ChevronLeft, ChevronRight, Download, UserX, UserCheck } from "lucide-react"

interface Subscriber {
  id: string
  email: string
  name: string | null
  status: string
  source: string | null
  subscribed_at: string
  created_at: string
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const perPage = 20

  const fetchSubscribers = useCallback(async () => {
    const supabase = createBrowserClient()
    if (!supabase) return
    setLoading(true)

    let query = supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1)

    if (search) {
      query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`)
    }
    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter)
    }

    const { data, count } = await query
    setSubscribers((data as Subscriber[]) || [])
    setTotal(count || 0)
    setLoading(false)
  }, [page, search, statusFilter])

  useEffect(() => { fetchSubscribers() }, [fetchSubscribers])

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === subscribers.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(subscribers.map(s => s.id)))
    }
  }

  const bulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} subscriber(s)?`)) return
    const supabase = createBrowserClient()
    if (!supabase) return
    await supabase.from("newsletter_subscribers").delete().in("id", Array.from(selected))
    setSelected(new Set())
    fetchSubscribers()
  }

  const toggleStatus = async (id: string, currentStatus: string) => {
    const supabase = createBrowserClient()
    if (!supabase) return
    const newStatus = currentStatus === "active" ? "unsubscribed" : "active"
    await supabase.from("newsletter_subscribers").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", id)
    fetchSubscribers()
  }

  const exportCSV = () => {
    const headers = ["Email", "Name", "Status", "Source", "Subscribed At"]
    const rows = subscribers.map(s => [s.email, s.name || "", s.status, s.source || "", s.subscribed_at])
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const totalPages = Math.ceil(total / perPage)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
          <p className="text-sm text-gray-500 mt-1">{total} total subscribers</p>
        </div>
        <button onClick={exportCSV} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {selected.size > 0 && (
        <div className="mb-4 p-3 bg-teal-50 border border-teal-200 rounded-lg flex items-center justify-between">
          <span className="text-sm text-teal-800">{selected.size} selected</span>
          <button onClick={bulkDelete} className="text-sm text-red-600 hover:text-red-800 font-medium">Delete Selected</button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email or name..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="unsubscribed">Unsubscribed</option>
          </select>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading subscribers...</div>
        ) : subscribers.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No subscribers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="py-3 px-4 w-10">
                    <input type="checkbox" checked={selected.size === subscribers.length && subscribers.length > 0} onChange={toggleAll} className="rounded border-gray-300" />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 hidden md:table-cell">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 hidden lg:table-cell">Source</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 hidden lg:table-cell">Date</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s) => (
                  <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggleSelect(s.id)} className="rounded border-gray-300" />
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{s.email}</td>
                    <td className="py-3 px-4 hidden md:table-cell text-gray-600">{s.name || "-"}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        s.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell text-gray-500 capitalize">{s.source || "-"}</td>
                    <td className="py-3 px-4 hidden lg:table-cell text-gray-500">
                      {new Date(s.subscribed_at || s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => toggleStatus(s.id, s.status)} className="p-1.5 text-gray-400 hover:text-teal-600 rounded" title={s.status === "active" ? "Unsubscribe" : "Reactivate"}>
                          {s.status === "active" ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </button>
                        <button onClick={async () => { if (!confirm("Delete?")) return; const sb = createBrowserClient(); if (!sb) return; await sb.from("newsletter_subscribers").delete().eq("id", s.id); fetchSubscribers() }} className="p-1.5 text-gray-400 hover:text-red-600 rounded">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
