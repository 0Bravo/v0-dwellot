"use client"

import { MessageCircle } from "lucide-react"
import { generateGeneralWhatsAppUrl } from "@/lib/utils/whatsapp"
import { trackLead } from "@/lib/facebook-pixel"

export default function WhatsAppFloatingButton() {
  const handleClick = () => {
    trackLead({
      content_name: "WhatsApp Floating Button",
      content_category: "general",
      value: 0,
      currency: "USD",
    })
  }

  return (
    <a
      href={generateGeneralWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label="Chat with Dwellot on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 pl-3 pr-4 py-3 rounded-full shadow-lg text-white font-semibold text-sm transition-transform hover:scale-105"
      style={{ backgroundColor: "#25D366" }}
    >
      <MessageCircle className="w-5 h-5" />
      <span className="hidden sm:inline">Chat with us</span>
    </a>
  )
}
