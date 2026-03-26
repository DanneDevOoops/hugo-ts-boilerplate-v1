.PHONY: help install dev dev-all build build-all build-fast build-hugo server server-docker server-docker-staging build-docker-production lint lint-fix format format-ts format-css format-html format-md format-check format-check-ts format-check-css format-check-html format-check-md clean clean-lock-files clean-docs clean-js-build clean-vendor docs docs-watch hugo-mod-graph hugo-mod-vendor hugo-mod-get hugo-mod-get-update hugo-mod-tidy hugo-mod-clean hugo-mod-verify hugo-mod-init

LOCK_FILES := bun.lock package-lock.json yarn.lock pnpm-lock.yaml .hugo_build.lock
CLEAN_DOC_PATHS := docs/coverage docs/typedoc
CLEAN_BUILD_PATHS := dist public node_modules
JS_BUILD_DIR := assets/js

help:
	@echo "╔════════════════════════════════════════════════════════════════════════════╗"
	@echo "║           ⚡ Hugo + TypeScript + Bun Development Build System ⚡          ║"
	@echo "╚════════════════════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "🔧 SETUP & INSTALLATION COMMANDS"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo ""
	@echo "  make install              - Install dependencies with Bun (run first!)"
	@echo "  make install-dev          - Install dev dependencies with Bun"
	@echo ""
	@echo "⚙️  DEVELOPMENT COMMANDS"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo ""
	@echo "  make dev                  - Watch TypeScript and rebuild on changes"
	@echo "  make dev-all              - ⭐ RECOMMENDED: Run CSS watch + TypeScript watch + Hugo dev server"
	@echo "                            (All run in one terminal, auto-reload on code changes)"
	@echo "  make server               - Start Hugo dev server only (http://localhost:1313)"
	@echo ""
	@echo "🔨 BUILD COMMANDS"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo ""
	@echo "  make build-ts             - Build TypeScript once"
	@echo "  make build-all            - Build CSS, TypeScript, and generate Hugo site"
	@echo "  make build-fast           - 🚀 RECOMMENDED: Fast production build with minification"
	@echo "                            (CSS built + TypeScript minified + Hugo minified)"
	@echo "  make build-hugo           - Full production build via scripts/build.sh"
	@echo ""
	@echo "🐳 DOCKER COMMANDS"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo ""
	@echo "  make server-docker-dev    - Start Hugo Docker development service (hugo-dev)"
	@echo "  make server-docker-stage  - Start Hugo Docker staging service (hugo-staging)"
	@echo "  make build-docker-prod    - Run Hugo Docker production build (hugo-prod)"
	@echo ""
	@echo "✨ CODE QUALITY COMMANDS"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo ""
	@echo "  make lint                 - Check TypeScript code with ESLint"
	@echo "  make lint-fix             - Auto-fix ESLint issues in TypeScript files"
	@echo ""
	@echo "  Testing (Vitest):"
	@echo "  make test                 - Run tests in watch mode"
	@echo "  make test-run             - Run all tests once"
	@echo "  make test-ui              - Open Vitest UI in browser"
	@echo "  make test-coverage        - Run tests with coverage report"
	@echo ""
	@echo "  Format (Prettier):"
	@echo "  make format               - Format all files (TS, CSS, HTML, MD) with Prettier"
	@echo "  make format-ts            - Format TypeScript files with Prettier"
	@echo "  make format-css           - Format SCSS source files with Prettier"
	@echo "  make format-html          - Format HTML files with Prettier"
	@echo "  make format-md            - Format Markdown files with Prettier"
	@echo ""
	@echo "  Format Check (Prettier):"
	@echo "  make format-check         - Check if all files are properly formatted"
	@echo "  make format-check-ts      - Check if TypeScript files are properly formatted"
	@echo "  make format-check-css     - Check if SCSS source files are properly formatted"
	@echo "  make format-check-html    - Check if HTML files are properly formatted"
	@echo "  make format-check-md      - Check if Markdown files are properly formatted"
	@echo ""
	@echo "📚 DOCUMENTATION COMMANDS"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo ""
	@echo "  make docs                 - Generate TypeDoc documentation"
	@echo "  make docs-watch           - Watch TypeScript files and regenerate docs on changes"
	@echo "                            (Output: docs/typedoc/)"
	@echo "  make clean-docs           - Remove generated TypeDoc documentation"
	@echo ""
	@echo "🔧 HUGO MODULE MANAGEMENT"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo ""
	@echo "  make hugo-mod-init        - Initialize this project as a Hugo Module"
	@echo "  make hugo-mod-get         - Resolve direct module dependencies (latest versions)"
	@echo "  make hugo-mod-get-update  - Update all module dependencies (direct and indirect)"
	@echo "                            (Equivalent to: hugo mod get -u ./...)"
	@echo "  make hugo-mod-tidy        - Clean up unused entries in go.mod and go.sum"
	@echo "  make hugo-mod-vendor      - Vendor all module dependencies into _vendor directory"
	@echo "                            (No Go required after vendoring)"
	@echo "  make hugo-mod-graph       - Print module dependency graph"
	@echo "  make hugo-mod-verify      - Verify dependencies"
	@echo "  make hugo-mod-clean       - Delete the Hugo Module cache for this project"
	@echo ""
	@echo "🧹 CLEANUP COMMANDS"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo ""
	@echo "  make clean                - Remove build artifacts, docs output, and node_modules"
	@echo "  make clean-lock-files     - Remove lock files (bun.lock, package-lock.json, etc.)"
	@echo "  make clean-docs           - Remove generated TypeDoc documentation"
	@echo "  make clean-js-build       - Remove generated JavaScript files (assets/js**/*.js)"
	@echo "  make clean-vendor         - Remove vendored Hugo modules (_vendor/)"
	@echo ""
	@echo "ℹ️  HELP"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo ""
	@echo "  make help                 - Show this help message"
	@echo ""
	@echo "🚀 QUICK START GUIDE"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo ""
	@echo "  1. make install           # Install dependencies"
	@echo "  2. make dev-all           # Start development (watch + server)"
	@echo "  3. Open browser to http://localhost:1313"
	@echo ""
	@echo "🏗️  PRODUCTION BUILD"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo ""
	@echo "  make build-fast           # Recommended for production"
	@echo ""
	@echo "Output locations:"
	@echo "  - TypeScript:   assets/js/main.js (+ source map)"
	@echo "  - Hugo Site:    public/ directory"
	@echo ""

