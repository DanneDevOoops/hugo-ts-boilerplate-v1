# HTMX + Web Components Hybrid Architecture

This document outlines the hybrid architecture implementation combining HTMX for server-rendered interactions and Web Components for reusable interactive widgets.

## Architecture Overview

The hybrid approach provides SPA-like user experience without the complexity of a full SPA framework:

- **HTMX** handles server-rendered interactions (fetch/swap HTML fragments)
- **Web Components** handle reusable interactive widgets (encapsulated behavior/styling)
- **Together** they provide progressive enhancement and optimal UX

## Responsibility Split

### HTMX Owns (Server-Driven)
- Navigation-ish partial updates
- Form submits and validation
- Table/list refreshes
- Pagination and filtering
- Search results
- Server state management

### Web Components Own (Client-Driven)
- Date pickers and rich inputs
- Toggles and switches
- Media widgets
- Interactive cards/accordions
- Client-only micro-interactions
- Ephemeral UI state

### Hybrid Pattern (Both)
HTMX swaps in HTML containing `<my-component>` tags, and components hydrate automatically.

**Example:**
```html
<!-- HTMX fetches this fragment -->
<div id="article-preview">
  <interactive-card title="Article Title" like-count="42">
    <p>Article content...</p>
  </interactive-card>
</div>
```

The component hydrates when HTMX loads the content, thanks to the HTMX bridge.

## Implementation Details

### 1. HTMX Integration

HTMX is installed as a project dependency and bundled with your TypeScript:

```bash
# Install HTMX
bun add htmx.org
```

```typescript
// assets/ts/main.ts
import 'htmx.org';  // Bundled into main.js
```

The bundled `main.js` is loaded in `layouts/partials/extend-head.html`.

### 2. HTMX Bridge

The bridge (`assets/ts/htmx-bridge.ts`) manages Web Component lifecycle across HTMX swaps:

- Listens to `htmx:load` events
- Re-initializes components in swapped content
- Handles cleanup before swaps
- Provides extension points for custom logic

### 3. Component Registration

Components are registered in `assets/ts/main.ts`:

```typescript
import './components/hello-card';
import './components/interactive-card';
import { setupHTMXBridge, initializeComponents } from './htmx-bridge';

// Initialize on page load
setupHTMXBridge();
initializeComponents();
```

### 4. Fragment Partials

Server-rendered fragments live in `layouts/partials/fragments/`:

- `post-list.html` - Paginated post listings
- `search-results.html` - Search results panel

Fragments should:
- Have stable container IDs for HTMX targeting
- Include HTMX attributes for progressive interactions
- Be self-contained (can work as initial render or swap)

### 5. Shortcodes

Shortcodes expose components to content authors:

- `{{</* interactive-card title="My Card" */>}}...{{</* /interactive-card */>}}`
- `{{</* hello-card name="World" */>}}`
- `{{</* htmx-search */>}}`

## Best Practices

### State Management

**Server as Source of Truth:**
- Business logic and data state live on the server
- HTMX requests refresh server state
- Components emit events for server sync when needed

**Component State is Ephemeral:**
- UI state (expanded/collapsed, local selections) lives in components
- Don't duplicate server state in components
- Use attributes for initial state from server

### Lifecycle Management

**HTMX Swaps:**
```typescript
// Components automatically re-hydrate on htmx:load
document.body.addEventListener('htmx:load', (event) => {
  const target = (event as CustomEvent).detail.elt;
  initializeComponents(target);
});
```

**Component Cleanup:**
```typescript
// Optional cleanup before swap
document.body.addEventListener('htmx:beforeSwap', (event) => {
  const target = (event as CustomEvent).detail.target;
  target.dispatchEvent(new CustomEvent('components:beforeCleanup'));
});
```

### Event Communication

**Component → Page:**
```typescript
this.dispatchEvent(new CustomEvent('card-liked', {
  detail: { id: this.id, liked: true },
  bubbles: true,
  composed: true,
}));
```

**Page → Component:**
```typescript
// Use attributes or properties
document.querySelector('interactive-card').setAttribute('expanded', 'true');
```

**HTMX → Component:**
```typescript
// Listen to HTMX events in components if needed
this.addEventListener('htmx:afterSwap', (e) => {
  // React to swap
});
```

## Anti-Patterns to Avoid

