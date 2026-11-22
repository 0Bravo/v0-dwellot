import Link from "next/link"
import { PageHero, HeroOverlap } from "@/components/ui/PageHero"
import {
  COLLECTION_BASE,
  listCollectionValues,
  type CollectionKind,
} from "@/lib/properties/collections"

/**
 * The browsable index of one kind of collection.
 *
 * Without these the collection pages are reachable only from the sitemap,
 * which is the slowest way to be found and gives a reader no way in at all.
 */
export async function CollectionIndex({
  kind,
  title,
  subtitle,
}: {
  kind: CollectionKind
  title: string
  subtitle: string
}) {
  const values = await listCollectionValues(kind)

  return (
    <>
      <PageHero eyebrow="Browse" title={title} subtitle={subtitle} width="wide" overlap />
      <HeroOverlap>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {values.length === 0 ? (
            <p className="bg-white rounded-2xl ring-1 ring-gray-200 p-8 text-gray-600">
              Nothing listed yet.
            </p>
          ) : (
            <div className="bg-white rounded-2xl ring-1 ring-gray-200 p-6 sm:p-8">
              <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
                {values.map((v) => (
                  <li key={v.slug}>
                    <Link
                      href={`${COLLECTION_BASE[kind]}/${v.slug}`}
                      className="flex items-baseline justify-between gap-4 py-2.5 border-b border-gray-100 group"
                    >
                      <span className="font-medium text-gray-900 group-hover:text-teal-700">
                        {v.name}
                      </span>
                      <span className="text-sm text-gray-500 tabular-nums">{v.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link className="text-teal-700 font-semibold" href="/locations">
              By location
            </Link>
            <Link className="text-teal-700 font-semibold" href="/estates">
              By development
            </Link>
            <Link className="text-teal-700 font-semibold" href="/developers">
              By developer
            </Link>
            <Link className="text-teal-700 font-semibold" href="/ghana-property-finance-index">
              This month&apos;s rates and costs
            </Link>
          </div>
        </div>
      </HeroOverlap>
    </>
  )
}
