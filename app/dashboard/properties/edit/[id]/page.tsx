"use client"

import type React from "react"
import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Upload, X, Loader2, ArrowLeft, ChevronUp, ChevronDown, GripVertical, Link2, Plus } from "lucide-react"

interface UploadedImage {
  url: string
  filename: string
}

const COMMON_AMENITIES = [
  "Swimming Pool",
  "Gym/Fitness Center",
  "24/7 Security",
  "Backup Generator",
  "Garden/Lawn",
  "Air Conditioning",
  "Balcony/Terrace",
  "Servant Quarters",
  "CCTV Surveillance",
  "Water Storage/Tank",
  "Gated Community",
  "Internet/WiFi",
  "Solar Panels",
  "Laundry Room",
  "Elevator",
  "Parking",
]

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [imageUrlInput, setImageUrlInput] = useState("")
  const [bulkUrlInput, setBulkUrlInput] = useState("")
  const [showBulkInput, setShowBulkInput] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    property_type: "house",
    listing_type: "sale",
    bedrooms: "",
    bathrooms: "",
    area: "",
    parking: "",
    description: "",
    featured: false,
    status: "active",
    agent: "",
    phone: "",
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user && id) {
      fetchProperty()
    }
  }, [user, id])

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/manage/${id}`)
      const data = await response.json()

      if (response.ok && data.property) {
        const property = data.property
        setFormData({
          title: property.title || "",
          location: property.location || "",
          price: property.price?.toString() || "",
          property_type: property.property_type || "house",
          listing_type: property.listing_type || "sale",
          bedrooms: property.bedrooms?.toString() || "",
          bathrooms: property.bathrooms?.toString() || "",
          area: property.area?.toString() || "",
          parking: property.parking?.toString() || "",
          description: property.description || "",
          featured: property.featured || false,
          status: property.status || "active",
          agent: property.agent || "",
          phone: property.phone || "",
        })
        setSelectedAmenities(property.amenities || [])
        if (property.images && property.images.length > 0) {
          setUploadedImages(property.images.map((url: string) => ({ url, filename: url.split("/").pop() || "image" })))
        }
      } else {
        toast({
          title: "Error",
          description: "Property not found",
          variant: "destructive",
        })
        router.push("/dashboard/properties")
      }
    } catch (error) {
      console.error("Error fetching property:", error)
      toast({
        title: "Error",
        description: "Failed to load property",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) => (prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]))
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
          const error = await response.json()
          throw new Error(error.error || "Upload failed")
        }

        return await response.json()
      })

      const results = await Promise.all(uploadPromises)

      setUploadedImages((prev) => [...prev, ...results.map((r) => ({ url: r.url, filename: r.filename }))])

      toast({
        title: "Success",
        description: `${results.length} image(s) uploaded successfully`,
      })

      e.target.value = ""
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload images",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const removeUploadedImage = (url: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.url !== url))
  }

  const moveImageUp = (index: number) => {
    if (index === 0) return
    setUploadedImages((prev) => {
      const newImages = [...prev]
      const temp = newImages[index - 1]
      newImages[index - 1] = newImages[index]
      newImages[index] = temp
      return newImages
    })
  }

  const moveImageDown = (index: number) => {
    if (index === uploadedImages.length - 1) return
    setUploadedImages((prev) => {
      const newImages = [...prev]
      const temp = newImages[index + 1]
      newImages[index + 1] = newImages[index]
      newImages[index] = temp
      return newImages
    })
  }

  const moveImageToPosition = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= uploadedImages.length) return
    setUploadedImages((prev) => {
      const newImages = [...prev]
      const [movedImage] = newImages.splice(fromIndex, 1)
      newImages.splice(toIndex, 0, movedImage)
      return newImages
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const allImages = uploadedImages.map((img) => img.url)

      if (allImages.length === 0) {
        toast({
          title: "Error",
          description: "Please add at least one image",
          variant: "destructive",
        })
        setSaving(false)
        return
      }

      const propertyData = {
        title: formData.title,
        location: formData.location,
        price: Number.parseFloat(formData.price),
        property_type: formData.property_type,
        listing_type: formData.listing_type,
        bedrooms: Number.parseInt(formData.bedrooms),
        bathrooms: Number.parseInt(formData.bathrooms),
        area: Number.parseFloat(formData.area),
        parking: formData.parking ? Number.parseInt(formData.parking) : null,
        description: formData.description,
        images: allImages,
        amenities: selectedAmenities.length > 0 ? selectedAmenities : null,
        featured: formData.featured,
        status: formData.status,
        agent: formData.agent || null,
        phone: formData.phone || null,
      }

      const response = await fetch(`/api/properties/manage/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(propertyData),
      })

      if (!response.ok) {
        throw new Error("Failed to update property")
      }

      toast({
        title: "Success",
        description: "Property has been updated successfully",
      })

      router.push("/dashboard/properties")
      router.refresh()
    } catch (error) {
      console.error("Error updating property:", error)
      toast({
        title: "Error",
        description: "Failed to update property. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAddImageUrl = () => {
    const url = imageUrlInput.trim()
    if (!url) return

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive",
      })
      return
    }

    if (uploadedImages.some((img) => img.url === url)) {
      toast({
        title: "Duplicate URL",
        description: "This image URL has already been added",
        variant: "destructive",
      })
      return
    }

    const filename = url.split("/").pop()?.split("?")[0] || "image"
    setUploadedImages((prev) => [...prev, { url, filename }])
    setImageUrlInput("")
    toast({
      title: "Image Added",
      description: "Image URL has been added successfully",
    })
  }

  const handleAddBulkUrls = () => {
    const urls = bulkUrlInput
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0)

    if (urls.length === 0) {
      toast({
        title: "No URLs",
        description: "Please enter at least one URL",
        variant: "destructive",
      })
      return
    }

    const validUrls: { url: string; filename: string }[] = []
    const invalidUrls: string[] = []
    const duplicateUrls: string[] = []

    urls.forEach((url) => {
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        invalidUrls.push(url)
        return
      }
      if (uploadedImages.some((img) => img.url === url) || validUrls.some((v) => v.url === url)) {
        duplicateUrls.push(url)
        return
      }
      const filename = url.split("/").pop()?.split("?")[0] || "image"
      validUrls.push({ url, filename })
    })

    if (validUrls.length > 0) {
      setUploadedImages((prev) => [...prev, ...validUrls])
      setBulkUrlInput("")
      setShowBulkInput(false)
    }

    const messages: string[] = []
    if (validUrls.length > 0) messages.push(`${validUrls.length} image(s) added`)
    if (invalidUrls.length > 0) messages.push(`${invalidUrls.length} invalid URL(s) skipped`)
    if (duplicateUrls.length > 0) messages.push(`${duplicateUrls.length} duplicate(s) skipped`)

    toast({
      title: validUrls.length > 0 ? "Images Added" : "No Images Added",
      description: messages.join(", "),
      variant: validUrls.length > 0 ? "default" : "destructive",
    })
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading property...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => router.push("/dashboard/properties")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Properties
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Edit Property</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Property Title *</Label>
                      <Input
                        id="title"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Luxury 4 Bedroom Villa in East Legon"
                      />
                    </div>

                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g., East Legon, Accra"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="property_type">Property Type *</Label>
                        <Select
                          value={formData.property_type}
                          onValueChange={(value) => setFormData({ ...formData, property_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="house">House</SelectItem>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="villa">Villa</SelectItem>
                            <SelectItem value="land">Land</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                            <SelectItem value="office">Office</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="listing_type">Listing Type *</Label>
                        <Select
                          value={formData.listing_type}
                          onValueChange={(value) => setFormData({ ...formData, listing_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sale">For Sale</SelectItem>
                            <SelectItem value="rent">For Rent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="price">Price (GHS) *</Label>
                      <Input
                        id="price"
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="e.g., 850000"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Property Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Property Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="bedrooms">Bedrooms *</Label>
                        <Input
                          id="bedrooms"
                          type="number"
                          required
                          value={formData.bedrooms}
                          onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                          placeholder="e.g., 4"
                        />
                      </div>

                      <div>
                        <Label htmlFor="bathrooms">Bathrooms *</Label>
                        <Input
                          id="bathrooms"
                          type="number"
                          required
                          value={formData.bathrooms}
                          onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                          placeholder="e.g., 3"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="area">Area (sqm) *</Label>
                        <Input
                          id="area"
                          type="number"
                          required
                          value={formData.area}
                          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                          placeholder="e.g., 350"
                        />
                      </div>

                      <div>
                        <Label htmlFor="parking">Parking Spaces</Label>
                        <Input
                          id="parking"
                          type="number"
                          value={formData.parking}
                          onChange={(e) => setFormData({ ...formData, parking: e.target.value })}
                          placeholder="e.g., 2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe the property, its features, and what makes it special..."
                        rows={6}
                      />
                    </div>

                    <div>
                      <Label>Amenities</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                        {COMMON_AMENITIES.map((amenity) => (
                          <div key={amenity} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`amenity-${amenity}`}
                              checked={selectedAmenities.includes(amenity)}
                              onChange={() => toggleAmenity(amenity)}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor={`amenity-${amenity}`} className="cursor-pointer text-sm font-normal">
                              {amenity}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {selectedAmenities.length > 0 && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Selected: {selectedAmenities.length} amenity(ies)
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Images */}
                <Card>
                  <CardHeader>
                    <CardTitle>Images</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Label>Add Image by URL</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            value={imageUrlInput}
                            onChange={(e) => setImageUrlInput(e.target.value)}
                            placeholder="Paste image URL here..."
                            className="pl-9"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                handleAddImageUrl()
                              }
                            }}
                          />
                        </div>
                        <Button type="button" onClick={handleAddImageUrl} variant="secondary">
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowBulkInput(!showBulkInput)}
                        className="text-muted-foreground"
                      >
                        {showBulkInput ? "Hide bulk paste" : "Paste multiple URLs at once"}
                      </Button>

                      {showBulkInput && (
                        <div className="space-y-2 p-3 border rounded-lg bg-muted/30">
                          <Label className="text-sm">Bulk URL Paste (one URL per line)</Label>
                          <Textarea
                            value={bulkUrlInput}
                            onChange={(e) => setBulkUrlInput(e.target.value)}
                            placeholder={
                              "https://example.com/image1.jpg\nhttps://example.com/image2.jpg\nhttps://example.com/image3.jpg"
                            }
                            rows={5}
                            className="font-mono text-sm"
                          />
                          <Button type="button" onClick={handleAddBulkUrls} variant="secondary" size="sm">
                            Add All URLs
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">or upload files</span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="file-upload">Upload Images</Label>
                      <div className="mt-2">
                        <label
                          htmlFor="file-upload"
                          className="flex items-center justify-center w-full h-32 px-4 transition bg-background border-2 border-dashed rounded-lg appearance-none cursor-pointer hover:border-primary focus:outline-none"
                        >
                          <div className="flex flex-col items-center space-y-2">
                            {uploading ? (
                              <>
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                <span className="text-sm text-muted-foreground">Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-8 h-8 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Click to upload or drag and drop</span>
                                <span className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 5MB</span>
                              </>
                            )}
                          </div>
                          <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleFileUpload}
                            disabled={uploading}
                          />
                        </label>
                      </div>
                    </div>

                    {uploadedImages.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Current Images ({uploadedImages.length})</Label>
                          <span className="text-xs text-muted-foreground">
                            Drag or use arrows to reorder. First image is the main photo.
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                          {uploadedImages.map((image, index) => (
                            <div
                              key={image.url}
                              className={`relative group rounded-lg border-2 ${
                                index === 0 ? "border-primary bg-primary/5" : "border-border"
                              } p-2`}
                            >
                              <div
                                className={`absolute top-4 left-4 z-10 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                                  index === 0
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-background/90 text-foreground border"
                                }`}
                              >
                                <GripVertical className="w-3 h-3" />
                                {index === 0 ? "Main" : `#${index + 1}`}
                              </div>

                              <div className="relative aspect-video rounded-md overflow-hidden">
                                <Image
                                  src={image.url || "/placeholder.svg"}
                                  alt={`Image ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>

                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-1">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => moveImageUp(index)}
                                    disabled={index === 0}
                                    className="h-8 w-8 p-0"
                                    title="Move up"
                                  >
                                    <ChevronUp className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => moveImageDown(index)}
                                    disabled={index === uploadedImages.length - 1}
                                    className="h-8 w-8 p-0"
                                    title="Move down"
                                  >
                                    <ChevronDown className="w-4 h-4" />
                                  </Button>
                                  <Select
                                    value={index.toString()}
                                    onValueChange={(value) => moveImageToPosition(index, Number.parseInt(value))}
                                  >
                                    <SelectTrigger className="h-8 w-20">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {uploadedImages.map((_, i) => (
                                        <SelectItem key={i} value={i.toString()}>
                                          {i === 0 ? "Main" : `#${i + 1}`}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeUploadedImage(image.url)}
                                  className="h-8 w-8 p-0"
                                  title="Remove image"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>

                              <p className="text-xs text-muted-foreground mt-1 truncate">{image.filename}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Contact & Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact & Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="agent">Agent Name</Label>
                        <Input
                          id="agent"
                          value={formData.agent}
                          onChange={(e) => setFormData({ ...formData, agent: e.target.value })}
                          placeholder="e.g., John Mensah"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Contact Phone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g., +233 24 123 4567"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) => setFormData({ ...formData, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="sold">Sold</SelectItem>
                            <SelectItem value="rented">Rented</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2 pt-8">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="featured" className="cursor-pointer">
                          Featured Property
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Buttons */}
                <div className="flex gap-4">
                  <Button type="submit" disabled={saving || uploading} className="flex-1">
                    {saving ? "Saving Changes..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard/properties")}
                    disabled={saving || uploading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
