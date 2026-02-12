"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload, X, Plus, Save, ImageIcon, RefreshCw } from "lucide-react"
import { getPropertiesAction, updatePropertyImagesAction } from "./actions"

interface Property {
  id: number
  title: string
  location: string
  images: string[] | null
}

export default function PropertyImagesPage() {
  const { toast } = useToast()
  const [properties, setProperties] = useState<Property[]>([])
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("")
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [newImageUrl, setNewImageUrl] = useState("")
  const [bulkUrls, setBulkUrls] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Load properties on mount
  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    setLoading(true)
    try {
      const result = await getPropertiesAction()
      if (result.success && result.data) {
        setProperties(result.data)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load properties",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load properties",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePropertySelect = (propertyId: string) => {
    setSelectedPropertyId(propertyId)
    const property = properties.find((p) => p.id.toString() === propertyId)
    if (property) {
      setSelectedProperty(property)
      setImages(property.images || [])
    }
  }

  const addSingleImage = () => {
    if (newImageUrl.trim()) {
      setImages((prev) => [...prev, newImageUrl.trim()])
      setNewImageUrl("")
    }
  }

  const addBulkImages = () => {
    const urls = bulkUrls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0)
    if (urls.length > 0) {
      setImages((prev) => [...prev, ...urls])
      setBulkUrls("")
      toast({
        title: "Images Added",
        description: `Added ${urls.length} image(s) to the list`,
      })
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const moveImage = (index: number, direction: "up" | "down") => {
    const newImages = [...images]
    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex >= 0 && newIndex < newImages.length) {
      ;[newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]]
      setImages(newImages)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Upload failed")
        }

        const data = await response.json()
        return data.url
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      setImages((prev) => [...prev, ...uploadedUrls])

      toast({
        title: "Success",
        description: `Uploaded ${uploadedUrls.length} image(s)`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const saveImages = async () => {
    if (!selectedPropertyId) return

    setSaving(true)
    try {
      const result = await updatePropertyImagesAction(Number.parseInt(selectedPropertyId), images)

      if (result.success) {
        toast({
          title: "Success",
          description: "Property images updated successfully",
        })
        // Refresh properties list
        await loadProperties()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update images",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save images",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Property Image Manager</h1>
        <p className="text-muted-foreground mt-2">Select a property and manage its images directly</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Property Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Select Property
            </CardTitle>
            <CardDescription>Choose a property to manage its images</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Select value={selectedPropertyId} onValueChange={handlePropertySelect}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder={loading ? "Loading..." : "Select a property"} />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id.toString()}>
                      #{property.id} - {property.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={loadProperties} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>

            {selectedProperty && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{selectedProperty.title}</p>
                <p className="text-sm text-muted-foreground">{selectedProperty.location}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Current images: {selectedProperty.images?.length || 0}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Images
            </CardTitle>
            <CardDescription>Upload files or paste image URLs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* File Upload */}
            <div>
              <Label htmlFor="file-upload">Upload Images</Label>
              <div className="mt-2">
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center w-full h-24 px-4 transition bg-background border-2 border-dashed rounded-lg cursor-pointer hover:border-primary"
                >
                  {uploading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground mt-1">Click to upload</span>
                    </div>
                  )}
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    disabled={uploading || !selectedPropertyId}
                  />
                </label>
              </div>
            </div>

            {/* Single URL */}
            <div>
              <Label htmlFor="single-url">Add Single URL</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="single-url"
                  placeholder="https://example.com/image.jpg"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  disabled={!selectedPropertyId}
                />
                <Button onClick={addSingleImage} disabled={!newImageUrl.trim() || !selectedPropertyId}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Bulk URLs */}
            <div>
              <Label htmlFor="bulk-urls">Add Multiple URLs (one per line)</Label>
              <Textarea
                id="bulk-urls"
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
                value={bulkUrls}
                onChange={(e) => setBulkUrls(e.target.value)}
                rows={4}
                className="mt-2"
                disabled={!selectedPropertyId}
              />
              <Button
                onClick={addBulkImages}
                className="mt-2 w-full bg-transparent"
                variant="outline"
                disabled={!bulkUrls.trim() || !selectedPropertyId}
              >
                Add All URLs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Image Preview */}
      {selectedPropertyId && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Images ({images.length})</span>
              <Button onClick={saveImages} disabled={saving || !selectedPropertyId}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardTitle>
            <CardDescription>Drag to reorder. First image will be the main/cover image.</CardDescription>
          </CardHeader>
          <CardContent>
            {images.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No images added yet</p>
                <p className="text-sm">Upload files or paste URLs above</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((url, index) => (
                  <div key={`${url}-${index}`} className="relative group">
                    <div className="aspect-video rounded-lg overflow-hidden border bg-muted">
                      <Image
                        src={url || "/placeholder.svg"}
                        alt={`Image ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/broken-image.png"
                        }}
                      />
                    </div>
                    {index === 0 && (
                      <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                        Main
                      </span>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {index > 0 && (
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-7 w-7"
                          onClick={() => moveImage(index, "up")}
                        >
                          ↑
                        </Button>
                      )}
                      {index < images.length - 1 && (
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-7 w-7"
                          onClick={() => moveImage(index, "down")}
                        >
                          ↓
                        </Button>
                      )}
                      <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => removeImage(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{url}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
