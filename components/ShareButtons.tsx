"use client"

import { Facebook, Twitter, Linkedin, Mail, MessageCircle, Link2, Check } from "lucide-react"
import { useState } from "react"

interface ShareButtonsProps {
  url: string
  title: string
  description?: string
  imageUrl?: string
  onShare?: (platform: string) => void
}

export default function ShareButtons({ url, title, description, imageUrl, onShare }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Check out this property on Dwellot:\n\n${title}\n${url}`)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this property: ${url}${description ? `\n\n${description}` : ""}`)}`,
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      onShare?.("clipboard")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const handleShare = (platform: string, link: string) => {
    window.open(link, "_blank", "width=600,height=400")
    onShare?.(platform)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleShare("facebook", shareLinks.facebook)}
        className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#1565c0] transition"
        title="Share on Facebook"
      >
        <Facebook className="w-4 h-4" />
        <span className="text-sm font-medium">Facebook</span>
      </button>

      <button
        onClick={() => handleShare("twitter", shareLinks.twitter)}
        className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a8cd8] transition"
        title="Share on Twitter"
      >
        <Twitter className="w-4 h-4" />
        <span className="text-sm font-medium">Twitter</span>
      </button>

      <button
        onClick={() => handleShare("linkedin", shareLinks.linkedin)}
        className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition"
        title="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
        <span className="text-sm font-medium">LinkedIn</span>
      </button>

      <button
        onClick={() => handleShare("whatsapp", shareLinks.whatsapp)}
        className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20ba5a] transition"
        title="Share on WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="text-sm font-medium">WhatsApp</span>
      </button>

      <a
        href={shareLinks.email}
        onClick={() => onShare?.("email")}
        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        title="Share via Email"
      >
        <Mail className="w-4 h-4" />
        <span className="text-sm font-medium">Email</span>
      </a>

      <button
        onClick={handleCopyLink}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        title="Copy link"
      >
        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Link2 className="w-4 h-4" />}
        <span className="text-sm font-medium">{copied ? "Copied!" : "Copy Link"}</span>
      </button>
    </div>
  )
}
