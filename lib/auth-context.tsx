"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import type { User, SupabaseClient } from "@supabase/supabase-js"
import { createClient } from "./supabase/client"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role?: string,
  ) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)

  useEffect(() => {
    // Initialize supabase client only on mount
    const client = createClient()
    setSupabase(client)

    if (!client) {
      setLoading(false)
      return
    }

    client.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!supabase) {
        return { success: false, error: "Supabase is not configured" }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        return { success: true }
      }

      return { success: false, error: "Sign in failed" }
    },
    [supabase],
  )

  const signUp = useCallback(
    async (email: string, password: string, fullName: string, role = "buyer") => {
      if (!supabase) {
        return { success: false, error: "Supabase is not configured" }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
            role: role,
          },
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        return { success: true }
      }

      return { success: false, error: "Sign up failed" }
    },
    [supabase],
  )

  const signOut = useCallback(async () => {
    if (!supabase) {
      return
    }

    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }, [supabase])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
