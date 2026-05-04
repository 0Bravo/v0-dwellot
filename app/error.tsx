"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCcw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[v0] Global error:", error)
    console.error("[v0] Error message:", error?.message)
    console.error("[v0] Error stack:", error?.stack)
    console.error("[v0] Error digest:", error?.digest)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong!</h2>
        <p className="text-gray-600 mb-4">
          We encountered an unexpected error while loading this page. Please try again or return to the homepage.
        </p>

        {(error?.message || error?.digest) && (
          <div className="mb-6 text-left bg-red-50 border border-red-200 rounded-lg p-4 overflow-auto max-h-64">
            <p className="text-xs font-bold text-red-900 mb-1">Error details (for debugging):</p>
            {error?.message && (
              <p className="text-xs font-mono text-red-800 break-words whitespace-pre-wrap">{error.message}</p>
            )}
            {error?.digest && (
              <p className="text-xs font-mono text-red-700 mt-2">Digest: {error.digest}</p>
            )}
            {error?.stack && (
              <details className="mt-2">
                <summary className="text-xs font-bold text-red-900 cursor-pointer">Stack trace</summary>
                <pre className="text-[10px] font-mono text-red-800 mt-1 whitespace-pre-wrap break-words">{error.stack}</pre>
              </details>
            )}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => reset()}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <RefreshCcw className="w-5 h-5" />
            Try Again
          </button>
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
