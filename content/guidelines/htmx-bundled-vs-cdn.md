---
title: 'HTMX: Bundled vs CDN'
date: '2026-03-25T00:00:00+01:00'
lastmod: '2026-03-25T00:00:00+01:00'
draft: false

description: 'Comparison guide for using HTMX as a bundled dependency versus loading it from a CDN, including tradeoffs in performance, caching, security, and developer workflow.'
slug: 'htmx-bundled-vs-cdn'

tags:
  - 'guidelines'
  - 'htmx'
  - 'bundling'
  - 'cdn'
  - 'performance'
  - 'caching'
  - 'security'
  - 'hugo'
  - 'bun'

categories:
  - 'Guidelines'
  - 'Tooling'

showDate: true
showAuthor: true
showReadingTime: true
showTableOfContents: true
---

## Current Setup: Bundled via Bun ✅

HTMX is installed as a dependency and bundled into your main JavaScript file.

```bash
bun add htmx.org
```

```typescript
// assets/ts/main.ts
import 'htmx.org';
```

## Benefits of Bundled Approach

### ✅ Version Control

- Exact version locked in `package.json`
- No risk of CDN serving wrong version
- Consistent across all environments

### ✅ Offline Development

- Works without internet connection
- No external dependencies during build
- Faster local development

### ✅ Build Optimization

- Bun can optimize the bundle
- Tree-shaking removes unused code
- Source maps for better debugging

### ✅ Single Request

- One JS file instead of multiple requests
- Better HTTP/2 multiplexing
- Reduced connection overhead

### ✅ Corporate/Security Policies

- No external CDN dependencies
- Content Security Policy friendly
- No third-party tracking

### ✅ Custom Configuration

- Can configure HTMX via `htmx.config` in your code
- Easier to extend or patch if needed

## Tradeoffs

### Bundle Size

- **Bundled:** ~96KB minified (includes HTMX + Lit + components)
- **CDN:** Separate ~14KB for HTMX
- HTMX portion: ~14KB gzipped when bundled

### Caching

- **Bundled:** Changes to any code invalidates entire bundle
- **CDN:** HTMX cached separately, very long TTL

### Browser Caching

- **Bundled:** Fingerprinted filename for cache busting
- **CDN:** Shared across sites (if user visited another HTMX site)

## Alternative: CDN Approach

If you prefer CDN, you can switch back:

1. **Remove from package.json:**

   ```bash
   bun remove htmx.org
   ```

2. **Remove from main.ts:**

   ```typescript
   // Remove: import 'htmx.org';
   ```

3. **Add CDN script in `layouts/partials/extend-head.html`:**
   ```html
   <script
     src="https://unpkg.com/htmx.org@2.0.8"
     integrity="sha384-..."
     crossorigin="anonymous"
   ></script>
   ```

## Recommendation

**Use Bundled** (current setup) when:

- You have a build pipeline (✅ You do: Bun)
- You want full control and version locking
- You're building a production app
- You have strict security policies

**Use CDN** when:

- You're prototyping quickly
- Bundle size is critical concern
- You want maximum browser caching across sites
- You're building simple static sites

## Current Bundle Analysis

```
main.js  96.29 KB  (entry point)
├─ htmx.org      ~40 KB (minified)
├─ lit           ~20 KB (minified)
└─ components    ~36 KB (minified)
```

After gzip compression (what users download):

- Total: ~30-35 KB gzipped
- HTMX portion: ~14 KB gzipped
- Very reasonable for modern web apps

## Performance Impact

- **First Load:** One request, ~30-35KB gzipped
- **Cached:** 0 bytes (304 Not Modified)
- **Updated:** Full bundle re-download (but fingerprinted/cached)

The bundled approach is **recommended** for your setup because:

1. You already have Bun build pipeline
2. You're building a production site
3. Version control is important
4. The bundle size is reasonable

## Future Optimization

If bundle size becomes a concern:

1. **Code Splitting:**

   ```typescript
   // Lazy load less common components
   const InteractiveCard = () => import('./components/interactive-card');
   ```

2. **Separate Vendor Bundle:**

   ```bash
   # Split HTMX/Lit from your code
   bun build --splitting
   ```

3. **Dynamic Imports:**
   ```typescript
   // Load HTMX only when needed
   if (needsHTMX) {
     await import('htmx.org');
   }
   ```

For most use cases, the current bundled approach with ~96KB minified (~30-35KB gzipped) is perfectly fine and provides the best developer experience.
