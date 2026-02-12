"use client"

import { X } from "lucide-react"
import ShareButtons from "./ShareButtons"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  url: string
  title: string
  description?: string
  imageUrl?: string
  onShare?: (platform: string) => void
}

export default function ShareModal({ isOpen, onClose, url, title, description, imageUrl, onShare }: ShareModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Share Property</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition" aria-label="Close">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Share this property with your network:</p>
          <p className="font-medium text-gray-900 truncate">{title}</p>
        </div>

        <ShareButtons
          url={url}
          title={title}
          description={description}
          imageUrl={imageUrl}
          onShare={(platform) => {
            onShare?.(platform)
            setTimeout(onClose, 1000)
          }}
        />
      </div>
    </div>
  )
}
