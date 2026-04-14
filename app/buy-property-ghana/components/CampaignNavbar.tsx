"use client"

import Link from "next/link"
import { MessageCircle } from "lucide-react"

const WHATSAPP_URL = "https://wa.me/233201578429"

export default function CampaignNavbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5">
          <span className="text-xl font-bold text-[#14b8a6] tracking-tight">Dwellot</span>
          <span className="hidden sm:inline text-xs font-medium text-gray-400 mt-0.5">
            Ghana&apos;s #1 Property Marketplace
          </span>
        </Link>

        {/* WhatsApp CTA */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-white border border-[#14b8a6] text-[#14b8a6] hover:bg-[#14b8a6] hover:text-white transition-colors px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm"
        >
          <MessageCircle size={15} />
          <span>WhatsApp Us</span>
        </a>
      </div>
    </nav>
  )
}
