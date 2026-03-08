# Environment Variables - Quick Reference

## 🚀 Quick Commands

### Development

```bash
make dev-all              # Start dev server with .env.dev
bun run dev:env           # Alternative using npm script
./scripts/dev.sh dev      # Direct script execution
```

### Staging

```bash
make dev-all ENV=stage    # Start dev server with .env.stage
bun run dev:stage         # Alternative using npm script
./scripts/dev.sh stage    # Direct script execution
```

### Production

```bash
make dev-all ENV=prod     # Start dev server with .env.prod
bun run dev:prod          # Alternative using npm script
./scripts/dev.sh prod     # Direct script execution
```

## 🏗️ Build Commands

```bash
# Development build
bun run build:dev
make build-hugo ENV=dev

# Staging build
bun run build:stage
make build-hugo ENV=stage

# Production build
bun run build:prod
make build-hugo ENV=prod
```

## 🐳 Docker Commands

```bash
# Development
make server-docker-dev

# Staging
make server-docker-stage

# Production
make build-docker-prod
```

## 📁 File Structure

```
project/
├── .env.example        # Template (committed to git)
├── .env.dev           # Development config (not in git)
├── .env.stage         # Staging config (not in git)
├── .env.prod          # Production config (not in git)
├── scripts/
│   ├── load-env.sh    # Loads environment variables
│   ├── dev.sh         # Development script
│   └── build.sh       # Build script
└── config/
    ├── _default/      # Base Hugo config
    ├── development/   # Dev overrides
    ├── staging/       # Staging overrides
    └── production/    # Production overrides
```

## 🔧 Using Variables

### In Hugo Templates

```go-html-template
{{ $apiUrl := os.Getenv "API_BASE_URL" }}
{{ $gaId := os.Getenv "GOOGLE_ANALYTICS_ID" }}
```

### In TypeScript

```typescript
const apiUrl = process.env.API_BASE_URL;
const apiKey = process.env.API_KEY;
```

## 📖 Full Documentation

See [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md) for complete guide.
