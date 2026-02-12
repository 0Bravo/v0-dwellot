// Stub route - email cron not configured
// This file exists to prevent build errors from stale deployment caches
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Newsletter cron not configured' }, { status: 200 })
}