❌ **Don't** have both HTMX and a component trying to "own" the same DOM/state
❌ **Don't** replace component root elements with HTMX swaps (swap children instead)
❌ **Don't** duplicate server state in component properties
❌ **Don't** make components depend on specific HTMX behavior
❌ **Don't** forget to handle cleanup in long-lived components

✅ **Do** use stable IDs for HTMX targets
✅ **Do** keep component state local and ephemeral
✅ **Do** emit events for cross-boundary communication
✅ **Do** test components with and without HTMX
✅ **Do** use Shadow DOM for style encapsulation

## Example Patterns

### Pattern 1: HTMX-Only (Pagination)

```html
<div id="post-list">
  <!-- Server renders posts -->
  <button hx-get="/posts?page=2" 
          hx-target="#post-list" 
          hx-swap="outerHTML">
    Load More
  </button>
</div>
```

### Pattern 2: Component-Only (Rich Input)

```html
<!-- Static HTML, component adds interactivity -->
<date-picker value="2026-03-10"></date-picker>
```

### Pattern 3: Hybrid (Interactive List)

```html
<!-- HTMX fetches list items -->
<div id="article-list" 
     hx-get="/articles?tag=tech"
     hx-trigger="load">
  
  <!-- Each item is a component -->
  <interactive-card title="Article 1" like-count="10">
    <p>Content...</p>
  </interactive-card>
  
  <interactive-card title="Article 2" like-count="5">
    <p>More content...</p>
  </interactive-card>
</div>
```

### Pattern 4: Form with Component Enhancement

```html
<form hx-post="/api/submit" 
      hx-target="#form-result"
      hx-swap="innerHTML">
  
  <!-- Regular inputs -->
  <input type="text" name="title" />
  
  <!-- Component-enhanced input -->
  <rich-editor name="content"></rich-editor>
  
  <button type="submit">Submit</button>
</form>

<div id="form-result"></div>
```

## Debugging

### HTMX Debugging

```javascript
// Enable HTMX logging
htmx.logAll();

// Listen to all HTMX events
document.body.addEventListener('htmx:*', (e) => {
  console.log(e.type, e.detail);
});
```

### Component Debugging

```javascript
// Check if component is defined
console.log(customElements.get('interactive-card'));

// Monitor component lifecycle
document.addEventListener('components:initialized', (e) => {
  console.log('Components initialized in', e.detail.container);
});
```

## Backend Requirements

For HTMX fragments, you need endpoints that return HTML:

### Option A: In-Repo Go Service
```go
// Serve HTML fragments
http.HandleFunc("/fragments/posts", func(w http.ResponseWriter, r *http.Request) {
    // Render partial HTML
    w.Header().Set("Content-Type", "text/html")
    fmt.Fprint(w, "<div>...</div>")
})
```

### Option B: Hugo Server + Serverless
- Hugo serves static content
- Serverless functions serve dynamic fragments
- CORS configured appropriately

### Option C: Separate API Service
- Dedicated service for HTML fragments
- Shared templates between Hugo and service
- Caching at CDN layer

## Performance Considerations

- **Initial Load:** Full HTML + Bundled JS (~96KB minified: HTMX + Lit + Components)
- **Subsequent Interactions:** Only HTML fragments (no JS re-execution)
- **Component Bundle:** Lazy-load less common components if needed
- **Caching:** Cache fragments aggressively, bust on content change
- **Bundle Size:** HTMX adds ~14KB gzipped when bundled

## Migration Path

1. **Phase 1:** Add HTMX, keep existing JS intact (✅ You are here)
2. **Phase 2:** Convert one feature to HTMX-only (e.g., pagination)
3. **Phase 3:** Add one Hybrid feature (e.g., interactive cards)
4. **Phase 4:** Expand to high-value interactions
5. **Phase 5:** Optimize and add caching

## Resources

- [HTMX Documentation](https://htmx.org/docs/)
- [Web Components Guide](https://web.dev/custom-elements-v1/)
- [Lit Documentation](https://lit.dev/)
- [Hugo Partials](https://gohugo.io/templates/partials/)

## Support

For questions or issues:
1. Check this documentation
2. Review example components in `assets/ts/components/`
3. Check fragment examples in `layouts/partials/fragments/`
4. Review shortcode usage in `layouts/shortcodes/`

