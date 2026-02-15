"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  DollarSign,
  Users,
  Zap,
  Upload,
  X,
  Phone,
  MessageCircle,
  Home,
  Building2,
  MapPin,
  Loader2,
} from "lucide-react"

const PROPERTY_TYPES = ["House", "Apartment", "Townhouse", "Studio", "Villa", "Land", "Commercial"]
const LISTING_TYPES = ["sale", "rent"]

const LOCATION_SUGGESTIONS = [
  "Cantonments",
  "East Legon",
  "Labone",
  "Dzorwulu",
  "Tse Addo",
  "Airport Residential",
  "North Ridge",
  "Roman Ridge",
  "Spintex",
  "Appolonia City",
  "East Legon Hills",
  "Ashaley Botwe",
  "Adenta",
  "Tema",
  "Osu",
  "Trasacco",
  "Kumasi",
  "Takoradi",
  "Achimota",
  "Kasoa",
]

const AMENITIES_OPTIONS = [
  "Swimming Pool",
  "Garden",
  "Garage",
  "Security",
  "Furnished",
  "Air Conditioning",
  "Boys Quarters",
  "CCTV",
  "Gym",
  "Solar Power",
]

interface UploadedImage {
  url: string
  filename: string
  uploading?: boolean
}

export default function ListPropertyPage() {
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  // Step 1: Property Details
  const [title, setTitle] = useState("")
  const [propertyType, setPropertyType] = useState("")
  const [listingType, setListingType] = useState("")
  const [price, setPrice] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [location, setLocation] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [address, setAddress] = useState("")
  const [description, setDescription] = useState("")

  // Step 2: Features
  const [bedrooms, setBedrooms] = useState(0)
  const [bathrooms, setBathrooms] = useState(0)
  const [area, setArea] = useState("")
  const [areaUnit, setAreaUnit] = useState("sqm")
  const [amenities, setAmenities] = useState<string[]>([])

  // Step 3: Images
  const [images, setImages] = useState<UploadedImage[]>([])
  const [uploading, setUploading] = useState(false)

  // Step 4: Contact Info
  const [contactName, setContactName] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [submitterType, setSubmitterType] = useState("Owner")

  const filteredSuggestions = LOCATION_SUGGESTIONS.filter((s) =>
    s.toLowerCase().includes(location.toLowerCase()),
  ).slice(0, 6)

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity],
    )
  }

  const handleImageUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    setUploading(true)

    for (const file of fileArray) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
      if (!allowedTypes.includes(file.type)) {
        setError(`${file.name} is not a valid image type. Use JPG, PNG, or WebP.`)
        continue
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`${file.name} is too large. Maximum size is 5MB.`)
        continue
      }

      setImages((prev) => {
        if (prev.length >= 15) return prev
        return [...prev, { url: "", filename: file.name, uploading: true }]
      })

      try {
        const formData = new FormData()
        formData.append("file", file)
        const res = await fetch("/api/upload-property-image", { method: "POST", body: formData })

        if (!res.ok) {
          const data = await res.json()
          setError(data.error || "Upload failed")
          setImages((prev) => prev.filter((img) => img.filename !== file.name || !img.uploading))
          continue
        }

        const data = await res.json()
        setImages((prev) =>
          prev.map((img) =>
            img.filename === file.name && img.uploading
              ? { url: data.url, filename: data.filename, uploading: false }
              : img,
          ),
        )
        setError("")
      } catch {
        setImages((prev) => prev.filter((img) => img.filename !== file.name || !img.uploading))
        setError("Failed to upload image. Please try again.")
      }
    }
    setUploading(false)
  }, [])

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      handleImageUpload(e.dataTransfer.files)
    },
    [handleImageUpload],
  )

  const validateStep = (s: number): boolean => {
    setError("")
    if (s === 1) {
      if (!title.trim()) { setError("Property title is required"); return false }
      if (!propertyType) { setError("Property type is required"); return false }
      if (!listingType) { setError("Listing type is required"); return false }
      if (!price || parseFloat(price) <= 0) { setError("Valid price is required"); return false }
      if (!location.trim()) { setError("Location is required"); return false }
      if (!description.trim() || description.trim().length < 50) {
        setError("Description must be at least 50 characters")
        return false
      }
    }
    if (s === 3) {
      const uploaded = images.filter((img) => !img.uploading && img.url)
      if (uploaded.length < 1) { setError("Please upload at least 1 image"); return false }
    }
    if (s === 4) {
      if (!contactName.trim()) { setError("Your name is required"); return false }
      if (!contactPhone.trim()) { setError("Phone number is required"); return false }
      if (!contactEmail.trim() || !contactEmail.includes("@")) {
        setError("Valid email is required")
        return false
      }
    }
    return true
  }

  const nextStep = () => {
    if (validateStep(step)) setStep(step + 1)
  }
  const prevStep = () => { setError(""); setStep(step - 1) }

  const handleSubmit = async () => {
    if (!validateStep(4)) return

    setSubmitting(true)
    setError("")

    try {
      const imageUrls = images.filter((img) => !img.uploading && img.url).map((img) => img.url)

      const res = await fetch("/api/submit-property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          property_type: propertyType,
          listing_type: listingType,
          price,
          location: location.trim(),
          description: description.trim(),
          bedrooms,
          bathrooms,
          area: area ? parseInt(area) : null,
          amenities,
          images: imageUrls,
          agent: contactName.trim(),
          phone: contactPhone.trim(),
          email: contactEmail.trim(),
          submitter_type: submitterType,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Submission failed")
        return
      }

      setSubmitted(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-teal-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Property Submitted!</h1>
          <p className="text-gray-600 mb-8">
            Your property has been submitted for review. Our team will review and publish it within 24 hours. We'll contact you if we need any additional details.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold transition"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
            <Link
              href="/list-property"
              onClick={() => window.location.reload()}
              className="text-teal-600 hover:text-teal-700 font-medium transition"
            >
              List another property
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 to-emerald-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-balance">List Your Property on Dwellot</h1>
          <p className="text-teal-100 text-lg">
            {"Reach thousands of buyers and renters across Ghana \u2014 it's free"}
          </p>
        </div>
      </section>

      {/* Why List With Us */}
      <section className="max-w-4xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: DollarSign, title: "Free to List", desc: "No listing fees for property owners" },
            { icon: Users, title: "Maximum Exposure", desc: "Seen by thousands of active searchers" },
            { icon: Zap, title: "Easy Process", desc: "List in under 5 minutes" },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <item.icon className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-10">
          {["Property Details", "Features", "Images", "Contact Info"].map((label, i) => {
            const stepNum = i + 1
            const isActive = step === stepNum
            const isDone = step > stepNum
            return (
              <div key={label} className="flex-1 flex flex-col items-center">
                <div className="flex items-center w-full">
                  {i > 0 && (
                    <div className={`flex-1 h-0.5 ${isDone ? "bg-teal-500" : "bg-gray-200"}`} />
                  )}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      isDone
                        ? "bg-teal-500 text-white"
                        : isActive
                          ? "bg-teal-600 text-white"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isDone ? <CheckCircle className="w-5 h-5" /> : stepNum}
                  </div>
                  {i < 3 && (
                    <div className={`flex-1 h-0.5 ${isDone ? "bg-teal-500" : "bg-gray-200"}`} />
                  )}
                </div>
                <span
                  className={`text-xs mt-2 hidden md:block ${isActive || isDone ? "text-teal-700 font-semibold" : "text-gray-400"}`}
                >
                  {label}
                </span>
              </div>
            )
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
          {/* Error Bar */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
              <X className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {/* Step 1: Property Details */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Property Details</h2>
              <p className="text-gray-500 text-sm mb-4">Tell us about your property</p>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Property Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 3 Bedroom House in East Legon"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-gray-900"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Property Type <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PROPERTY_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setPropertyType(type)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                          propertyType === type
                            ? "bg-teal-600 text-white border-teal-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-teal-400"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Listing Type <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    {LISTING_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setListingType(type)}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition capitalize ${
                          listingType === type
                            ? "bg-teal-600 text-white border-teal-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-teal-400"
                        }`}
                      >
                        For {type === "sale" ? "Sale" : "Rent"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      {currency === "USD" ? "$" : "GHS"}
                    </span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-gray-900"
                    />
                  </div>
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    {["USD", "GHS"].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCurrency(c)}
                        className={`px-4 py-2 text-sm font-medium transition ${
                          currency === c ? "bg-teal-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => { setLocation(e.target.value); setShowSuggestions(true) }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="e.g. East Legon, Accra"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-gray-900"
                  />
                </div>
                {showSuggestions && location && filteredSuggestions.length > 0 && (
                  <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredSuggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onMouseDown={() => { setLocation(s); setShowSuggestions(false) }}
                        className="w-full text-left px-4 py-2.5 hover:bg-teal-50 text-sm text-gray-700 transition"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Address (optional)</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address, neighbourhood"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your property in detail. Highlight key features, nearby amenities, and anything that makes it special..."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none text-gray-900"
                />
                <p className={`text-xs mt-1 ${description.length < 50 ? "text-gray-400" : "text-teal-600"}`}>
                  {description.length}/50 characters minimum
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Features */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Features</h2>
              <p className="text-gray-500 text-sm mb-4">Add property features and amenities</p>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bedrooms</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setBedrooms(Math.max(0, bedrooms - 1))}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg font-bold"
                    >
                      -
                    </button>
                    <span className="text-xl font-bold text-gray-900 w-8 text-center">{bedrooms}</span>
                    <button
                      type="button"
                      onClick={() => setBedrooms(Math.min(10, bedrooms + 1))}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bathrooms</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setBathrooms(Math.max(0, bathrooms - 1))}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg font-bold"
                    >
                      -
                    </button>
                    <span className="text-xl font-bold text-gray-900 w-8 text-center">{bathrooms}</span>
                    <button
                      type="button"
                      onClick={() => setBathrooms(Math.min(10, bathrooms + 1))}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Area</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="0"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-gray-900"
                  />
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    {["sqm", "sqft"].map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setAreaUnit(u)}
                        className={`px-4 py-2 text-sm font-medium transition ${
                          areaUnit === u ? "bg-teal-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Amenities</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {AMENITIES_OPTIONS.map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition text-left ${
                        amenities.includes(amenity)
                          ? "bg-teal-50 text-teal-700 border-teal-300"
                          : "bg-white text-gray-600 border-gray-200 hover:border-teal-300"
                      }`}
                    >
                      {amenities.includes(amenity) ? "+" : ""} {amenity}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Images */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Property Images</h2>
              <p className="text-gray-500 text-sm mb-4">
                Upload 1-15 images (JPG, PNG, or WebP, max 5MB each)
              </p>

              {/* Drop Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-teal-400 transition cursor-pointer"
                onClick={() => document.getElementById("file-input")?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") document.getElementById("file-input")?.click() }}
              >
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-700 font-medium mb-1">Drag and drop images here</p>
                <p className="text-gray-400 text-sm">or click to browse</p>
                <input
                  id="file-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={(e) => handleImageUpload(e.target.files)}
                />
              </div>

              {uploading && (
                <div className="flex items-center gap-2 text-teal-600 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading images...
                </div>
              )}

              {/* Thumbnails */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                      {img.uploading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
                        </div>
                      ) : (
                        <>
                          <Image
                            src={img.url}
                            alt={img.filename}
                            fill
                            className="object-cover"
                            sizes="120px"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <p className="text-sm text-gray-400">
                {images.filter((img) => !img.uploading).length} of 15 images uploaded
              </p>
            </div>
          )}

          {/* Step 4: Contact Info */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Your Contact Info</h2>
              <p className="text-gray-500 text-sm mb-4">How can interested parties reach you?</p>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone / WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. 020 123 4567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">You are</label>
                <div className="flex gap-3">
                  {["Owner", "Agent", "Developer"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSubmitterType(type)}
                      className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium border transition ${
                        submitterType === type
                          ? "bg-teal-600 text-white border-teal-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-teal-400"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Summary */}
              <div className="bg-gray-50 rounded-xl p-5 mt-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Submission Summary</h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-gray-500">Title:</span>
                  <span className="text-gray-900 font-medium">{title || "-"}</span>
                  <span className="text-gray-500">Type:</span>
                  <span className="text-gray-900">{propertyType || "-"} / For {listingType === "sale" ? "Sale" : "Rent"}</span>
                  <span className="text-gray-500">Price:</span>
                  <span className="text-gray-900">{currency} {price ? parseFloat(price).toLocaleString() : "-"}</span>
                  <span className="text-gray-500">Location:</span>
                  <span className="text-gray-900">{location || "-"}</span>
                  <span className="text-gray-500">Bedrooms:</span>
                  <span className="text-gray-900">{bedrooms}</span>
                  <span className="text-gray-500">Bathrooms:</span>
                  <span className="text-gray-900">{bathrooms}</span>
                  <span className="text-gray-500">Images:</span>
                  <span className="text-gray-900">{images.filter((i) => !i.uploading).length} uploaded</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-gray-600 hover:text-gray-900 font-medium transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold transition"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Submit Property for Review
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Need Help Section */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Need help listing?</h2>
          <p className="text-gray-500 mb-6">{"Chat with us and we'll list it for you"}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://wa.me/233201578429?text=${encodeURIComponent("Hi Dwellot! I need help listing my property. Can you assist?")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </a>
            <a
              href="tel:+233201578429"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
            >
              <Phone className="w-5 h-5" />
              Call: 020 157 8429
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
