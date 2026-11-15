"use client"

import { useState, type FormEvent } from "react"
import { CheckCircle2, Loader2, Send } from "lucide-react"
import { trackLead } from "@/lib/facebook-pixel"
import { formatMoney, type MortgageCurrency } from "@/lib/mortgage/calc"

export interface MortgageLeadContext {
  currency: MortgageCurrency
  propertyPrice: number
  deposit: number
  loanAmount: number
  monthlyPayment: number
  interestRate: number
  termYears: number
}

interface MortgageLeadFormProps {
  context: MortgageLeadContext
  /** Where the form sits, recorded as the lead source */
  source?: string
}

const COUNTRIES = ["United Kingdom", "United States", "Canada", "Germany", "Netherlands", "Ghana", "Other"]

const TIMELINES = ["Immediately", "1-3 months", "3-6 months", "6-12 months", "Just browsing"]

const inputClass =
  "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"

export default function MortgageLeadForm({ context, source = "mortgage_calculator" }: MortgageLeadFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [country, setCountry] = useState(COUNTRIES[0])
  const [timeline, setTimeline] = useState(TIMELINES[2])
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const summary =
    `${formatMoney(context.propertyPrice, context.currency)} property, ` +
    `${formatMoney(context.deposit, context.currency)} deposit, ` +
    `${formatMoney(context.loanAmount, context.currency)} loan over ${context.termYears} years ` +
    `at ${context.interestRate}% (about ${formatMoney(context.monthlyPayment, context.currency)} a month)`

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email && !whatsapp) {
      setStatus("error")
      setErrorMessage("Please give an email address or a WhatsApp number so we can reach you.")
      return
    }
    if (!consent) {
      setStatus("error")
      setErrorMessage("Please tick the box so we can contact you about mortgage options.")
      return
    }

    setStatus("sending")
    setErrorMessage("")

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || undefined,
          email: email || undefined,
          whatsapp_number: whatsapp || undefined,
          intent: "buy",
          max_budget: Math.round(context.propertyPrice),
          timeline,
          source,
          notes:
            `Mortgage enquiry (${context.currency} mortgage). ${summary}. ` +
            `Country of residence: ${country}. Budget figures are in ${context.currency}.`,
        }),
      })

      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(result?.error || "Something went wrong. Please try again.")
      }

      setStatus("sent")

      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "generate_lead", {
          event_category: "Mortgage",
          event_label: `${source} - ${context.currency}`,
          value: Math.round(context.loanAmount),
          currency: context.currency,
        })
      }
      trackLead({
        content_name: "Mortgage enquiry",
        content_category: source,
        value: Math.round(context.loanAmount),
        currency: context.currency,
      })
    } catch (error) {
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.")
    }
  }

  if (status === "sent") {
    return (
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 md:p-8 text-center" role="status">
        <CheckCircle2 className="w-10 h-10 text-teal-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-900 mb-1">Thank you, we have your details</h3>
        <p className="text-gray-700">
          A member of the Dwellot team will contact you about mortgage options for your budget.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 md:p-8" noValidate>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Get your mortgage options</h2>
      <p className="text-sm text-gray-600 mb-6">
        Send us your estimate and we will come back to you with lenders and properties that fit. Your estimate:{" "}
        <span className="font-medium text-gray-900">{summary}</span>.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="lead-name" className="block text-sm font-medium text-gray-700 mb-1">
            Full name
          </label>
          <input
            id="lead-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="lead-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="lead-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="lead-whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
            WhatsApp number (with country code)
          </label>
          <input
            id="lead-whatsapp"
            type="tel"
            autoComplete="tel"
            placeholder="+44 7..."
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="lead-country" className="block text-sm font-medium text-gray-700 mb-1">
            Where do you live?
          </label>
          <select
            id="lead-country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={inputClass}
          >
            {COUNTRIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="lead-timeline" className="block text-sm font-medium text-gray-700 mb-1">
            When are you looking to buy?
          </label>
          <select
            id="lead-timeline"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            className={inputClass}
          >
            {TIMELINES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="flex items-start gap-3 mt-5 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 accent-teal-600"
        />
        <span>
          I agree that Dwellot may contact me about mortgage options and properties, and may pass my details to a
          lender or developer for that purpose. See our{" "}
          <a href="/privacy" className="text-teal-600 hover:text-teal-700 underline">
            privacy policy
          </a>
          .
        </span>
      </label>

      {status === "error" && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 w-full md:w-auto inline-flex items-center justify-center gap-2 bg-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-teal-700 transition disabled:opacity-60"
      >
        {status === "sending" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {status === "sending" ? "Sending..." : "Send my details"}
      </button>

      <p className="mt-4 text-xs text-gray-500">
        Dwellot is a property marketplace, not a lender or a financial adviser. Estimates are illustrative and are not
        an offer of credit.
      </p>
    </form>
  )
}
