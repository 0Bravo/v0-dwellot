import { AgentCardSkeleton } from "@/components/LoadingSkeleton"

export default function AgentsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-96"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <AgentCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
