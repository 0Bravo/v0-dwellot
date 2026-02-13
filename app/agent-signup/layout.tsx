import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Become a Dwellot Agent | Join Ghana's Top Property Platform",
  description: "Apply to become a verified Dwellot agent. List unlimited properties, connect with buyers and renters, and grow your real estate business across Ghana.",
  alternates: { canonical: "https://dwellot.com/agent-signup" },
}

export default function AgentSignupLayout({ children }: { children: React.ReactNode }) {
  return children
}
