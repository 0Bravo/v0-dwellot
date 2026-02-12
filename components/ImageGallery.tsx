"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Maximize2 } from "lucide-react"

interface ImageGalleryProps {
  images: string[]
  title: string
  initialIndex?: number
  onClose?: () => void
}

export default function ImageGallery({ images, title, initialIndex = 0, onClose }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
    setIsZoomed(false)
    setZoomLevel(1)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    setIsZoomed(false)
    setZoomLevel(1)
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3))
    setIsZoomed(true)
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1))
    if (zoomLevel <= 1.5) setIsZoomed(false)
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(images[currentIndex])
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${title}-image-${currentIndex + 1}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") nextImage()
    if (e.key === "ArrowLeft") prevImage()
    if (e.key === "Escape") onClose?.()
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-white">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-sm text-gray-300">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
            aria-label="Close gallery"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Main Image */}
      <div className="relative w-full h-full flex items-center justify-center p-4 pt-16 pb-40 sm:p-20">
        <div
          className={`relative w-full h-full transition-transform duration-300 ${isZoomed ? "cursor-move" : "cursor-default"}`}
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <Image
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`${title} - Image ${currentIndex + 1}`}
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        </>
      )}

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-10">
        <div className="max-w-7xl mx-auto">
          {/* Thumbnail Strip */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  setIsZoomed(false)
                  setZoomLevel(1)
                }}
                className={`relative w-20 h-16 flex-shrink-0 rounded overflow-hidden transition ${
                  index === currentIndex ? "ring-2 ring-white" : "opacity-50 hover:opacity-100"
                }`}
              >
                <Image src={image || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-5 h-5 text-white" />
            </button>
            <div className="px-3 py-2 bg-white/10 rounded-lg text-white text-sm font-medium min-w-[60px] text-center">
              {Math.round(zoomLevel * 100)}%
            </div>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-5 h-5 text-white" />
            </button>
            <div className="w-px h-8 bg-white/20 mx-2"></div>
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
              aria-label="Toggle fullscreen"
            >
              <Maximize2 className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
              aria-label="Download image"
            >
              <Download className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
