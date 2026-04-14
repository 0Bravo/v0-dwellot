"use client"

import { usePathname } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import NewsletterModal from "@/components/NewsletterModal"

const STANDALONE_ROUTES = ["/buy-property-ghana"]

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isStandalone = STANDALONE_ROUTES.some((route) => pathname.startsWith(route))

  if (isStandalone) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      <main className="pt-16">{children}</main>
      <Footer />
      <NewsletterModal />
    </>
  )
}
