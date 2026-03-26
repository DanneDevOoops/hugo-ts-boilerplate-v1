---
title: 'Environment Variables Guide'
date: '2026-03-07T22:38:53+01:00'
lastmod: '2026-03-25T00:00:00+01:00'
draft: false

description: 'Complete guide to managing environment-specific variables, .env files, build commands, and secure configuration patterns for this Hugo project.'
slug: 'environment-variables'

tags:
  - 'project'
  - 'environment'
  - 'variables'
  - 'configuration'
  - 'hugo'
  - 'bun'
  - 'docker'

categories:
  - 'Guidelines'
  - 'Configuration'

showDate: true
showAuthor: true
showReadingTime: true
showTableOfContents: true
---

This project supports environment-specific configuration using `.env` files. This allows you to maintain different configurations for development, staging, and production environments.

## 📁 Environment Files

The project includes the following environment files:

- **`.env.example`** - Template file with all available variables (committed to git)
- **`.env.dev`** - Development environment configuration
- **`.env.stage`** - Staging environment configuration
- **`.env.prod`** - Production environment configuration

> ⚠️ **Important**: The actual `.env.*` files (except `.env.example`) are excluded from git for security. Never commit sensitive credentials.

## 🚀 Quick Start

### 1. Set Up Your Environment Files

The environment files are already created with default values. Review and update them with your actual values:

```bash
# Review and edit the development environment
nano .env.dev

# Review and edit the staging environment
nano .env.stage

# Review and edit the production environment
nano .env.prod
```

### 2. Available Variables

Each environment file supports the following variables:

```bash
# Hugo Configuration
HUGO_ENV=development                    # Environment name
HUGO_BASE_URL=http://localhost:1313    # Base URL for the site

# API Configuration
API_BASE_URL=https://api.example.com   # Your API endpoint
API_KEY=your-api-key-here              # API authentication key

# Google Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXX        # GA4 tracking ID

# Site Configuration
SITE_TITLE=My Hugo Site                # Site title
SITE_DESCRIPTION=Site description      # Site description

# Feature Flags
ENABLE_COMMENTS=false                  # Enable/disable comments
ENABLE_ANALYTICS=false                 # Enable/disable analytics

# Build Configuration
MINIFY=false                           # Enable/disable minification
BUILD_DRAFTS=true                      # Build draft content
```

## 🛠️ Usage

### Local Development

#### Using Make (Recommended)

```bash
# Development environment (default)
make dev-all

# Staging environment
make dev-all ENV=stage

# Production environment
make dev-all ENV=prod
```

#### Using npm/bun Scripts

```bash
# Development environment
bun run dev:env
# or
npm run dev:env

# Staging environment
bun run dev:stage

# Production environment
bun run dev:prod
```

#### Using Scripts Directly

```bash
# Development
./scripts/dev.sh dev

# Staging
./scripts/dev.sh stage

# Production
./scripts/dev.sh prod
```

### Building

#### Using Make

```bash
# Build for development
make build-hugo ENV=dev

# Build for staging
make build-hugo ENV=stage

# Build for production (default)
make build-hugo ENV=prod
```

#### Using npm/bun Scripts

```bash
# Build for development
bun run build:dev

# Build for staging
bun run build:stage

# Build for production
bun run build:prod
```

### Docker

The Docker services automatically load the appropriate environment file:

```bash
# Development (uses .env.dev)
docker compose up --build hugo-dev
# or
make server-docker-dev

# Staging (uses .env.stage)
docker compose --profile staging up --build hugo-staging
# or
make server-docker-stage

# Production (uses .env.prod)
docker compose --profile production run --rm hugo-prod
# or
make build-docker-prod
```

## 🔧 Accessing Variables in Hugo

### In Templates

Environment variables are available in Hugo templates through the `os.Getenv` function:

```go-html-template
{{ $apiUrl := os.Getenv "API_BASE_URL" }}
{{ $gaId := os.Getenv "GOOGLE_ANALYTICS_ID" }}

{{ if $gaId }}
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id={{ $gaId }}"></script>
{{ end }}
```

### In Configuration Files

You can reference environment variables in your Hugo config files:

**config/\_default/hugo.toml:**

