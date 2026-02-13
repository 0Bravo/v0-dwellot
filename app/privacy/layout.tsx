import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Dwellot Ghana Property Marketplace",
  description: "Dwellot's privacy policy. How we collect, use, and protect your personal data when using our Ghana property marketplace platform.",
  alternates: { canonical: "https://dwellot.com/privacy" },
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
