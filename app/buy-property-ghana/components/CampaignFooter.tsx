import Link from "next/link"
import { Phone, Mail } from "lucide-react"

export default function CampaignFooter() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col items-center sm:items-start gap-1">
            <span className="text-xl font-bold text-white tracking-tight">Dwellot</span>
            <span className="text-xs">{"Ghana's #1 Property Marketplace"}</span>
          </div>

          {/* Contact */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
            <a
              href="tel:+233201578429"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone size={13} /> +233 20 157 8429
            </a>
            <a
              href="mailto:hello@dwellot.com"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail size={13} /> hello@dwellot.com
            </a>
          </div>

          {/* Legal */}
          <div className="flex items-center gap-4 text-xs">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
