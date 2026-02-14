import { Suspense } from "react"
import type { Metadata } from "next"
import AdminLoginForm from "./AdminLoginForm"

export const metadata: Metadata = {
  title: "Admin Login | Dwellot",
  description: "Secure admin login for Dwellot property management dashboard",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto" />
            <p className="text-gray-500 mt-4">Loading admin login...</p>
          </div>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  )
}
