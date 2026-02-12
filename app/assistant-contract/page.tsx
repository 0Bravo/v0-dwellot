"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Printer, Download, FileText, ClipboardList } from "lucide-react"
import { useState } from "react"

export default function AssistantContractPage() {
  const [activeTab, setActiveTab] = useState<"contract" | "onboarding">("contract")

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - hidden when printing */}
      <div className="bg-white border-b print:hidden">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Assistant Documentation</h1>
          <p className="text-gray-600 mt-1">Employment contract and onboarding materials</p>

          <div className="flex gap-4 mt-6">
            <Button
              variant={activeTab === "contract" ? "default" : "outline"}
              onClick={() => setActiveTab("contract")}
              className={activeTab === "contract" ? "bg-teal-600 hover:bg-teal-700" : ""}
            >
              <FileText className="w-4 h-4 mr-2" />
              Employment Contract
            </Button>
            <Button
              variant={activeTab === "onboarding" ? "default" : "outline"}
              onClick={() => setActiveTab("onboarding")}
              className={activeTab === "onboarding" ? "bg-teal-600 hover:bg-teal-700" : ""}
            >
              <ClipboardList className="w-4 h-4 mr-2" />
              Onboarding Checklist
            </Button>
          </div>
        </div>
      </div>

      {/* Print Actions - hidden when printing */}
      <div className="container mx-auto px-4 py-4 print:hidden">
        <div className="flex gap-3">
          <Button onClick={handlePrint} className="bg-teal-600 hover:bg-teal-700">
            <Printer className="w-4 h-4 mr-2" />
            Print Document
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Download className="w-4 h-4 mr-2" />
            Save as PDF
          </Button>
        </div>
      </div>

      {/* Contract Document */}
      {activeTab === "contract" && (
        <div className="container mx-auto px-4 py-6 print:p-0">
          <Card className="max-w-4xl mx-auto print:shadow-none print:border-none">
            <CardContent className="p-8 md:p-12 print:p-8">
              {/* Letterhead */}
              <div className="text-center border-b-2 border-teal-600 pb-6 mb-8">
                <h1 className="text-3xl font-bold text-teal-600">DWELLOT</h1>
                <p className="text-gray-600 mt-1">Ghana&apos;s Premier Real Estate Platform</p>
                <p className="text-sm text-gray-500 mt-2">www.dwellot.com | support@dwellot.com</p>
              </div>

              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">EMPLOYMENT CONTRACT</h2>
              <p className="text-center text-gray-600 mb-8">Property Listing Coordinator</p>

              {/* Parties */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">1. PARTIES</h3>
                <p className="text-gray-700 mb-4">
                  This Employment Contract (&quot;Contract&quot;) is entered into on this _____ day of _______________,
                  20___
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900">EMPLOYER:</p>
                    <p className="text-gray-700">Dwellot Limited</p>
                    <p className="text-gray-600 text-sm mt-2">Address: _______________________</p>
                    <p className="text-gray-600 text-sm">Ghana</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900">EMPLOYEE:</p>
                    <p className="text-gray-700">Name: _________________________</p>
                    <p className="text-gray-600 text-sm mt-2">ID/Passport: ___________________</p>
                    <p className="text-gray-600 text-sm">Address: _______________________</p>
                  </div>
                </div>
              </section>

              {/* Position */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">2. POSITION & DUTIES</h3>
                <p className="text-gray-700 mb-4">
                  <strong>Job Title:</strong> Property Listing Coordinator
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>Employment Type:</strong> ☐ Full-time &nbsp;&nbsp; ☐ Part-time &nbsp;&nbsp; ☐ Contract
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Primary Responsibilities:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Contact and build relationships with real estate agents and developers</li>
                  <li>Collect complete property information using official Dwellot forms</li>
                  <li>Gather high-quality property images (minimum 5 per listing)</li>
                  <li>Enter property data accurately into the Dwellot platform</li>
                  <li>Maintain regular follow-ups with agents for new listings</li>
                  <li>Submit weekly progress reports to management</li>
                  <li>Ensure data accuracy rate of 95% or higher</li>
                </ul>
              </section>

              {/* Compensation */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">3. COMPENSATION</h3>

                <div className="bg-teal-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold text-gray-900 mb-2">Base Salary:</p>
                  <p className="text-gray-700">GHS _____________ per month</p>
                </div>

                <p className="text-gray-700 mb-2">
                  <strong>Performance Bonuses:</strong>
                </p>
                <table className="w-full border-collapse border border-gray-300 mb-4">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Metric</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Bonus Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Per property listed (after first 10)</td>
                      <td className="border border-gray-300 px-4 py-2">GHS __________</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Per new agent partnership</td>
                      <td className="border border-gray-300 px-4 py-2">GHS __________</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Monthly target bonus (if exceeded by 20%+)</td>
                      <td className="border border-gray-300 px-4 py-2">GHS __________</td>
                    </tr>
                  </tbody>
                </table>

                <p className="text-gray-700 mb-2">
                  <strong>Allowances:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Transportation: GHS __________ per month</li>
                  <li>Phone/Data: GHS __________ per month</li>
                </ul>

                <p className="text-gray-700 mt-4">
                  <strong>Payment Schedule:</strong> Salary paid bi-weekly on the 1st and 15th of each month.
                  Performance bonuses paid at month-end after review.
                </p>
              </section>

              {/* Targets */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">4. PERFORMANCE TARGETS</h3>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Deliverable</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Monthly Target</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Agents/Developers Contacted</td>
                      <td className="border border-gray-300 px-4 py-2">30-50</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Property Data Forms Completed</td>
                      <td className="border border-gray-300 px-4 py-2">20-30</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Properties Uploaded to Platform</td>
                      <td className="border border-gray-300 px-4 py-2">15-20</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Property Images Collected</td>
                      <td className="border border-gray-300 px-4 py-2">100-150</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Data Accuracy Rate</td>
                      <td className="border border-gray-300 px-4 py-2">95%+</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Weekly Reports Submitted</td>
                      <td className="border border-gray-300 px-4 py-2">4</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              {/* Duration */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">5. DURATION & PROBATION</h3>
                <p className="text-gray-700 mb-2">
                  <strong>Contract Start Date:</strong> ___________________
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Contract Type:</strong> ☐ Fixed Term (_____ months) &nbsp;&nbsp; ☐ Indefinite
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Probation Period:</strong> 3 months from start date
                </p>
                <p className="text-gray-700">
                  During probation, either party may terminate with 1 week written notice. After probation, 2 weeks
                  notice is required.
                </p>
              </section>

              {/* Working Hours */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">6. WORKING HOURS</h3>
                <p className="text-gray-700 mb-2">
                  <strong>Full-time:</strong> Monday to Friday, 9:00 AM - 5:00 PM (40 hours/week)
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Part-time:</strong> _____ hours per week, schedule to be agreed
                </p>
                <p className="text-gray-700">
                  Remote work is permitted with prior approval. Field visits to agents/properties may be required as
                  part of duties.
                </p>
              </section>

              {/* Confidentiality */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">7. CONFIDENTIALITY</h3>
                <p className="text-gray-700">
                  The Employee agrees to maintain strict confidentiality regarding all business information, agent
                  contacts, property data, and proprietary systems of Dwellot. This obligation continues for 2 years
                  after termination of employment. Breach of confidentiality may result in immediate termination and
                  legal action.
                </p>
              </section>

              {/* Termination */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">8. TERMINATION</h3>
                <p className="text-gray-700 mb-2">This contract may be terminated:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>By mutual written agreement</li>
                  <li>By either party with 2 weeks written notice (after probation)</li>
                  <li>Immediately by Employer for gross misconduct, fraud, or breach of confidentiality</li>
                  <li>Upon expiry of fixed term (if applicable)</li>
                </ul>
              </section>

              {/* Signatures */}
              <section className="mt-12">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b pb-2">9. SIGNATURES</h3>
                <p className="text-gray-700 mb-8">
                  By signing below, both parties agree to the terms and conditions outlined in this contract.
                </p>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="font-semibold text-gray-900 mb-4">FOR EMPLOYER (Dwellot):</p>
                    <div className="border-b border-gray-400 mb-2 h-12"></div>
                    <p className="text-sm text-gray-600">Signature</p>
                    <div className="border-b border-gray-400 mb-2 h-8 mt-4"></div>
                    <p className="text-sm text-gray-600">Name & Title</p>
                    <div className="border-b border-gray-400 mb-2 h-8 mt-4"></div>
                    <p className="text-sm text-gray-600">Date</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-4">EMPLOYEE:</p>
                    <div className="border-b border-gray-400 mb-2 h-12"></div>
                    <p className="text-sm text-gray-600">Signature</p>
                    <div className="border-b border-gray-400 mb-2 h-8 mt-4"></div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <div className="border-b border-gray-400 mb-2 h-8 mt-4"></div>
                    <p className="text-sm text-gray-600">Date</p>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <div className="mt-12 pt-6 border-t text-center text-sm text-gray-500">
                <p>This contract is governed by the laws of the Republic of Ghana</p>
                <p className="mt-1">Dwellot Limited - All Rights Reserved</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Onboarding Checklist */}
      {activeTab === "onboarding" && (
        <div className="container mx-auto px-4 py-6 print:p-0">
          <Card className="max-w-4xl mx-auto print:shadow-none print:border-none">
            <CardContent className="p-8 md:p-12 print:p-8">
              {/* Letterhead */}
              <div className="text-center border-b-2 border-teal-600 pb-6 mb-8">
                <h1 className="text-3xl font-bold text-teal-600">DWELLOT</h1>
                <p className="text-gray-600 mt-1">Ghana&apos;s Premier Real Estate Platform</p>
              </div>

              <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">ONBOARDING CHECKLIST</h2>
              <p className="text-center text-gray-600 mb-8">Property Listing Coordinator</p>

              <div className="bg-teal-50 p-4 rounded-lg mb-8">
                <p className="text-gray-700">
                  <strong>Employee Name:</strong> ________________________________
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Start Date:</strong> ________________________________
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Supervisor:</strong> ________________________________
                </p>
              </div>

              {/* Day 1 */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-white bg-teal-600 px-4 py-2 rounded-t-lg">
                  DAY 1 - Welcome & Setup
                </h3>
                <div className="border border-t-0 border-gray-300 rounded-b-lg p-4">
                  <div className="space-y-3">
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Sign employment contract</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Receive company welcome pack and ID badge</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">
                        Set up Dwellot email account: _____________@support.dwellot.com
                      </span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Create Dwellot platform account with admin access</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Introduction to team members and key contacts</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Review company mission, vision, and values</span>
                    </label>
                  </div>
                </div>
              </section>

              {/* Day 2-3 */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-white bg-teal-600 px-4 py-2 rounded-t-lg">
                  DAY 2-3 - Platform Training
                </h3>
                <div className="border border-t-0 border-gray-300 rounded-b-lg p-4">
                  <div className="space-y-3">
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Complete Dwellot platform walkthrough</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Learn how to add new property listings</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Practice uploading images and setting featured properties</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Learn how to edit and delete listings</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Understand property types, listing types, and categories</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Review dashboard and reporting features</span>
                    </label>
                  </div>
                </div>
              </section>

              {/* Day 4-5 */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-white bg-teal-600 px-4 py-2 rounded-t-lg">
                  DAY 4-5 - Data Collection Training
                </h3>
                <div className="border border-t-0 border-gray-300 rounded-b-lg p-4">
                  <div className="space-y-3">
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Review Property Data Collection Form</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Understand all required fields and data formats</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Learn image requirements (quality, size, angles)</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Practice using Excel template for data capture</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Role-play agent phone calls and data collection scenarios</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Review common amenities and property features in Ghana</span>
                    </label>
                  </div>
                </div>
              </section>

              {/* Week 2 */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-white bg-teal-600 px-4 py-2 rounded-t-lg">
                  WEEK 2 - Agent Outreach Training
                </h3>
                <div className="border border-t-0 border-gray-300 rounded-b-lg p-4">
                  <div className="space-y-3">
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Receive list of target agents/developers to contact</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Review agent outreach scripts and talking points</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Learn Dwellot value proposition for agents</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Practice cold calling with supervisor feedback</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Make first 10 real agent calls (supervised)</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Set up CRM/tracking system for agent contacts</span>
                    </label>
                  </div>
                </div>
              </section>

              {/* Tools & Resources */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-white bg-teal-600 px-4 py-2 rounded-t-lg">
                  TOOLS & RESOURCES PROVIDED
                </h3>
                <div className="border border-t-0 border-gray-300 rounded-b-lg p-4">
                  <div className="space-y-3">
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Dwellot admin dashboard access credentials</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Property Data Collection Forms (printed copies)</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Excel template for data capture</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Agent contact list / database</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Dwellot branding materials for agent meetings</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Phone/data allowance activated</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Transportation allowance set up</span>
                    </label>
                  </div>
                </div>
              </section>

              {/* Key Links */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Links & Resources</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="text-gray-700">
                    <strong>Dwellot Platform:</strong> www.dwellot.com
                  </p>
                  <p className="text-gray-700">
                    <strong>Admin Dashboard:</strong> www.dwellot.com/dashboard
                  </p>
                  <p className="text-gray-700">
                    <strong>Add Property:</strong> www.dwellot.com/admin/add-property
                  </p>
                  <p className="text-gray-700">
                    <strong>Data Collection Form:</strong> www.dwellot.com/agent-collection-form
                  </p>
                  <p className="text-gray-700">
                    <strong>Branding Materials:</strong> www.dwellot.com/brand
                  </p>
                </div>
              </section>

              {/* Week 3-4 */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-white bg-teal-600 px-4 py-2 rounded-t-lg">
                  WEEK 3-4 - Independent Work & Review
                </h3>
                <div className="border border-t-0 border-gray-300 rounded-b-lg p-4">
                  <div className="space-y-3">
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Begin independent agent outreach</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Upload first 5 properties independently</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Submit first weekly report</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Week 2 review meeting with supervisor</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Reach 10+ properties listed milestone</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5" />
                      <span className="text-gray-700">Month-end performance review scheduled</span>
                    </label>
                  </div>
                </div>
              </section>

              {/* Sign-off */}
              <section className="mt-12">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b pb-2">
                  ONBOARDING COMPLETION SIGN-OFF
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="font-semibold text-gray-900 mb-4">EMPLOYEE:</p>
                    <p className="text-sm text-gray-600 mb-2">
                      I confirm that I have completed all onboarding tasks and received all necessary training and
                      resources.
                    </p>
                    <div className="border-b border-gray-400 mb-2 h-12 mt-4"></div>
                    <p className="text-sm text-gray-600">Signature & Date</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-4">SUPERVISOR:</p>
                    <p className="text-sm text-gray-600 mb-2">
                      I confirm that the employee has successfully completed onboarding and is ready for independent
                      work.
                    </p>
                    <div className="border-b border-gray-400 mb-2 h-12 mt-4"></div>
                    <p className="text-sm text-gray-600">Signature & Date</p>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <div className="mt-12 pt-6 border-t text-center text-sm text-gray-500">
                <p>Dwellot Limited - Property Listing Coordinator Onboarding</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .print\\:p-8 {
            padding: 2rem !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-none {
            border: none !important;
          }
        }
      `}</style>
    </div>
  )
}
