import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { width: string; height: string } }) {
  const width = Number.parseInt(params.width) || 400
  const height = Number.parseInt(params.height) || 300

  // Generate SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#e5e7eb"/>
      <text 
        x="50%" 
        y="50%" 
        dominant-baseline="middle" 
        text-anchor="middle" 
        font-family="Arial, sans-serif" 
        font-size="24" 
        fill="#9ca3af"
      >
        ${width} × ${height}
      </text>
    </svg>
  `

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
