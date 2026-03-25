---
title: 'TypeScript + Bun Implementation Guide'
date: 2026-03-10
draft: false
description: 'Practical guide for using TypeScript with Bun in your Hugo project, including build commands, project structure, debugging, and best practices.'
slug: 'typescript-bun-guide'
tags: ['guidelines', 'typescript', 'bun', 'hugo', 'tooling']
categories: ['Guidelines', 'Tooling']
showDate: true
showReadingTime: true
showTableOfContents: true
---

## Overview

Your Hugo site has been configured with **TypeScript** and **Bun** for modern JavaScript development and bundling. This setup provides:

- 🔷 **Type Safety** - Full TypeScript support
- ⚡ **Fast Bundling** - Bun is 20-100x faster than webpack
- 📦 **Simple Setup** - No complex configuration needed
- 🐛 **Easy Debugging** - Source maps included
- 🎯 **Hugo Integration** - Seamless integration with Hugo asset pipeline

## System Architecture

```
Your TypeScript Code (assets/ts/)
         ↓
    Bun Bundler
         ↓
  Minified Output (assets/js/main.js)
         ↓
   Hugo Processes
         ↓
  Your Website
```

## Installation & First Build

### 1. Install Bun (One Time)

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Verify
bun --version
```

### 2. Install Dependencies

```bash
cd /Users/daniel/GolandProjects/Hugo/hugo-site
bun install
```

### 3. Build TypeScript

```bash
bun run build:ts
```

This creates: `assets/js/main.js`

### 4. Include in Hugo Layout

Add this to your `layouts/baseof.html`:

```html
<script src="{{ "js/main.js" | relURL }}" defer></script>
```

### 5. Test It

```bash
# Terminal 1: Watch TypeScript
bun run dev

# Terminal 2: Run Hugo
bun run server
```

Visit `http://localhost:1313` and open DevTools console - you should see:

```
Hugo site loaded with TypeScript via Bun!
```

## Project Structure

```
hugo-site/
│
├─ assets/ts/                       # TypeScript source files
│  ├─ main.ts                       # Entry point (main bundle)
│  ├─ utils.ts                      # Shared utilities
│  └─ features/                     # Feature modules
│     ├─ search.ts                  # Search functionality
│     └─ theme-switcher.ts          # Theme switching
│
├─ assets/js/                       # Generated JavaScript
│  └─ main.js                       # Bundled & minified output
│
├─ package.json                     # Bun configuration
├─ tsconfig.json                    # TypeScript settings
├─ bunfig.toml                      # Bun build settings
├─ Makefile                         # Convenient commands
│
├─ QUICKSTART.md                    # Quick start guide
├─ TYPESCRIPT_BUN_SETUP.md          # Detailed documentation
├─ SETUP_COMPLETE.md                # Setup summary
└─ ...other Hugo files...
```

## Commands Reference

### Using npm-style (`bun run`)

```bash
bun run dev              # Watch and rebuild on changes
bun run build:ts         # Build once
bun run build:all        # Build TS + Hugo
bun run server           # Start Hugo server
bun run server:docker    # Start with Docker
```

### Using Make (optional)

```bash
make dev                 # Watch and rebuild
make build               # Build once
make build-all           # Build TS + Hugo
make server              # Start server
make install             # Install dependencies
make clean               # Clean build artifacts
make help                # Show all commands
```

### Direct Bun Commands

```bash
# Package management
bun add lodash           # Add runtime dependency
bun add -d tailwindcss   # Add dev dependency
bun remove lodash        # Remove package
bun install              # Install all dependencies

# Building
bun build ./assets/ts/main.ts --outdir ./assets/js --minify

# Running
bun run <script>         # Run script from package.json
```

## Writing TypeScript

### Creating a New Feature

**Step 1: Create file** `assets/ts/features/my-feature.ts`

```typescript
// Example feature module
export interface Config {
  debug?: boolean;
  timeout?: number;
}

export class MyFeature {
  private config: Config;

  constructor(config?: Config) {
    this.config = config || {};
  }

  public start(): void {
    if (this.config.debug) {
      console.log('MyFeature started');
    }
  }
}

export function initializeMyFeature(config?: Config): MyFeature {
  const feature = new MyFeature(config);
  feature.start();
  return feature;
}
```

**Step 2: Import in** `assets/ts/main.ts`

```typescript
import { initializeMyFeature } from './features/my-feature';

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeMyFeature({ debug: true });
  });
} else {
  initializeMyFeature({ debug: true });
}
```

**Step 3: Build**

```bash
bun run build:ts
```

**Step 4: Use in Hugo**

```html
<!-- Your feature is now available globally -->
<script src="{{ "js/main.js" | relURL }}" defer></script>
```

## Advanced Examples

### Example 1: Search Feature

