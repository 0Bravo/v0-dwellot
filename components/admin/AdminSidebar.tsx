"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { 
  LayoutDashboard, 
  Home, 
  Users, 
  Mail, 
  MessageSquare, 
  UserPlus,
  PlusCircle,
  Upload,
  Settings,
  LogOut
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Properties", href: "/dashboard/properties", icon: Home },
  { name: "Add Property", href: "/dashboard/add-property", icon: PlusCircle },
  { name: "Bulk Upload", href: "/dashboard/bulk-upload", icon: Upload },
  { name: "Enquiries", href: "/dashboard/enquiries", icon: MessageSquare },
  { name: "Subscribers", href: "/dashboard/subscribers", icon: Mail },
  { name: "Agent Applications", href: "/dashboard/agent-applications", icon: UserPlus },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [admin, setAdmin] = useState<{ email: string; full_name: string | null } | null>(null)

  useEffect(() => {
    async function fetchUser() {
      const supabase = createBrowserClient()
      if (!supabase) return
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single()
        setAdmin({
          email: user.email || "",
          full_name: profile?.full_name || null,
        })
      }
    }
    fetchUser()
  }, [])

  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div className="lg:hidden fixed inset-0 bg-gray-900/80 z-40" />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 lg:block">
        {/* Logo */}
        <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 px-6">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-2xl font-bold">
              <span className="text-teal-600">Dwell</span>
              <span className="text-gray-900">ot</span>
            </span>
          </Link>
          <span className="ml-auto text-xs font-medium text-gray-500 bg-teal-100 px-2 py-1 rounded">
            ADMIN
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col flex-1 gap-y-1 px-4 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href))
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-teal-50 text-teal-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-200 p-4">
          {admin ? (
            <div className="flex items-center gap-x-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-semibold">
                {admin.full_name?.[0] || admin.email[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {admin.full_name || "Admin"}
                </p>
                <p className="text-xs text-gray-500 truncate">{admin.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-x-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-2 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </div>
            </div>
          )}
          
          <Link
            href="/api/auth/signout"
            className="flex w-full items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Link>
        </div>
      </div>
    </>
  )
}
