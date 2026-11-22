import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PageHero, HeroOverlap } from "@/components/ui/PageHero"
import { formatRateDate } from "@/lib/mortgage/rates"
import type { Post } from "@/lib/blog/posts"

/**
 * The shell every article sits in.
 *
 * Articles here are worth writing only where we hold something nobody else
 * publishes, so the shell makes the sourcing visible: a dated line at the
 * top, and a standing pointer to the index the figures come from. An article
 * whose numbers cannot be traced is the kind of filler this site has just
 * finished removing.
 */
export function Article({
  post,
  children,
  asOfNote,
}: {
  post: Post
  children: ReactNode
  asOfNote?: string
}) {
  return (
    <>
      <PageHero
        eyebrow={post.category}
        title={post.title}
        subtitle={post.excerpt}
        width="narrow"
        overlap
      />
      <HeroOverlap>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <article className="bg-white rounded-2xl ring-1 ring-gray-200 p-6 sm:p-10">
            <p className="text-sm text-gray-500 border-b border-gray-100 pb-4 mb-6">
              {formatRateDate(post.published)} · {post.readMinutes} min read
              {asOfNote ? ` · ${asOfNote}` : ""}
            </p>

            <div
              className="
                [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-10 [&>h2]:mb-3
                [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-gray-900 [&>h3]:mt-7 [&>h3]:mb-2
                [&>p]:text-gray-700 [&>p]:leading-relaxed [&>p]:mb-4
                [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ul]:text-gray-700 [&>ul>li]:mb-1.5
                [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>ol]:text-gray-700 [&>ol>li]:mb-1.5
                [&_a]:text-teal-700 [&_a]:underline
                [&>table]:w-full [&>table]:text-sm [&>table]:mb-6
                [&_th]:text-left [&_th]:font-semibold [&_th]:text-gray-900 [&_th]:py-2 [&_th]:border-b [&_th]:border-gray-200
                [&_td]:py-2 [&_td]:border-b [&_td]:border-gray-100 [&_td]:text-gray-700
              "
            >
              {children}
            </div>

            <p className="mt-10 pt-6 border-t border-gray-100 text-sm text-gray-600">
              Figures come from the{" "}
              <Link className="text-teal-700 underline" href="/ghana-property-finance-index">
                Ghana Property Finance Index
              </Link>
              , which carries the source and date for each one. This is general information about
              the market, not advice on a particular purchase or loan.
            </p>
          </article>

          <Link
            href="/blog"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            All articles
          </Link>
        </div>
      </HeroOverlap>
    </>
  )
}
