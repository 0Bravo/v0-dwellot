"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Cookie, Mail } from "lucide-react"

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Cookie className="h-16 w-16 text-teal-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
            <p className="text-muted-foreground">Last updated: January 11, 2026</p>
          </div>

          <Card>
            <CardContent className="p-8 prose prose-slate max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">What Are Cookies</h2>
                <p>
                  Cookies are small text files stored on your device when you visit our website. They help us provide
                  you with a better experience by remembering your preferences and understanding how you use our
                  platform.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">How We Use Cookies</h2>
                <p>We use cookies to:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Keep you signed in to your account</li>
                  <li>Remember your search preferences and filters</li>
                  <li>Understand how you interact with our platform</li>
                  <li>Improve our services and user experience</li>
                  <li>Show you relevant property listings</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Types of Cookies We Use</h2>

                <h3 className="text-xl font-semibold mb-3">Essential Cookies</h3>
                <p>
                  These cookies are necessary for the website to function properly. They enable core functionality such
                  as security, authentication, and accessibility.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-4">Performance Cookies</h3>
                <p>
                  These cookies help us understand how visitors interact with our website by collecting anonymous
                  information about page visits and user behavior.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-4">Functional Cookies</h3>
                <p>
                  These cookies allow the website to remember choices you make (such as language or region) and provide
                  enhanced, personalized features.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-4">Analytics Cookies</h3>
                <p>
                  We use analytics cookies to understand how users navigate our site, which pages are most popular, and
                  how we can improve the user experience.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Third-Party Cookies</h2>
                <p>
                  We may use third-party services (such as Google Analytics) that also place cookies on your device.
                  These cookies are subject to the respective privacy policies of these external services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Managing Cookies</h2>
                <p>You can control and manage cookies through your browser settings. Most browsers allow you to:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>View cookies stored on your device</li>
                  <li>Delete existing cookies</li>
                  <li>Block cookies from specific websites</li>
                  <li>Block all cookies</li>
                  <li>Delete cookies when you close your browser</li>
                </ul>
                <p>
                  Please note that blocking or deleting cookies may affect your experience on our website and limit
                  certain functionality.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Updates to This Policy</h2>
                <p>
                  We may update this Cookie Policy from time to time. We will notify you of any changes by posting the
                  new policy on this page with an updated revision date.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <p>If you have questions about our use of cookies, please contact us:</p>
                <div className="flex items-center gap-2 mt-2">
                  <Mail className="h-5 w-5 text-teal-600" />
                  <a href="mailto:support@dwellot.com" className="text-teal-600 hover:underline">
                    support@dwellot.com
                  </a>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
