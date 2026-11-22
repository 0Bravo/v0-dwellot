import type { Metadata } from "next"
import { CollectionIndex } from "@/components/properties/CollectionIndex"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Developments and Estates in Ghana",
  description: "Every development we list, with prices, available homes and what a purchase there costs once the deposit, taxes and fees are counted.",
  alternates: { canonical: "/estates" },
}

export default function Page() {
  return (
    <CollectionIndex
      kind="estate"
      title="Developments and estates"
      subtitle="Every development we list, with prices and the cost of buying in"
    />
  )
}
