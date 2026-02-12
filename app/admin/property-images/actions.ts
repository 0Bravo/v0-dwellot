"use server"

import { createClient } from "@supabase/supabase-js"

// Create a server-side Supabase client using service role key
function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

export async function getPropertiesAction(): Promise<{
  success: boolean
  data?: { id: number; title: string; location: string; images: string[] | null }[]
  error?: string
}> {
  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from("properties")
      .select("id, title, location, images")
      .order("id", { ascending: true })

    if (error) {
      console.error("Error fetching properties:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getPropertiesAction:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function updatePropertyImagesAction(
  propertyId: number,
  images: string[],
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseAdmin()

    const { error } = await supabase.from("properties").update({ images }).eq("id", propertyId)

    if (error) {
      console.error("Error updating property images:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in updatePropertyImagesAction:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
