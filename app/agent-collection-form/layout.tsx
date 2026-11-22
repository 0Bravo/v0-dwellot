import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Become a Dwellot Agent | List Properties & Grow Your Business",
  description: "Apply to list your properties on Dwellot. List unlimited properties, get leads, grow your real estate business. Sign up free.",
  alternates: { canonical: "https://dwellot.com/agent-collection-form" },
}

export default function AgentCollectionFormLayout({ children }: { children: React.ReactNode }) {
  return children
}
