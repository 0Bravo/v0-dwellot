"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileText, Mail } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <FileText className="h-16 w-16 text-teal-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: January 11, 2026</p>
          </div>

          <Card>
            <CardContent className="p-8 prose prose-slate max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
                <p>
                  By accessing and using Dwellot, you accept and agree to be bound by these Terms of Service. If you do
                  not agree to these terms, please do not use our platform.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Use of Platform</h2>
                <h3 className="text-xl font-semibold mb-3">Eligibility</h3>
                <p>You must be at least 18 years old to use Dwellot's services.</p>

                <h3 className="text-xl font-semibold mb-3 mt-4">Permitted Use</h3>
                <p>You agree to use our platform only for lawful purposes and in accordance with these Terms.</p>

                <h3 className="text-xl font-semibold mb-3 mt-4">Prohibited Activities</h3>
                <p>You may not:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Post false, misleading, or fraudulent property listings</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use automated systems to access the platform</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Property Listings</h2>
                <h3 className="text-xl font-semibold mb-3">Listing Requirements</h3>
                <p>Property listings must:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Contain accurate and truthful information</li>
                  <li>Include clear, recent photographs</li>
                  <li>Comply with local housing laws</li>
                  <li>Not discriminate based on protected characteristics</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-4">Verification</h3>
                <p>
                  We reserve the right to verify property information and may remove listings that violate our policies.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">User Accounts</h2>
                <p>You are responsible for:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized access</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
                <p>
                  All content on Dwellot, including text, graphics, logos, and software, is our property or that of our
                  licensors and is protected by intellectual property laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
                <p>
                  Dwellot is a platform that connects property seekers with property providers. We do not guarantee the
                  accuracy of listings or the conduct of users. We are not liable for:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Property condition or ownership disputes</li>
                  <li>Agreements or transactions between users</li>
                  <li>Indirect or consequential damages</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Dispute Resolution</h2>
                <p>
                  Any disputes arising from these Terms shall be resolved through good faith negotiations. If
                  unresolved, disputes will be subject to the jurisdiction of Ghanaian courts.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
                <p>
                  We may modify these Terms at any time. Continued use of the platform after changes constitutes
                  acceptance of the modified Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <p>For questions about these Terms, contact us:</p>
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
