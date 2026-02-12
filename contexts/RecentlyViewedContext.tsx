"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

interface Property {
  id: string
  title: string
  location: string
  price: number
  listing_type: string
  images: string[]
  bedrooms: number
  bathrooms: number
  area: number
  property_type: string
  viewed_at: string
}

interface RecentlyViewedContextType {
  recentlyViewed: Property[]
  addToRecentlyViewed: (property: Omit<Property, "viewed_at">) => void
  clearRecentlyViewed: () => void
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined)

const STORAGE_KEY = "dwellot_recently_viewed"
const MAX_ITEMS = 20

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<Property[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored))
      } catch (error) {
        console.error("Error loading recently viewed:", error)
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed))
    }
  }, [recentlyViewed, isLoaded])

  const addToRecentlyViewed = useCallback((property: Omit<Property, "viewed_at">) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== property.id)
      const newItem = { ...property, viewed_at: new Date().toISOString() }
      const updated = [newItem, ...filtered].slice(0, MAX_ITEMS)
      return updated
    })
  }, [])

  const clearRecentlyViewed = () => {
    setRecentlyViewed([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addToRecentlyViewed, clearRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  )
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext)
  if (context === undefined) {
    throw new Error("useRecentlyViewed must be used within a RecentlyViewedProvider")
  }
  return context
}
