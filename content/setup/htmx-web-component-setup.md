---
title: "HTMX + Web Components Hybrid Setup"
date: "2026-03-25T09:15:00+01:00"
draft: false
description: "Guide for combining HTMX and Web Components in a Hugo site using a hybrid architecture."
tags: ["setup", "htmx", "web-components", "lit", "hugo"]
categories: ["Setup"]
showDate: true
showAuthor: false
showReadingTime: true
showTableOfContents: true
---

Your Hugo project is now configured with a hybrid architecture combining HTMX and Web Components!

## What's Been Configured

### 1. **HTMX Integration** ✅
- HTMX 2.0.8 installed via Bun (`bun add htmx.org`)
- Bundled in `assets/js/main.js` via `import 'htmx.org'` in `main.ts`
- Ready for server-rendered interactions

### 2. **HTMX Bridge** ✅
- Component lifecycle manager in `assets/ts/htmx-bridge.ts`
- Automatically hydrates Web Components after HTMX swaps
- Event listeners for `htmx:load`, `htmx:beforeSwap`, `htmx:responseError`

### 3. **Components** ✅
- **HelloCard**: Simple example component (`assets/ts/components/hello-card.ts`)
- **InteractiveCard**: Hybrid component with expand/collapse and likes (`assets/ts/components/interactive-card.ts`)

### 4. **Shortcodes** ✅
- `{{</* hello-card name="World" */>}}`
- `{{</* interactive-card title="Title" expanded="true" like-count="5" */>}}...{{</* /interactive-card */>}}`
- `{{</* htmx-search */>}}` (requires backend)

### 5. **HTMX Fragment Partials** ✅
- `layouts/partials/fragments/post-list.html` - Paginated posts
- `layouts/partials/fragments/search-results.html` - Search results

### 6. **Documentation** ✅
- `docs/guidelines/htmx-web-components-architecture.md` - Full architecture guide
- `docs/guidelines/htmx-quick-reference.md` - Quick reference
- `content/posts/htmx-demo.md` - Live demo page

## Quick Start

### View the Demo

1. Start the development server:
   ```bash
   bun run server
   ```

2. Visit the demo page:
   ```
   http://localhost:1313/posts/htmx-demo/
   ```

3. Interact with the components:
   - Click ▼ to expand/collapse cards
   - Click 🤍 to like cards
   - Open DevTools console to see lifecycle events

### Create Your First Hybrid Feature

#### Option A: HTMX-Only (Server Pagination)

```html
<!-- In a layout file -->
<div id="posts" hx-get="/posts?page=2" hx-trigger="click">
  {{ partial "fragments/post-list.html" . }}
</div>
```

#### Option B: Component-Only (Interactive Widget)

```typescript
// assets/ts/components/my-widget.ts
import { LitElement, html, css } from 'lit';

export class MyWidget extends LitElement {
  static properties = {
    value: { type: String }
  };

  static styles = css`
    :host { display: block; }
  `;

  render() {
    return html`<div>${this.value}</div>`;
  }
}

customElements.define('my-widget', MyWidget);
```

```typescript
// Add to assets/ts/main.ts
import './components/my-widget';
```

```html
<!-- layouts/shortcodes/my-widget.html -->
<my-widget value="{{ .Get "value" }}"></my-widget>
```

#### Option C: Hybrid (HTMX + Component)

```html
<!-- Server endpoint returns this HTML -->
<div id="article-preview">
  <interactive-card title="Dynamic Content" like-count="0">
    <p>Server-rendered content...</p>
  </interactive-card>
</div>
```

```html
<!-- Trigger from page -->
<button hx-get="/api/article/123" 
        hx-target="#article-preview"
        hx-swap="innerHTML">
  Load Article
</button>
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐         ┌──────────────────────────┐    │
│  │   HTMX       │────────▶│  Web Components          │    │
│  │              │         │  (Lit Elements)          │    │
│  │ - Fetch HTML │         │  - Local UI State        │    │
│  │ - Swap DOM   │         │  - Encapsulated Styles   │    │
│  │ - Triggers   │         │  - Custom Events         │    │
│  └──────┬───────┘         └────────▲─────────────────┘    │
│         │                          │                       │
│         │      ┌──────────────────┴──────────────┐        │
│         └─────▶│     HTMX Bridge                 │        │
│                │  - Component Hydration          │        │
│                │  - Lifecycle Management         │        │
│                └─────────────────────────────────┘        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                       Network                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              Server (Hugo + Backend)                 │  │
│  │                                                       │  │
│  │  ┌──────────────┐         ┌─────────────────────┐  │  │
│  │  │ Hugo Static  │         │  Fragment Endpoints │  │  │
│  │  │ - Full Pages │         │  - HTML Partials    │  │  │
│  │  │ - Templates  │         │  - Dynamic Data     │  │  │
│  │  └──────────────┘         └─────────────────────┘  │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Responsibility Matrix

| Feature Type | HTMX | Web Component | Example |
|-------------|------|---------------|---------|
| Pagination | ✅ | ❌ | Post list navigation |
| Form Submit | ✅ | ❌ | Contact form |
| Search Results | ✅ | ❌ | Dynamic search panel |
| Date Picker | ❌ | ✅ | Calendar widget |
| Toggle/Accordion | ❌ | ✅ | Expandable card |
| Rich Text Editor | ❌ | ✅ | WYSIWYG input |
| Interactive Cards | ✅ | ✅ | Swapped + local state |
| Dynamic Forms | ✅ | ✅ | Server validation + UX |
| Live Updates | ✅ | ✅ | Polling + animations |

## File Structure

```
hugo-ts-boilerplate-v1/
├── assets/
│   ├── ts/
│   │   ├── main.ts                    # Entry point (imports bridge)
│   │   ├── htmx-bridge.ts            # HTMX ↔ Component lifecycle
│   │   └── components/
│   │       ├── hello-card.ts         # Example component
│   │       └── interactive-card.ts   # Hybrid component
│   └── js/
│       └── main.js                    # Built output
├── layouts/
│   ├── partials/
│   │   ├── extend-head.html          # HTMX + scripts
│   │   └── fragments/
│   │       ├── post-list.html        # HTMX fragment
│   │       └── search-results.html   # HTMX fragment
│   └── shortcodes/
│       ├── hello-card.html           # Component shortcode
│       ├── interactive-card.html     # Component shortcode
│       └── htmx-search.html          # HTMX + fragment
├── content/
│   └── posts/
│       └── htmx-demo.md              # Live demo page
└── docs/
    └── guidelines/
        ├── htmx-web-components-architecture.md
        └── htmx-quick-reference.md
