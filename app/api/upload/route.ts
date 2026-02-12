import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Upload API called")

    const formData = await request.formData()
    const file = formData.get("file") as File

    console.log("[v0] File received:", file ? { name: file.name, size: file.size, type: file.type } : "No file")

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type (images only)
    if (!file.type.startsWith("image/")) {
      console.log("[v0] Invalid file type:", file.type)
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      console.log("[v0] File too large:", file.size)
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.log("[v0] BLOB_READ_WRITE_TOKEN not configured")
      return NextResponse.json({ error: "Blob storage not configured" }, { status: 500 })
    }

    // Upload to Vercel Blob with a unique filename
    const timestamp = Date.now()
    const filename = `properties/${timestamp}-${file.name}`

    console.log("[v0] Uploading to blob:", filename)

    const blob = await put(filename, file, {
      access: "public",
    })

    console.log("[v0] Upload successful:", blob.url)

    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 },
    )
  }
}
