---
title: '⚡ Super Fast Hugo + TypeScript/JavaScript Build Guide'
date: '2026-03-25T00:00:00+01:00'
lastmod: '2026-03-25T00:00:00+01:00'
draft: false

description: 'Guide to building a fast Hugo + TypeScript pipeline with Bun, Hugo Pipes, minification, fingerprinting, and practical development/production workflows.'
slug: 'fast-build-guide'

tags:
  - 'guidelines'
  - 'hugo'
  - 'bun'
  - 'typescript'
  - 'build'
  - 'performance'
  - 'optimization'

categories:
  - 'Guidelines'
  - 'Tooling'

showDate: true
showAuthor: true
showReadingTime: true
showTableOfContents: true
---

This guide explains how to bundle your TypeScript/JavaScript code into your Hugo build for maximum performance.

## 🎯 Overview

Your Hugo site now has an optimized build pipeline that:

- ✅ Uses **Bun** (fastest JavaScript runtime) to compile TypeScript
- ✅ Integrates seamlessly with **Hugo Pipes** for asset processing
- ✅ Automatically minifies and fingerprints your JavaScript
- ✅ Supports **development** and **production** workflows
- ✅ Enables **watch mode** for instant rebuilds

## 🚀 Quick Start

### Development Workflow (Recommended)

```bash
make dev-all
```

This starts both:

- Bun in watch mode (rebuilds TypeScript on changes)
- Hugo server with live reload

### Production Build (Super Fast)

```bash
make build-fast
```

Builds optimized production site in `public/` directory.

## 📋 Available Commands

### Development

| Command        | Description                                      |
| -------------- | ------------------------------------------------ |
| `make dev-all` | Run TypeScript watch + Hugo server (recommended) |
| `make dev`     | Watch TypeScript only (rebuild on changes)       |
| `make server`  | Start Hugo server only                           |
| `./dev.sh`     | Alternative way to run dev-all                   |

### Production Builds

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `make build-fast` | Fast production build (recommended) |
| `make build-hugo` | Production build with cleanup       |
| `make build`      | Build TypeScript only               |
| `make build-all`  | Build TypeScript then Hugo          |
| `./build.sh`      | Alternative production build script |

### Code Quality

| Command             | Description                    |
| ------------------- | ------------------------------ |
| `make lint`         | Check code quality with ESLint |
| `make lint-fix`     | Auto-fix ESLint issues         |
| `make format`       | Format code with Prettier      |
| `make format-check` | Check formatting               |

### Utilities

| Command        | Description             |
| -------------- | ----------------------- |
| `make install` | Install dependencies    |
| `make clean`   | Clean build artifacts   |
| `make help`    | Show available commands |

## 🏗️ How It Works

### 1. TypeScript Compilation

Your TypeScript files in `assets/ts/` are compiled by Bun:

```bash
bun build ./assets/ts/main.ts --outdir ./assets/js --target browser --minify
```

This creates `assets/js/main.js` which Hugo can process.

### 2. Hugo Integration

Hugo processes your compiled JavaScript through Hugo Pipes via the custom partial at `layouts/partials/extend-head.html`:

```html
{{- if fileExists "assets/js/main.js" -}} {{- $jsCustom := resources.Get "js/main.js" |
resources.Minify | resources.Fingerprint $alg -}}
<script
  defer
  src="{{ $jsCustom.RelPermalink }}"
  integrity="{{ $jsCustom.Data.Integrity }}"
></script>
{{- end -}}
```

This:

- ✅ Minifies your JavaScript
- ✅ Generates integrity hashes for security
- ✅ Creates cache-busted filenames
- ✅ Defers loading for better performance

### 3. Blowfish Theme Integration

The Blowfish theme automatically includes the `extend-head.html` partial, so your JavaScript bundle is automatically injected into every page.

## 📁 File Structure

```
assets/
  ts/                    # TypeScript source files
    main.ts             # Entry point
    utils.ts
    components/
    features/
  js/                    # Compiled JavaScript output
    main.js             # Compiled bundle (auto-generated)
    main.js.map         # Source map

layouts/
  partials/
    extend-head.html    # Injects your JS bundle

build.sh                # Production build script
dev.sh                  # Development workflow script
Makefile                # Build commands
```

## 🎨 Adding More TypeScript Files

### 1. Create a new file

```bash
touch assets/ts/features/my-feature.ts
```

### 2. Import it in main.ts

```typescript
// assets/ts/main.ts
import './features/my-feature';
```

### 3. Build automatically

- **Dev mode**: Changes detected automatically with `make dev-all`
- **Production**: Run `make build-fast`

## 🔧 Customization

### Bun Build Options

Edit `bunfig.toml` to customize:

- Minification settings
- Source map generation
- Browser targets
- Console stripping

### Hugo Processing

Edit `layouts/partials/extend-head.html` to customize:

- Loading strategy (defer/async)
- Fingerprinting algorithm
- Conditional loading

## 🚀 Performance Tips

### Development

1. **Use `make dev-all`** - Fastest feedback loop
2. **Keep TypeScript compilation fast** - Avoid unnecessary imports
3. **Hugo's fast render is disabled** - Ensures all changes are properly detected and rendered

### Production

1. **Use `make build-fast`** - Optimized for speed
2. **Bun is already blazing fast** - No need for complex optimizations
3. **Hugo Pipes handles caching** - Fingerprinted assets for cache busting

### Optimization Checklist

- ✅ Bun compiles TypeScript (faster than Node/TSC)
- ✅ Code is minified during compilation
- ✅ Hugo Pipes adds fingerprinting
- ✅ Deferred script loading (non-blocking)
- ✅ Integrity hashes for security
- ✅ External source maps (smaller bundles)

## 🐛 Troubleshooting

### JavaScript not loading?

1. Check if `assets/js/main.js` exists
   ```bash
   ls -la assets/js/main.js
   ```
2. Run a fresh build
   ```bash
   make clean && make build-fast
   ```

### TypeScript compilation errors?

1. Check ESLint output
   ```bash
   make lint
   ```
2. Validate TypeScript
   ```bash
   bun run build:ts
   ```

### Hugo not finding the bundle?

1. Ensure `assets/js/main.js` exists before running Hugo
2. Check `layouts/partials/extend-head.html` exists
3. Verify the path in the partial matches your output

## 🎯 Deployment

### Build for production

```bash
make build-fast
```

### Deploy the `public/` directory

Your built site is in `public/` with:

- ✅ Minified HTML
- ✅ Optimized CSS
- ✅ Bundled & minified JavaScript
- ✅ Fingerprinted assets
- ✅ Source maps (for debugging)

### Example: Deploy to Netlify/Vercel

Add to your deploy configuration:

```yaml
build:
  command: make install && make build-fast
  publish: public
```

## 📚 Additional Resources

- [Bun Documentation](https://bun.sh/docs)
- [Hugo Pipes Documentation](https://gohugo.io/hugo-pipes/)
- [Blowfish Theme Docs](https://blowfish.page/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🎉 Why This Setup is Super Fast

1. **Bun**: 10-100x faster than Node.js/Webpack
2. **Hugo**: Already one of the fastest static site generators
3. **No unnecessary bundlers**: Direct compilation, no webpack/rollup overhead
4. **Efficient caching**: Hugo Pipes handles asset caching
5. **Parallel processing**: Hugo and Bun work together efficiently
6. **Optimized defaults**: Minification, fingerprinting built-in

---

**Need help?** Run `make help` to see all available commands.
