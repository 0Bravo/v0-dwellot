import { Suspense } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import PropertyImportForm from "@/components/PropertyImportForm"

async function PropertyImportContent() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  // Check user role
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || !["agent", "admin"].includes(profile.role)) {
    redirect("/dashboard")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Import Property</h1>
          <p className="text-muted-foreground">Fill in the details below to add a new property to your listings</p>
        </div>

        <PropertyImportForm userId={user.id} />

        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Quick Guide</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium mb-1">Property Type</h3>
              <p className="text-muted-foreground">Choose from: House, Apartment, Villa, Land, Commercial, Office</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Listing Type</h3>
              <p className="text-muted-foreground">Sale or Rent</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Images</h3>
              <p className="text-muted-foreground">
                Add image URLs (one per line). You can use placeholder images or upload to Vercel Blob storage.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Amenities</h3>
              <p className="text-muted-foreground">Separate with commas: Pool, Gym, Security, Garden, etc.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PropertyImportPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <PropertyImportContent />
    </Suspense>
  )
}
