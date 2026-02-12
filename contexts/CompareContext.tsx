"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface CompareContextType {
  compareList: string[]
  addToCompare: (propertyId: string) => void
  removeFromCompare: (propertyId: string) => void
  clearCompare: () => void
  isInCompare: (propertyId: string) => boolean
  compareCount: number
}

const CompareContext = createContext<CompareContextType | undefined>(undefined)

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<string[]>([])
  const router = useRouter()

  const addToCompare = (propertyId: string) => {
    if (compareList.length >= 4) {
      alert("You can only compare up to 4 properties at a time")
      return
    }
    if (!compareList.includes(propertyId)) {
      setCompareList([...compareList, propertyId])
    }
  }

  const removeFromCompare = (propertyId: string) => {
    setCompareList(compareList.filter((id) => id !== propertyId))
  }

  const clearCompare = () => {
    setCompareList([])
  }

  const isInCompare = (propertyId: string) => {
    return compareList.includes(propertyId)
  }

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        compareCount: compareList.length,
      }}
    >
      {children}
      {compareList.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl p-4 border-2 border-blue-600 z-40">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Compare Properties</h3>
            <button onClick={clearCompare} className="text-gray-500 hover:text-gray-700 text-sm">
              Clear all
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-3">{compareList.length} of 4 properties selected</p>
          <button
            onClick={() => router.push(`/compare?ids=${compareList.join(",")}`)}
            disabled={compareList.length < 2}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Compare Now
          </button>
        </div>
      )}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const context = useContext(CompareContext)
  if (!context) {
    throw new Error("useCompare must be used within CompareProvider")
  }
  return context
}
