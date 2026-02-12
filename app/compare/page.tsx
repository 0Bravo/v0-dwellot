import { Suspense } from "react"
import ComparePageClient from "./ComparePageClient"

export default function ComparePage() {
  return (
    <Suspense fallback={<CompareLoading />}>
      <ComparePageClient />
    </Suspense>
  )
}

function CompareLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-4 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="h-40 bg-gray-200 rounded-lg"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
