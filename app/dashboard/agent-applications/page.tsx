"use client"

import { useState, useEffect, useCallback } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Search, Eye, Trash2, ChevronLeft, ChevronRight, X, CheckCircle, XCircle, Clock } from "lucide-react"

interface AgentApp {
  id: string
  full_name: string
  email: string
  phone: string | null
  company: string | null
  license_number: string | null
  experience: string | null
  areas: string[] | null
  bio: string | null
  status: string
  created_at: string
}

export default function AgentApplicationsPage() {
  const [apps, setApps] = useState<AgentApp[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [selectedApp, setSelectedApp] = useState<AgentApp | null>(null)
  const perPage = 20

  const fetchApps = useCallback(async () => {
    const supabase = createBrowserClient()
    if (!supabase) return
    setLoading(true)

    let query = supabase
      .from("agent_applications")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1)

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`)
    }
    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter)
    }

    const { data, count } = await query
    setApps((data as AgentApp[]) || [])
    setTotal(count || 0)
    setLoading(false)
  }, [page, search, statusFilter])

  useEffect(() => { fetchApps() }, [fetchApps])

  const updateStatus = async (id: string, status: string) => {
    const supabase = createBrowserClient()
    if (!supabase) return
    await supabase.from("agent_applications").update({ status, updated_at: new Date().toISOString() }).eq("id", id)
    if (selectedApp?.id === id) setSelectedApp({ ...selectedApp, status })
    fetchApps()
  }

  const deleteApp = async (id: string) => {
    if (!confirm("Delete this application?")) return
    const supabase = createBrowserClient()
    if (!supabase) return
    await supabase.from("agent_applications").delete().eq("id", id)
    if (selectedApp?.id === id) setSelectedApp(null)
    fetchApps()
  }

  const totalPages = Math.ceil(total / perPage)
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agent Applications</h1>
          <p className="text-sm text-gray-500 mt-1">{total} total applications</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or company..."
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
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading applications...</div>
        ) : apps.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No applications found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Applicant</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 hidden md:table-cell">Company</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 hidden lg:table-cell">Date</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((a) => (
                  <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{a.full_name}</p>
                      <p className="text-xs text-gray-500">{a.email}</p>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-gray-600">{a.company || "-"}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColors[a.status] || "bg-gray-100 text-gray-600"}`}>
                        {a.status === "pending" && <Clock className="h-3 w-3" />}
                        {a.status === "approved" && <CheckCircle className="h-3 w-3" />}
                        {a.status === "rejected" && <XCircle className="h-3 w-3" />}
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell text-gray-500">
                      {new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setSelectedApp(a)} className="p-1.5 text-gray-400 hover:text-teal-600 rounded">
                          <Eye className="h-4 w-4" />
                        </button>
                        {a.status === "pending" && (
                          <>
                            <button onClick={() => updateStatus(a.id, "approved")} className="p-1.5 text-gray-400 hover:text-green-600 rounded" title="Approve">
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button onClick={() => updateStatus(a.id, "rejected")} className="p-1.5 text-gray-400 hover:text-red-600 rounded" title="Reject">
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button onClick={() => deleteApp(a.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded">
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

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedApp(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Application Details</h3>
              <button onClick={() => setSelectedApp(null)} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="font-medium text-gray-600">Name:</span> <span className="text-gray-900">{selectedApp.full_name}</span></div>
              <div><span className="font-medium text-gray-600">Email:</span> <span className="text-gray-900">{selectedApp.email}</span></div>
              {selectedApp.phone && <div><span className="font-medium text-gray-600">Phone:</span> <span className="text-gray-900">{selectedApp.phone}</span></div>}
              {selectedApp.company && <div><span className="font-medium text-gray-600">Company:</span> <span className="text-gray-900">{selectedApp.company}</span></div>}
              {selectedApp.license_number && <div><span className="font-medium text-gray-600">License:</span> <span className="text-gray-900">{selectedApp.license_number}</span></div>}
              {selectedApp.experience && <div><span className="font-medium text-gray-600">Experience:</span> <span className="text-gray-900">{selectedApp.experience}</span></div>}
              {selectedApp.areas && selectedApp.areas.length > 0 && (
                <div>
                  <span className="font-medium text-gray-600">Areas:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedApp.areas.map((area, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs">{area}</span>
                    ))}
                  </div>
                </div>
              )}
              {selectedApp.bio && <div><span className="font-medium text-gray-600">Bio:</span><p className="text-gray-900 mt-1 bg-gray-50 p-3 rounded-lg">{selectedApp.bio}</p></div>}
              <div>
                <span className="font-medium text-gray-600">Status:</span>
                <span className={`ml-2 inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[selectedApp.status] || "bg-gray-100 text-gray-600"}`}>
                  {selectedApp.status}
                </span>
              </div>
              <div><span className="font-medium text-gray-600">Applied:</span> <span className="text-gray-900">{new Date(selectedApp.created_at).toLocaleString()}</span></div>
            </div>
            {selectedApp.status === "pending" && (
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                <button onClick={() => updateStatus(selectedApp.id, "approved")} className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                  Approve
                </button>
                <button onClick={() => updateStatus(selectedApp.id, "rejected")} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
