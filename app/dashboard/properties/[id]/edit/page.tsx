"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import PropertyForm from "@/components/admin/PropertyForm"
import { Loader2 } from "lucide-react"

export default function EditPropertyPage() {
  const params = useParams()
  const router = useRouter()
  const [property, setProperty] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchProperty() {
      const supabase = createBrowserClient()
      if (!supabase) {
        setError("Database connection not available")
        setLoading(false)
        return
      }

      const { data, error: fetchError } = await supabase
        .from("properties")
        .select("*")
        .eq("id", params.id)
        .single()

      if (fetchError || !data) {
        setError("Property not found")
        setLoading(false)
        return
      }

      setProperty(data)
      setLoading(false)
    }

    fetchProperty()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
        <p>{error || "Property not found"}</p>
        <button onClick={() => router.push("/dashboard/properties")} className="mt-3 text-sm font-medium text-red-800 underline">
          Back to Properties
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
        <p className="text-sm text-gray-500 mt-1">Update details for: {property.title as string}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <PropertyForm mode="edit" initialData={property} />
      </div>
    </div>
  )
}
