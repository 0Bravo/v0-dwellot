"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

interface PropertyRow {
  title: string
  description: string
  location: string
  property_type: string
  listing_type: string
  price: number
  bedrooms: number
  bathrooms: number
  area: number
  parking: number
  amenities: string
  agent: string
  phone: string
  featured: boolean
  status: string
  image_1?: string
  image_2?: string
  image_3?: string
  image_4?: string
  image_5?: string
}

export default function BulkUploadPage() {
  const [uploading, setUploading] = useState(false)
  const [results, setResults] = useState<{ success: number; failed: number; errors: string[] } | null>(null)
  const supabase = createBrowserClient()

  const handleDownloadTemplate = () => {
    const link = document.createElement("a")
    link.href = "/templates/property-listing-template.csv"
    link.download = "property-listing-template.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const parseCSV = (text: string): PropertyRow[] => {
    const lines = text.split("\n").filter((line) => line.trim())
    const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""))

    return lines.slice(1).map((line) => {
      const values: string[] = []
      let current = ""
      let inQuotes = false

      for (const char of line) {
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

      const row: Record<string, unknown> = {}
      headers.forEach((header, index) => {
        let value: unknown = values[index]?.replace(/^"|"$/g, "") || ""

        if (["price", "bedrooms", "bathrooms", "area", "parking"].includes(header)) {
          value = Number(value) || 0
        }
        if (header === "featured") {
          value = value === "true" || value === "TRUE" || value === "1"
        }

        row[header] = value
      })

      return row as PropertyRow
    })
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setResults(null)

    try {
      const text = await file.text()
      const rows = parseCSV(text)

      let success = 0
      let failed = 0
      const errors: string[] = []

      for (const row of rows) {
        try {
          // Collect images into array
          const images: string[] = []
          if (row.image_1) images.push(row.image_1)
          if (row.image_2) images.push(row.image_2)
          if (row.image_3) images.push(row.image_3)
          if (row.image_4) images.push(row.image_4)
          if (row.image_5) images.push(row.image_5)

          // Parse amenities from pipe-separated string
          const amenities = row.amenities ? row.amenities.split("|").map((a) => a.trim()) : []

          const { error } = await supabase.from("properties").insert({
            title: row.title,
            description: row.description,
            location: row.location,
            property_type: row.property_type,
            listing_type: row.listing_type,
            price: row.price,
            bedrooms: row.bedrooms,
            bathrooms: row.bathrooms,
            area: row.area,
            parking: row.parking,
            amenities,
            agent: row.agent,
            phone: row.phone,
            featured: row.featured,
            status: row.status || "active",
            images,
          })

          if (error) {
            failed++
            errors.push(`Row "${row.title}": ${error.message}`)
          } else {
            success++
          }
        } catch (err) {
          failed++
          errors.push(`Row "${row.title}": ${err instanceof Error ? err.message : "Unknown error"}`)
        }
      }

      setResults({ success, failed, errors })
    } catch {
      setResults({ success: 0, failed: 1, errors: ["Failed to parse CSV file. Please check the format."] })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Bulk Property Upload</h1>

      {/* Step 1: Download Template */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Step 1: Download Template
          </CardTitle>
          <CardDescription>Download the CSV template and fill in your property details</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleDownloadTemplate} variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Download CSV Template
          </Button>

          <div className="mt-4 text-sm text-muted-foreground">
            <p className="font-medium mb-2">Template Fields:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>title</strong> - Property name/title (required)
              </li>
              <li>
                <strong>description</strong> - Full property description
              </li>
              <li>
                <strong>location</strong> - Address or area (required)
              </li>
              <li>
                <strong>property_type</strong> - house, apartment, land, commercial, office
              </li>
              <li>
                <strong>listing_type</strong> - sale or rent
              </li>
              <li>
                <strong>price</strong> - Price in USD (numbers only)
              </li>
              <li>
                <strong>bedrooms, bathrooms</strong> - Number of rooms
              </li>
              <li>
                <strong>area</strong> - Size in square meters
              </li>
              <li>
                <strong>parking</strong> - Number of parking spaces
              </li>
              <li>
                <strong>amenities</strong> - Pipe-separated list (e.g., "Pool|Gym|Security")
              </li>
              <li>
                <strong>agent, phone</strong> - Contact details
              </li>
              <li>
                <strong>featured</strong> - true or false
              </li>
              <li>
                <strong>status</strong> - active, pending, or sold
              </li>
              <li>
                <strong>image_1 to image_5</strong> - Image URLs (up to 5)
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Upload CSV */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Step 2: Upload Completed CSV
          </CardTitle>
          <CardDescription>Upload your filled CSV file to add properties to the database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={uploading}
              className="block w-full text-sm text-foreground
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-primary-foreground
                hover:file:bg-primary/90
                disabled:opacity-50"
            />
            {uploading && <Loader2 className="h-5 w-5 animate-spin" />}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6 mb-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">{results.success} successful</span>
              </div>
              {results.failed > 0 && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">{results.failed} failed</span>
                </div>
              )}
            </div>

            {results.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertDescription>
                  <ul className="list-disc list-inside">
                    {results.errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {results.success > 0 && results.failed === 0 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  All properties uploaded successfully! View them on the{" "}
                  <a href="/properties" className="underline font-medium">
                    properties page
                  </a>
                  .
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
