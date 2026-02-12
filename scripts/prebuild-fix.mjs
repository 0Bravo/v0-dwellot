// This script fixes stale deployment cache issues by overwriting
// email files that were removed but persist in the Vercel build cache
import { writeFileSync, mkdirSync } from 'fs'

console.log('[prebuild] Fixing stale cached email files...')

// Ensure directories exist
mkdirSync('lib/email', { recursive: true })
mkdirSync('emails', { recursive: true })
mkdirSync('app/api/cron/send-newsletter', { recursive: true })

// Overwrite lib/email/config.ts
writeFileSync('lib/email/config.ts', `// Stub - email packages removed
export const resend = null
export function getResendClient() { return null }
`)

// Overwrite lib/email/service.tsx
writeFileSync('lib/email/service.tsx', `// Stub - email packages removed
export async function sendInquiryConfirmation(..._args: unknown[]) {
  return { success: false, error: 'Email service not configured' }
}
export async function sendNewPropertyAlert(..._args: unknown[]) {
  return { success: false, error: 'Email service not configured' }
}
export async function sendWeeklyNewsletter(..._args: unknown[]) {
  return { success: false, error: 'Email service not configured' }
}
`)

// Overwrite email templates
writeFileSync('emails/InquiryConfirmation.tsx', `export default function InquiryConfirmation() { return null }
`)
writeFileSync('emails/NewPropertyAlert.tsx', `export default function NewPropertyAlert() { return null }
`)
writeFileSync('emails/WeeklyNewsletter.tsx', `export default function WeeklyNewsletter() { return null }
`)

// Overwrite cron route
writeFileSync('app/api/cron/send-newsletter/route.ts', `import { NextResponse } from 'next/server'
export async function GET() {
  return NextResponse.json({ message: 'Newsletter cron not configured' }, { status: 200 })
}
`)

console.log('[prebuild] Stale email files overwritten successfully.')
