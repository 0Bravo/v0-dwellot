"use client"
import { useState, useEffect, useMemo, useRef } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import {
  Plus,
  Home,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Calendar,
  Trash2,
  Edit,
  Tag,
  Loader2,
  ImageIcon,
  Building2,
  ChevronDown,
  ChevronRight,
  Users,
  Upload,
  X,
  ChevronUp,
  GripVertical,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"

interface Property {
  id: number
  title: string
  location: string
  price: number
  bedrooms: number
  bathrooms: number
  area: number
  property_type: string
  listing_type: string
  status: string
  amenities: string[]
  images: string[]
  created_at: string
  agent: string | null
}

interface GroupedProperties {
  [agent: string]: Property[]
}

interface UploadedImage {
  url: string
  filename: string
}

export default function PropertyManagementDashboard() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedAgents, setExpandedAgents] = useState<Set<string>>(new Set())

  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [imageUrlInput, setImageUrlInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchProperties()
    }
  }, [user])

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/properties/manage", { cache: "no-store" })
      const data = await response.json()

      if (response.ok) {
        setProperties(data.properties || [])
        const agents = new Set<string>()
        ;(data.properties || []).forEach((p: Property) => {
          agents.add(p.agent || "Unknown Agent")
        })
        setExpandedAgents(agents)
      } else {
        console.error("Failed to fetch properties:", data.error)
      }
    } catch (error) {
      console.error("Error fetching properties:", error)
    } finally {
      setLoading(false)
    }
  }

  const openImageModal = (property: Property) => {
    setSelectedProperty(property)
    setUploadedImages(
      (property.images || []).map((url) => ({
        url,
        filename: url.split("/").pop() || "image",
      })),
    )
    setImageModalOpen(true)
  }

  const closeImageModal = () => {
    setImageModalOpen(false)
    setSelectedProperty(null)
    setUploadedImages([])
    setImageUrlInput("")
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

      e.target.value = ""
    } catch (error) {
      console.error("Upload error:", error)
      alert(error instanceof Error ? error.message : "Failed to upload images")
    } finally {
      setUploading(false)
    }
  }

  const handleAddImageUrl = () => {
    const url = imageUrlInput.trim()
    if (!url) return

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      alert("Please enter a valid URL starting with http:// or https://")
      return
    }

    if (uploadedImages.some((img) => img.url === url)) {
      alert("This image URL has already been added")
      return
    }

    const filename = url.split("/").pop()?.split("?")[0] || "image"
    setUploadedImages((prev) => [...prev, { url, filename }])
    setImageUrlInput("")
  }

  const removeImage = (url: string) => {
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

  const saveImages = async () => {
    if (!selectedProperty) return

    setSaving(true)
    try {
      const response = await fetch(`/api/properties/manage/${selectedProperty.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: uploadedImages.map((img) => img.url),
        }),
      })

      if (response.ok) {
        // Update local state
        setProperties((prev) =>
          prev.map((p) => (p.id === selectedProperty.id ? { ...p, images: uploadedImages.map((img) => img.url) } : p)),
        )
        closeImageModal()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to save images")
      }
    } catch (error) {
      console.error("Save error:", error)
      alert("Failed to save images")
    } finally {
      setSaving(false)
    }
  }

  const groupedProperties = useMemo(() => {
    const groups: GroupedProperties = {}
    properties.forEach((property) => {
      const agentName = property.agent || "Unknown Agent"
      if (!groups[agentName]) {
        groups[agentName] = []
      }
      groups[agentName].push(property)
    })
    const sortedGroups: GroupedProperties = {}
    Object.keys(groups)
      .sort()
      .forEach((key) => {
        sortedGroups[key] = groups[key]
      })
    return sortedGroups
  }, [properties])

  const toggleAgent = (agent: string) => {
    setExpandedAgents((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(agent)) {
        newSet.delete(agent)
      } else {
        newSet.add(agent)
      }
      return newSet
    })
  }

  const expandAll = () => {
    const allAgents = new Set(Object.keys(groupedProperties))
    setExpandedAgents(allAgents)
  }

  const collapseAll = () => {
    setExpandedAgents(new Set())
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this property?")) {
      return
    }

    try {
      const response = await fetch(`/api/properties/manage/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchProperties()
      }
    } catch (error) {
      console.error("Error deleting property:", error)
      alert("Failed to delete property")
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const agentCount = Object.keys(groupedProperties).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-t-4 border-green-600">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-lg">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Property Manager</h1>
              </div>
              <p className="text-gray-600">Manage your property listings</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/admin/add-property")}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center gap-2 font-medium shadow-md"
              >
                <Plus size={20} />
                Add New Property
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Properties ({properties.length})</h2>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  {agentCount} Agent{agentCount !== 1 ? "s" : ""}
                </span>
                <span>Total Value: {formatCurrency(properties.reduce((sum, p) => sum + p.price, 0))}</span>
              </div>
            </div>
            {properties.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={expandAll}
                  className="text-sm text-green-600 hover:text-green-700 px-3 py-1 rounded border border-green-200 hover:bg-green-50 transition"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="text-sm text-gray-600 hover:text-gray-700 px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 transition"
                >
                  Collapse All
                </button>
              </div>
            )}
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Home size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No properties yet</p>
              <p className="text-sm mt-2">Start adding properties to your portfolio!</p>
              <button
                onClick={() => router.push("/admin/add-property")}
                className="mt-4 text-green-600 hover:text-green-700 font-medium flex items-center justify-center gap-2 mx-auto"
              >
                <Plus size={16} />
                Add your first property
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedProperties).map(([agent, agentProperties]) => (
                <div key={agent} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleAgent(agent)}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white hover:from-green-50 hover:to-white transition"
                  >
                    <div className="flex items-center gap-3">
                      {expandedAgents.has(agent) ? (
                        <ChevronDown size={20} className="text-gray-500" />
                      ) : (
                        <ChevronRight size={20} className="text-gray-500" />
                      )}
                      <Building2 size={20} className="text-green-600" />
                      <span className="font-semibold text-gray-900">{agent}</span>
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        {agentProperties.length} propert{agentProperties.length !== 1 ? "ies" : "y"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatCurrency(agentProperties.reduce((sum, p) => sum + p.price, 0))}
                    </div>
                  </button>

                  {expandedAgents.has(agent) && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {agentProperties.map((property) => (
                          <div
                            key={property.id}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-green-300 transition"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h3 className="text-base font-bold text-gray-900">{property.title}</h3>
                                <p className="text-gray-600 flex items-center gap-1 mt-1 text-sm">
                                  <MapPin size={14} />
                                  {property.location}
                                </p>
                              </div>
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                                  property.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {property.status}
                              </span>
                            </div>

                            {property.images && property.images.length > 0 ? (
                              <div className="mb-3 h-36 relative rounded-lg overflow-hidden bg-gray-100">
                                <img
                                  src={property.images[0] || "/placeholder.svg"}
                                  alt={property.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                  <ImageIcon size={12} />
                                  {property.images.length}
                                </div>
                              </div>
                            ) : (
                              <div
                                onClick={() => openImageModal(property)}
                                className="mb-3 h-36 relative rounded-lg overflow-hidden bg-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition border-2 border-dashed border-gray-300"
                              >
                                <Upload size={24} className="text-gray-400 mb-2" />
                                <span className="text-sm text-gray-500">Click to add images</span>
                              </div>
                            )}

                            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                              <div className="flex items-center gap-2 text-gray-700">
                                <DollarSign size={14} className="text-green-600" />
                                <span className="font-bold text-green-700">{formatCurrency(property.price)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <Tag size={12} className="text-gray-500" />
                                <span className="text-xs">{property.property_type}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <Bed size={12} className="text-gray-500" />
                                <span className="text-xs">{property.bedrooms} Beds</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <Bath size={12} className="text-gray-500" />
                                <span className="text-xs">{property.bathrooms} Baths</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 pt-2 border-t border-gray-100">
                              <Calendar size={12} />
                              <span>Listed {new Date(property.created_at).toLocaleDateString()}</span>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => openImageModal(property)}
                                className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-2 font-medium text-sm"
                              >
                                <ImageIcon size={14} />
                                Images
                              </button>
                              <button
                                onClick={() => router.push(`/dashboard/properties/edit/${property.id}`)}
                                className="flex-1 bg-green-50 text-green-700 px-3 py-2 rounded-lg hover:bg-green-100 transition flex items-center justify-center gap-2 font-medium text-sm"
                              >
                                <Edit size={14} />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(property.id)}
                                className="flex-1 bg-red-50 text-red-700 px-3 py-2 rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-2 font-medium text-sm"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {imageModalOpen && selectedProperty && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Manage Images</h2>
                <p className="text-sm text-gray-600">{selectedProperty.title}</p>
              </div>
              <button onClick={closeImageModal} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* URL Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddImageUrl()}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <button
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Files</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center w-full h-32 px-4 transition bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-400 hover:bg-green-50"
                >
                  <div className="flex flex-col items-center space-y-2">
                    {uploading ? (
                      <>
                        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                        <span className="text-sm text-gray-600">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-sm text-gray-600">Click to upload or drag and drop</span>
                        <span className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</span>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </div>
              </div>

              {/* Image Grid */}
              {uploadedImages.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Images ({uploadedImages.length})</label>
                    <span className="text-xs text-gray-500">First image is the main photo</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div
                        key={image.url}
                        className={`relative rounded-lg border-2 ${
                          index === 0 ? "border-green-500 bg-green-50" : "border-gray-200"
                        } p-2`}
                      >
                        <div
                          className={`absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                            index === 0 ? "bg-green-600 text-white" : "bg-white/90 text-gray-700 border"
                          }`}
                        >
                          <GripVertical className="w-3 h-3" />
                          {index === 0 ? "Main" : `#${index + 1}`}
                        </div>

                        <div className="relative aspect-video rounded overflow-hidden bg-gray-100">
                          <Image
                            src={image.url || "/placeholder.svg"}
                            alt={`Image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => moveImageUp(index)}
                              disabled={index === 0}
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Move up"
                            >
                              <ChevronUp size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveImageDown(index)}
                              disabled={index === uploadedImages.length - 1}
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Move down"
                            >
                              <ChevronDown size={16} />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(image.url)}
                            className="p-1 rounded text-red-600 hover:bg-red-50"
                            title="Remove"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {uploadedImages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon size={48} className="mx-auto mb-2 opacity-30" />
                  <p>No images yet. Upload files or paste URLs above.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                onClick={closeImageModal}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={saveImages}
                disabled={saving}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Images"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
