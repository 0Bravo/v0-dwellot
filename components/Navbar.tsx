"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, User, ChevronDown, Home, LogOut, Settings, LayoutDashboard, PlusCircle } from "lucide-react" // Added PlusCircle icon
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, signOut } = useAuth() // Added auth context
  const router = useRouter()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  const handleSignOut = async () => {
    await signOut()
    setIsUserMenuOpen(false)
    router.push("/")
  }

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold text-gray-900">Dwellot</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/properties"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Properties
              </Link>
              <Link
                href="/agents"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Agents
              </Link>
              <Link
                href="/sell"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sell
              </Link>
              <Link
                href="/rent"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Rent
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 gap-3">
              {user && (
                <Link
                  href="/admin/add-property"
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Property</span>
                </Link>
              )}

              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span>{user ? user.email?.split("@")[0] : "Account"}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    {user ? (
                      <>
                        <Link
                          href="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/properties"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Home className="h-4 w-4 mr-2" />
                          My Properties
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Profile Settings
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/auth"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/auth"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <Link
              href="/properties"
              className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Properties
            </Link>
            <Link
              href="/agents"
              className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Agents
            </Link>
            <Link
              href="/sell"
              className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Sell
            </Link>
            <Link
              href="/rent"
              className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Rent
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Contact
            </Link>
            <div className="border-t border-gray-200 pt-4">
              {user ? (
                <>
                  <Link
                    href="/admin/add-property"
                    className="bg-green-600 text-white hover:bg-green-700 block px-3 py-2 rounded-md text-base font-medium mb-2"
                    onClick={toggleMenu}
                  >
                    + Add Property
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/properties"
                    className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={toggleMenu}
                  >
                    My Properties
                  </Link>
                  <Link
                    href="/profile"
                    className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={toggleMenu}
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut()
                      toggleMenu()
                    }}
                    className="text-gray-700 hover:text-green-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth"
                    className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={toggleMenu}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth"
                    className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={toggleMenu}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
