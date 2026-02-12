"use client"

import { AlertTriangle, RefreshCcw } from "lucide-react"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Error</h2>
            <p className="text-gray-600 mb-6">
              A critical error occurred. Please refresh the page or contact support if the problem persists.
            </p>
            <button
              onClick={() => reset()}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              <RefreshCcw className="w-5 h-5" />
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
