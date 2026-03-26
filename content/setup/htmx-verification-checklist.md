---
title: 'HTMX Bundled Setup Verification Checklist'
date: '2026-03-25T09:10:00+01:00'
draft: false
description: 'Checklist to verify HTMX is installed, bundled, and working correctly in the Hugo project.'
tags: ['setup', 'htmx', 'checklist', 'verification', 'bun']
categories: ['Setup']
showDate: true
showAuthor: false
showReadingTime: true
showTableOfContents: true
---

## ✅ HTMX Bundled Setup Complete

Use this checklist to verify your setup:

### 1. Package Dependency

```bash
grep "htmx.org" package.json
```

**Expected:** `"htmx.org": "^2.0.8"`

### 2. TypeScript Import

```bash
head -3 assets/ts/main.ts
```

**Expected:** First line is `import 'htmx.org';`

### 3. Bundle Built

```bash
bun run build:ts
```

**Expected:**

```
Bundled 11 modules
main.js  96.29 KB  (entry point)
```

### 4. No CDN Script

```bash
grep -i "unpkg\|cdn" layouts/partials/extend-head.html
```

**Expected:** No results (or only in comments)

### 5. Runtime Test

```bash
bun run server
```

Open browser console at `http://localhost:1313`:

```javascript
typeof htmx; // "object" ✅
htmx.version; // "2.0.8" ✅
htmx.config; // Object with config ✅
```

## Development Commands

```bash
# Install dependencies
bun install

# Build TypeScript (includes HTMX)
bun run build:ts

# Development server
bun run server

# Full production build
bun run build:all
```

## File Locations

- 📦 Dependency: `node_modules/htmx.org/`
- 📝 Import: `assets/ts/main.ts` (line 1)
- 🔨 Output: `assets/js/main.js` (96.29 KB)
- 📄 Loaded: `layouts/partials/extend-head.html`
- 📚 Docs: `docs/setup/HTMX-BUNDLED-COMPLETE.md`

## Bundle Contents

```
main.js (96.29 KB minified)
├─ htmx.org          ~40 KB
├─ lit               ~20 KB
└─ your components   ~36 KB
```

Gzipped: ~30-35 KB total

## Common Issues

### "htmx is not defined"

✅ Run `bun run build:ts`  
✅ Check browser console for errors  
✅ Verify `import 'htmx.org'` is in `main.ts`

### Bundle not updating

✅ Run `bun run build:ts` manually  
✅ Clear browser cache (Cmd+Shift+R)  
✅ Check Hugo isn't caching: `--noHTTPCache`

### Types not working

✅ Add types: `bun add -d @types/htmx.org` (if available)  
✅ Or use: `declare const htmx: any;` in a `.d.ts` file

## Success Indicators

✅ Bundle size increased from ~35KB to ~96KB  
✅ `import 'htmx.org'` in `main.ts`  
✅ No CDN script in HTML  
✅ `htmx` object available in browser  
✅ HTMX attributes work (hx-get, hx-post, etc.)  
✅ HTMX bridge initializes components on swap

---

**All checks passed?** You're ready to build! 🚀

See `docs/setup/HTMX-WEB-COMPONENTS-SETUP.md` for usage examples.
