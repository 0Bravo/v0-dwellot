"use client"

import { Printer, Download } from "lucide-react"

interface PropertyPrintProps {
  propertyId: string
  className?: string
}

export default function PropertyPrint({ propertyId, className = "" }: PropertyPrintProps) {
  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = async () => {
    try {
      // Open print dialog with PDF save option
      window.print()
    } catch (error) {
      console.error("Error generating PDF:", error)
    }
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        title="Print property details"
      >
        <Printer className="w-4 h-4" />
        <span className="hidden sm:inline">Print</span>
      </button>
      <button
        onClick={handleDownloadPDF}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        title="Download as PDF"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">PDF</span>
      </button>
    </div>
  )
}
