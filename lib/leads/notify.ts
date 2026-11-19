/**
 * Email notification for new leads.
 *
 * Leads have always been written to the database and nothing told anyone
 * they had arrived, so an enquiry sat unread until someone thought to query
 * the table. This sends one email per lead to ADMIN_EMAIL.
 *
 * Deliberately never throws: a mail failure must not fail the lead capture,
 * because the row is already saved and the visitor has already been thanked.
 * lib/email.tsx looks like a mailer but its sendEmail() returns success
 * without sending anything, so this uses Resend directly, the same way
 * app/api/newsletter/subscribe/route.ts does.
 */

export type LeadNotification = {
  id?: string
  name?: string | null
  email?: string | null
  phone?: string | null
  whatsapp?: string | null
  intent?: string | null
  property_type?: string | null
  budget_min?: number | null
  budget_max?: number | null
  bedrooms?: number | null
  preferred_locations?: string[] | string | null
  timeline?: string | null
  source?: string | null
  notes?: string | null
  isUpdate?: boolean
}

const SOURCE_LABELS: Record<string, string> = {
  mortgage_calculator: "Mortgage calculator",
  website_modal: "Website pop-up",
  property_detail: "Property page",
  campaign: "Ad campaign",
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function money(amount: number | null | undefined): string | null {
  if (typeof amount !== "number" || !Number.isFinite(amount)) return null
  return amount.toLocaleString("en-GB")
}

function row(label: string, value: string | null | undefined): string {
  if (!value) return ""
  return `<tr><td style="padding:6px 12px 6px 0;color:#6b7280;vertical-align:top;white-space:nowrap">${escapeHtml(
    label,
  )}</td><td style="padding:6px 0;color:#111827">${escapeHtml(value)}</td></tr>`
}

export async function notifyNewLead(lead: LeadNotification): Promise<{ sent: boolean; reason?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      return { sent: false, reason: "RESEND_API_KEY not set" }
    }

    const { Resend } = await import("resend")
    const resend = new Resend(process.env.RESEND_API_KEY)

    const fromAddress = process.env.RESEND_FROM_EMAIL || "Dwellot <onboarding@resend.dev>"
    const adminEmail = process.env.ADMIN_EMAIL || "support@dwellot.com"

    const sourceLabel = lead.source ? SOURCE_LABELS[lead.source] || lead.source : "Unknown"
    const budgetMin = money(lead.budget_min)
    const budgetMax = money(lead.budget_max)
    const budget =
      budgetMin && budgetMax
        ? `${budgetMin} – ${budgetMax}`
        : budgetMax
          ? `up to ${budgetMax}`
          : budgetMin
            ? `from ${budgetMin}`
            : null

    const locations = Array.isArray(lead.preferred_locations)
      ? lead.preferred_locations.join(", ")
      : lead.preferred_locations || null

    // WhatsApp-only leads get a synthetic @leads.dwellot.com address, which is
    // not worth showing as a contact route.
    const realEmail = lead.email && !lead.email.endsWith("@leads.dwellot.com") ? lead.email : null

    const heading = lead.isUpdate ? "Returning lead updated their details" : "New lead"
    const subject = `${lead.isUpdate ? "Lead updated" : "New lead"}: ${lead.name || realEmail || lead.whatsapp || "unknown"} (${sourceLabel})`

    const replyTo = realEmail || undefined
    const waDigits = lead.whatsapp ? String(lead.whatsapp).replace(/\D/g, "") : ""

    const actions: string[] = []
    if (realEmail) {
      actions.push(
        `<a href="mailto:${encodeURIComponent(realEmail)}" style="color:#0d9488">Reply by email</a>`,
      )
    }
    if (waDigits) {
      actions.push(`<a href="https://wa.me/${waDigits}" style="color:#0d9488">Open WhatsApp</a>`)
    }
    actions.push(`<a href="https://dwellot.com/dashboard/leads" style="color:#0d9488">All leads</a>`)

    const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:600px">
      <h2 style="color:#111827;margin:0 0 4px">${escapeHtml(heading)}</h2>
      <p style="color:#6b7280;margin:0 0 16px">via ${escapeHtml(sourceLabel)}</p>
      <table style="border-collapse:collapse;font-size:14px;width:100%">
        ${row("Name", lead.name)}
        ${row("Email", realEmail)}
        ${row("WhatsApp", lead.whatsapp)}
        ${row("Phone", lead.phone)}
        ${row("Looking to", lead.intent)}
        ${row("Property type", lead.property_type)}
        ${row("Budget", budget)}
        ${row("Bedrooms", typeof lead.bedrooms === "number" ? String(lead.bedrooms) : null)}
        ${row("Areas", locations)}
        ${row("Timeline", lead.timeline)}
        ${row("Notes", lead.notes)}
      </table>
      <p style="font-size:14px;margin:20px 0 0">${actions.join(" &nbsp;·&nbsp; ")}</p>
      <p style="color:#9ca3af;font-size:12px;margin-top:16px">Received ${new Date().toISOString()}</p>
    </div>`

    await resend.emails.send({
      from: fromAddress,
      to: adminEmail,
      subject,
      replyTo,
      html,
    })

    return { sent: true }
  } catch (error) {
    // Logged, never rethrown: the lead is already saved.
    console.error("Lead notification failed:", error)
    return { sent: false, reason: error instanceof Error ? error.message : "unknown error" }
  }
}
