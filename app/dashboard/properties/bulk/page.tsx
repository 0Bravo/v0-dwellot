"use client"

import { useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Upload, Download, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface UploadResult {
  row: number
  title: string
  status: "success" | "error"
  message: string
}

const CSV_TEMPLATE = `title,description,property_type,listing_type,price,currency,location,region,bedrooms,bathrooms,area,parking_spaces,floors,furnished,status,agent,developer,estate_name,images,amenities
"Luxury 3 Bedroom Villa","Beautiful villa with pool",House,sale,350000,USD,"East Legon, Accra",Greater Accra,3,4,250,2,2,Furnished,active,rudolf2mf,"Best Developers","Trasacco Valley","https://img1.jpg|https://img2.jpg","Swimming Pool|Garden|Security"`

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [parsing, setParsing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [results, setResults] = useState<UploadResult[]>([])
  const [preview, setPreview] = useState<Record<string, string>[]>([])

  function downloadTemplate() {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "dwellot-properties-template.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  function parseCSV(text: string): Record<string, string>[] {
    const lines = text.split("\n").filter(l => l.trim())
    if (lines.length < 2) return []
    
    const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""))
    const rows: Record<string, string>[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const values: string[] = []
      let current = ""
      let inQuotes = false
      
      for (const char of lines[i]) {
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === "," && !inQuotes) {
          values.push(current.trim())
          current = ""
        } else {
          current += char
        }
      }
      values.push(current.trim())
      
      const row: Record<string, string> = {}
      headers.forEach((h, idx) => {
        row[h] = values[idx] || ""
      })
      rows.push(row)
    }
    return rows
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setResults([])
    setParsing(true)

    const text = await f.text()
    const rows = parseCSV(text)
    setPreview(rows.slice(0, 5))
    setParsing(false)
  }

  async function handleUpload() {
    if (!file) return
    setUploading(true)
    setResults([])

    const supabase = createBrowserClient()
    if (!supabase) {
      setResults([{ row: 0, title: "Error", status: "error", message: "Database not available" }])
      setUploading(false)
      return
    }

    const text = await file.text()
    const rows = parseCSV(text)
    const uploadResults: UploadResult[] = []

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      try {
        if (!row.title || !row.location || !row.price || !row.property_type || !row.listing_type) {
          uploadResults.push({ row: i + 2, title: row.title || "Unknown", status: "error", message: "Missing required fields (title, location, price, property_type, listing_type)" })
          continue
        }

        const slug = row.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
        const images = row.images ? row.images.split("|").map(s => s.trim()) : []
        const amenities = row.amenities ? row.amenities.split("|").map(s => s.trim()) : []

        const { error } = await supabase.from("properties").insert({
          title: row.title,
          description: row.description || null,
          property_type: row.property_type,
          listing_type: row.listing_type,
          price: parseFloat(row.price),
          currency: row.currency || "USD",
          location: row.location,
          region: row.region || "Greater Accra",
          bedrooms: parseInt(row.bedrooms) || 0,
          bathrooms: parseInt(row.bathrooms) || 0,
          area: parseInt(row.area) || 0,
          parking_spaces: parseInt(row.parking_spaces) || 0,
          floors: parseInt(row.floors) || 1,
          furnished: row.furnished || null,
          status: row.status || "active",
          agent: row.agent || null,
          developer: row.developer || null,
          estate_name: row.estate_name || null,
          images,
          amenities,
          slug,
        })

        if (error) throw error
        uploadResults.push({ row: i + 2, title: row.title, status: "success", message: "Created successfully" })
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error"
        uploadResults.push({ row: i + 2, title: row.title || "Unknown", status: "error", message })
      }
    }

    setResults(uploadResults)
    setUploading(false)
  }

  const successCount = results.filter(r => r.status === "success").length
  const errorCount = results.filter(r => r.status === "error").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bulk Upload Properties</h1>
        <p className="text-sm text-gray-500 mt-1">Upload multiple properties at once using a CSV file</p>
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
          <li>Download the CSV template below</li>
          <li>Fill in your property data (required fields: title, location, price, property_type, listing_type)</li>
          <li>For multiple images or amenities, separate values with a pipe character (|)</li>
          <li>Upload the completed CSV file</li>
        </ol>
        <button onClick={downloadTemplate} className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center gap-2">
          <Download className="h-4 w-4" /> Download Template
        </button>
      </div>

      {/* Upload */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload CSV</h2>
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-400 hover:bg-teal-50/50 transition-colors">
          <div className="flex flex-col items-center">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">{file ? file.name : "Click to select CSV file"}</p>
          </div>
          <input type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
        </label>

        {parsing && <p className="mt-3 text-sm text-gray-500">Parsing file...</p>}

        {/* Preview */}
        {preview.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <p className="text-sm font-medium text-gray-700">Preview (first 5 rows)</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    {Object.keys(preview[0]).slice(0, 6).map(h => (
                      <th key={h} className="px-3 py-2 text-left font-medium text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      {Object.values(row).slice(0, 6).map((v, j) => (
                        <td key={j} className="px-3 py-2 text-gray-700 max-w-[200px] truncate">{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {file && !uploading && (
          <button onClick={handleUpload} className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center gap-2">
            <Upload className="h-4 w-4" /> Upload Properties
          </button>
        )}

        {uploading && (
          <div className="mt-4 flex items-center gap-2 text-sm text-teal-600">
            <Loader2 className="h-4 w-4 animate-spin" /> Uploading properties...
          </div>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Upload Results</h2>
          <div className="flex gap-4 mb-4 text-sm">
            <span className="text-green-600 font-medium">{successCount} succeeded</span>
            {errorCount > 0 && <span className="text-red-600 font-medium">{errorCount} failed</span>}
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {results.map((r, i) => (
              <div key={i} className={`flex items-start gap-3 px-3 py-2 rounded-lg text-sm ${r.status === "success" ? "bg-green-50" : "bg-red-50"}`}>
                {r.status === "success" ? <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> : <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />}
                <div>
                  <span className="font-medium">Row {r.row}: {r.title}</span>
                  <span className="text-gray-500 ml-2">{r.message}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
