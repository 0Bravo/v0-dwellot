"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Shield, Mail } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Shield className="h-16 w-16 text-teal-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: January 11, 2026</p>
          </div>

          <Card>
            <CardContent className="p-8 prose prose-slate max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                <p>
                  Dwellot ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains
                  how we collect, use, disclose, and safeguard your information when you use our platform.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
                <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
                <p>We may collect personal information that you provide to us, including:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Name and contact information (email, phone number)</li>
                  <li>Account credentials</li>
                  <li>Property listing information</li>
                  <li>Communication preferences</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Usage Data</h3>
                <p>We automatically collect certain information when you use our platform:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Browser type and version</li>
                  <li>IP address</li>
                  <li>Pages visited and time spent</li>
                  <li>Search queries and filters used</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Provide and maintain our services</li>
                  <li>Process property listings and transactions</li>
                  <li>Communicate with you about our services</li>
                  <li>Improve our platform and user experience</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Information Sharing</h2>
                <p>We may share your information with:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Property agents and sellers when you inquire about listings</li>
                  <li>Service providers who assist in operating our platform</li>
                  <li>Legal authorities when required by law</li>
                </ul>
                <p>We do not sell your personal information to third parties.</p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Data Security</h2>
                <p>
                  We implement appropriate security measures to protect your personal information. However, no method of
                  transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Cookies</h2>
                <p>
                  We use cookies and similar tracking technologies to enhance your experience. You can control cookie
                  settings through your browser preferences.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <p>If you have questions about this Privacy Policy, please contact us:</p>
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
