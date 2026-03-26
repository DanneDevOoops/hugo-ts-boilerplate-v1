---
title: 'TypeScript + Bun Setup for Hugo'
date: '2026-03-25T09:40:00+01:00'
draft: false
description: 'Comprehensive guide to configuring TypeScript and Bun as the JavaScript toolchain for Hugo.'
tags: ['setup', 'typescript', 'bun', 'hugo', 'tooling']
categories: ['Setup']
showDate: true
showAuthor: false
showReadingTime: true
showTableOfContents: true
---

This Hugo site now uses **TypeScript** and **Bun** as the package manager and build tool for JavaScript bundling.

## 📋 Project Structure

```
hugo-site/
├── src/
│   └── ts/
│       ├── main.ts          # Entry point
│       └── utils.ts         # Utility functions
├── assets/
│   └── js/                  # Compiled JavaScript output
├── package.json             # Bun package configuration
├── tsconfig.json            # TypeScript configuration
└── ...other Hugo files...
```

## 🚀 Getting Started

### Prerequisites

- Install **Bun**: https://bun.sh
  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```

### Installation

1. Install dependencies:

   ```bash
   bun install
   ```

2. Build TypeScript:

   ```bash
   bun run build:ts
   ```

3. Watch mode for development:

   ```bash
   bun run dev
   ```

4. Start Hugo server:

   ```bash
   bun run server
   ```

5. Build everything (TypeScript + Hugo):
   ```bash
   bun run build:all
   ```

## 🛠️ Available Scripts

| Script                  | Description                                   |
| ----------------------- | --------------------------------------------- |
| `bun run dev`           | Watch TypeScript files and rebuild on changes |
| `bun run build:ts`      | Build TypeScript to bundled JavaScript        |
| `bun run build:all`     | Build TypeScript and Hugo site                |
| `bun run server`        | Start Hugo dev server                         |
| `bun run server:docker` | Start Hugo with Docker Compose                |

## 📝 Writing TypeScript

### Main Entry Point (`src/ts/main.ts`)

This is your primary entry point. Import and use other modules here:

```typescript
import { Utilities } from './utils';

console.log('My Hugo site with TypeScript!');
```

### Creating New Modules

Create TypeScript files in `src/ts/` directory:

```typescript
// src/ts/features/search.ts
export function initializeSearch(): void {
  // Your search implementation
}
```

Import in `main.ts`:

```typescript
import { initializeSearch } from './features/search';
initializeSearch();
```

## 🔧 Configuration

### TypeScript Config (`tsconfig.json`)

- **Target**: ES2020
- **Module**: ESNext
- **Strict Mode**: Enabled
- **Source Map**: Enabled for debugging

### Build Config (`bunfig.toml`)

Optional: Create `bunfig.toml` for custom Bun settings:

```toml
[build]
minify = true
sourcemap = "external"
```

## 📦 Bun vs npm

**Why Bun?**

- ⚡ **Faster**: 20-100x faster than npm for package management and bundling
- 🚀 **Built-in Bundler**: No need for separate webpack/esbuild configuration
- 📦 **Simpler**: One tool for package management and bundling
- 🔄 **Hot Reload**: Native hot reload support

**Key Bun Commands**:

- `bun install` - Install dependencies (replaces `npm install`)
- `bun add <package>` - Add dependency (replaces `npm install <package>`)
- `bun remove <package>` - Remove dependency
- `bun build` - Bundle code
- `bun run <script>` - Run scripts from package.json

## 📚 Using Bun with Hugo

The build process:

1. **Source**: `src/ts/**/*.ts` → TypeScript files
2. **Compile**: Bun bundles TypeScript to JavaScript
3. **Output**: `assets/js/main.js` → Hugo asset pipeline
4. **Include in Hugo**: Reference compiled JS in your layouts

Example in Hugo template (`layouts/baseof.html`):

```html
<script src="{{ "js/main.js" | relURL }}"></script>
```

## 🔍 Debugging

With source maps enabled, you can debug TypeScript directly in browser DevTools:

1. Check the "Sources" tab in Chrome DevTools
2. You'll see original `.ts` files instead of compiled `.js`

## 📚 Resources

- **Bun Docs**: https://bun.sh/docs
- **TypeScript Docs**: https://www.typescriptlang.org/docs/
- **Hugo Docs**: https://gohugo.io/documentation/
- **Bun API**: https://bun.sh/docs/api

## ✨ Next Steps

1. Install Bun if not already installed
2. Run `bun install` to install dependencies
3. Run `bun run build:ts` to build your first bundle
4. Add more TypeScript files to `src/ts/`
5. Import them in `main.ts`
6. Reference the built JS in your Hugo layouts

Happy coding! 🎉