install:
	@echo "📦 Installing dependencies with Bun..."
	bun install

install-dev:
	@echo "📦 Installing development dependencies with Bun..."
	bun install --dev

dev:
	@echo "🚀 Starting TypeScript watch mode..."
	bun run dev

dev-all:
	@echo "🚀 Starting development environment (TypeScript watch + Hugo server)..."
	@./scripts/dev.sh $(ENV)


# ============================================================================
# Build Commands
# ============================================================================

build-ts:
	@echo "🔨 Building TypeScript..."
	bun run build:ts

build-all:
	@echo "🔨 Building CSS, TypeScript, and Hugo site..."
	bun run build:all

build-fast:
	@echo "⚡ Fast build starting..."
	@bun run build:css
	@bun build ./assets/ts/main.ts --outdir ./assets/js --target browser --minify --sourcemap=external
	@hugo --minify
	@echo "✅ Build complete! Output: public/"

build-hugo:
	@echo "🚀 Starting $(if $(ENV),$(ENV),dev) environment build with optimizations..."
	@./scripts/build.sh $(or $(ENV),dev)

build-hugo-dev:
	@$(MAKE) build-hugo ENV=dev

build-hugo-stage:
	@$(MAKE) build-hugo ENV=stage

build-hugo-prod:
	@$(MAKE) build-hugo ENV=prod

server:
	@echo "🚀 Starting Hugo development server..."
	bun run server

# ============================================================================
# Docker Commands
# ============================================================================

server-docker-dev:
	@echo "🐳 Starting Hugo Docker development service (hugo-dev)..."
	docker compose up --build hugo-dev

server-docker-stage:
	@echo "🐳 Starting Hugo Docker staging service (hugo-staging)..."
	docker compose --profile staging up --build hugo-staging

build-docker-prod:
	@echo "🐳 Running Hugo Docker production build (hugo-prod)..."
	docker compose --profile production run --rm hugo-prod

# ============================================================================
# Code Quality Commands
# ============================================================================

lint:
	@echo "🔍 Running ESLint to check TypeScript code quality..."
	bun run lint

