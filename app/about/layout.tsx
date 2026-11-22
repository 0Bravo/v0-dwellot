import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Dwellot",
  description:
    "Why Dwellot publishes what borrowing and buying property in Ghana actually costs, with a " +
    "source and a date beside every figure, alongside listings from agents and developers.",
  alternates: { canonical: "https://dwellot.com/about" },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
