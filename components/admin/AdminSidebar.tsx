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
  LogOut,
  X,
  Megaphone,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Properties", href: "/dashboard/properties", icon: Home },
  { name: "Add Property", href: "/dashboard/properties/new", icon: PlusCircle },
  { name: "Bulk Upload", href: "/dashboard/properties/bulk", icon: Upload },
  { name: "Enquiries", href: "/dashboard/enquiries", icon: MessageSquare },
  { name: "Subscribers", href: "/dashboard/subscribers", icon: Mail },
  { name: "Agent Applications", href: "/dashboard/agent-applications", icon: UserPlus },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Facebook Pixel", href: "/dashboard/facebook-pixel", icon: Megaphone },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [admin, setAdmin] = useState<{ email: string; full_name: string | null } | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

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

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const sidebarContent = (
    <>
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
        {/* Mobile close button */}
        <button
          type="button"
          className="lg:hidden -m-2.5 p-2.5 text-gray-700"
          onClick={() => setMobileOpen(false)}
        >
          <span className="sr-only">Close sidebar</span>
          <X className="h-5 w-5" />
        </button>
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
            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex-1 min-w-0 space-y-2">
              <div className="h-3 bg-gray-200 rounded animate-pulse" />
              <div className="h-2 bg-gray-200 rounded animate-pulse w-3/4" />
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
    </>
  )

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-gray-900/80 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:w-64 lg:flex-col bg-white border-r border-gray-200">
        {sidebarContent}
      </aside>

      {/* Mobile toggle button - exposed for AdminHeader */}
      <button
        type="button"
        id="sidebar-toggle"
        className="hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
      />
    </>
  )
}

// Export a hook-like approach for the header to toggle the sidebar
export function useSidebarToggle() {
  return () => {
    document.getElementById("sidebar-toggle")?.click()
  }
}