```toml
# Use environment variable or fallback to default
baseURL = '{{ getenv "HUGO_BASE_URL" "https://example.com" }}'
```

Or use Hugo's environment-specific config files:

- `config/_default/hugo.toml` - Default configuration
- `config/development/hugo.toml` - Development overrides
- `config/staging/hugo.toml` - Staging overrides
- `config/production/hugo.toml` - Production overrides

## 📝 Accessing Variables in TypeScript

To use environment variables in your TypeScript code, you can access them through Bun's built-in support:

**assets/ts/main.ts:**

```typescript
// Access environment variables
const apiUrl = process.env.API_BASE_URL || 'http://localhost:8080';
const apiKey = process.env.API_KEY;

// Use in your code
async function fetchData() {
  const response = await fetch(`${apiUrl}/data`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  return response.json();
}
```

> **Note**: Environment variables used in TypeScript will be embedded in the compiled JavaScript during build time.

## 🔐 Security Best Practices

1. **Never commit sensitive data**: The `.gitignore` file is configured to exclude all `.env.*` files except `.env.example`

2. **Use different keys per environment**: Don't reuse API keys or credentials across environments

3. **Keep `.env.example` updated**: When adding new variables, update the example file

4. **Use secure vaults for production**: Consider using secret management tools like:
   - AWS Secrets Manager
   - HashiCorp Vault
   - GitHub Secrets (for CI/CD)

5. **Rotate credentials regularly**: Update API keys and secrets periodically

## 📚 Environment-Specific Hugo Config

You can also create environment-specific Hugo configuration files:

```
config/
├── _default/         # Default configuration (all environments)
│   ├── hugo.toml
│   ├── params.toml
│   └── menus.toml
├── development/      # Development overrides
│   └── hugo.toml
├── staging/          # Staging overrides
│   └── hugo.toml
└── production/       # Production overrides
    └── hugo.toml
```

Hugo automatically loads the appropriate config based on the `--environment` flag.

## 🐛 Troubleshooting

### Environment file not found

If you see: `⚠️ Environment file not found: .env.dev`

**Solution**: Copy the example file:

```bash
cp .env.example .env.dev
# Edit with your values
nano .env.dev
```

### Variables not loading

1. Ensure the environment file exists and has the correct permissions:

```bash
ls -la .env.*
chmod 644 .env.dev
```

2. Check that you're using the correct environment argument:

```bash
# Correct
./scripts/dev.sh dev

# Wrong (will fail)
./scripts/dev.sh development
```

3. Verify the load-env.sh script is executable:

```bash
chmod +x scripts/load-env.sh
```

### Variables not available in Hugo templates

Make sure environment variables are exported before running Hugo:

```bash
# Load manually
source scripts/load-env.sh dev

# Then run Hugo
hugo server
```

## 📖 Additional Resources

- [Hugo Environment Variables](https://gohugo.io/getting-started/configuration/#configure-with-environment-variables)
- [Bun Environment Variables](https://bun.sh/docs/runtime/env)
- [Docker Compose env_file](https://docs.docker.com/compose/environment-variables/set-environment-variables/#use-the-env_file-attribute)

## 🤝 Contributing

When adding new environment variables:

1. Add them to all environment files (`.env.dev`, `.env.stage`, `.env.prod`)
2. Update `.env.example` with a safe default or placeholder
3. Document the variable in this guide
4. Update relevant documentation

## 📝 Example: Adding a New Variable

1. **Add to all environment files:**

```bash
# .env.dev
NEW_FEATURE_FLAG=true

# .env.stage
NEW_FEATURE_FLAG=true

# .env.prod
NEW_FEATURE_FLAG=false
```

2. **Update the example file:**

```bash
# .env.example
NEW_FEATURE_FLAG=false
```

3. **Use in Hugo template:**

```go-html-template
{{ if eq (os.Getenv "NEW_FEATURE_FLAG") "true" }}
  <!-- New feature content -->
{{ end }}
```

4. **Use in TypeScript:**

```typescript
const isFeatureEnabled = process.env.NEW_FEATURE_FLAG === 'true';
```

---

**Need help?** Check the [README.md](../../README.md) or open an issue on GitHub.
