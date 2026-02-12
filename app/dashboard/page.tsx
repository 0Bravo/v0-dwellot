"use client"

import { useAuth } from "@/lib/auth-context" // FIX: Correct import path
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link" // Added Link import for navigation

export default function DashboardPage() {
  const { user, loading } = useAuth() // FIX: Use your actual auth context
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before rendering
  useEffect(() => {
    setMounted(true)
  }, [])

  console.log("Dashboard - Auth state:", {
    user: !!user,
    loading,
    mounted,
  })

  useEffect(() => {
    // Redirect to auth page if not logged in and not loading
    if (mounted && !loading && !user) {
      console.log("Dashboard - No user, redirecting to /auth")
      router.push("/auth")
    }
  }, [user, loading, router, mounted])

  // Don't render anything until mounted (prevents hydration issues)
  if (!mounted) {
    return null
  }

  // Show loading state while auth is initializing
  if (loading) {
    console.log("Dashboard - Auth loading")
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // If no user and not loading, don't render (should redirect)
  if (!user) {
    console.log("Dashboard - No user and not loading, returning null")
    return null
  }

  console.log("Dashboard - Rendering dashboard for user:", user.email)

  // Simple dashboard for now - we'll enhance this later
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {user.email}!</p>

          <div className="mt-6 flex gap-4">
            <Link
              href="/dashboard/properties"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition"
            >
              Manage Properties
            </Link>
            <Link
              href="/admin/add-property"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition"
            >
              Add New Property
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/dashboard/properties"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition cursor-pointer"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">🏠</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Properties</dt>
                      <dd className="text-lg font-medium text-gray-900">0</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">💰</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Value</dt>
                      <dd className="text-lg font-medium text-gray-900">GH₵ 0</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard/inquiries"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition cursor-pointer"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">👥</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Inquiries</dt>
                      <dd className="text-lg font-medium text-gray-900">0</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
