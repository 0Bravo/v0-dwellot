import { PropertyCardSkeleton } from "@/components/LoadingSkeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="animate-pulse">
        {/* Hero Skeleton */}
        <div className="relative h-[600px] bg-gray-200">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-4xl px-4">
              <div className="h-16 bg-gray-300 rounded w-3/4 mx-auto mb-6"></div>
              <div className="h-8 bg-gray-300 rounded w-2/3 mx-auto mb-8"></div>
              <div className="h-14 bg-gray-300 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Featured Properties Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="h-10 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
