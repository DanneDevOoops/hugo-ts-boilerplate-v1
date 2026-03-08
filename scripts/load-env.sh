#!/usr/bin/env bash
# Load environment variables from .env file
# Usage: source scripts/load-env.sh [dev|stage|prod]
#
# This script loads environment variables from the appropriate .env file
# based on the environment argument (defaults to 'dev')

set -a  # Automatically export all variables

# Determine environment
ENV="${1:-dev}"

# Map environment names
case "$ENV" in
  development|dev)
    ENV_FILE=".env.dev"
    ;;
  staging|stage)
    ENV_FILE=".env.stage"
    ;;
  production|prod)
    ENV_FILE=".env.prod"
    ;;
  *)
    echo "⚠️  Unknown environment: $ENV"
    echo "   Valid options: dev, stage, prod"
    exit 1
    ;;
esac

# Check if env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "⚠️  Environment file not found: $ENV_FILE"
    echo "   Please copy .env.example to $ENV_FILE and configure it"
    exit 1
fi

# Load environment variables
echo "🔧 Loading environment variables from: $ENV_FILE"
source "$ENV_FILE"

# Export common variables for Hugo
export HUGO_ENVIRONMENT="${HUGO_ENV:-$ENV}"
export BASE_URL="${HUGO_BASE_URL}"

set +a  # Stop automatically exporting

echo "✅ Environment loaded: $HUGO_ENVIRONMENT"

