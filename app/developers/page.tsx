import type { Metadata } from "next"
import { CollectionIndex } from "@/components/properties/CollectionIndex"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Property Developers in Ghana",
  description: "Every developer whose homes we list, with their available properties and what buying one actually costs at today's published mortgage rates.",
  alternates: { canonical: "/developers" },
}

export default function Page() {
  return (
    <CollectionIndex
      kind="developer"
      title="Property developers"
      subtitle="Whose homes we list, and what buying one actually costs"
    />
  )
}
