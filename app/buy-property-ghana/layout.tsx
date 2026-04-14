import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Own a Beautiful Home in Ghana — From Anywhere in the World | Dwellot",
  description:
    "Browse 500+ verified residential properties across Ghana. Remote purchase support for Ghanaian diaspora worldwide. Get your free property consultation today.",
  keywords:
    "buy property Ghana, Ghana real estate diaspora, homes for sale Ghana, Ghanaian diaspora property, buy house Ghana abroad, Ghana property investment",
  openGraph: {
    title: "Own a Beautiful Home in Ghana — From Anywhere in the World",
    description:
      "500+ verified properties across Ghana. Remote purchase support for worldwide buyers. Get your free consultation.",
    url: "https://dwellot.com/buy-property-ghana",
    siteName: "Dwellot",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Own a Beautiful Home in Ghana — Dwellot",
    description: "500+ verified properties. Remote purchase support. Free consultation.",
  },
  alternates: {
    canonical: "https://dwellot.com/buy-property-ghana",
  },
}

export default function BuyPropertyGhanaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
