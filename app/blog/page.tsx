import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, User, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Ghana Property Blog - Real Estate Tips, Guides & Market Updates | Dwellot",
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

const blogPosts = [
  {
    id: 1,
    title: "10 Tips for First-Time Home Buyers in Ghana",
    excerpt: "Essential advice for navigating the property market and making your first home purchase",
    author: "Dwellot Team",
    date: "January 10, 2026",
    image: "/modern-home.png",
    category: "Buying Tips",
  },
  {
    id: 2,
    title: "Understanding Property Values in Accra",
    excerpt: "A comprehensive guide to property pricing trends in Greater Accra Region",
    author: "Dwellot Team",
    date: "January 8, 2026",
    image: "/accra-skyline.jpg",
    category: "Market Insights",
  },
  {
    id: 3,
    title: "How to Prepare Your Property for Sale",
    excerpt: "Expert tips on staging and preparing your property to attract buyers",
    author: "Dwellot Team",
    date: "January 5, 2026",
    image: "/house-for-sale.jpg",
    category: "Selling Tips",
  },
]

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
            {blogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                </div>
                <CardContent className="p-6">
                  <div className="text-sm text-teal-600 font-semibold mb-2">{post.category}</div>
                  <h3 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </span>
                  </div>
                  <Link href="#" className="text-teal-600 hover:text-teal-700 flex items-center gap-1 font-semibold">
                    Read More <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Coming Soon Message */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground">More articles coming soon. Stay tuned for expert insights!</p>
          </div>
        </div>
      </section>
      </div>
    </>
  )
}