```typescript
// assets/ts/features/search.ts
export class SearchEngine {
  private index: SearchResult[] = [];

  async initialize(): Promise<void> {
    const response = await fetch('/index.json');
    this.index = await response.json();
  }

  search(query: string): SearchResult[] {
    return this.index.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
  }
}
```

See `assets/ts/features/search.ts` for complete example.

### Example 2: DOM Manipulation

```typescript
// assets/ts/utils.ts - Already includes:
// - Debounce function
// - Date formatting
// - Viewport detection
```

### Example 3: External Libraries

```bash
# Install a library
bun add fuse.js

# Use in TypeScript
import Fuse from 'fuse.js';

const fuse = new Fuse(items, options);
const results = fuse.search(query);
```

## Configuration Files

### `tsconfig.json`

Controls TypeScript compilation:

- **target**: ES2020 (modern browsers)
- **strict**: All type checking enabled
- **sourceMap**: Enables debugging

### `bunfig.toml`

Controls Bun's bundling:

- **minify**: Reduces file size
- **sourcemap**: For debugging in DevTools

### `package.json`

Manages dependencies and scripts.

## Debugging

### Enable Debugging in Browser

1. **Chrome DevTools**
   - Open DevTools (F12 or Cmd+Option+I)
   - Go to **Sources** tab
   - Look for your source files in the file tree (TypeScript files with `file://` protocol)
   - You'll see your original `.ts` files thanks to source maps

2. **Set Breakpoints**
   - Click line numbers in source view
   - Code will pause when breakpoint is hit

3. **Console Access**
   - All exported functions available globally
   - Use `console.log()` for quick debugging

### Source Maps

Source maps are generated automatically:

- `assets/js/main.js` - Minified code
- `assets/js/main.js.map` - Maps to TypeScript source

## Build Process Flow

```
1. Developer edits assets/ts/*.ts files
                    ↓
2. Run: bun run build:ts
                    ↓
3. Bun bundler:
   - Reads all .ts files
   - Compiles TypeScript to JavaScript
   - Bundles imports into one file
   - Minifies output
                    ↓
4. Output: assets/js/main.js (+ .map file)
                    ↓
5. Hugo processes and serves assets/
                    ↓
6. Browser loads script in <head> or <body>
                    ↓
7. JavaScript runs on page load
```

## Performance Considerations

- **Minification**: Enabled by default (smaller = faster)
- **Source Maps**: External files (don't slow down production)
- **Tree Shaking**: Bun removes unused code automatically
- **Code Splitting**: Can be configured for large projects
- **Async Loading**: Use `defer` attribute on script tags

## Troubleshooting

### "bun: command not found"

```bash
curl -fsSL https://bun.sh/install | bash
# Then restart your terminal
```

### "Module not found" error

```typescript
// Make sure you're exporting from the source file
export function myFunction() {}

// And importing the correct path
import { myFunction } from './features/my-feature';
```

### Changes not showing in browser

```bash
# 1. Rebuild
bun run build:ts

# 2. Hard refresh browser
# Chrome: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

# 3. Check DevTools for errors
# F12 → Console tab
```

### Slow builds

Bun is already very fast. If slow:

1. Check disk space
2. Verify Bun version: `bun --version`
3. Update Bun: `bun upgrade`

## Best Practices

1. **Keep main.ts clean**
   - Delegate to feature modules
   - Import and initialize features

2. **Use TypeScript types**
   - Enables better IDE support
   - Catches errors at compile time
   - Makes code self-documenting

3. **Organize by features**

   ```
   features/
   ├── search.ts
   ├── theme-switcher.ts
   ├── analytics.ts
   └── comments.ts
   ```

4. **Handle async properly**

   ```typescript
   async function loadData() {
     try {
       const response = await fetch('/api/data');
       return await response.json();
     } catch (error) {
       console.error('Failed to load:', error);
     }
   }
   ```

5. **Error handling**
   - Wrap DOM access in try/catch if needed
   - Check for null/undefined elements
   - Log errors for debugging

## Next Steps

1. ✅ **Setup Complete** - You now have everything configured
2. 📖 **Read Documentation**:
   - `QUICKSTART.md` - Hands-on examples
   - `TYPESCRIPT_BUN_SETUP.md` - Detailed guide
3. 🏗️ **Build Features**:
   - Create new files in `assets/ts/features/`
   - Import and use in `main.ts`
   - Rebuild with `bun run build:ts`
4. 🚀 **Deploy**:
   - Include `assets/js/main.js` in production
   - Don't deploy `assets/ts/` or `node_modules/`

## Resources

- **Bun**: https://bun.sh
- **TypeScript**: https://www.typescriptlang.org
- **Hugo**: https://gohugo.io
- **MDN Web Docs**: https://developer.mozilla.org

## Summary

You now have a modern JavaScript development workflow for your Hugo site:

✅ TypeScript for type safety
✅ Bun for fast bundling
✅ Source maps for easy debugging
✅ Minified output for production
✅ Seamless Hugo integration
✅ Full documentation and examples

Happy coding! 🎉
