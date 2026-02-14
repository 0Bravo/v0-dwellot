import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminDashboardClient from "@/components/admin/AdminDashboardClient"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin-login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/admin-login?error=unauthorized")
  }

  return <AdminDashboardClient />
}
