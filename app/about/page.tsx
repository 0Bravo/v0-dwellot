"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Home, Users, Shield, TrendingUp, MapPin, Phone, Mail } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-teal-50 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Dwellot</h1>
            <p className="text-xl text-muted-foreground">
              Ghana's leading real estate platform connecting buyers, sellers, and renters
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Dwellot is committed to simplifying the property buying, selling, and renting process in Ghana. We provide
              a transparent, secure, and efficient platform that connects property seekers with verified listings and
              trusted agents.
            </p>
            <p className="text-lg text-muted-foreground">
              Our goal is to make real estate transactions accessible to everyone, ensuring that finding your dream home
              or investment property is a seamless experience.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Home className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Quality Listings</h3>
                <p className="text-sm text-muted-foreground">Only verified, high-quality properties on our platform</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Transparency</h3>
                <p className="text-sm text-muted-foreground">Clear pricing and honest property information</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Customer First</h3>
                <p className="text-sm text-muted-foreground">Your satisfaction is our top priority</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Innovation</h3>
                <p className="text-sm text-muted-foreground">Using technology to improve real estate</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Phone className="h-5 w-5 text-teal-600" />
                <span className="text-lg">+233 275 577 577</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Mail className="h-5 w-5 text-teal-600" />
                <span className="text-lg">support@dwellot.com</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <MapPin className="h-5 w-5 text-teal-600" />
                <span className="text-lg">Accra, Ghana</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
