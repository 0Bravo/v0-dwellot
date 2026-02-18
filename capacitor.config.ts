import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.dwellot.app",
  appName: "Dwellot",
  webDir: "public",
  server: {
    url: "https://dwellot.com",
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#0A1F44",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0A1F44",
    },
    Keyboard: {
      resize: "body",
      resizeOnFullScreen: true,
    },
  },
  android: {
    allowMixedContent: false,
    backgroundColor: "#0A1F44",
  },
  ios: {
    backgroundColor: "#0A1F44",
    contentInset: "automatic",
    preferredContentMode: "mobile",
    scheme: "Dwellot",
  },
}

export default config