```

## Next Steps

### 1. Backend for HTMX Fragments

Choose one approach:

**Option A: Go Service (in-repo)**
```go
// main.go
package main

import (
    "html/template"
    "net/http"
)

func fragmentHandler(w http.ResponseWriter, r *http.Request) {
    tmpl := template.Must(template.ParseFiles("layouts/partials/fragments/post-list.html"))
    tmpl.Execute(w, data)
}

func main() {
    http.HandleFunc("/fragments/posts", fragmentHandler)
    http.ListenAndServe(":8080", nil)
}
```

**Option B: Serverless Functions**
- Vercel: Create `api/fragments/[name].js`
- Netlify: Create `netlify/functions/fragments.js`
- AWS Lambda: Create handler returning HTML

**Option C: Separate Service**
- Dedicated microservice for HTML fragments
- Share Hugo templates with service
- Deploy alongside static site

### 2. Add More Components

```typescript
// assets/ts/components/my-component.ts
import { LitElement, html, css } from 'lit';

export class MyComponent extends LitElement {
  // Your component code
}

customElements.define('my-component', MyComponent);
```

```typescript
// assets/ts/main.ts
import './components/my-component';  // Add this line
```

### 3. Create Custom HTMX Patterns

See `docs/guidelines/htmx-quick-reference.md` for recipes:
- Infinite scroll
- Live search
- Inline editing
- Modal dialogs
- Form validation

### 4. Testing

```bash
# Test components in isolation
bun run test  # (Add test setup)

# Test HTMX interactions
# Use browser DevTools or Playwright/Cypress
```

### 5. Production Build

```bash
# Build everything
bun run build:all

# Or build separately
bun run build:ts    # TypeScript → JS
bun run build:css   # Tailwind CSS
hugo --minify        # Hugo site
```

## Common Tasks

### Add HTMX to existing page

```html
<!-- Add to any template -->
<div id="dynamic-content">
  {{ partial "fragments/my-fragment.html" . }}
</div>

<button hx-get="/fragments/more" 
        hx-target="#dynamic-content">
  Load More
</button>
```

### Make component HTMX-aware

```typescript
connectedCallback() {
  super.connectedCallback();
  
  // Listen for HTMX events
  this.addEventListener('htmx:afterSwap', (e) => {
    console.log('Content swapped', e);
  });
}
```

### Debug HTMX

```javascript
// In browser console
htmx.logAll();

// Or add to page
document.body.addEventListener('htmx:*', console.log);
```

## Troubleshooting

### Components not hydrating after HTMX swap

✅ Check that `setupHTMXBridge()` is called in `main.ts`  
✅ Verify component is imported in `main.ts`  
✅ Check browser console for errors

### HTMX requests not working

✅ Verify endpoint returns HTML (not JSON)  
✅ Check CORS if using separate service  
✅ Enable `htmx.logAll()` for debugging  
✅ Check network tab for request/response

### Component not rendering

✅ Verify `customElements.define()` is called  
✅ Check TypeScript build succeeded  
✅ Ensure script is loaded (`defer` or after DOM)  
✅ Check for Shadow DOM style isolation issues

## Resources

- 📖 [Full Architecture Guide](docs/guidelines/htmx-web-components-architecture.md)
- 📖 [Quick Reference](docs/guidelines/htmx-quick-reference.md)
- 🎯 [Demo Page](content/posts/htmx-demo.md)
- 🔗 [HTMX Documentation](https://htmx.org/docs/)
- 🔗 [Lit Documentation](https://lit.dev/)
- 🔗 [Web Components Guide](https://web.dev/custom-elements-v1/)

## Support

Questions? Check:
1. This README
2. Architecture documentation
3. Quick reference guide
4. Component source code examples

---

**You're all set!** Start by viewing the demo page, then build your first hybrid feature. 🚀

