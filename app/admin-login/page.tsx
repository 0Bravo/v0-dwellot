import { Suspense } from "react"
import AdminLoginForm from "./AdminLoginForm"

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  )
}
