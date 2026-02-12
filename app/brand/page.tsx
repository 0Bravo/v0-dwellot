"use client"

import { useState } from "react"
import { Download, Copy, Check, Home, Palette, Type, Layout, FileImage, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function BrandPage() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedColor(label)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  const brandColors = [
    { name: "Teal Primary", hex: "#14B8A6", rgb: "rgb(20, 184, 166)", usage: "Primary buttons, links, accents" },
    { name: "Teal Dark", hex: "#0D9488", rgb: "rgb(13, 148, 136)", usage: "Hover states, dark accents" },
    { name: "Teal Light", hex: "#5EEAD4", rgb: "rgb(94, 234, 212)", usage: "Backgrounds, highlights" },
    { name: "Dark Navy", hex: "#0F172A", rgb: "rgb(15, 23, 42)", usage: "Text, headers, dark mode bg" },
    { name: "Slate Gray", hex: "#64748B", rgb: "rgb(100, 116, 139)", usage: "Secondary text, borders" },
    { name: "White", hex: "#FFFFFF", rgb: "rgb(255, 255, 255)", usage: "Backgrounds, cards" },
  ]

  const typography = [
    {
      name: "Heading 1",
      class: "text-4xl font-bold",
      example: "Dwellot",
      size: "36px / 2.25rem",
      weight: "Bold (700)",
    },
    {
      name: "Heading 2",
      class: "text-3xl font-semibold",
      example: "Find Your Home",
      size: "30px / 1.875rem",
      weight: "Semibold (600)",
    },
    {
      name: "Heading 3",
      class: "text-2xl font-semibold",
      example: "Featured Properties",
      size: "24px / 1.5rem",
      weight: "Semibold (600)",
    },
    {
      name: "Body Large",
      class: "text-lg",
      example: "Discover premium real estate in Ghana",
      size: "18px / 1.125rem",
      weight: "Regular (400)",
    },
    {
      name: "Body",
      class: "text-base",
      example: "Browse thousands of properties for sale and rent",
      size: "16px / 1rem",
      weight: "Regular (400)",
    },
    {
      name: "Small",
      class: "text-sm",
      example: "Terms and conditions apply",
      size: "14px / 0.875rem",
      weight: "Regular (400)",
    },
  ]

  const downloadSVG = (id: string, filename: string) => {
    const svg = document.getElementById(id)
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const blob = new Blob([svgData], { type: "image/svg+xml" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const downloadAsImage = (id: string, filename: string, format: "png" | "jpeg", scale = 4) => {
    const svg = document.getElementById(id)
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(svgBlob)

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      const ctx = canvas.getContext("2d")
      if (ctx) {
        // For JPEG, fill white background
        if (format === "jpeg") {
          ctx.fillStyle = "#FFFFFF"
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
        ctx.scale(scale, scale)
        ctx.drawImage(img, 0, 0)
        const link = document.createElement("a")
        link.download = filename
        link.href = canvas.toDataURL(`image/${format}`, 1.0)
        link.click()
      }
      URL.revokeObjectURL(url)
    }
    img.src = url
  }

  const LogoDownloadButtons = ({ id, baseName }: { id: string; baseName: string }) => (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button className="flex-1 bg-teal-500 hover:bg-teal-600" onClick={() => downloadSVG(id, `${baseName}.svg`)}>
          <Download className="w-4 h-4 mr-2" />
          SVG
        </Button>
        <Button
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          onClick={() => downloadAsImage(id, `${baseName}.png`, "png")}
        >
          <Download className="w-4 h-4 mr-2" />
          PNG
        </Button>
        <Button
          className="flex-1 bg-orange-600 hover:bg-orange-700"
          onClick={() => downloadAsImage(id, `${baseName}.jpg`, "jpeg")}
        >
          <Download className="w-4 h-4 mr-2" />
          JPEG
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 sticky top-0 bg-slate-950/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Dwellot</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <a href="#colors" className="hover:text-white transition-colors">
              Colors
            </a>
            <a href="#typography" className="hover:text-white transition-colors">
              Typography
            </a>
            <a href="#logos" className="hover:text-white transition-colors">
              Logos
            </a>
            <a href="#guidelines" className="hover:text-white transition-colors">
              Guidelines
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 border-b border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Dwellot <span className="text-teal-400">Brand</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            Official brand guidelines and assets for Dwellot - Ghana's premier real estate platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white" onClick={() => window.print()}>
              <Download className="w-4 h-4 mr-2" />
              Download Brand Kit
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-700 text-white hover:bg-slate-800 bg-transparent"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              View Guidelines
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <Tabs defaultValue="colors" className="space-y-12">
          <TabsList className="bg-slate-900 border border-slate-800 p-1 flex flex-wrap justify-center gap-1">
            <TabsTrigger value="colors" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">
              <Palette className="w-4 h-4 mr-2" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">
              <Type className="w-4 h-4 mr-2" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="logos" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">
              <FileImage className="w-4 h-4 mr-2" />
              Logos
            </TabsTrigger>
            <TabsTrigger value="guidelines" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">
              <Layout className="w-4 h-4 mr-2" />
              Guidelines
            </TabsTrigger>
          </TabsList>

          {/* Colors Tab */}
          <TabsContent value="colors" id="colors" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Color Palette</h2>
              <p className="text-slate-400">
                Our brand colors represent trust, growth, and the vibrant Ghanaian landscape.
              </p>
            </div>

            {/* Primary Colors */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-teal-400">Primary Colors</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {brandColors.slice(0, 3).map((color) => (
                  <Card key={color.name} className="bg-slate-900 border-slate-800 overflow-hidden">
                    <div className="h-32 w-full" style={{ backgroundColor: color.hex }} />
                    <CardContent className="p-4 space-y-3">
                      <h4 className="font-semibold text-white">{color.name}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">HEX</span>
                          <button
                            onClick={() => copyToClipboard(color.hex, `${color.name}-hex`)}
                            className="flex items-center gap-1 text-white hover:text-teal-400 transition-colors"
                          >
                            {color.hex}
                            {copiedColor === `${color.name}-hex` ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">RGB</span>
                          <button
                            onClick={() => copyToClipboard(color.rgb, `${color.name}-rgb`)}
                            className="flex items-center gap-1 text-white hover:text-teal-400 transition-colors"
                          >
                            {copiedColor === `${color.name}-rgb` ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">{color.usage}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Neutral Colors */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-400">Neutral Colors</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {brandColors.slice(3).map((color) => (
                  <Card key={color.name} className="bg-slate-900 border-slate-800 overflow-hidden">
                    <div className="h-32 w-full border-b border-slate-700" style={{ backgroundColor: color.hex }} />
                    <CardContent className="p-4 space-y-3">
                      <h4 className="font-semibold text-white">{color.name}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">HEX</span>
                          <button
                            onClick={() => copyToClipboard(color.hex, `${color.name}-hex`)}
                            className="flex items-center gap-1 text-white hover:text-teal-400 transition-colors"
                          >
                            {color.hex}
                            {copiedColor === `${color.name}-hex` ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">{color.usage}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography" id="typography" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Typography</h2>
              <p className="text-slate-400">We use Geist Sans for a clean, modern, and professional look.</p>
            </div>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Font Family: Geist Sans</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {typography.map((type) => (
                  <div
                    key={type.name}
                    className="flex flex-col md:flex-row md:items-center gap-4 pb-6 border-b border-slate-800 last:border-0"
                  >
                    <div className="w-full md:w-1/3">
                      <p className="text-teal-400 font-medium">{type.name}</p>
                      <p className="text-sm text-slate-500">
                        {type.size} / {type.weight}
                      </p>
                    </div>
                    <div className="w-full md:w-2/3">
                      <p className={`text-white ${type.class}`}>{type.example}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logos Tab - Updated with PNG/JPEG download buttons */}
          <TabsContent value="logos" id="logos" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Logo Assets</h2>
              <p className="text-slate-400">Download official Dwellot logos in SVG, PNG, and JPEG formats.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Primary Logo - Dark BG */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Primary Logo (Dark Background)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-950 rounded-lg p-12 flex items-center justify-center">
                    <svg
                      id="logo-dark"
                      width="200"
                      height="50"
                      viewBox="0 0 200 50"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="40" height="40" rx="8" fill="#14B8A6" y="5" />
                      <path d="M20 15L28 22V32H24V25H16V32H12V22L20 15Z" fill="white" />
                      <text x="50" y="32" fill="white" fontFamily="system-ui" fontSize="24" fontWeight="700">
                        Dwellot
                      </text>
                    </svg>
                  </div>
                  <LogoDownloadButtons id="logo-dark" baseName="dwellot-logo-dark" />
                </CardContent>
              </Card>

              {/* Primary Logo - Light BG */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Primary Logo (Light Background)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white rounded-lg p-12 flex items-center justify-center">
                    <svg
                      id="logo-light"
                      width="200"
                      height="50"
                      viewBox="0 0 200 50"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="40" height="40" rx="8" fill="#14B8A6" y="5" />
                      <path d="M20 15L28 22V32H24V25H16V32H12V22L20 15Z" fill="white" />
                      <text x="50" y="32" fill="#0F172A" fontFamily="system-ui" fontSize="24" fontWeight="700">
                        Dwellot
                      </text>
                    </svg>
                  </div>
                  <LogoDownloadButtons id="logo-light" baseName="dwellot-logo-light" />
                </CardContent>
              </Card>

              {/* Icon Only - Teal */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Icon Only - Teal (Favicon)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-800 rounded-lg p-12 flex items-center justify-center">
                    <svg
                      id="icon-teal"
                      width="64"
                      height="64"
                      viewBox="0 0 64 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="64" height="64" rx="12" fill="#14B8A6" />
                      <path d="M32 18L48 32V50H40V38H24V50H16V32L32 18Z" fill="white" />
                    </svg>
                  </div>
                  <LogoDownloadButtons id="icon-teal" baseName="dwellot-icon-teal" />
                </CardContent>
              </Card>

              {/* Icon Only - Dark */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Icon Only - Dark</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-800 rounded-lg p-12 flex items-center justify-center">
                    <svg
                      id="icon-dark"
                      width="64"
                      height="64"
                      viewBox="0 0 64 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="64" height="64" rx="12" fill="#0F172A" />
                      <path d="M32 18L48 32V50H40V38H24V50H16V32L32 18Z" fill="#14B8A6" />
                    </svg>
                  </div>
                  <LogoDownloadButtons id="icon-dark" baseName="dwellot-icon-dark" />
                </CardContent>
              </Card>

              {/* Wordmark - White */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Wordmark - White</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-800 rounded-lg p-12 flex items-center justify-center">
                    <svg
                      id="wordmark-white"
                      width="150"
                      height="30"
                      viewBox="0 0 150 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <text x="0" y="24" fill="white" fontFamily="system-ui" fontSize="28" fontWeight="700">
                        Dwellot
                      </text>
                    </svg>
                  </div>
                  <LogoDownloadButtons id="wordmark-white" baseName="dwellot-wordmark-white" />
                </CardContent>
              </Card>

              {/* Wordmark - Teal */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Wordmark - Teal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-800 rounded-lg p-12 flex items-center justify-center">
                    <svg
                      id="wordmark-teal"
                      width="150"
                      height="30"
                      viewBox="0 0 150 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <text x="0" y="24" fill="#14B8A6" fontFamily="system-ui" fontSize="28" fontWeight="700">
                        Dwellot
                      </text>
                    </svg>
                  </div>
                  <LogoDownloadButtons id="wordmark-teal" baseName="dwellot-wordmark-teal" />
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-900 border-slate-800 mt-8">
              <CardHeader>
                <CardTitle className="text-white">Download Formats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-teal-400">SVG (Recommended)</h4>
                    <p className="text-sm text-slate-400">
                      Vector format, scalable to any size without quality loss. Best for web, print, and professional
                      use.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-400">PNG</h4>
                    <p className="text-sm text-slate-400">
                      High-resolution raster format with transparent background. Great for presentations, social media,
                      and digital use.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-orange-400">JPEG</h4>
                    <p className="text-sm text-slate-400">
                      Compressed raster format with white background. Best for documents, emails, and general use.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guidelines Tab */}
          <TabsContent value="guidelines" id="guidelines" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Brand Guidelines</h2>
              <p className="text-slate-400">Rules and best practices for using the Dwellot brand.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Do's */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-green-400">Do's</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      Use the logo with adequate white space around it
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      Maintain the original aspect ratio when scaling
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      Use approved color combinations only
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      Use the dark logo on light backgrounds
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      Use the light logo on dark backgrounds
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Don'ts */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-red-400">Don'ts</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0">✕</span>
                      Stretch or distort the logo
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0">✕</span>
                      Change the logo colors
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0">✕</span>
                      Add effects like shadows or gradients
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0">✕</span>
                      Place logo on busy backgrounds
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0">✕</span>
                      Rotate or flip the logo
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Voice & Tone */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Voice & Tone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-teal-400 mb-2">Professional</h4>
                    <p className="text-sm text-slate-400">
                      Maintain a trustworthy, knowledgeable presence in all communications.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-teal-400 mb-2">Approachable</h4>
                    <p className="text-sm text-slate-400">
                      Be friendly and helpful, making real estate accessible to everyone.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-teal-400 mb-2">Modern</h4>
                    <p className="text-sm text-slate-400">
                      Embrace innovation and technology while respecting tradition.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Taglines */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Official Taglines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <p className="text-xl font-semibold text-white">"Find Your Perfect Home in Ghana"</p>
                    <p className="text-sm text-slate-400 mt-1">Primary tagline</p>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <p className="text-xl font-semibold text-white">"Your Gateway to Ghana Real Estate"</p>
                    <p className="text-sm text-slate-400 mt-1">Alternative tagline</p>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <p className="text-xl font-semibold text-white">"Home Starts Here"</p>
                    <p className="text-sm text-slate-400 mt-1">Short tagline</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="container mx-auto px-4 text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} Dwellot. All rights reserved.</p>
          <p className="text-sm mt-2">For brand inquiries, contact support@dwellot.com</p>
        </div>
      </footer>
    </div>
  )
}
