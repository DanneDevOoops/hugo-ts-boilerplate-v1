#!/usr/bin/env bash
# Fast production build script for Hugo + TypeScript
# This script ensures TypeScript is built before Hugo processes assets
# Usage: ./scripts/build.sh [dev|stage|prod]

set -e  # Exit on error

# Load environment variables
ENV="${1:-prod}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/load-env.sh" "$ENV"

echo "🚀 Starting fast production build..."

# Step 1: Clean previous builds (optional, comment out for fastest builds)
echo "🧹 Cleaning previous builds..."
rm -rf public
rm -f assets/js/main.js assets/js/main.js.map 2>/dev/null || true

# Step 2: Build TypeScript with Bun (super fast!)
echo "📦 Building TypeScript with Bun..."
bun build ./assets/ts/main.ts \
  --outdir ./assets/js \
  --target browser \
  --minify \
  --sourcemap=external

# Step 3: Build Hugo site with minification
echo "🏗️  Building Hugo site for environment: $HUGO_ENVIRONMENT..."
hugo --minify --gc --environment "$HUGO_ENVIRONMENT"

# Step 4: Show build stats
echo "✅ Build complete!"
echo ""
echo "📊 Build statistics:"
du -sh public
echo ""
echo "📁 Output directory: public/"
echo "🌐 Ready to deploy!"

