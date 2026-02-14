import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Home } from "lucide-react"
import NewsletterSubscribe from "./NewsletterSubscribe"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSubscribe variant="footer" source="footer" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold">Dwellot</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your trusted partner in finding the perfect home. We connect buyers, sellers, and renters across Ghana
              with premium real estate services.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties" className="text-gray-400 hover:text-white transition-colors">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link href="/sell" className="text-gray-400 hover:text-white transition-colors">
                  Sell Property
                </Link>
              </li>
              <li>
                <Link href="/rent" className="text-gray-400 hover:text-white transition-colors">
                  Rent Property
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-4 text-sm">
              {/* Ghana Office */}
              <div>
                <p className="text-white font-medium mb-1.5">Ghana Office</p>
                <div className="space-y-1.5">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-400">Accra, Ghana</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-400">020 157 8429</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-400">055 259 9185</span>
                  </div>
                </div>
              </div>

              {/* UK Office */}
              <div>
                <p className="text-white font-medium mb-1.5">UK Office</p>
                <div className="space-y-1.5">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-400">
                      86-90 Paul Street
                      <br />
                      London EC2A 4NE
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-400">+44 7861 932209</span>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-400">support@dwellot.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Dwellot. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
