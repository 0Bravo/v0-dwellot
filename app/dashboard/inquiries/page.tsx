"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Mail, Phone, MessageSquare, Calendar, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface Inquiry {
  id: number
  property_id: number
  name: string
  email: string
  phone: string | null
  message: string
  status: string
  created_at: string
  properties: {
    id: number
    title: string
    location: string
    price: number
  }
}

export default function InquiriesDashboard() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchInquiries()
    }
  }, [user])

  const fetchInquiries = async () => {
    try {
      const response = await fetch("/api/inquiries")
      const data = await response.json()

      if (response.ok) {
        setInquiries(data.inquiries || [])
      } else {
        console.error("Failed to fetch inquiries:", data.error)
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateInquiryStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        await fetchInquiries()
      }
    } catch (error) {
      console.error("Error updating inquiry:", error)
    }
  }

  const filteredInquiries = filter === "all" ? inquiries : inquiries.filter((i) => i.status === filter)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "contacted":
        return <CheckCircle className="h-4 w-4" />
      case "closed":
        return <XCircle className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "contacted":
        return "bg-blue-100 text-blue-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading inquiries...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
              <p className="text-gray-600 mt-1">Manage property inquiries</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === "all" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All ({inquiries.length})
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === "pending" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Pending ({inquiries.filter((i) => i.status === "pending").length})
              </button>
              <button
                onClick={() => setFilter("contacted")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === "contacted" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Contacted ({inquiries.filter((i) => i.status === "contacted").length})
              </button>
            </div>
          </div>

          {filteredInquiries.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No inquiries yet</p>
              <p className="text-sm mt-2">Inquiries will appear here when users contact you</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInquiries.map((inquiry) => (
                <div key={inquiry.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{inquiry.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">Property: {inquiry.properties.title}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(inquiry.status)}`}
                    >
                      {getStatusIcon(inquiry.status)}
                      {inquiry.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a href={`mailto:${inquiry.email}`} className="hover:text-green-600">
                        {inquiry.email}
                      </a>
                    </div>
                    {inquiry.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <a href={`tel:${inquiry.phone}`} className="hover:text-green-600">
                          {inquiry.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-md p-3 mb-4">
                    <p className="text-sm text-gray-700">{inquiry.message}</p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(inquiry.created_at).toLocaleString()}</span>
                    </div>
                    <div className="flex gap-2">
                      {inquiry.status === "pending" && (
                        <button
                          onClick={() => updateInquiryStatus(inquiry.id, "contacted")}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm font-medium hover:bg-blue-100 transition"
                        >
                          Mark as Contacted
                        </button>
                      )}
                      {inquiry.status === "contacted" && (
                        <button
                          onClick={() => updateInquiryStatus(inquiry.id, "closed")}
                          className="px-3 py-1 bg-gray-50 text-gray-700 rounded text-sm font-medium hover:bg-gray-100 transition"
                        >
                          Close
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