lint-fix:
	@echo "🔧 Running ESLint with --fix to auto-correct issues..."
	bun run lint:fix

format:
	@echo "🎨 Running Prettier to format all files (TS, CSS, HTML, MD)..."
	bun run format

format-ts:
	@echo "🎨 Running Prettier to format TypeScript code..."
	bun run format:ts

format-css:
	@echo "🎨 Running Prettier to format CSS code..."
	bun run format:css

format-html:
	@echo "🎨 Running Prettier to format HTML code..."
	bun run format:html

format-md:
	@echo "🎨 Running Prettier to format Markdown files..."
	bun run format:md

format-check:
	@echo "🔍 Checking if all files are properly formatted with Prettier..."
	bun run format:check

format-check-ts:
	@echo "🔍 Checking if TypeScript files are properly formatted with Prettier..."
	bun run format:check:ts

format-check-css:
	@echo "🔍 Checking if CSS files are properly formatted with Prettier..."
	bun run format:check:css

format-check-html:
	@echo "🔍 Checking if HTML files are properly formatted with Prettier..."
	bun run format:check:html

format-check-md:
	@echo "🔍 Checking if Markdown files are properly formatted with Prettier..."
	bun run format:check:md

# ============================================================================
# Testing Commands
# ============================================================================

test:
	@echo "🧪 Running tests in watch mode..."
	bun run test

test-run:
	@echo "🧪 Running all tests once..."
	bun run test:run

test-ui:
	@echo "🧪 Opening Vitest UI in browser..."
	bun run test:ui

test-coverage:
	@echo "📊 Running tests with coverage report..."
	bun run test:coverage

# ============================================================================
# Documentation Commands
# ============================================================================

docs:
	@echo "📚 Generating TypeDoc documentation..."
	bun run docs

docs-watch:
	@echo "👀 Watching TypeScript files and regenerating documentation on changes..."
	bun run docs:watch

# ============================================================================
# Cleanup Commands
# ============================================================================

clean: clean-js-build clean-docs
	@echo "🧹 Cleaning build artifacts and dependencies..."
	rm -rf $(CLEAN_BUILD_PATHS)
	@echo "🧹 Cleaned build artifacts, dependencies, and generated docs"

clean-lock-files:
	@echo "🧹 Removing lock files..."
	rm -f $(LOCK_FILES)
	@echo "🧹 Lock files removed"

clean-docs:
	@echo "🧹 Cleaning generated documentation..."
	rm -rf $(CLEAN_DOC_PATHS)
	@echo "🧹 Generated documentation cleaned"

clean-js-build:
	@echo "🧹 Cleaning generated JavaScript files..."
	@if [ -d "$(JS_BUILD_DIR)" ]; then \
		find "$(JS_BUILD_DIR)" -type f \( -name "*.js" -o -name "*.js.map" \) -delete; \
	fi
	@echo "🧹 Generated JavaScript files cleaned"

clean-vendor:
	@echo "🧹 Cleaning vendored Hugo modules..."
	rm -rf _vendor/
	@echo "🧹 Vendored modules cleaned"

# ============================================================================
# Hugo Module Management Commands
# ============================================================================

hugo-mod-init:
	@echo "🚀 Initializing Hugo module..."
	hugo mod init

hugo-mod-get:
	@echo "🔍 Resolving Hugo module dependencies..."
	hugo mod get

hugo-mod-get-update:
	@echo "🔄 Updating all Hugo module dependencies..."
	hugo mod get -u ./...

hugo-mod-tidy:
	@echo "🧹 Tidying Hugo module dependencies..."
	hugo mod tidy
	@echo "✅ go.mod and go.sum tidied"

hugo-mod-vendor:
	@echo "🔄 Vendoring Hugo modules..."
	hugo mod vendor
	@echo "✅ Modules vendored to _vendor directory"

hugo-mod-graph:
	@echo "📊 Hugo module dependency graph:"
	hugo mod graph

hugo-mod-verify:
	@echo "✅ Verifying Hugo module dependencies..."
	hugo mod verify

hugo-mod-clean:
	@echo "🧹 Cleaning Hugo module cache..."
	hugo mod clean
	@echo "✅ Cache cleaned"

.DEFAULT_GOAL := help
