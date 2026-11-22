import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, ArrowRight, Clock } from "lucide-react"
import Link from "next/link"

import { listPosts } from "@/lib/blog/posts"
import { formatRateDate } from "@/lib/mortgage/rates"

export const metadata: Metadata = {
  title: "Ghana Property Blog - Real Estate Tips, Guides & Market Updates",
  description:
    "Expert insights on buying, selling, and renting property in Ghana. Property investment tips, area guides, legal advice, and market trends for Accra, Kumasi, East Legon, and beyond.",
  keywords:
    "Ghana property blog, real estate Ghana, property investment Ghana, buying property Ghana, Ghana property market, Accra property guide, real estate tips Ghana, property advice Ghana",
  alternates: {
    canonical: "https://dwellot.com/blog",
  },
  openGraph: {
    title: "Ghana Property Blog | Expert Real Estate Insights | Dwellot",
    description: "Expert real estate insights and guides for buying, selling, and renting property in Ghana",
    url: "https://dwellot.com/blog",
    siteName: "Dwellot",
    type: "website",
  },
}


export default function BlogPage() {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Dwellot Ghana Property Blog",
    description: "Expert insights on buying, selling, and renting property in Ghana",
    url: "https://dwellot.com/blog",
    publisher: {
      "@type": "Organization",
      name: "Dwellot",
      logo: {
        "@type": "ImageObject",
        url: "https://dwellot.com/icon-512.png",
      },
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-teal-50 to-background py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Dwellot Blog</h1>
            <p className="text-xl text-muted-foreground">Insights, tips, and news about Ghana's real estate market</p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listPosts().map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-sm text-teal-600 font-semibold mb-2">{post.category}</div>
                    <h2 className="text-xl font-bold mb-3 group-hover:text-teal-700">{post.title}</h2>
                    <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatRateDate(post.published)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readMinutes} min
                      </span>
                    </div>
                    <span className="text-teal-700 flex items-center gap-1 font-semibold">
                      Read <ArrowRight className="h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
      </div>
    </>
  )
}
