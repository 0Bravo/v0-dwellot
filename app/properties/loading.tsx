export default function PropertiesLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-8 bg-gray-200 rounded w-32 animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Skeleton */}
          <div className="lg:w-80 hidden lg:block">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="h-6 bg-gray-200 rounded w-24 animate-pulse mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i}>
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Properties Grid Skeleton */}
          <div className="flex-1">
            {/* Controls Bar Skeleton */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex justify-between items-center">
                <div className="h-8 bg-gray-200 rounded w-40 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-gray-200 h-48 animate-pulse"></div>
                  <div className="p-4">
                    <div className="bg-gray-200 h-6 rounded animate-pulse mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded animate-pulse mb-2"></div>
                    <div className="bg-gray-200 h-8 rounded animate-pulse mb-3"></div>
                    <div className="flex gap-4 mb-3">
                      <div className="bg-gray-200 h-4 w-12 rounded animate-pulse"></div>
                      <div className="bg-gray-200 h-4 w-12 rounded animate-pulse"></div>
                      <div className="bg-gray-200 h-4 w-16 rounded animate-pulse"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="bg-gray-200 h-4 w-20 rounded animate-pulse"></div>
                      <div className="bg-gray-200 h-4 w-16 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
