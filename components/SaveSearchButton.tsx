"use client"

import { useState } from "react"
import { Bookmark } from "lucide-react"
import SaveSearchModal from "@/components/SaveSearchModal"

interface SaveSearchButtonProps {
  filters: any
  className?: string
}

export default function SaveSearchButton({ filters, className = "" }: SaveSearchButtonProps) {
  const [showModal, setShowModal] = useState(false)

  const handleSave = async (name: string, emailAlerts: boolean, alertFrequency: string) => {
    try {
      const response = await fetch("/api/saved-searches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, filters, emailAlerts, alertFrequency }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save search")
      }

      alert("Search saved successfully!")
    } catch (error) {
      console.error("Error saving search:", error)
      alert(error instanceof Error ? error.message : "Failed to save search")
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition ${className}`}
      >
        <Bookmark className="w-4 h-4" />
        <span>Save Search</span>
      </button>

      <SaveSearchModal isOpen={showModal} onClose={() => setShowModal(false)} filters={filters} onSave={handleSave} />
    </>
  )
}
