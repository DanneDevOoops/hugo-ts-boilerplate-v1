#!/usr/bin/env bash
# Setup script to initialize environment files from example
# Usage: ./scripts/setup-env.sh

set -e

echo "🔧 Environment Setup Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Function to create env file if it doesn't exist
create_env_file() {
    local env_file=$1
    local env_name=$2

    if [ -f "$env_file" ]; then
        echo "✓ $env_file already exists (skipping)"
    else
        echo "Creating $env_file..."
        cp .env.example "$env_file"
        echo "✓ Created $env_file from .env.example"
        echo "  → Please edit $env_file and configure your $env_name settings"
    fi
}

# Check if .env.example exists
if [ ! -f ".env.example" ]; then
    echo "❌ Error: .env.example not found!"
    echo "   Please create .env.example first."
    exit 1
fi

echo "Checking environment files..."
echo ""

# Create environment files
create_env_file ".env.dev" "development"
create_env_file ".env.stage" "staging"
create_env_file ".env.prod" "production"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Environment setup complete!"
echo ""
echo "📝 Next steps:"
echo ""
echo "  1. Edit your environment files with actual values:"
echo "     nano .env.dev"
echo "     nano .env.stage"
echo "     nano .env.prod"
echo ""
echo "  2. Start development:"
echo "     make dev-all"
echo ""
echo "📖 For more information, see:"
echo "   - docs/ENVIRONMENT_VARIABLES.md"
echo "   - docs/ENV_QUICK_REFERENCE.md"
echo ""

