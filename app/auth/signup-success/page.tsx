import Link from "next/link"
import { Mail, CheckCircle } from "lucide-react"

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Check your email</h2>
        <p className="mt-2 text-center text-sm text-gray-600">We&apos;ve sent you a confirmation link</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <Mail className="mx-auto h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Verify your email address</h3>
            <p className="text-sm text-gray-600 mb-6">
              {/* We've sent a confirmation email to your inbox. Please click the link in the email to verify your account */}
              {/* and complete your registration. */}
              We&apos;ve sent a confirmation email to your inbox. Please click the link in the email to verify your
              account and complete your registration.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Important:</strong> You won&apos;t be able to sign in until you verify your email address.
              </p>
            </div>
            <p className="text-xs text-gray-500 mb-6">
              Didn&apos;t receive the email? Check your spam folder or contact support.
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
