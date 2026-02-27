import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import {
  Home,
  Upload,
  Camera,
  MapPin,
  DollarSign,
  Users,
  Shield,
  TrendingUp,
  CheckCircle,
  ChevronRight,
  LogIn,
} from "lucide-react"

export const metadata = {
  title: "List Your Property | Dwellot",
  description:
    "List your property for sale or rent on Dwellot. Reach thousands of potential buyers and renters across Ghana.",
}

export default async function AddPropertyPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is logged in, redirect to dashboard add property
  if (user) {
    redirect("/dashboard/properties/new")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-teal-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-full mb-4">
            <Home className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 text-balance">
            List Your Property on Dwellot
          </h1>
          <p className="text-teal-100 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Reach thousands of buyers and renters looking for properties in Ghana
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth?redirect=/dashboard/properties/new"
              className="inline-flex items-center justify-center gap-2 bg-white text-teal-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-teal-50 transition"
            >
              <LogIn className="w-5 h-5" />
              Sign In to List Property
            </Link>
            <Link
              href="/agent-collection-form"
              className="inline-flex items-center justify-center gap-2 bg-teal-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-teal-500 transition border border-teal-500"
            >
              Register as Agent
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">How It Works</h2>
          <p className="text-gray-600 text-center mb-12 max-w-xl mx-auto">
            List your property in just 3 simple steps
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="text-2xl font-bold text-teal-700">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Create Account</h3>
              <p className="text-gray-600">
                Sign up for free with your email or phone number. Verification takes less than a minute.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="text-2xl font-bold text-teal-700">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Add Property Details</h3>
              <p className="text-gray-600">
                Enter your property information, upload photos, and set your price. Our form guides you through it.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="text-2xl font-bold text-teal-700">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get Enquiries</h3>
              <p className="text-gray-600">
                Your listing goes live and interested buyers/renters contact you directly via WhatsApp or phone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Why List on Dwellot?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-teal-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Reach More Buyers</h3>
              <p className="text-gray-600 text-sm">
                Thousands of active property seekers browse Dwellot every month looking for homes in Ghana.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-teal-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Easy Photo Upload</h3>
              <p className="text-gray-600 text-sm">
                Upload multiple high-quality photos to showcase your property. First impressions matter.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-teal-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Location Mapping</h3>
              <p className="text-gray-600 text-sm">
                Pin your exact location on the map so buyers can easily find and visit your property.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-teal-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Free Basic Listing</h3>
              <p className="text-gray-600 text-sm">
                List your property for free. Only pay for premium features if you want more visibility.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-teal-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Platform</h3>
              <p className="text-gray-600 text-sm">
                Your contact details are protected. Control who can reach you and how.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-teal-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Track Performance</h3>
              <p className="text-gray-600 text-sm">
                See how many people view your listing and track enquiries from your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bulk Upload Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 md:p-12 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 text-balance">
              Have Multiple Properties?
            </h2>
            <p className="text-teal-100 text-lg mb-8 max-w-xl mx-auto">
              Use our bulk upload feature to list multiple properties at once using a simple spreadsheet.
            </p>
            <Link
              href="/auth?redirect=/dashboard/properties/bulk"
              className="inline-flex items-center gap-2 bg-white text-teal-700 px-8 py-3 rounded-lg font-bold hover:bg-teal-50 transition"
            >
              Try Bulk Upload
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial/Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-teal-700 mb-2">500+</p>
              <p className="text-gray-600">Properties Listed</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-teal-700 mb-2">10K+</p>
              <p className="text-gray-600">Monthly Visitors</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-teal-700 mb-2">50+</p>
              <p className="text-gray-600">Active Agents</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-teal-700 mb-2">8</p>
              <p className="text-gray-600">Cities Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-balance">
            Ready to List Your Property?
          </h2>
          <p className="text-gray-600 mb-8">
            Join hundreds of property owners and agents who trust Dwellot to connect them with serious buyers.
          </p>

          <div className="space-y-4">
            <Link
              href="/auth?redirect=/dashboard/properties/new"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-teal-700 transition"
            >
              Get Started Free
              <ChevronRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/auth" className="text-teal-600 hover:text-teal-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Free to list
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-600" />
              No hidden fees
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Cancel anytime
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
