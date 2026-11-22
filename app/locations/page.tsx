import type { Metadata } from "next"
import { CollectionIndex } from "@/components/properties/CollectionIndex"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Property by Location in Ghana",
  description: "Every area we list property in, with what a purchase there costs once deposit, stamp duty, Lands Commission charges and lender fees are counted.",
  alternates: { canonical: "/locations" },
}

export default function Page() {
  return (
    <CollectionIndex
      kind="location"
      title="Property by location"
      subtitle="Every area we list in, and what buying there actually costs"
    />
  )
}
