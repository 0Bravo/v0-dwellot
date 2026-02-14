"use client"

import { useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Save, X, Plus, Trash2, Loader2 } from "lucide-react"

const PROPERTY_TYPES = ["House", "Apartment", "Townhouse", "Villa", "Duplex", "Penthouse", "Studio", "Land", "Commercial", "Office"]
const LISTING_TYPES = ["sale", "rent"]
const STATUS_OPTIONS = ["active", "pending", "sold", "rented", "draft"]
const REGIONS = ["Greater Accra", "Ashanti", "Central", "Eastern", "Western", "Northern", "Volta", "Upper East", "Upper West", "Bono", "Bono East", "Ahafo", "Western North", "Oti", "North East", "Savannah"]
const FURNISHED_OPTIONS = ["Furnished", "Semi-Furnished", "Unfurnished"]
const CURRENCIES = ["USD", "GHS", "EUR", "GBP"]
const COMMON_AMENITIES = ["Swimming Pool", "Garden", "Garage", "Security", "CCTV", "Gym", "Playground", "Tennis Court", "Balcony", "Terrace", "Elevator", "Generator", "Borehole", "Air Conditioning", "Solar Panel", "Smart Home", "Gated Community", "Boys Quarters", "Store Room", "Laundry Room"]

interface PropertyFormProps {
  initialData?: Record<string, unknown>
  mode: "create" | "edit"
}

