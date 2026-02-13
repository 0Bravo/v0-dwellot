import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Find Real Estate Agents in Ghana | Verified Property Agents | Dwellot",
  description: "Connect with verified real estate agents across Ghana. Browse agent profiles, ratings, and listings. Find trusted property professionals in Accra, Kumasi, and beyond.",
  alternates: { canonical: "https://dwellot.com/agents" },
}

export default function AgentsLayout({ children }: { children: React.ReactNode }) {
  return children
}
