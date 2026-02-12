"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Upload, X, Loader2 } from "lucide-react"

interface PropertyImportFormProps {
  userId: string
}

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

export default function PropertyImportForm({ userId }: PropertyImportFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
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
    images: "",
    featured: false,
    status: "active",
    agent: "",
    phone: "",
  })

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

      // Reset file input
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const manualImages = formData.images
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url.length > 0)

      const allImages = [...uploadedImages.map((img) => img.url), ...manualImages]

      if (allImages.length === 0) {
        toast({
          title: "Error",
          description: "Please add at least one image",
          variant: "destructive",
        })
        setLoading(false)
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
        user_id: userId,
      }

      const response = await fetch("/api/properties/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(propertyData),
      })

      if (!response.ok) {
        throw new Error("Failed to create property")
      }

      toast({
        title: "Success",
        description: "Property has been added successfully",
      })

      router.push("/dashboard/properties")
      router.refresh()
    } catch (error) {
      console.error("Error creating property:", error)
      toast({
        title: "Error",
        description: "Failed to create property. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
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
                <p className="text-sm text-muted-foreground mt-2">Selected: {selectedAmenities.length} amenity(ies)</p>
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
                <Label>Uploaded Images ({uploadedImages.length})</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {uploadedImages.map((image, index) => (
                    <div key={image.url} className="relative group">
                      <div className="relative aspect-video rounded-lg overflow-hidden border">
                        <Image
                          src={image.url || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeUploadedImage(image.url)}
                        className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{image.filename}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="images">Additional Image URLs (optional, one per line)</Label>
              <Textarea
                id="images"
                value={formData.images}
                onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                placeholder={`/placeholder.svg?height=600&width=800&query=modern house in Accra Ghana
/placeholder.svg?height=600&width=800&query=luxury living room interior
/placeholder.svg?height=600&width=800&query=modern kitchen with island`}
                rows={6}
              />
              <p className="text-sm text-muted-foreground mt-2">
                You can add placeholder images with descriptive queries or provide your own image URLs
              </p>
            </div>
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
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
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
          <Button type="submit" disabled={loading || uploading} className="flex-1">
            {loading ? "Adding Property..." : "Add Property"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/properties")}
            disabled={loading || uploading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  )
}
