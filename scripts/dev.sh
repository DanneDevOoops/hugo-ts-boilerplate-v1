#!/usr/bin/env bash
# Development workflow - runs Bun (TypeScript watch) and Hugo server concurrently
# Press Ctrl+C to stop both processes
# Usage: ./scripts/dev.sh [dev|stage|prod]

set -e

# Load environment variables
ENV="${1:-dev}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/load-env.sh" "$ENV"

echo "🔥 Starting development environment..."
echo ""
echo "This will run:"
echo "  1. Bun (TypeScript watch mode)"
echo "  2. Hugo server (with live reload)"
echo ""
echo "Press Ctrl+C to stop both processes"
echo ""

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping development servers..."
    kill $(jobs -p) 2>/dev/null || true
    exit
}

# Set trap to cleanup on exit
trap cleanup INT TERM EXIT

# Initial build
echo "📦 Initial TypeScript build..."
bun build ./assets/ts/main.ts --outdir ./assets/js --target browser --minify

echo ""
echo "🚀 Starting development servers..."
echo ""

# Start Bun in watch mode in background
bun build ./assets/ts/main.ts --outdir ./assets/js --target browser --minify --watch &
BUN_PID=$!

# Give Bun a moment to start
sleep 1

# Start Hugo server with environment (this will run in foreground)
hugo server -D --disableFastRender --noHTTPCache --environment "$HUGO_ENVIRONMENT"

# If Hugo server exits, cleanup
cleanup

