"use client"

import Link from "next/link"
import { Home, Search, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-gray-600 text-lg">
            Sorry, we couldn't find the page you're looking for. The page might have been moved or doesn't exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <Link
            href="/properties"
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition"
          >
            <Search className="w-5 h-5" />
            Browse Properties
          </Link>
        </div>

        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Pages</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Link href="/properties" className="text-blue-600 hover:text-blue-700 transition">
              Properties
            </Link>
            <Link href="/agents" className="text-blue-600 hover:text-blue-700 transition">
              Agents
            </Link>
            <Link href="/about" className="text-blue-600 hover:text-blue-700 transition">
              About Us
            </Link>
            <Link href="/contact" className="text-blue-600 hover:text-blue-700 transition">
              Contact
            </Link>
            <Link href="/help" className="text-blue-600 hover:text-blue-700 transition">
              Help Center
            </Link>
            <Link href="/faq" className="text-blue-600 hover:text-blue-700 transition">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
