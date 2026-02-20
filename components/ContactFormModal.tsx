"use client"

import type React from "react"
import { useState } from "react"
import { analytics, trackInquirySent } from "@/lib/analytics"

interface ContactFormModalProps {
  propertyId: string
  propertyTitle: string
  agentId?: string
  onClose: () => void
}

export default function ContactFormModal({ propertyId, propertyTitle, agentId, onClose }: ContactFormModalProps) {
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" })
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus("loading")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Contact form submitted:", {
        ...contactForm,
        propertyId,
        propertyTitle,
        agentId,
      })

      analytics.trackInquiry(propertyId, propertyTitle, "contact_form")
      trackInquirySent({
        property_id: propertyId,
      })

      onClose()
      setContactForm({ name: "", email: "", phone: "", message: "" })

      setSubmitStatus("success")
      alert("Message sent successfully! The agent will contact you soon.")
    } catch {
      console.error("Error sending message")
      setSubmitStatus("error")
      alert("Failed to send message. Please try again.")
    } finally {
      setSubmitStatus("idle")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Contact Agent</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <input
              type="text"
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
            <input
              type="email"
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={contactForm.phone}
              onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+233 XX XXX XXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
            <textarea
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={`Hi, I'm interested in ${propertyTitle}. Could you please provide more information?`}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              disabled={submitStatus === "loading"}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              disabled={submitStatus === "loading"}
            >
              {submitStatus === "loading" ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
