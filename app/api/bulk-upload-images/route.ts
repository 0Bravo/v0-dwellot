import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { images } = await request.json()

    if (!Array.isArray(images)) {
      return NextResponse.json({ error: "Images must be an array" }, { status: 400 })
    }

    const uploadedUrls: string[] = []

    for (const imageData of images) {
      const { filename, url } = imageData

      // Fetch the image from the URL
      const response = await fetch(url)
      const blob = await response.blob()

      // Upload to Vercel Blob
      const { url: blobUrl } = await put(filename, blob, {
        access: "public",
      })

      uploadedUrls.push(blobUrl)
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      count: uploadedUrls.length,
    })
  } catch (error) {
    console.error("Error uploading images:", error)
    return NextResponse.json({ error: "Failed to upload images" }, { status: 500 })
  }
}
