import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, AlertCircle, FileText, DollarSign, Home } from "lucide-react"

export const metadata: Metadata = {
  title: "Complete Guide to Buying Property in Ghana 2026 | Legal Requirements & Process",
  description:
    "Step-by-step guide to buying property in Ghana. Learn about legal requirements, costs, documents needed, best areas, and how to avoid scams. Updated 2026.",
  keywords:
    "buy property Ghana, buying house Ghana, property purchase Ghana, Ghana real estate guide, buy land Ghana, property documents Ghana, Lands Commission Ghana",
}

export default function BuyingPropertyGhanaGuide() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Complete Guide to Buying Property in Ghana 2026",
    description:
      "Comprehensive guide covering everything you need to know about buying property in Ghana including legal requirements, costs, and step-by-step process",
    author: {
      "@type": "Organization",
      name: "Dwellot",
    },
    publisher: {
      "@type": "Organization",
      name: "Dwellot",
      logo: {
        "@type": "ImageObject",
        url: "https://dwellot.com/icon-512.png",
      },
    },
    datePublished: "2026-01-15",
    dateModified: "2026-01-15",
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <article className="min-h-screen bg-background">
        {/* Hero */}
        <div className="bg-gradient-to-b from-teal-50 to-background py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link href="/blog" className="text-teal-600 hover:text-teal-700 mb-4 inline-block">
              ← Back to Blog
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Complete Guide to Buying Property in Ghana 2026</h1>
            <p className="text-xl text-muted-foreground mb-4">
              Everything you need to know about purchasing property in Ghana - legal requirements, costs, process, and
              expert tips
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>By Dwellot Team</span>
              <span>•</span>
              <span>January 15, 2026</span>
              <span>•</span>
              <span>15 min read</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <p className="lead text-xl mb-8">
              Buying property in Ghana is an exciting investment opportunity, whether you're a Ghanaian returning home,
              an expat relocating, or an investor looking for opportunities. This comprehensive guide walks you through
              every step of the property buying process in Ghana.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-6">Can Foreigners Buy Property in Ghana?</h2>
            <p>
              Yes, foreigners can buy property in Ghana. However, there's an important distinction: non-Ghanaians can
              only acquire <strong>leasehold interests</strong> (typically 50 years, renewable) rather than freehold
              ownership. Ghanaian citizens can own property outright (freehold).
            </p>

            <Card className="my-8 border-teal-200 bg-teal-50">
              <CardContent className="p-6">
                <div className="flex gap-3">
                  <AlertCircle className="h-6 w-6 text-teal-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Important for Foreign Buyers</h3>
                    <p className="text-sm mb-0">
                      All land in Ghana is held either by the government (public lands) or by customary owners
                      (stool/skin lands, family lands). Even Ghanaians technically hold land through long-term leases.
                      Always work with a licensed real estate lawyer.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <h2 className="text-3xl font-bold mt-12 mb-6">Step-by-Step Property Buying Process</h2>

            <div className="space-y-6 my-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Find Your Property</h3>
                      <p className="text-muted-foreground">
                        Browse listings on Dwellot, visit properties, and shortlist options. Consider location, price,
                        property condition, and development potential. Visit during both day and night to assess the
                        neighborhood.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Hire a Real Estate Lawyer</h3>
                      <p className="text-muted-foreground">
                        This is <strong>non-negotiable</strong>. A qualified lawyer will conduct due diligence, verify
                        ownership, check for encumbrances, and ensure all documents are legitimate. Budget $500-$2,000
                        for legal fees.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Conduct Property Search</h3>
                      <p className="text-muted-foreground">
                        Your lawyer will search the property at the Lands Commission to verify: legal owner, property
                        boundaries, existing mortgages or liens, planning permissions, and any disputes. This costs
                        $100-$300 and takes 1-2 weeks.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Get Land Surveyed</h3>
                      <p className="text-muted-foreground">
                        Hire a licensed surveyor to verify property boundaries and confirm the land area matches what's
                        being sold. Survey costs $500-$2,000 depending on land size and location.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                      5
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Negotiate and Make Offer</h3>
                      <p className="text-muted-foreground">
                        Once due diligence is complete, negotiate the final price. In Ghana, property prices are often
                        negotiable (5-15% discount possible). Make a written offer through your lawyer.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                      6
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Sign Sale Agreement</h3>
                      <p className="text-muted-foreground">
                        Your lawyer prepares a Sale Agreement detailing: parties involved, property description,
                        purchase price, payment terms, completion date, and conditions. Both parties sign and it's
                        witnessed.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                      7
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Make Payment</h3>
                      <p className="text-muted-foreground">
                        Pay deposit (typically 10-30%) upon signing. Remaining balance paid before or at completion. Use
                        bank transfers for traceability. Never pay cash without proper receipts.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                      8
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Complete Transfer</h3>
                      <p className="text-muted-foreground">
                        Lawyer prepares transfer documents and registers the property with the Lands Commission. Seller
                        hands over keys and possession. This takes 2-6 months depending on the Commission's workload.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-3xl font-bold mt-12 mb-6">Required Documents</h2>

            <div className="grid md:grid-cols-2 gap-4 my-8">
              <Card>
                <CardContent className="p-6">
                  <FileText className="h-8 w-8 text-teal-600 mb-3" />
                  <h3 className="font-bold mb-3">Seller Must Provide:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>Original title certificate or deed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>Site plan approved by Town & Country Planning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>Survey plan by licensed surveyor</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>Building permit (if developed property)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>Tax clearance certificate</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <FileText className="h-8 w-8 text-teal-600 mb-3" />
                  <h3 className="font-bold mb-3">Buyer Must Provide:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>Valid ID or passport</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>Tax Identification Number (TIN)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>Proof of address</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>Proof of funds (bank statements)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>Resident permit (for foreigners)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-3xl font-bold mt-12 mb-6">Cost Breakdown</h2>

            <Card className="my-8">
              <CardContent className="p-6">
                <DollarSign className="h-8 w-8 text-teal-600 mb-4" />
                <h3 className="font-bold text-xl mb-4">Total Transaction Costs: 3-5% of Property Value</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-start border-b pb-2">
                    <span className="font-medium">Property Price</span>
                    <span className="text-right">$100,000 (example)</span>
                  </div>
                  <div className="flex justify-between items-start border-b pb-2">
                    <span>Legal Fees</span>
                    <span className="text-right">$1,000 - $2,000 (1-2%)</span>
                  </div>
                  <div className="flex justify-between items-start border-b pb-2">
                    <span>Land Registration Fees</span>
                    <span className="text-right">$1,000 - $2,000 (1-2%)</span>
                  </div>
                  <div className="flex justify-between items-start border-b pb-2">
                    <span>Stamp Duty</span>
                    <span className="text-right">$500 (0.5%)</span>
                  </div>
                  <div className="flex justify-between items-start border-b pb-2">
                    <span>Surveyor Fees</span>
                    <span className="text-right">$500 - $2,000</span>
                  </div>
                  <div className="flex justify-between items-start border-b pb-2">
                    <span>Property Search</span>
                    <span className="text-right">$100 - $300</span>
                  </div>
                  <div className="flex justify-between items-start border-b pb-2">
                    <span>Estate Agent (if used)</span>
                    <span className="text-right">$5,000 (5%, usually paid by seller)</span>
                  </div>
                  <div className="flex justify-between items-start font-bold text-lg pt-2">
                    <span>Total Buyer Costs</span>
                    <span className="text-right">$3,100 - $6,800</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <h2 className="text-3xl font-bold mt-12 mb-6">How to Avoid Property Scams in Ghana</h2>

            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 my-8">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-red-600" />
                Red Flags to Watch Out For
              </h3>
              <ul className="space-y-2">
                <li>• Seller pressures you to pay quickly without proper documentation</li>
                <li>• Property price is significantly below market value (too good to be true)</li>
                <li>• Seller refuses to allow lawyer involvement or property search</li>
                <li>• Documents look forged or have inconsistencies</li>
                <li>• Seller can't provide original documents, only photocopies</li>
                <li>• Multiple people claim ownership of the same land</li>
                <li>• Property boundaries are unclear or disputed</li>
                <li>• Seller wants cash payments without receipts</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold mt-8 mb-4">Protection Strategies:</h3>
            <ol className="space-y-3 mb-8">
              <li>
                <strong>1. Always hire a licensed real estate lawyer</strong> - They know the tricks and will protect
                you
              </li>
              <li>
                <strong>2. Conduct thorough due diligence</strong> - Never skip the property search at Lands Commission
              </li>
              <li>
                <strong>3. Visit the property multiple times</strong> - Talk to neighbors about the seller and any
                disputes
              </li>
              <li>
                <strong>4. Verify all documents</strong> - Check stamps, signatures, and dates for authenticity
              </li>
              <li>
                <strong>5. Use secure payment methods</strong> - Bank transfers only, keep all receipts
              </li>
              <li>
                <strong>6. Check for litigation</strong> - Your lawyer should search for any court cases involving the
                land
              </li>
            </ol>

            <h2 className="text-3xl font-bold mt-12 mb-6">Best Areas to Buy Property in Ghana</h2>

            <div className="grid md:grid-cols-3 gap-4 my-8">
              <Card>
                <CardContent className="p-6">
                  <Home className="h-8 w-8 text-teal-600 mb-3" />
                  <h3 className="font-bold mb-2">Accra - Premium</h3>
                  <p className="text-sm text-muted-foreground mb-3">East Legon, Airport Hills, Cantonments</p>
                  <p className="text-2xl font-bold text-teal-600 mb-2">$200K - $800K</p>
                  <p className="text-xs text-muted-foreground">Established areas, high appreciation, expat-friendly</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Home className="h-8 w-8 text-teal-600 mb-3" />
                  <h3 className="font-bold mb-2">Accra - Emerging</h3>
                  <p className="text-sm text-muted-foreground mb-3">Appolonia City, Spintex, Adenta</p>
                  <p className="text-2xl font-bold text-teal-600 mb-2">$80K - $300K</p>
                  <p className="text-xs text-muted-foreground">
                    Good value, modern developments, growing infrastructure
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Home className="h-8 w-8 text-teal-600 mb-3" />
                  <h3 className="font-bold mb-2">Other Cities</h3>
                  <p className="text-sm text-muted-foreground mb-3">Kumasi, Takoradi, Tema</p>
                  <p className="text-2xl font-bold text-teal-600 mb-2">$50K - $250K</p>
                  <p className="text-xs text-muted-foreground">Lower costs, good rental yields, less competition</p>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-3xl font-bold mt-12 mb-6">Frequently Asked Questions</h2>

            <div className="space-y-4 my-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">How long does it take to buy property in Ghana?</h3>
                  <p className="text-muted-foreground">
                    The entire process typically takes 3-6 months. Due diligence takes 2-4 weeks, registration at Lands
                    Commission takes 2-6 months. Having all documents ready can speed things up.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Do I need a Ghanaian bank account?</h3>
                  <p className="text-muted-foreground">
                    Not required but highly recommended. It makes transactions easier and shows financial stability.
                    Most banks offer accounts for non-residents with proper documentation.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Can I get a mortgage in Ghana as a foreigner?</h3>
                  <p className="text-muted-foreground">
                    Yes, but it's challenging. Local banks require higher down payments (30-50%) from foreigners and
                    proof of income in Ghana. Interest rates range from 18-28%. Many foreign buyers pay cash.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Should I buy land or a completed house?</h3>
                  <p className="text-muted-foreground">
                    Completed houses cost more but are ready to occupy or rent. Land is cheaper but requires additional
                    investment and time to build (6-18 months). For investors seeking immediate returns, buy completed
                    properties.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-12 bg-teal-50 border-teal-200">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Ready to Find Your Dream Property in Ghana?</h2>
                <p className="text-muted-foreground mb-6">
                  Browse thousands of verified properties across Ghana on Dwellot
                </p>
                <Link href="/properties">
                  <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                    View All Properties
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-lg mb-3">About This Guide</h3>
              <p className="text-sm text-muted-foreground">
                This guide was written by the Dwellot team with input from experienced Ghana real estate lawyers and
                agents. Information is accurate as of January 2026. Property laws and regulations may change. Always
                consult with qualified professionals before making property decisions.
              </p>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
