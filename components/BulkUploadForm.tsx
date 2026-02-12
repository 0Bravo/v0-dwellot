"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { Download, Upload, CheckCircle2, XCircle, Loader2, ImageIcon, Copy, X } from "lucide-react"
import Papa from "papaparse"
import { createClient } from "@/lib/supabase/client"

interface PropertyRow {
  title: string
  description: string
  price: string
  location: string
  city: string
  property_type: string
  bedrooms: string
  bathrooms: string
  square_feet: string
  year_built: string
  images: string
  amenities: string
  contact_name: string
  contact_email: string
  contact_phone: string
}

interface ParsedProperty extends PropertyRow {
  status: "pending" | "success" | "error"
  error?: string
  rowNumber: number
}

interface UploadedImage {
  file: File
  url: string
  status: "uploading" | "success" | "error"
  error?: string
}

export default function BulkUploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [properties, setProperties] = useState<ParsedProperty[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)

  const downloadTemplate = () => {
    const template = `title,description,price,location,city,property_type,bedrooms,bathrooms,square_feet,year_built,images,amenities,contact_name,contact_email,contact_phone
Luxury Villa in East Legon,"Beautiful 4-bedroom villa with modern amenities",850000,"East Legon, Accra",Accra,House,4,4,3500,2022,"https://example.com/image1.jpg|https://example.com/image2.jpg","Swimming Pool|24/7 Security|Backup Generator|Garden/Lawn",John Doe,john@example.com,+233 24 123 4567
Modern Apartment in Cantonments,"Spacious 2-bedroom apartment in prime location",450000,"Cantonments, Accra",Accra,Apartment,2,2,1200,2021,"https://example.com/image3.jpg","Gym/Fitness Center|Parking|Air Conditioning",Jane Smith,jane@example.com,+233 20 987 6543`

    const blob = new Blob([template], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "property-upload-template.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      parseCSV(selectedFile)
    }
  }

  const parseCSV = (file: File) => {
    Papa.parse<PropertyRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed: ParsedProperty[] = results.data.map((row, index) => ({
          ...row,
          status: "pending" as const,
          rowNumber: index + 2, // +2 because of header row and 0-indexing
        }))
        setProperties(parsed)
        setUploadComplete(false)
      },
      error: (error) => {
        console.error("CSV parsing error:", error)
        alert("Error parsing CSV file. Please check the format.")
      },
    })
  }

  const validateProperty = (property: PropertyRow): string | null => {
    if (!property.title?.trim()) return "Title is required"
    if (!property.description?.trim()) return "Description is required"
    if (!property.price || isNaN(Number(property.price))) return "Valid price is required"
    if (!property.location?.trim()) return "Location is required"
    if (!property.city?.trim()) return "City is required"
    if (!property.property_type?.trim()) return "Property type is required"
    if (!property.bedrooms || isNaN(Number(property.bedrooms))) return "Valid bedrooms count is required"
    if (!property.bathrooms || isNaN(Number(property.bathrooms))) return "Valid bathrooms count is required"
    if (!property.images?.trim()) return "At least one image URL is required"
    return null
  }

  const uploadProperties = async () => {
    setUploading(true)
    const supabase = createClient()

    const updatedProperties = [...properties]

    for (let i = 0; i < updatedProperties.length; i++) {
      const property = updatedProperties[i]

      // Validate property
      const validationError = validateProperty(property)
      if (validationError) {
        updatedProperties[i] = {
          ...property,
          status: "error",
          error: validationError,
        }
        setProperties([...updatedProperties])
        continue
      }

      try {
        // Parse images (pipe-separated URLs)
        const images = property.images
          .split("|")
          .map((url) => url.trim())
          .filter(Boolean)

        // Parse amenities (pipe-separated)
        const amenities =
          property.amenities
            ?.split("|")
            .map((a) => a.trim())
            .filter(Boolean) || []

        // Insert property into database
        const { error } = await supabase.from("properties").insert({
          title: property.title.trim(),
          description: property.description.trim(),
          price: Number(property.price),
          location: property.location.trim(),
          city: property.city.trim(),
          property_type: property.property_type.trim(),
          bedrooms: Number(property.bedrooms),
          bathrooms: Number(property.bathrooms),
          square_feet: property.square_feet ? Number(property.square_feet) : null,
          year_built: property.year_built ? Number(property.year_built) : null,
          images,
          amenities,
          contact_name: property.contact_name?.trim() || null,
          contact_email: property.contact_email?.trim() || null,
          contact_phone: property.contact_phone?.trim() || null,
          status: "available",
        })

        if (error) throw error

        updatedProperties[i] = {
          ...property,
          status: "success",
        }
      } catch (error) {
        updatedProperties[i] = {
          ...property,
          status: "error",
          error: error instanceof Error ? error.message : "Failed to upload property",
        }
      }

      setProperties([...updatedProperties])
    }

    setUploading(false)
    setUploadComplete(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploadingImages(true)

    // Initialize uploaded images with uploading status
    const newImages: UploadedImage[] = files.map((file) => ({
      file,
      url: "",
      status: "uploading",
    }))
    setUploadedImages((prev) => [...prev, ...newImages])

    // Upload each image
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const formData = new FormData()
      formData.append("file", file)

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) throw new Error("Upload failed")

        const data = await response.json()

        setUploadedImages((prev) => {
          const updated = [...prev]
          const index = updated.findIndex((img) => img.file === file && img.status === "uploading")
          if (index !== -1) {
            updated[index] = {
              ...updated[index],
              url: data.url,
              status: "success",
            }
          }
          return updated
        })
      } catch (error) {
        setUploadedImages((prev) => {
          const updated = [...prev]
          const index = updated.findIndex((img) => img.file === file && img.status === "uploading")
          if (index !== -1) {
            updated[index] = {
              ...updated[index],
              status: "error",
              error: error instanceof Error ? error.message : "Upload failed",
            }
          }
          return updated
        })
      }
    }

    setUploadingImages(false)
    // Reset file input
    e.target.value = ""
  }

  const copyAllImageUrls = () => {
    const urls = uploadedImages
      .filter((img) => img.status === "success")
      .map((img) => img.url)
      .join("|")
    navigator.clipboard.writeText(urls)
    alert("Image URLs copied to clipboard!")
  }

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    alert("Image URL copied to clipboard!")
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const successCount = properties.filter((p) => p.status === "success").length
  const errorCount = properties.filter((p) => p.status === "error").length

  return (
    <div className="space-y-6">
      <Alert>
        <AlertDescription>
          Upload multiple properties at once using a CSV file. First upload your images, then download the template and
          use the image URLs in your CSV.
        </AlertDescription>
      </Alert>

      <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Step 1: Upload Images
            </h3>
            <p className="text-sm text-muted-foreground">Upload all property images first to get their URLs</p>
          </div>
          {uploadedImages.length > 0 && (
            <Button
              onClick={copyAllImageUrls}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent"
            >
              <Copy className="h-4 w-4" />
              Copy All URLs
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="image-upload">Select Images</Label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={uploadingImages}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:opacity-50"
          />
          <p className="text-xs text-muted-foreground">
            Select multiple images (max 5MB each). You can upload images for multiple properties at once.
          </p>
        </div>

        {uploadedImages.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Uploaded Images ({uploadedImages.filter((img) => img.status === "success").length}/{uploadedImages.length}
              )
            </p>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {uploadedImages.map((image, index) => (
                <Card key={index} className="p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {image.status === "success" && <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />}
                      {image.status === "uploading" && <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />}
                      {image.status === "error" && <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{image.file.name}</p>
                        {image.status === "success" && (
                          <p className="text-xs text-muted-foreground truncate">{image.url}</p>
                        )}
                        {image.status === "error" && <p className="text-xs text-red-600">{image.error}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {image.status === "success" && (
                        <Button
                          onClick={() => copyImageUrl(image.url)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        onClick={() => removeImage(index)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Step 2: Prepare CSV File</h3>
          <p className="text-sm text-muted-foreground">Download the template and fill in your property details</p>
        </div>

        <div className="flex gap-4">
          <Button onClick={downloadTemplate} variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Download CSV Template
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Step 3: Upload CSV File</h3>
          <p className="text-sm text-muted-foreground">Upload your completed CSV file with property details</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="csv-file">Upload CSV File</Label>
          <div className="flex items-center gap-4">
            <input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
            />
          </div>
          {file && (
            <p className="text-sm text-muted-foreground">
              Selected: {file.name} ({properties.length} properties found)
            </p>
          )}
        </div>
      </div>

      {properties.length > 0 && (
        <>
          <div className="space-y-2">
            <h3 className="font-semibold">Preview ({properties.length} properties)</h3>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {properties.map((property, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground">Row {property.rowNumber}</span>
                        {property.status === "success" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                        {property.status === "error" && <XCircle className="h-4 w-4 text-red-600" />}
                      </div>
                      <p className="font-medium truncate">{property.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{property.location}</p>
                      <p className="text-sm font-semibold">$ {Number(property.price).toLocaleString()}</p>
                      {property.error && <p className="text-sm text-red-600 mt-1">{property.error}</p>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {uploadComplete && (
            <Alert>
              <AlertDescription>
                Upload complete! {successCount} properties uploaded successfully.
                {errorCount > 0 && ` ${errorCount} properties failed.`}
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={uploadProperties} disabled={uploading || uploadComplete} className="w-full">
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading... ({successCount + errorCount}/{properties.length})
              </>
            ) : uploadComplete ? (
              "Upload Complete"
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload {properties.length} Properties
              </>
            )}
          </Button>
        </>
      )}

      <div className="text-sm text-muted-foreground space-y-2">
        <p className="font-semibold">CSV Format Instructions:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Use pipe (|) to separate multiple images: image1.jpg|image2.jpg</li>
          <li>Use pipe (|) to separate multiple amenities: Swimming Pool|Gym|Parking</li>
          <li>
            Required fields: title, description, price, location, city, property_type, bedrooms, bathrooms, images
          </li>
          <li>Optional fields: square_feet, year_built, amenities, contact_name, contact_email, contact_phone</li>
        </ul>
      </div>
    </div>
  )
}
