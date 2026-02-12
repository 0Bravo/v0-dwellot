"use client"

import { useState, useEffect } from "react"
import { X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Don't show if user previously dismissed
      const dismissed = localStorage.getItem("pwa-prompt-dismissed")
      if (!dismissed) {
        // Show prompt after 30 seconds
        setTimeout(() => {
          setShowPrompt(true)
        }, 30000)
      }
    }

    window.addEventListener("beforeinstallprompt", handler)

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowPrompt(false)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      console.log("[v0] User accepted PWA install")
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem("pwa-prompt-dismissed", "true")
  }

  if (!showPrompt || !deferredPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
            <Download className="w-6 h-6 text-teal-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1">Install Dwellot App</h3>
            <p className="text-sm text-gray-600 mb-3">
              Get quick access to properties. Install our app for a better experience!
            </p>
            <div className="flex gap-2">
              <Button onClick={handleInstall} className="bg-teal-600 hover:bg-teal-700 text-white" size="sm">
                Install
              </Button>
              <Button onClick={handleDismiss} variant="outline" size="sm">
                Not now
              </Button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
