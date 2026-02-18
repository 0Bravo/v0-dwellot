#!/bin/bash
# =============================================================================
# Dwellot - Capacitor Native App Setup
# =============================================================================
# Run this script locally after cloning the repo to set up native platforms.
#
# Prerequisites:
#   - Node.js 18+
#   - Android Studio (for Android builds)
#   - Xcode 15+ (for iOS builds, macOS only)
#   - Java 17+ (for Android)
#   - Apple Developer Account ($99/year) for App Store
#   - Google Play Developer Account ($25 one-time) for Play Store
# =============================================================================

set -e

echo "============================================"
echo "  Dwellot - Capacitor Setup"
echo "============================================"

# Step 1: Install dependencies
echo ""
echo "[1/4] Installing dependencies..."
npm install

# Step 2: Add Android platform
echo ""
echo "[2/4] Adding Android platform..."
npx cap add android 2>/dev/null || echo "Android platform already exists."

# Step 3: Add iOS platform (macOS only)
echo ""
if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "[3/4] Adding iOS platform..."
  npx cap add ios 2>/dev/null || echo "iOS platform already exists."
else
  echo "[3/4] Skipping iOS (not on macOS)."
fi

# Step 4: Sync
echo ""
echo "[4/4] Syncing Capacitor..."
npx cap sync

echo ""
echo "============================================"
echo "  Setup Complete!"
echo "============================================"
echo ""
echo "Next steps:"
echo ""
echo "  Android:"
echo "    npm run cap:android     # Opens in Android Studio"
echo "    Build > Generate Signed Bundle/APK"
echo ""
echo "  iOS (macOS only):"
echo "    npm run cap:ios         # Opens in Xcode"
echo "    Product > Archive"
echo ""
echo "  To sync after code changes:"
echo "    npm run cap:sync"
echo ""
echo "  Note: Since the app loads from https://dwellot.com,"
echo "  most updates are instant - no need to rebuild the"
echo "  native app unless you change Capacitor plugins."
echo ""
