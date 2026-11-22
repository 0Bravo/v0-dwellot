import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CollectionPage } from "@/components/properties/CollectionPage"
import { getCombo, listComboValues } from "@/lib/properties/collections"

const BASE = "/property-search"

export const revalidate = 3600

export async function generateStaticParams() {
  const values = await listComboValues()
  return values.map((v) => ({ slug: v.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const collection = await getCombo(slug)
  if (!collection) return { title: "Not found" }

  const title = `${collection.name} for Sale and Rent`
  const description =
    `${collection.properties.length} listings: ${collection.name.toLowerCase()}, with the ` +
    `deposit, stamp duty, Lands Commission charges and monthly repayment a purchase there ` +
    `actually needs at today's published mortgage rates.`

  return {
    title,
    description,
    alternates: { canonical: `${BASE}/${slug}` },
    openGraph: { title, description, url: `${BASE}/${slug}`, type: "website" },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const collection = await getCombo(slug)
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
