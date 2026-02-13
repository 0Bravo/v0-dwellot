import { redirect } from "next/navigation"
import { getAdminUser } from "@/lib/admin-auth"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"

export const metadata = {
  title: "Admin Dashboard | Dwellot",
  description: "Manage properties, users, and site content",
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminUser()

  if (!admin) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar admin={admin} />
      
      <div className="lg:pl-64">
        <AdminHeader admin={admin} />
        
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
