---
title: "Quick Start: TypeScript + Bun for Hugo"
date: "2026-03-25T09:25:00+01:00"
draft: false
description: "Fast 5-minute setup for TypeScript and Bun in a Hugo project."
tags: ["setup", "quickstart", "typescript", "bun", "hugo"]
categories: ["Setup"]
showDate: true
showAuthor: false
showReadingTime: true
showTableOfContents: true
---

## ⚡ 5-Minute Setup

### 1. Install Bun (if not already installed)

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows (with Windows Subsystem for Linux)
curl -fsSL https://bun.sh/install | bash
```

Verify installation:
```bash
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

This creates `assets/js/main.js` with your compiled and bundled JavaScript.

### 4. Add Script to Your Hugo Layout

In your `layouts/baseof.html` or similar:

```html
<script src="{{ "js/main.js" | relURL }}" defer></script>
```

### 5. Start Developing

**Option 1: Watch TypeScript + Hugo Server**
```bash
# Terminal 1: Watch TypeScript
bun run dev

# Terminal 2: Run Hugo
bun run server
```

**Option 2: Docker (if you prefer)**
```bash
bun run server:docker
```

## 📂 File Structure

```
assets/ts/
├── main.ts              ← Entry point (always required)
├── utils.ts             ← Shared utilities
└── features/
    ├── search.ts        ← Feature module example
    └── theme-switcher.ts ← Theme switcher example

assets/js/
└── main.js              ← Compiled and minified output
```

## ✍️ Adding New TypeScript Files

### 1. Create a new file in `assets/ts/`

```typescript
// assets/ts/features/my-feature.ts

export function myFunction(): void {
  console.log('Hello from my feature!');
}
```

### 2. Import it in `main.ts`

```typescript
// assets/ts/main.ts

import { myFunction } from './features/my-feature';

myFunction();
```

### 3. Rebuild

```bash
bun run build:ts
```

The output is automatically bundled into `assets/js/main.js`.

## 🔍 Common Commands

```bash
# Install new package
bun add lodash
bun add -d @types/lodash

# Remove package
bun remove lodash

# Watch and rebuild on changes
bun run dev

# Build once (optimized)
bun run build:ts

# Build everything (TS + Hugo)
bun run build:all

# Run Hugo dev server
bun run server

# Run with Docker
bun run server:docker
```

## 🎯 Real-World Example: Adding a Feature

Let's add a "Copy to Clipboard" feature:

### 1. Create the feature file

```typescript
// assets/ts/features/copy-to-clipboard.ts

export function initializeCopyToClipboard(): void {
  document.querySelectorAll('[data-copy]').forEach((element) => {
    const button = element as HTMLElement;
    button.style.cursor = 'pointer';

    button.addEventListener('click', async () => {
      const text = button.getAttribute('data-copy') || '';

      try {
        await navigator.clipboard.writeText(text);
        button.textContent = '✓ Copied!';

        setTimeout(() => {
          button.textContent = 'Copy';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });
  });
}
```

### 2. Import in main.ts

```typescript
// assets/ts/main.ts

import { initializeCopyToClipboard } from './features/copy-to-clipboard';

// ...existing code...

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeCopyToClipboard();
    // ...
  });
} else {
  initializeCopyToClipboard();
  // ...
}
```

### 3. Use in Hugo templates

```html
<!-- In your content or layout -->
<button data-copy="https://example.com">Copy</button>

<!-- Make it pretty with Tailwind CSS -->
<button 
  data-copy="https://example.com"
  class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
>
  Copy
</button>
```

### 4. Build and test

```bash
bun run build:ts
bun run server
```

Visit your site and click the button!

## 🐛 Debugging

### Source Maps
Source maps are enabled. In Chrome DevTools:
1. Open **Sources** tab
2. Find your `.ts` files under `webpack://`
3. Set breakpoints and debug as TypeScript

### Console Logs
```typescript
// Works just like JavaScript
console.log('Debugging message');
console.error('Error message');
console.table({ key: 'value' });
```

## 📦 Installing Packages

```bash
# Add a package
bun add fuse.js                    # Runtime dependency
bun add -d tailwindcss             # Dev dependency

# Use in TypeScript
import Fuse from 'fuse.js';

const fuse = new Fuse(items, options);
const results = fuse.search(query);
```

## ⚠️ Troubleshooting

### "bun: command not found"
Install Bun: `curl -fsSL https://bun.sh/install | bash`

### "Module not found"
Make sure you're:
1. Using correct file paths
2. Exporting from the source file
3. Running `bun install` for external packages

### "Changes not reflected in browser"
1. Hard refresh: `Cmd+Shift+R` (or `Ctrl+Shift+R`)
2. Clear browser cache
3. Make sure you ran `bun run build:ts`

### "assets/js/ directory doesn't exist"
Run: `mkdir -p assets/js`

## 📚 Learn More

- **Bun Docs**: https://bun.sh/docs
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Bun Build API**: https://bun.sh/docs/bundler
- **Hugo Asset Pipeline**: https://gohugo.io/hugo-pipes/introduction/

## 💡 Tips & Best Practices

1. **One Entry Point**: Keep `main.ts` clean, delegate to feature modules
2. **Type Safety**: Use TypeScript interfaces for data structures
3. **Error Handling**: Wrap async operations in try/catch
4. **Browser Support**: Check `.target` in `tsconfig.json` (currently ES2020)
5. **Performance**: Bun's minification is enabled by default
6. **Organization**: Group related code in `src/ts/features/`

---

**Questions?** Check `TYPESCRIPT_BUN_SETUP.md` for detailed documentation.

