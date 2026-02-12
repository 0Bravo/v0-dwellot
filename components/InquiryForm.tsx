"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, User, MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface InquiryFormProps {
  propertyId: number
  propertyTitle: string
}

export default function InquiryForm({ propertyId, propertyTitle }: InquiryFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `I'm interested in ${propertyTitle}. Please provide more information.`,
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
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          property_id: propertyId,
          ...formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit inquiry")
      }

      setSuccess(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit inquiry")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Agent</h3>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm mb-4">
          Your inquiry has been sent successfully! The agent will contact you soon.
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-400" />
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your@email.com"
            required
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
          <Label htmlFor="message" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-gray-400" />
            Message
          </Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Tell us about your requirements..."
            rows={4}
            required
            className="mt-1"
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sending...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Send className="h-4 w-4 mr-2" />
              Send Inquiry
            </div>
          )}
        </Button>
      </form>
    </div>
  )
}
