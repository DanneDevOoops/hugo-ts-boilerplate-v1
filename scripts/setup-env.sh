#!/usr/bin/env bash
# Setup script to initialize environment files from example
# Usage: ./scripts/setup-env.sh [dev|stage|prod|all]...

set -euo pipefail

show_usage() {
    echo "Usage: ./scripts/setup-env.sh [dev|stage|prod|all]..."
    echo ""
    echo "Examples:"
    echo "  ./scripts/setup-env.sh            # Create all env files"
    echo "  ./scripts/setup-env.sh dev        # Create only .env.dev"
    echo "  ./scripts/setup-env.sh stage prod # Create .env.stage and .env.prod"
}

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

CREATE_DEV=0
CREATE_STAGE=0
CREATE_PROD=0

add_env_target() {
    local env_name
    env_name="$(printf '%s' "$1" | tr '[:upper:]' '[:lower:]')"

    case "$env_name" in
        dev|development)
            CREATE_DEV=1
            ;;
        stage|staging)
            CREATE_STAGE=1
            ;;
        prod|production)
            CREATE_PROD=1
            ;;
        all)
            CREATE_DEV=1
            CREATE_STAGE=1
            CREATE_PROD=1
            ;;
        -h|--help|help)
            show_usage
            exit 0
            ;;
        *)
            echo "❌ Error: Unknown environment '$1'"
            echo ""
            show_usage
            exit 1
            ;;
    esac
}

# Check if .env.example exists
if [ ! -f ".env.example" ]; then
    echo "❌ Error: .env.example not found!"
    echo "   Please create .env.example first."
    exit 1
fi

if [ "$#" -eq 0 ]; then
    add_env_target "all"
else
    for env_target in "$@"; do
        add_env_target "$env_target"
    done
fi

echo "Checking environment files..."
echo ""

# Create only selected environment files.
if [ "$CREATE_DEV" -eq 1 ]; then
    create_env_file ".env.dev" "development"
fi

if [ "$CREATE_STAGE" -eq 1 ]; then
    create_env_file ".env.stage" "staging"
fi

if [ "$CREATE_PROD" -eq 1 ]; then
    create_env_file ".env.prod" "production"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Environment setup complete!"
echo ""
echo "📝 Next steps:"
echo ""
echo "  1. Edit your environment files with actual values:"
if [ "$CREATE_DEV" -eq 1 ]; then
    echo "     nano .env.dev"
fi
if [ "$CREATE_STAGE" -eq 1 ]; then
    echo "     nano .env.stage"
fi
if [ "$CREATE_PROD" -eq 1 ]; then
    echo "     nano .env.prod"
fi
echo ""
echo "  2. Start development:"
echo "     make dev-all"
echo ""
echo "📖 For more information, see:"
echo "   - docs/ENVIRONMENT_VARIABLES.md"
echo "   - docs/ENV_QUICK_REFERENCE.md"
echo ""
