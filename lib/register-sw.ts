"use client"

export function registerServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("[v0] SW registered:", registration)
        })
        .catch((error) => {
          console.log("[v0] SW registration failed:", error)
        })
    })
  }
}
