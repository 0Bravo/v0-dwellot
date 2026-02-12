"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Search,
  BarChart3,
  Code2,
  Share2,
  ArrowLeft,
} from "lucide-react"

const STORAGE_KEY = "dwellot-seo-checklist"

interface ChecklistItem {
  id: string
  label: string
  link?: string
  linkLabel?: string
}

interface ChecklistSection {
  title: string
  icon: React.ReactNode
  color: string
  items: ChecklistItem[]
}

const sections: ChecklistSection[] = [
  {
    title: "Google Search Console",
    icon: <Search className="w-5 h-5" />,
    color: "text-blue-600",
    items: [
      {
        id: "gsc-1",
        label: "Go to Google Search Console",
        link: "https://search.google.com/search-console",
        linkLabel: "Open GSC",
      },
      {
        id: "gsc-2",
        label: "Add property: dwellot.com (URL prefix method)",
      },
      {
        id: "gsc-3",
        label: 'Choose "HTML tag" verification method',
      },
      {
        id: "gsc-4",
        label: "Copy the verification code (just the content value, not the full tag)",
      },
      {
        id: "gsc-5",
        label: "Add it as NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in Vercel Environment Variables",
        link: "https://vercel.com/dashboard",
        linkLabel: "Vercel Dashboard",
      },
      {
        id: "gsc-6",
        label: "Redeploy the site",
      },
      {
        id: "gsc-7",
        label: "Click Verify in Google Search Console",
      },
      {
        id: "gsc-8",
        label: "Submit sitemap: dwellot.com/sitemap.xml",
        link: "https://search.google.com/search-console/sitemaps",
        linkLabel: "Submit Sitemap",
      },
      {
        id: "gsc-9",
        label: "Request indexing of homepage",
        link: "https://search.google.com/search-console/inspect?resource_id=https://dwellot.com/",
        linkLabel: "Inspect URL",
      },
      {
        id: "gsc-10",
        label: "Request indexing of /properties, /about, /contact",
      },
    ],
  },
  {
    title: "Bing Webmaster Tools",
    icon: <Search className="w-5 h-5" />,
    color: "text-teal-600",
    items: [
      {
        id: "bing-1",
        label: "Go to Bing Webmaster Tools",
        link: "https://www.bing.com/webmasters",
        linkLabel: "Open Bing",
      },
      {
        id: "bing-2",
        label: "Import from Google Search Console OR add site manually",
      },
      {
        id: "bing-3",
        label: "If manual: copy verification code, add as NEXT_PUBLIC_BING_VERIFICATION env var",
      },
      {
        id: "bing-4",
        label: "Submit sitemap: dwellot.com/sitemap.xml",
      },
    ],
  },
  {
    title: "Google Analytics 4",
    icon: <BarChart3 className="w-5 h-5" />,
    color: "text-amber-600",
    items: [
      {
        id: "ga4-1",
        label: "Confirm GA4 measurement ID is set in NEXT_PUBLIC_GA_MEASUREMENT_ID env var",
        link: "https://analytics.google.com/",
        linkLabel: "Open GA4",
      },
      {
        id: "ga4-2",
        label: "Verify tracking is firing (check Realtime report in GA4)",
      },
    ],
  },
  {
    title: "Structured Data Validation",
    icon: <Code2 className="w-5 h-5" />,
    color: "text-purple-600",
    items: [
      {
        id: "sd-1",
        label: "Test homepage with Rich Results Test",
        link: "https://search.google.com/test/rich-results?url=https://dwellot.com",
        linkLabel: "Test Homepage",
      },
      {
        id: "sd-2",
        label: "Test a property page with Rich Results Test",
        link: "https://search.google.com/test/rich-results?url=https://dwellot.com/properties/21",
        linkLabel: "Test Property",
      },
      {
        id: "sd-3",
        label: "Fix any errors shown in the test results",
      },
    ],
  },
  {
    title: "Indexing Acceleration",
    icon: <Share2 className="w-5 h-5" />,
    color: "text-rose-600",
    items: [
      {
        id: "idx-1",
        label: "Share dwellot.com link on social media (creates backlinks)",
      },
      {
        id: "idx-2",
        label: "Submit to Google My Business (Accra office)",
        link: "https://business.google.com/",
        linkLabel: "Google Business",
      },
      {
        id: "idx-3",
        label: "Submit to Ghana business directories",
      },
      {
        id: "idx-4",
        label: "Create and share 2-3 blog posts with internal links",
      },
    ],
  },
]

const totalItems = sections.reduce((acc, s) => acc + s.items.length, 0)

export default function SEOSetupPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setChecked(JSON.parse(saved))
    } catch {}
  }, [])

  const toggle = useCallback((id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {}
      return next
    })
  }, [])

  const completedCount = Object.values(checked).filter(Boolean).length
  const percentage = Math.round((completedCount / totalItems) * 100)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">SEO Setup Checklist</h1>
          <p className="text-gray-500 mt-1">
            Internal reference for setting up search engine indexing for dwellot.com
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {completedCount} of {totalItems} completed
            </span>
            <span className="text-sm font-bold text-gray-900">{percentage}%</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${percentage}%`,
                backgroundColor:
                  percentage === 100
                    ? "#10b981"
                    : percentage >= 60
                      ? "#0d9488"
                      : "#3b82f6",
              }}
            />
          </div>
          {percentage === 100 && (
            <p className="text-sm text-emerald-600 font-medium mt-2">
              All done! Your SEO setup is complete.
            </p>
          )}
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => {
            const sectionDone = section.items.every((item) => checked[item.id])
            return (
              <div
                key={section.title}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                  <span className={section.color}>{section.icon}</span>
                  <h2 className="font-semibold text-gray-900">{section.title}</h2>
                  {sectionDone && (
                    <span className="ml-auto text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Complete
                    </span>
                  )}
                </div>
                <ul className="divide-y divide-gray-50">
                  {section.items.map((item, idx) => (
                    <li key={item.id} className="group">
                      <button
                        onClick={() => toggle(item.id)}
                        className="w-full flex items-start gap-3 px-5 py-3.5 text-left hover:bg-gray-50 transition"
                      >
                        <span className="mt-0.5 flex-shrink-0">
                          {checked[item.id] ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition" />
                          )}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span
                            className={`text-sm leading-relaxed ${
                              checked[item.id]
                                ? "text-gray-400 line-through"
                                : "text-gray-700"
                            }`}
                          >
                            <span className="text-gray-400 mr-2 font-mono text-xs">
                              {idx + 1}.
                            </span>
                            {item.label}
                          </span>
                          {item.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline ml-2"
                            >
                              {item.linkLabel || "Open"}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Footer note */}
        <p className="text-xs text-gray-400 text-center mt-10">
          Checklist progress is saved in your browser. This page is not indexed by search engines.
        </p>
      </div>
    </div>
  )
}
