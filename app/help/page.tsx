"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { MessageSquare, Phone, Mail, HelpCircle } from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-teal-50 to-background py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <HelpCircle className="h-16 w-16 text-teal-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">How Can We Help You?</h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions or contact our support team
            </p>
          </div>
        </div>
      </section>

      {/* Quick Help Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            <Card className="text-center">
              <CardContent className="p-6">
                <MessageSquare className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-4">Chat with our support team on WhatsApp</p>
                <a href="https://wa.me/233201578429?text=Hi%20Dwellot!%20I%20need%20help%20with%20something%20on%20your%20platform." target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full bg-transparent">
                    Start Chat
                  </Button>
                </a>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Phone className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-sm text-muted-foreground mb-4">Speak directly with our team</p>
                <a href="tel:+233201578429">
                  <Button variant="outline" className="w-full bg-transparent">
                    020 157 8429
                  </Button>
                </a>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Mail className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground mb-4">Send us your questions</p>
                <a href="mailto:support@dwellot.com">
                  <Button variant="outline" className="w-full bg-transparent">
                    Email Us
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Common Questions */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Common Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I list my property?</AccordionTrigger>
                <AccordionContent>
                  You can list your property by visiting our agent collection form. Fill in the required details about
                  your property, upload photos, and our team will review and publish your listing.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>What are the listing fees?</AccordionTrigger>
                <AccordionContent>
                  Contact our support team at support@dwellot.com or call 020 157 8429 for information about listing
                  fees and packages.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>How do I contact a property agent?</AccordionTrigger>
                <AccordionContent>
                  Each property listing includes the agent's contact information. You can call or WhatsApp them directly
                  from the property details page.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Are property photos required?</AccordionTrigger>
                <AccordionContent>
                  Yes, we recommend adding high-quality photos of your property to attract more potential buyers or
                  renters. Properties with photos receive significantly more inquiries.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>How long does verification take?</AccordionTrigger>
                <AccordionContent>
                  Property verification typically takes 1-2 business days. Our team reviews all submitted information to
                  ensure quality and accuracy before publishing.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">Still have questions?</p>
              <Link href="/contact">
                <Button className="bg-teal-600 hover:bg-teal-700">Contact Support</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
