/**
 * Utility helpers for detecting if the app is running inside a Capacitor native shell.
 * Use these to conditionally show/hide web-only features like PWA install prompts,
 * or to enable native-only features like back button handling.
 */

export function isNative(): boolean {
  if (typeof window === "undefined") return false
  return !!(window as Record<string, unknown>).Capacitor
}

export function getPlatform(): "ios" | "android" | "web" {
  if (typeof window === "undefined") return "web"
  const cap = (window as Record<string, unknown>).Capacitor as
    | { getPlatform?: () => string }
    | undefined
  if (cap?.getPlatform) {
    const platform = cap.getPlatform()
    if (platform === "ios") return "ios"
    if (platform === "android") return "android"
  }
  return "web"
}

export function isIOS(): boolean {
  return getPlatform() === "ios"
}

export function isAndroid(): boolean {
  return getPlatform() === "android"
}
