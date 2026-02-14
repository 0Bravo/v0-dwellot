"use client"

import { useState, useEffect, useCallback } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Search, Eye, Trash2, ChevronLeft, ChevronRight, X, Phone, Mail, MessageSquare } from "lucide-react"

interface Enquiry {
  id: string
  property_id: number
  enquiry_type: string
  visitor_name: string
  visitor_email: string
  visitor_phone: string | null
  message: string | null
  source_page: string | null
  created_at: string
  property?: { title: string; slug: string }
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null)
  const perPage = 20

  const fetchEnquiries = useCallback(async () => {
    const supabase = createBrowserClient()
    if (!supabase) return
    setLoading(true)

    let query = supabase
      .from("property_enquiries")
      .select("*, property:properties(title, slug)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1)

    if (search) {
      query = query.or(`visitor_name.ilike.%${search}%,visitor_email.ilike.%${search}%,visitor_phone.ilike.%${search}%`)
    }
    if (typeFilter !== "all") {
      query = query.eq("enquiry_type", typeFilter)
    }

    const { data, count } = await query
    setEnquiries((data as Enquiry[]) || [])
    setTotal(count || 0)
    setLoading(false)
  }, [page, search, typeFilter])

  useEffect(() => { fetchEnquiries() }, [fetchEnquiries])

  const deleteEnquiry = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return
    const supabase = createBrowserClient()
    if (!supabase) return
    await supabase.from("property_enquiries").delete().eq("id", id)
    fetchEnquiries()
  }

  const totalPages = Math.ceil(total / perPage)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
          <p className="text-sm text-gray-500 mt-1">{total} total enquiries</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Types</option>
            <option value="whatsapp_click">WhatsApp</option>
            <option value="call_click">Phone Call</option>
            <option value="email_click">Email</option>
            <option value="form_submission">Form</option>
          </select>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading enquiries...</div>
        ) : enquiries.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No enquiries found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Visitor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 hidden md:table-cell">Property</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 hidden lg:table-cell">Date</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((e) => (
                  <tr key={e.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{e.visitor_name}</p>
                      <p className="text-xs text-gray-500">{e.visitor_email}</p>
                      {e.visitor_phone && <p className="text-xs text-gray-400">{e.visitor_phone}</p>}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        e.enquiry_type === "whatsapp_click" ? "bg-green-100 text-green-700" :
                        e.enquiry_type === "call_click" ? "bg-blue-100 text-blue-700" :
                        e.enquiry_type === "email_click" ? "bg-purple-100 text-purple-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {e.enquiry_type === "whatsapp_click" && <MessageSquare className="h-3 w-3" />}
                        {e.enquiry_type === "call_click" && <Phone className="h-3 w-3" />}
                        {e.enquiry_type === "email_click" && <Mail className="h-3 w-3" />}
                        {e.enquiry_type.replace("_click", "").replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-gray-600 max-w-[200px] truncate">
                      {e.property?.title || `Property #${e.property_id}`}
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell text-gray-500">
                      {new Date(e.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setSelectedEnquiry(e)} className="p-1.5 text-gray-400 hover:text-teal-600 rounded">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => deleteEnquiry(e.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded">
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
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedEnquiry(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Enquiry Details</h3>
              <button onClick={() => setSelectedEnquiry(null)} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="font-medium text-gray-600">Name:</span> <span className="text-gray-900">{selectedEnquiry.visitor_name}</span></div>
              <div><span className="font-medium text-gray-600">Email:</span> <span className="text-gray-900">{selectedEnquiry.visitor_email}</span></div>
              {selectedEnquiry.visitor_phone && <div><span className="font-medium text-gray-600">Phone:</span> <span className="text-gray-900">{selectedEnquiry.visitor_phone}</span></div>}
              <div><span className="font-medium text-gray-600">Type:</span> <span className="text-gray-900 capitalize">{selectedEnquiry.enquiry_type.replace(/_/g, " ")}</span></div>
              <div><span className="font-medium text-gray-600">Property:</span> <span className="text-gray-900">{selectedEnquiry.property?.title || `#${selectedEnquiry.property_id}`}</span></div>
              {selectedEnquiry.message && <div><span className="font-medium text-gray-600">Message:</span><p className="text-gray-900 mt-1 bg-gray-50 p-3 rounded-lg">{selectedEnquiry.message}</p></div>}
              <div><span className="font-medium text-gray-600">Date:</span> <span className="text-gray-900">{new Date(selectedEnquiry.created_at).toLocaleString()}</span></div>
              {selectedEnquiry.source_page && <div><span className="font-medium text-gray-600">Source:</span> <span className="text-gray-900">{selectedEnquiry.source_page}</span></div>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