export default function PropertyForm({ initialData, mode }: PropertyFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState("basic")

  const [form, setForm] = useState({
    title: (initialData?.title as string) || "",
    description: (initialData?.description as string) || "",
    property_type: (initialData?.property_type as string) || "House",
    listing_type: (initialData?.listing_type as string) || "sale",
    status: (initialData?.status as string) || "active",
    price: (initialData?.price as string) || "",
    currency: (initialData?.currency as string) || "USD",
    negotiable: initialData?.negotiable !== false,
    payment_plans: (initialData?.payment_plans as string) || "",
    location: (initialData?.location as string) || "",
    address: (initialData?.address as string) || "",
    region: (initialData?.region as string) || "Greater Accra",
    estate_name: (initialData?.estate_name as string) || "",
    bedrooms: (initialData?.bedrooms as number) || 0,
    bathrooms: (initialData?.bathrooms as number) || 0,
    area: (initialData?.area as number) || 0,
    parking_spaces: (initialData?.parking_spaces as number) || 0,
    floors: (initialData?.floors as number) || 1,
    plot_size: (initialData?.plot_size as string) || "",
    year_built: (initialData?.year_built as number) || null,
    furnished: (initialData?.furnished as string) || "",
    developer: (initialData?.developer as string) || "",
    featured: (initialData?.featured as boolean) || false,
    agent: (initialData?.agent as string) || "",
    agent_name: (initialData?.agent_name as string) || "",
    agent_phone: (initialData?.agent_phone as string) || "",
    agent_whatsapp: (initialData?.agent_whatsapp as string) || "",
    agent_email: (initialData?.agent_email as string) || "",
    agent_company: (initialData?.agent_company as string) || "",
    latitude: (initialData?.latitude as string) || "",
    longitude: (initialData?.longitude as string) || "",
  })

  const [images, setImages] = useState<string[]>((initialData?.images as string[]) || [])
  const [newImageUrl, setNewImageUrl] = useState("")
  const [amenities, setAmenities] = useState<string[]>((initialData?.amenities as string[]) || [])

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "details", label: "Details" },
    { id: "location", label: "Location" },
    { id: "media", label: "Images" },
    { id: "agent", label: "Agent" },
    { id: "pricing", label: "Pricing" },
  ]

  function updateForm(key: string, value: unknown) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function addImage() {
    if (newImageUrl.trim()) {
      setImages(prev => [...prev, newImageUrl.trim()])
      setNewImageUrl("")
    }
  }

  function removeImage(index: number) {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  function toggleAmenity(amenity: string) {
    setAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    const supabase = createBrowserClient()
    if (!supabase) {
      setError("Database connection not available")
      setLoading(false)
      return
    }

    const slug = form.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const propertyData = {
      title: form.title,
      description: form.description || null,
      property_type: form.property_type,
      listing_type: form.listing_type,
      status: form.status,
      price: parseFloat(form.price as string) || 0,
      currency: form.currency,
      negotiable: form.negotiable,
      payment_plans: form.payment_plans || null,
      location: form.location,
      address: form.address || null,
      region: form.region,
      estate_name: form.estate_name || null,
      bedrooms: form.bedrooms,
      bathrooms: form.bathrooms,
      area: form.area,
      parking_spaces: form.parking_spaces,
      floors: form.floors,
      plot_size: form.plot_size ? parseFloat(form.plot_size as string) : null,
      year_built: form.year_built || null,
      furnished: form.furnished || null,
      developer: form.developer || null,
      featured: form.featured,
      agent: form.agent || null,
      agent_name: form.agent_name || null,
      agent_phone: form.agent_phone || null,
      agent_whatsapp: form.agent_whatsapp || null,
      agent_email: form.agent_email || null,
      agent_company: form.agent_company || null,
      latitude: form.latitude ? parseFloat(form.latitude as string) : null,
      longitude: form.longitude ? parseFloat(form.longitude as string) : null,
      images,
      amenities,
      slug,
      updated_at: new Date().toISOString(),
    }

    try {
      if (mode === "create") {
        const { error: insertError } = await supabase
          .from("properties")
          .insert(propertyData)
        if (insertError) throw insertError
        setSuccess("Property created successfully!")
        setTimeout(() => router.push("/dashboard/properties"), 1500)
      } else {
        const { error: updateError } = await supabase
          .from("properties")
          .update(propertyData)
          .eq("id", initialData?.id)
        if (updateError) throw updateError
        setSuccess("Property updated successfully!")
        setTimeout(() => router.push("/dashboard/properties"), 1500)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-x-1 overflow-x-auto" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-teal-600 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Error / Success */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>
      )}

      {/* Basic Info Tab */}
      {activeTab === "basic" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className={labelClass}>Title *</label>
            <input type="text" required value={form.title} onChange={e => updateForm("title", e.target.value)} className={inputClass} placeholder="e.g. Luxury 3 Bedroom Villa in East Legon" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea rows={5} value={form.description} onChange={e => updateForm("description", e.target.value)} className={inputClass} placeholder="Detailed property description..." />
          </div>
          <div>
            <label className={labelClass}>Property Type *</label>
            <select value={form.property_type} onChange={e => updateForm("property_type", e.target.value)} className={inputClass}>
              {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Listing Type *</label>
            <select value={form.listing_type} onChange={e => updateForm("listing_type", e.target.value)} className={inputClass}>
              {LISTING_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select value={form.status} onChange={e => updateForm("status", e.target.value)} className={inputClass}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Developer</label>
            <input type="text" value={form.developer} onChange={e => updateForm("developer", e.target.value)} className={inputClass} placeholder="Developer name" />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="featured" checked={form.featured} onChange={e => updateForm("featured", e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">Featured Property</label>
          </div>
        </div>
      )}

      {/* Details Tab */}
      {activeTab === "details" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Bedrooms</label>
              <input type="number" min={0} value={form.bedrooms} onChange={e => updateForm("bedrooms", parseInt(e.target.value) || 0)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Bathrooms</label>
              <input type="number" min={0} value={form.bathrooms} onChange={e => updateForm("bathrooms", parseInt(e.target.value) || 0)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Area (sqm)</label>
              <input type="number" min={0} value={form.area} onChange={e => updateForm("area", parseInt(e.target.value) || 0)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Parking Spaces</label>
              <input type="number" min={0} value={form.parking_spaces} onChange={e => updateForm("parking_spaces", parseInt(e.target.value) || 0)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Floors</label>
              <input type="number" min={1} value={form.floors} onChange={e => updateForm("floors", parseInt(e.target.value) || 1)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Plot Size (sqm)</label>
              <input type="text" value={form.plot_size} onChange={e => updateForm("plot_size", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Year Built</label>
              <input type="number" min={1900} max={2030} value={form.year_built || ""} onChange={e => updateForm("year_built", parseInt(e.target.value) || null)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Furnished</label>
              <select value={form.furnished} onChange={e => updateForm("furnished", e.target.value)} className={inputClass}>
                <option value="">Select...</option>
                {FURNISHED_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className={labelClass}>Amenities</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {COMMON_AMENITIES.map(amenity => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    amenities.includes(amenity)
                      ? "bg-teal-100 border-teal-300 text-teal-800"
                      : "bg-white border-gray-300 text-gray-600 hover:border-teal-300"
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Location Tab */}
      {activeTab === "location" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className={labelClass}>Location *</label>
            <input type="text" required value={form.location} onChange={e => updateForm("location", e.target.value)} className={inputClass} placeholder="e.g. East Legon, Accra" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Full Address</label>
            <input type="text" value={form.address} onChange={e => updateForm("address", e.target.value)} className={inputClass} placeholder="Full street address" />
          </div>
          <div>
            <label className={labelClass}>Region</label>
            <select value={form.region} onChange={e => updateForm("region", e.target.value)} className={inputClass}>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Estate Name</label>
            <input type="text" value={form.estate_name} onChange={e => updateForm("estate_name", e.target.value)} className={inputClass} placeholder="e.g. Trasacco Valley" />
          </div>
          <div>
            <label className={labelClass}>Latitude</label>
            <input type="text" value={form.latitude} onChange={e => updateForm("latitude", e.target.value)} className={inputClass} placeholder="5.6037" />
          </div>
          <div>
            <label className={labelClass}>Longitude</label>
            <input type="text" value={form.longitude} onChange={e => updateForm("longitude", e.target.value)} className={inputClass} placeholder="-0.1870" />
          </div>
        </div>
      )}

      {/* Media Tab */}
      {activeTab === "media" && (
        <div className="space-y-4">
          <label className={labelClass}>Property Images</label>
          <div className="flex gap-2">
            <input type="text" value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} className={`${inputClass} flex-1`} placeholder="Paste image URL..." onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addImage() } }} />
            <button type="button" onClick={addImage} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200">
                  <img src={img} alt={`Property image ${i + 1}`} className="w-full h-32 object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="h-3 w-3" />
                  </button>
                  {i === 0 && <span className="absolute bottom-2 left-2 bg-teal-600 text-white text-xs px-2 py-0.5 rounded">Cover</span>}
                </div>
              ))}
            </div>
          )}
          {images.length === 0 && <p className="text-sm text-gray-500">No images added yet. Paste image URLs above.</p>}
        </div>
      )}

      {/* Agent Tab */}
      {activeTab === "agent" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Agent Username</label>
            <input type="text" value={form.agent} onChange={e => updateForm("agent", e.target.value)} className={inputClass} placeholder="e.g. rudolf2mf" />
          </div>
          <div>
            <label className={labelClass}>Agent Name</label>
            <input type="text" value={form.agent_name} onChange={e => updateForm("agent_name", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Agent Phone</label>
            <input type="tel" value={form.agent_phone} onChange={e => updateForm("agent_phone", e.target.value)} className={inputClass} placeholder="+233..." />
          </div>
          <div>
            <label className={labelClass}>Agent WhatsApp</label>
            <input type="tel" value={form.agent_whatsapp} onChange={e => updateForm("agent_whatsapp", e.target.value)} className={inputClass} placeholder="+233..." />
          </div>
          <div>
            <label className={labelClass}>Agent Email</label>
            <input type="email" value={form.agent_email} onChange={e => updateForm("agent_email", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Agent Company</label>
            <input type="text" value={form.agent_company} onChange={e => updateForm("agent_company", e.target.value)} className={inputClass} />
          </div>
        </div>
      )}

      {/* Pricing Tab */}
      {activeTab === "pricing" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Price *</label>
            <input type="number" required min={0} step="0.01" value={form.price} onChange={e => updateForm("price", e.target.value)} className={inputClass} placeholder="290000" />
          </div>
          <div>
            <label className={labelClass}>Currency</label>
            <select value={form.currency} onChange={e => updateForm("currency", e.target.value)} className={inputClass}>
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="negotiable" checked={form.negotiable} onChange={e => updateForm("negotiable", e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
            <label htmlFor="negotiable" className="text-sm font-medium text-gray-700">Price is Negotiable</label>
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Payment Plans</label>
            <textarea rows={3} value={form.payment_plans} onChange={e => updateForm("payment_plans", e.target.value)} className={inputClass} placeholder="Describe available payment plans..." />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button type="button" onClick={() => router.push("/dashboard/properties")} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <X className="h-4 w-4" /> Cancel
        </button>
        <button type="submit" disabled={loading} className="px-6 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {mode === "create" ? "Create Property" : "Update Property"}
        </button>
      </div>
    </form>
  )
}
