"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, MessageSquare, Send, CheckCircle, AlertCircle, Clock } from "lucide-react"

const SUBJECT_OPTIONS = [
  "General Enquiry",
  "Property Listing",
  "Agent Partnership",
  "Technical Support",
  "Billing & Payments",
  "Report a Problem",
  "Feedback & Suggestions",
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("submitting")
    setErrorMessage("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || "Something went wrong.")
        setStatus("error")
        return
      }

      setStatus("success")
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.")
      setStatus("error")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">Contact Us</h1>
            <p className="text-xl text-gray-600">
              {"Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                {status === "success" ? (
                  <div className="text-center py-12">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-7 h-7 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Message Sent Successfully</h3>
                    <p className="text-gray-600 text-sm mb-6">
                      {"Thank you for reaching out. Our team will review your message and get back to you within 24 hours."}
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="px-5 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition text-sm"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {status === "error" && (
                      <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <p className="text-red-700 text-sm">{errorMessage}</p>
                      </div>
                    )}

                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition text-sm text-gray-900 placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition text-sm text-gray-900 placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+233 XX XXX XXXX"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition text-sm text-gray-900 placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition text-sm text-gray-900 bg-white"
                      >
                        <option value="">Select a subject</option>
                        {SUBJECT_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help you..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition text-sm text-gray-900 placeholder:text-gray-400 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                    >
                      {status === "submitting" ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ghana Office</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-teal-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Address</p>
                      <p className="text-gray-600 text-sm">Accra, Ghana</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-teal-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Phone</p>
                      <a href="tel:+233201578429" className="text-teal-600 hover:underline text-sm block">020 157 8429</a>
                      <a href="tel:+233552599185" className="text-teal-600 hover:underline text-sm block">055 259 9185</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-teal-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <a href="mailto:support@dwellot.com" className="text-teal-600 hover:underline text-sm">support@dwellot.com</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">WhatsApp</p>
                      <a
                        href={`https://wa.me/233201578429?text=${encodeURIComponent("Hi Dwellot! I'd like to get in touch with your team.")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline text-sm"
                      >
                        Chat with us instantly
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>UK Office</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-teal-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Address</p>
                      <p className="text-gray-600 text-sm">86-90 Paul Street, London EC2A 4NE</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-teal-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Phone</p>
                      <a href="tel:+447861932209" className="text-teal-600 hover:underline text-sm">+44 7861 932209</a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-teal-600" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monday - Friday:</span>
                      <span className="font-semibold text-gray-900">8:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saturday:</span>
                      <span className="font-semibold text-gray-900">9:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sunday:</span>
                      <span className="font-semibold text-gray-900">Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/faq" className="text-teal-600 hover:underline">Frequently Asked Questions</Link></li>
                  <li><Link href="/help" className="text-teal-600 hover:underline">Help Centre</Link></li>
                  <li><Link href="/agent-collection-form" className="text-teal-600 hover:underline">Become an Agent</Link></li>
                  <li><Link href="/properties" className="text-teal-600 hover:underline">Browse Properties</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
