"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { TrendingUp, Users, Shield, ArrowRight } from "lucide-react"

export default function SellPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-teal-50 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Sell Your Property with Dwellot</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Get the best value for your property with our professional service and wide network of buyers
            </p>
            <Link href="/agent-collection-form">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                List Your Property <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Sell With Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-teal-600 mb-4" />
                <CardTitle>Best Market Price</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We help you get the best market value for your property with professional valuations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-teal-600 mb-4" />
                <CardTitle>Wide Buyer Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access to thousands of potential buyers actively looking for properties in Ghana
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-teal-600 mb-4" />
                <CardTitle>Secure Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Safe and secure property transactions with proper legal documentation
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {[
              { step: 1, title: "List Your Property", desc: "Fill out our simple form with property details" },
              { step: 2, title: "Get Verified", desc: "Our team verifies your property and documentation" },
              { step: 3, title: "Market Exposure", desc: "Your property gets listed and marketed to buyers" },
              { step: 4, title: "Close the Deal", desc: "We handle negotiations and legal paperwork" },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Sell Your Property?</h2>
          <p className="text-xl text-muted-foreground mb-8">Join hundreds of satisfied property sellers</p>
          <Link href="/agent-collection-form">
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
