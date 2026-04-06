---
title: 'HTMX + Web Components Demo'
date: '2026-03-10T10:00:00+01:00'
draft: false
description: 'Interactive demonstration of HTMX and Web Components working together.'
tags: ['demo', 'htmx', 'web-components', 'hugo']
categories: ['Development']
showDate: true
showAuthor: true
showReadingTime: true
showTableOfContents: true
---

# HTMX + Web Components Hybrid Demo

This page demonstrates the hybrid architecture combining HTMX for server-rendered interactions and Web Components for interactive widgets.

## Example 1: Web Component Only

This is a pure Web Component with local state (no HTMX involved):

{{< hello-card name="Developer" >}}

## Example 2: Interactive Cards (Hybrid Pattern)

These cards use Web Components for local UI state (expanded/collapsed, likes) while their content could be swapped by HTMX:

{{< interactive-card title="Getting Started with HTMX" expanded="true" like-count="15" >}}
HTMX gives you access to AJAX, CSS Transitions, WebSockets and Server Sent Events directly in HTML, using attributes, so you can build modern user interfaces with the simplicity and power of hypertext.

**Key Features:**

- Minimal JavaScript required
- Progressive enhancement
- Works with any backend
- Small file size (~14KB gzipped)
  {{< /interactive-card >}}

{{< interactive-card title="Web Components Overview" like-count="8" >}}
Web Components are a suite of different technologies allowing you to create reusable custom elements with their functionality encapsulated away from the rest of your code.

**Benefits:**

- Framework-agnostic
- Shadow DOM isolation
- Native browser support
- Composable and reusable
  {{< /interactive-card >}}

{{< interactive-card title="Why Combine Both?" like-count="23" >}}
HTMX is excellent for **server-rendered interactions** (fetch/swap fragments). Web Components are excellent for **reusable interactive widgets** (encapsulated behavior/styling).

Together, you get **SPA-like UX** without committing to a full SPA framework!

**Use this split:**

- **HTMX owns:** navigation, forms, lists, pagination, server truth
- **Web Components own:** date pickers, toggles, media widgets, micro-interactions
- **Hybrid pattern:** HTMX swaps HTML containing components that hydrate automatically
  {{< /interactive-card >}}

## Example 3: HTMX Search (Coming Soon)

This will demonstrate HTMX-powered search with debouncing:

{{< htmx-search >}}

## Try It Yourself

1. **Expand/Collapse Cards** - Click the ▼ button to see local component state
2. **Like Cards** - Click the 🤍 button to increment likes (ephemeral state)
3. **Open DevTools** - See console logs from component lifecycle events

### What's Happening Behind the Scenes?

```javascript
// When HTMX swaps content:
document.body.addEventListener('htmx:load', (event) => {
  // Components in the swapped content automatically hydrate
  initializeComponents(event.detail.elt);
});

// When you interact with a card:
card.dispatchEvent(
  new CustomEvent('card-liked', {
    detail: { liked: true, likeCount: 42 },
    bubbles: true,
    composed: true,
  }),
);
```

## Architecture Benefits

✅ **Progressive Enhancement** - Works without JavaScript, enhanced with it  
✅ **Minimal Bundle Size** - Only load what you need  
✅ **Server Truth** - Data lives on the server, not duplicated client-side  
✅ **Component Reusability** - Use components anywhere, with or without HTMX  
✅ **Simple Mental Model** - Clear separation of concerns

## Next Steps

- Read the [Architecture Guide](/docs/guidelines/htmx-web-components-architecture.md)
- Check component source in `assets/ts/components/`
- Review fragment partials in `layouts/partials/fragments/`
- Create your own hybrid features!

---

**Note:** For HTMX features to work with dynamic server data, you'll need backend endpoints that return HTML fragments. See the architecture guide for implementation options.
