"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import PropertyImportForm from "@/components/PropertyImportForm"
import BulkUploadForm from "@/components/BulkUploadForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

export default function AddPropertyPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redirect to auth page if not logged in
        router.push("/auth?redirect=/admin/add-property")
      } else {
        setIsChecking(false)
      }
    }
  }, [user, loading, router])

  // Show loading state while checking authentication
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, show nothing (will redirect)
  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Add Properties</CardTitle>
          <CardDescription>Add a single property or upload multiple properties at once</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="single" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="single">Single Property</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="single" className="mt-6">
              <PropertyImportForm />
            </TabsContent>
            <TabsContent value="bulk" className="mt-6">
              <BulkUploadForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
