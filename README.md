# Hugo Website

This is a static website built with **Hugo**, a fast and flexible static site generator with **TypeScript** support via **Bun**.

## 📦 Requirements

- [Hugo Extended](https://gohugo.io/getting-started/installing/)
- [Bun](https://bun.sh/) - Fast JavaScript runtime and package manager
- (Optional) Docker, if you want to build or run the site inside a container

## 🚀 Getting Started

### 1. Install Dependencies

```bash
bun install
# or
make install
```

### 2. Set Up Environment Variables

Copy the example environment file and configure for your environment:

```bash
# The .env files are already created, just review and update them
nano .env.dev
```

See [Environment Variables Guide](content/guidelines/environment-variables.md) for detailed information.

### 3. Start Development Server

```bash
# Recommended: TypeScript watch + Hugo server
make dev-all

# Or using npm/bun scripts
bun run dev:env

# Or directly
./scripts/dev.sh dev
```

The site will be available at: http://localhost:1313

## 🌍 Environment Management

This project supports multiple environments with separate `.env` files:

- **`.env.dev`** - Development environment
- **`.env.stage`** - Staging environment
- **`.env.prod`** - Production environment

### Running Different Environments

```bash
# Development (default)
make dev-all

# Staging
make dev-all ENV=stage

# Production
make dev-all ENV=prod
```

📖 **Full documentation**: [docs/ENVIRONMENT_VARIABLES.md](content/guidelines/environment-variables.md)

## 🏗️ Building the Site

### Development Build

```bash
bun run build:dev
# or
make build-hugo ENV=dev
```

### Production Build

```bash
bun run build:prod
# or
make build-hugo ENV=prod
```

Generate the static website in the `public/` directory.

## 🐳 Running with Docker Compose

### Development

```bash
docker compose up --build hugo-dev
# or
make server-docker-dev
```

### Staging

```bash
docker compose --profile staging up --build hugo-staging
# or
make server-docker-stage
```

### Production Build

```bash
docker compose --profile production run --rm hugo-prod
# or
make build-docker-prod
```

## 🧪 Testing and Coverage

```bash
bun run test:coverage
# or
make test-coverage
```

Coverage artifacts are generated in `docs/coverage/`.
Open `docs/coverage/index.html` to view the HTML report.

## 📚 Documentation

- [Environment Variables Guide](content/guidelines/environment-variables.md) - Complete guide for managing environment-specific configurations
- [SCSS Structure](content/guidelines/SCSS_STRUCTURE.md) - CSS/SCSS architecture documentation
- [Setup Guides](content/setup/) - Additional setup documentation
- [Guidelines](content/guidelines/) - Development guidelines

## 📄 License

Insert your license or preferred text here...
