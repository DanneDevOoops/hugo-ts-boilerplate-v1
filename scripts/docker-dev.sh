#!/usr/bin/env sh
# Docker development workflow - runs Bun (TypeScript watch) and Hugo server concurrently
# This script runs inside the Docker container

set -e

# Load environment variables if .env.dev exists
if [ -f ".env.dev" ]; then
    echo "🔧 Loading environment variables from .env.dev..."
    set -a
    . ./.env.dev
    set +a
    export HUGO_ENVIRONMENT="${HUGO_ENV:-development}"
fi

echo "🔥 Starting Docker development environment..."
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

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing development dependencies..."
    bun install --dev
    echo ""
fi

# Initial TypeScript build
echo "📦 Initial TypeScript build..."
bun build ./assets/ts/main.ts --outdir ./assets/js --target browser --minify
echo ""

echo "🚀 Starting development servers..."
echo "  - Bun watch (TypeScript)"
echo "  - Tailwind CSS watch (SCSS to CSS)"
echo "  - Hugo server (live reload)"
echo ""

# Start Bun in watch mode in background
echo "🔧 Starting Bun watch for TypeScript..."
bun build ./assets/ts/main.ts --outdir ./assets/js --target browser --minify --watch &
BUN_PID=$!

# Start Tailwind CSS watch in background
echo "🔧 Starting Tailwind CSS watch..."
npx @tailwindcss/cli -i ./assets/css/scss/style.scss -o ./assets/css/style.css --watch &
TAILWIND_PID=$!

# Give Bun and Tailwind a moment to start
sleep 2

# Start Hugo server (this will run in foreground)
echo "🔧 Starting Hugo development server..."
hugo server -D --environment development --disableFastRender --noHTTPCache --bind 0.0.0.0

# If Hugo server exits, cleanup
echo "Hugo server stopped. Starting clean up process..."
cleanup
