"use client"

import { Button } from "@/components/ui/button"
import { Printer, Download, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AgentCollectionForm() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header - Hidden when printing */}
      <div className="print:hidden bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex gap-2">
            <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2 bg-transparent">
              <Printer className="h-4 w-4" />
              Print Form
            </Button>
            <Button onClick={handlePrint} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700">
              <Download className="h-4 w-4" />
              Save as PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Printable Form */}
      <div className="max-w-4xl mx-auto p-8 print:p-0 print:max-w-none">
        <div className="bg-white shadow-lg print:shadow-none p-8 space-y-6">
          {/* Header */}
          <div className="border-b-2 border-teal-600 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dwellot</h1>
                <p className="text-gray-600">Property Listing Collection Form</p>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>Date: _________________</p>
                <p>Ref #: _________________</p>
              </div>
            </div>
          </div>

          {/* Section 1: Agent/Developer Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white bg-teal-600 px-4 py-2 -mx-8 print:-mx-8">
              SECTION 1: Agent/Developer Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Contact Name *</label>
                <div className="border-b border-gray-400 h-8"></div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Company/Agency Name *</label>
                <div className="border-b border-gray-400 h-8"></div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                <div className="border-b border-gray-400 h-8"></div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Email Address *</label>
                <div className="border-b border-gray-400 h-8"></div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">WhatsApp Number</label>
                <div className="border-b border-gray-400 h-8"></div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">License Number (if applicable)</label>
                <div className="border-b border-gray-400 h-8"></div>
              </div>
            </div>
          </div>

          {/* Section 2: Property Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white bg-teal-600 px-4 py-2 -mx-8">SECTION 2: Property Details</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Property Title *</label>
                <div className="border-b border-gray-400 h-8"></div>
                <p className="text-xs text-gray-500">e.g., "4 Bedroom Executive House in East Legon"</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Property Type *</label>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {["House", "Apartment", "Land", "Commercial", "Office"].map((type) => (
                      <label key={type} className="flex items-center gap-1">
                        <div className="w-4 h-4 border border-gray-400"></div>
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Listing Type *</label>
                  <div className="flex gap-6 mt-2">
                    <label className="flex items-center gap-1">
                      <div className="w-4 h-4 border border-gray-400"></div>
                      <span className="text-sm">For Sale</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <div className="w-4 h-4 border border-gray-400"></div>
                      <span className="text-sm">For Rent</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Price (USD) *</label>
                  <div className="border-b border-gray-400 h-8"></div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Location/Address *</label>
                  <div className="border-b border-gray-400 h-8"></div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Full Description *</label>
                <div className="border border-gray-400 h-24"></div>
                <p className="text-xs text-gray-500">
                  Detailed description of the property (minimum 100 words recommended)
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Property Specifications */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white bg-teal-600 px-4 py-2 -mx-8">
              SECTION 3: Property Specifications
            </h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Bedrooms *</label>
                <div className="border-b border-gray-400 h-8"></div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Bathrooms *</label>
                <div className="border-b border-gray-400 h-8"></div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Size (sq ft) *</label>
                <div className="border-b border-gray-400 h-8"></div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Parking Spaces</label>
                <div className="border-b border-gray-400 h-8"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Year Built</label>
                <div className="border-b border-gray-400 h-8"></div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Plot Size (if applicable)</label>
                <div className="border-b border-gray-400 h-8"></div>
              </div>
            </div>
          </div>

          {/* Section 4: Amenities */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white bg-teal-600 px-4 py-2 -mx-8">
              SECTION 4: Amenities (Check all that apply)
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                "Swimming Pool",
                "Security/Gated",
                "Gym/Fitness",
                "Garden/Yard",
                "Garage",
                "Air Conditioning",
                "Furnished",
                "Semi-Furnished",
                "Boys Quarters (BQ)",
                "Backup Generator",
                "Borehole/Water Storage",
                "CCTV Cameras",
                "Internet Ready",
                "Balcony/Terrace",
                "Store Room",
                "Laundry Room",
                "Staff Quarters",
                "Elevator/Lift",
              ].map((amenity) => (
                <label key={amenity} className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-gray-400 flex-shrink-0"></div>
                  <span className="text-sm">{amenity}</span>
                </label>
              ))}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Other Amenities</label>
              <div className="border-b border-gray-400 h-8"></div>
            </div>
          </div>

          {/* Section 5: Images */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white bg-teal-600 px-4 py-2 -mx-8">
              SECTION 5: Images (Minimum 5 Required)
            </h2>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Image Requirements:</p>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Minimum 5 high-quality photos</li>
                <li>Format: JPG or PNG</li>
                <li>Minimum resolution: 1200 x 800 pixels</li>
                <li>No watermarks from other platforms</li>
                <li>Well-lit, clear photos only</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Required Photos Checklist:</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Exterior/Front View",
                  "Living Room",
                  "Kitchen",
                  "Master Bedroom",
                  "Bathroom",
                  "Additional Rooms",
                  "Compound/Yard",
                  "Special Features (Pool, etc.)",
                ].map((photo) => (
                  <label key={photo} className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-gray-400"></div>
                    <span className="text-sm">{photo}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">How will images be sent?</label>
              <div className="flex gap-4 mt-2">
                {["WhatsApp", "Email", "Google Drive", "Dropbox", "USB/Physical"].map((method) => (
                  <label key={method} className="flex items-center gap-1">
                    <div className="w-4 h-4 border border-gray-400"></div>
                    <span className="text-sm">{method}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Section 6: Additional Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white bg-teal-600 px-4 py-2 -mx-8">
              SECTION 6: Additional Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Virtual Tour Link (YouTube/Matterport)</label>
                <div className="border-b border-gray-400 h-8"></div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Floor Plan Available?</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-1">
                    <div className="w-4 h-4 border border-gray-400"></div>
                    <span className="text-sm">Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <div className="w-4 h-4 border border-gray-400"></div>
                    <span className="text-sm">No</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Nearby Landmarks/Facilities</label>
              <div className="border-b border-gray-400 h-8"></div>
              <p className="text-xs text-gray-500">e.g., Schools, Hospitals, Shopping Centers, Main Roads</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Special Notes/Instructions</label>
              <div className="border border-gray-400 h-16"></div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="border-t-2 border-gray-300 pt-6 mt-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Agent/Developer Signature</label>
                <div className="border-b border-gray-400 h-12"></div>
                <p className="text-xs text-gray-500">Date: _________________</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Collected By (Dwellot Rep)</label>
                <div className="border-b border-gray-400 h-12"></div>
                <p className="text-xs text-gray-500">Date: _________________</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 pt-4 border-t">
            <p>Dwellot - Ghana's Premier Property Listing Platform</p>
            <p>www.dwellot.com | support@dwellot.com</p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          @page {
            size: A4;
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  )
}
