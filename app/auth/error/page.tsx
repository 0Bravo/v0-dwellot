"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Suspense } from "react"

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") || "An unknown error occurred"
  const errorDescription =
    searchParams.get("error_description") || "Please try again or contact support if the problem persists."

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
        </div>

        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Authentication Error</h2>
        <p className="mt-2 text-center text-sm text-gray-600">Something went wrong</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <h3 className="text-sm font-medium text-red-800 mb-2">{error}</h3>
              <p className="text-sm text-red-700">{errorDescription}</p>
            </div>
            <Link
              href="/auth"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  )
}
