import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CollectionPage } from "@/components/properties/CollectionPage"
import { getCollection, listCollectionValues } from "@/lib/properties/collections"

const KIND = "developer" as const
const BASE = "/developers"

/* Listings change through the day; the page itself rarely does. */
export const revalidate = 3600

export async function generateStaticParams() {
  const values = await listCollectionValues(KIND)
  return values.map((v) => ({ slug: v.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const collection = await getCollection(KIND, slug)
  if (!collection) return { title: "Not found" }

  const title = `${collection.name}: Properties for Sale in Ghana`
  const description = `${collection.properties.length} listings from ${collection.name}, with the deposit, fees and monthly repayment a purchase actually needs at today's published mortgage rates.`

  return {
    title,
    description,
    alternates: { canonical: `${BASE}/${slug}` },
    openGraph: { title, description, url: `${BASE}/${slug}`, type: "website" },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const collection = await getCollection(KIND, slug)
  if (!collection) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.name,
    url: `https://dwellot.com${BASE}/${slug}`,
    numberOfItems: collection.properties.length,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CollectionPage collection={collection} />
    </>
  )
}
