"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, Phone, FileText, Shield, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  bio: string | null
  avatar_url: string | null
  role: string
  is_verified: boolean
  created_at: string
}

interface ProfileFormProps {
  initialProfile: Profile | null
  userEmail: string
}

export default function ProfileForm({ initialProfile, userEmail }: ProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    full_name: initialProfile?.full_name || "",
    phone: initialProfile?.phone || "",
    bio: initialProfile?.bio || "",
    avatar_url: initialProfile?.avatar_url || "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError(null)
    setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile")
      }

      setSuccess(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "agent":
        return "bg-blue-100 text-blue-800"
      case "seller":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">{error}</div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm flex items-center">
          <CheckCircle className="h-4 w-4 mr-2" />
          Profile updated successfully!
        </div>
      )}

      {/* Account Info */}
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Account Information</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              Email Address
            </Label>
            <Input id="email" type="email" value={userEmail} disabled className="mt-1 bg-gray-50" />
            <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-400" />
              Role
            </Label>
            <div className="mt-1">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(initialProfile?.role || "buyer")}`}
              >
                {initialProfile?.role || "buyer"}
              </span>
              {initialProfile?.is_verified && (
                <span className="ml-2 inline-flex items-center text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Profile Details</h2>

        <div>
          <Label htmlFor="full_name" className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            Full Name
          </Label>
          <Input
            id="full_name"
            name="full_name"
            type="text"
            value={formData.full_name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-400" />
            Phone Number
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+233 XX XXX XXXX"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="bio" className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-400" />
            Bio
          </Label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Tell us about yourself..."
            rows={4}
            className="mt-1"
          />
          <p className="mt-1 text-xs text-gray-500">
            {initialProfile?.role === "agent" && "This will be displayed on your agent profile"}
          </p>
        </div>

        <div>
          <Label htmlFor="avatar_url">Avatar URL</Label>
          <Input
            id="avatar_url"
            name="avatar_url"
            type="url"
            value={formData.avatar_url}
            onChange={handleInputChange}
            placeholder="https://example.com/avatar.jpg"
            className="mt-1"
          />
          <p className="mt-1 text-xs text-gray-500">Enter a URL to your profile picture</p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button type="submit" disabled={isLoading} className="px-6">
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </div>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  )
}
