import type { Metadata } from "next"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { HelpCircle, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "FAQ - Ghana Property Questions Answered | Dwellot",
  description:
    "Get answers to common questions about buying, renting, and investing in Ghana property. Learn about property costs, legal requirements, best areas in Accra, and more.",
  keywords:
    "Ghana property FAQ, buy property Ghana, rent apartment Ghana, property costs Ghana, real estate questions Ghana",
  alternates: { canonical: "https://dwellot.com/faq" },
  openGraph: {
    title: "Frequently Asked Questions - Ghana Property | Dwellot",
    description: "Everything you need to know about buying and renting property in Ghana",
  },
}

export default function FAQPage() {
  const faqs = [
    {
      category: "Buying Property in Ghana",
      questions: [
        {
          q: "How much does property cost in Ghana?",
          a: "Property prices in Ghana vary by location. In Accra, apartments range from $50,000 to $500,000+, while houses can range from $100,000 to over $1 million. Areas like East Legon and Airport Hills command premium prices ($200,000-$800,000), while Appolonia City and Tema offer more affordable options ($80,000-$300,000). Kumasi properties are generally 20-30% less expensive than Accra.",
        },
        {
          q: "Can foreigners buy property in Ghana?",
          a: "Yes, foreigners can buy property in Ghana. However, non-Ghanaians can only acquire leasehold interests (typically 50 years, renewable) rather than freehold ownership. You'll need to work with a licensed real estate lawyer to ensure proper documentation and registration with the Lands Commission.",
        },
        {
          q: "What documents do I need to buy property in Ghana?",
          a: "Essential documents include: valid ID/passport, site plan, land title certificate or deed, property search report from Lands Commission, survey plan, building permit (for developed land), and proof of payment. It's recommended to hire a real estate lawyer to verify all documents before purchase.",
        },
        {
          q: "Is Ghana good for real estate investment?",
          a: "Yes, Ghana offers attractive real estate investment opportunities. The country has a stable democracy, growing economy, and increasing urbanization. Rental yields in Accra range from 6-10% annually, and property values have appreciated steadily. Key investment areas include Accra, Kumasi, and emerging cities like Takoradi.",
        },
        {
          q: "How do I verify property ownership in Ghana?",
          a: "Verify ownership through the Lands Commission by conducting a property search. This confirms the legal owner, existing encumbrances, and land status. Hire a qualified surveyor to verify boundaries and a lawyer to review all documents. Never rely solely on documents provided by the seller.",
        },
      ],
    },
    {
      category: "Renting in Ghana",
      questions: [
        {
          q: "How much does it cost to rent in Ghana?",
          a: "Rental prices vary by location and property type. In Accra, studio apartments start from $300/month, 1-bedroom from $500/month, 2-bedroom from $800/month, and 3-bedroom houses from $1,200/month. Premium areas like East Legon and Airport Hills can be 50-100% higher. Most landlords require 1-2 years advance payment.",
        },
        {
          q: "Do I need to pay rent in advance in Ghana?",
          a: "Yes, advance rent payment is standard in Ghana. Most landlords require 1-2 years rent paid upfront, though some may accept 6 months or quarterly payments. This is a common practice and negotiable depending on the landlord and property. Always get a receipt for all payments made.",
        },
        {
          q: "What are tenant rights in Ghana?",
          a: "Tenants in Ghana have rights including: peaceful enjoyment of property, proper notice for eviction (minimum 6 months), receipt of rent payments, maintenance of essential services, and return of security deposit (if applicable). The Rent Act 1963 (Act 220) governs landlord-tenant relationships.",
        },
        {
          q: "How can I avoid rental scams in Ghana?",
          a: "Protect yourself by: verifying landlord identity and ownership documents, visiting the property in person, checking with neighbors about the landlord, never paying without proper documentation, using licensed real estate agents, and conducting a Lands Commission search before making large payments.",
        },
      ],
    },
    {
      category: "Best Areas in Ghana",
      questions: [
        {
          q: "What are the best areas to live in Accra?",
          a: "Top residential areas in Accra include: East Legon (luxury, expat-friendly), Airport Hills (gated communities, near airport), Cantonments (diplomatic area, secure), Labone (beach access, restaurants), Appolonia City (modern planned community), Tema (industrial city, good infrastructure), and Spintex (growing area, good value). Each offers different lifestyles and price points.",
        },
        {
          q: "Where should expats live in Ghana?",
          a: "Expats typically prefer East Legon, Airport Hills, Cantonments, and Labone in Accra. These areas offer: international schools, supermarkets, healthcare facilities, restaurant options, 24-hour security, reliable utilities, and strong expat communities. Rental prices range from $1,000-$3,000+ per month for quality housing.",
        },
        {
          q: "What are the cheapest areas to live in Accra?",
          a: "Affordable areas in Accra include: Tema Community 25, Spintex, Madina, Kasoa, Adenta, and Ashongman Estates. These areas offer 2-3 bedroom apartments for $400-$800/month and houses for $600-$1,200/month. They have improving infrastructure and good access to central Accra.",
        },
      ],
    },
    {
      category: "Using Dwellot",
      questions: [
        {
          q: "What is Dwellot?",
          a: "Dwellot is Ghana's leading online property marketplace connecting buyers, sellers, renters, and landlords. We provide verified property listings across Ghana with detailed information, photos, and direct agent contact. Our platform makes finding and listing properties simple, transparent, and secure.",
        },
        {
          q: "Is Dwellot free to use?",
          a: "Yes, browsing and searching properties on Dwellot is completely free. You can view unlimited listings, contact agents directly, and save your favorite properties at no cost. Property owners may have listing fees. Contact us for detailed pricing information.",
        },
        {
          q: "How do I search for properties on Dwellot?",
          a: "Use our advanced search filters to find properties by location (Accra, Kumasi, etc.), price range, property type (house, apartment, land), number of bedrooms/bathrooms, and listing type (sale or rent). You can also search by specific keywords like 'East Legon', 'gated community', or 'swimming pool'.",
        },
        {
          q: "Are Dwellot properties verified?",
          a: "Yes, our team verifies all property listings before publishing. We check agent credentials, property documentation, and listing accuracy. However, we recommend buyers conduct their own due diligence including property searches at the Lands Commission and physical inspections.",
        },
        {
          q: "How do I contact property agents?",
          a: "Each property listing shows the agent's phone number and WhatsApp button. Simply click to call or message them directly. Agents typically respond within 24 hours and can arrange property viewings, answer questions, and provide additional information.",
        },
      ],
    },
    {
      category: "Property Investment",
      questions: [
        {
          q: "What is the average ROI for rental property in Ghana?",
          a: "Average rental yields in Ghana range from 6-10% annually in Accra, with higher yields (8-12%) possible in growing areas like Appolonia City and Tema. Property appreciation averages 5-8% per year. Best returns come from well-located properties near schools, shopping centers, and business districts.",
        },
        {
          q: "Should I buy land or developed property in Ghana?",
          a: "Both have advantages. Land is cheaper and offers development flexibility but requires time, money, and management to build. Developed property provides immediate income but costs more upfront. For investors, developed properties in good locations offer better returns with less hassle. Land works well for long-term appreciation plays.",
        },
        {
          q: "What are the costs of buying property in Ghana?",
          a: "Budget for: property price (main cost), legal fees (1-2% of property value), land registration fees (1-2%), stamp duty (0.5%), surveyor fees ($500-$2,000), property search fees ($100-$300), and estate agent fees (typically 5% paid by seller). Total transaction costs are typically 3-5% of purchase price.",
        },
      ],
    },
  ]

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.flatMap((section) =>
      section.questions.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a,
        },
      })),
    ),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-teal-50 to-background py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <HelpCircle className="h-16 w-16 text-teal-600 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-4">Ghana Property Questions Answered</h1>
              <p className="text-xl text-muted-foreground">
                Everything you need to know about buying, renting, and investing in property across Ghana
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {faqs.map((section, idx) => (
                <div key={idx} className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">{section.category}</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {section.questions.map((faq, qIdx) => (
                      <AccordionItem key={qIdx} value={`${idx}-${qIdx}`}>
                        <AccordionTrigger className="text-left font-semibold">{faq.q}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">{faq.a}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>

            {/* Contact Card */}
            <Card className="max-w-2xl mx-auto mt-12">
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
                <p className="text-muted-foreground mb-4">
                  Can't find the answer you're looking for? Our support team is here to help.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Link href="/contact">
                    <Button className="bg-teal-600 hover:bg-teal-700">Contact Support</Button>
                  </Link>
                  <a href="https://wa.me/233201578429?text=Hi%20Dwellot!%20I%20have%20a%20question%20that%20isn't%20covered%20in%20your%20FAQ." target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">WhatsApp Chat</Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  )
}
