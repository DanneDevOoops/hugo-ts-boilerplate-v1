---
title: "Using @11ty/is-land for Progressive Hydration"
date: "2026-03-25T09:20:00+01:00"
draft: false
description: "Guide to progressive hydration with @11ty/is-land for improved performance in interactive Hugo pages."
tags: ["setup", "performance", "islands-architecture", "web-components", "hugo"]
categories: ["Setup"]
showDate: true
showAuthor: false
showReadingTime: true
showTableOfContents: true
---

## Overview
`@11ty/is-land` enables "islands architecture" - loading JavaScript components only when they're needed. This significantly improves initial page load performance.

## Installation
Already installed! ✅
```bash
bun add @11ty/is-land
```

## Setup in TypeScript

Add to your `main.ts`:

```typescript
import 'htmx.org';
import '@11ty/is-land/is-land.js'; // Add this line
import './components/hello-card';
import './components/interactive-card';
```

## Usage in Hugo Templates

### Basic Example: Load on Visible
```html
<!-- Before: Component loads immediately -->
<interactive-card title="Heavy Component">
  <p>Content here</p>
</interactive-card>

<!-- After: Component loads only when scrolled into view -->
<is-land on:visible>
  <interactive-card title="Heavy Component">
    <p>Content here</p>
  </interactive-card>
</is-land>
```

### Load on User Interaction
```html
<!-- Load when user clicks/touches the area -->
<is-land on:interaction>
  <interactive-card title="Click to Load">
    <p>This loads when you interact with it</p>
  </interactive-card>
</is-land>
```

### Load on Idle
```html
<!-- Load when browser is idle (after page load) -->
<is-land on:idle>
  <interactive-card title="Low Priority">
    <p>Loads after critical content</p>
  </interactive-card>
</is-land>
```

### Conditional Loading
```html
<!-- Only load on desktop (save mobile bandwidth) -->
<is-land on:visible on:media="(min-width: 768px)">
  <interactive-card title="Desktop Only">
    <p>Only loads on larger screens</p>
  </interactive-card>
</is-land>
```

### Multiple Conditions
```html
<!-- Load when visible AND user prefers reduced motion -->
<is-land on:visible on:media="(prefers-reduced-motion: reduce)">
  <interactive-card title="Accessible Component">
    <p>Respects user preferences</p>
  </interactive-card>
</is-land>
```

## Best Practices

### ✅ DO Use is-land for:
- Components below the fold (not visible on initial load)
- Heavy interactive components (charts, maps, video players)
- Components with large dependencies
- Components in carousels/tabs (not immediately visible)
- Mobile-only or desktop-only components

### ❌ DON'T Use is-land for:
- Critical above-the-fold content
- Simple, lightweight components
- Components needed for initial interactivity (e.g., main navigation)

## Example: Blog Post with Comments

```html
<!-- layouts/posts/single.html -->
<article>
  <h1>{{ .Title }}</h1>
  <div class="content">
    {{ .Content }}
  </div>
  
  <!-- Comments section: load when user scrolls to it -->
  <is-land on:visible>
    <interactive-card title="Comments" expanded>
      <div id="comments">
        <!-- HTMX loads comments -->
        <div hx-get="/api/comments/{{ .Params.id }}" 
             hx-trigger="load">
          Loading comments...
        </div>
      </div>
    </interactive-card>
  </is-land>
</article>
```

## Example: Search Component

```html
<!-- Load search when user clicks the search icon -->
<is-land on:interaction>
  <search-component>
    <input type="search" placeholder="Search..." />
    <div id="search-results"></div>
  </search-component>
</is-land>
```

## Measuring Impact

### Before is-land:
```
First Contentful Paint: 1.2s
Time to Interactive: 2.5s
JavaScript Bundle: 45KB
```

### After is-land (typical improvements):
```
First Contentful Paint: 0.8s (-33%)
Time to Interactive: 1.5s (-40%)
JavaScript Bundle: 12KB initial, 33KB lazy-loaded
```

## Combining with HTMX

`is-land` works perfectly with HTMX! The component hydrates when the conditions are met, then HTMX handles the dynamic content swapping.

```html
<is-land on:visible>
  <div hx-get="/api/posts" 
       hx-trigger="revealed"
       hx-swap="innerHTML">
    <!-- HTMX loads content when visible -->
    <interactive-card title="Latest Posts">
      Loading...
    </interactive-card>
  </div>
</is-land>
```

## Debugging

Add `debug` attribute to see when components load:

```html
<is-land on:visible debug>
  <interactive-card>Content</interactive-card>
</is-land>
```

This will log to the console when the component is hydrated.

## Resources
- Official Docs: https://www.11ty.dev/docs/plugins/is-land/
- GitHub: https://github.com/11ty/is-land

