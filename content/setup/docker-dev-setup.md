---
title: "🐳 Docker Development Setup with Live TypeScript Reload"
date: "2026-03-25T09:00:00+01:00"
draft: false
description: "Set up a Docker-based Hugo development workflow with Bun TypeScript watch mode and live reload."
tags: ["setup", "docker", "hugo", "typescript", "bun"]
categories: ["Setup"]
showDate: true
showAuthor: false
showReadingTime: true
showTableOfContents: true
---

## Overview

Your Docker development environment now includes **both** Bun TypeScript watch mode and Hugo server with live reload - all running in one container!

## Quick Start

Start the development environment:

```bash
docker compose up --build hugo-dev
```

or use the Makefile:

```bash
make server-docker
```

That's it! The container will:
1. ✅ Install dependencies (if needed)
2. ✅ Build TypeScript initially
3. ✅ Start Bun in watch mode (auto-rebuilds TypeScript on changes)
4. ✅ Start Hugo server with live reload
5. ✅ Bind to `0.0.0.0:1313` so you can access from your host

## How It Works

### Architecture

```
┌─────────────────────────────────────────┐
│         Docker Container                │
│                                         │
│  ┌────────────────┐  ┌───────────────┐ │
│  │  Bun Watch     │  │  Hugo Server  │ │
│  │  (Background)  │  │  (Foreground) │ │
│  │                │  │               │ │
│  │  Watches:      │  │  Watches:     │ │
│  │  assets/ts/    │  │  content/     │ │
│  │                │  │  layouts/     │ │
│  │  Outputs:      │  │  config/      │ │
│  │  assets/js/    │  │  assets/      │ │
│  └────────────────┘  └───────────────┘ │
│           │                  │          │
│           └──────┬───────────┘          │
│                  ▼                      │
│        Port 1313 (exposed)              │
└─────────────────────────────────────────┘
                   │
                   ▼
        http://localhost:1313
        (accessible from host)
```

### Modified Files

1. **`Dockerfile`** - Added Bun installation
2. **`docker-compose.yml`** - Updated `hugo-dev` service to run new script
3. **`scripts/docker-dev.sh`** - New script that manages both processes
4. **`.dockerignore`** - Excludes unnecessary files from build context

## Usage

### Start Development (Recommended)

```bash
docker compose up --build hugo-dev
```

Watch the logs - you'll see:
- 📦 Dependency installation (first time only)
- 📦 Initial TypeScript build
- 🚀 Bun watch started
- 🚀 Hugo server started
- 🌐 `Web Server is available at http://localhost:1313/`

### Edit TypeScript Files

1. Edit any file in `assets/ts/`
2. Bun automatically rebuilds `assets/js/main.js`
3. Hugo detects the change and triggers browser reload
4. See your changes instantly!

### Edit Hugo Content

1. Edit files in `content/`, `layouts/`, or `config/`
2. Hugo detects changes and rebuilds
3. Browser auto-reloads
4. See your changes instantly!

### Stop the Environment

Press `Ctrl+C` in the terminal - both processes will shut down gracefully.

## Testing the Setup

1. Start the container:
   ```bash
   docker compose up --build hugo-dev
   ```

2. Open browser to `http://localhost:1313`

3. Edit `assets/ts/components/hello-card.ts`:
   ```typescript
   // Change the greeting
   <h3>Hello from Docker! 🐳, ${this.name} 👋</h3>
   ```

4. Save the file and watch:
   - Bun rebuilds the JS in container logs
   - Hugo detects the change
   - Browser auto-reloads
   - New greeting appears!

## Troubleshooting

### Container won't start
- Check if port 1313 is already in use: `lsof -i :1313`
- Stop any local Hugo server running
- Rebuild: `docker compose up --build hugo-dev`

### TypeScript changes not detected
- Check container logs: `docker compose logs -f hugo-dev`
- Verify Bun watch is running (you should see "Bun watch started")
- Make sure volumes are mounted correctly

### Dependencies not installing
- Remove node_modules: `rm -rf node_modules`
- Rebuild container: `docker compose up --build hugo-dev`

### Clean restart
```bash
docker compose down
docker compose up --build hugo-dev
```

## Production Build

For production, use:

```bash
docker compose --profile production run --rm hugo-prod
```

or

```bash
make build-docker-production
```

This builds the optimized static site in `public/` without watch mode.

## Comparison: Docker vs. Local Development

### Docker Development (New Setup)
```bash
docker compose up --build hugo-dev
```
- ✅ Consistent environment across machines
- ✅ No need to install Hugo/Bun locally
- ✅ Isolated dependencies
- ✅ Easy CI/CD integration
- ⚠️ Slightly slower initial build

### Local Development
```bash
make dev-all
```
- ✅ Faster startup
- ✅ Native performance
- ✅ Easier debugging
- ⚠️ Requires local Hugo/Bun installation

Both approaches now support full live reload for TypeScript and Hugo content!

## Advanced: Custom Docker Commands

### View logs only
```bash
docker compose logs -f hugo-dev
```

### Rebuild without cache
```bash
docker compose build --no-cache hugo-dev
docker compose up hugo-dev
```

### Run bash inside container
```bash
docker compose run --rm hugo-dev /bin/sh
```

### Check Bun version in container
```bash
docker compose run --rm hugo-dev bun --version
```

## Files Reference

- **`Dockerfile`** - Container image definition with Hugo + Bun
- **`docker-compose.yml`** - Service definitions (dev, staging, prod)
- **`scripts/docker-dev.sh`** - Development orchestration script
- **`.dockerignore`** - Build context exclusions for faster builds

## Next Steps

- Your Docker dev environment is ready!
- Just run `docker compose up --build hugo-dev`
- Edit TypeScript or Hugo files and see live updates
- Press `Ctrl+C` to stop when done

Happy coding! 🚀

