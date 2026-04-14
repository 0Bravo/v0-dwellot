"use client"

import { MessageCircle } from "lucide-react"

const WHATSAPP_URL = "https://wa.me/233201578429"

export default function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105"
    >
      <MessageCircle size={26} />
    </a>
  )
}
