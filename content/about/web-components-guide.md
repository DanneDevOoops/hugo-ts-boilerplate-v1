---
title: 'Using Web Components in Hugo Markdown'
date: '2026-03-25T00:00:00+01:00'
lastmod: '2026-03-25T00:00:00+01:00'
draft: false

description: 'Guide to integrating and using Lit-based Web Components inside Hugo markdown content and templates.'
slug: 'web-components-guide'

tags:
  - 'project'
  - 'web-components'
  - 'lit'
  - 'hugo'
  - 'frontend'
  - 'components'

categories:
  - 'Guidelines'
  - 'Frontend'

showDate: true
showAuthor: true
showReadingTime: true
showTableOfContents: true
---

This guide explains how to use the `hello-card` web component (and other Lit-based components) in your Hugo markdown files.

## Setup Complete ✅

Your site is now configured to use web components in markdown files!

## How It Works

1. **TypeScript Component** (`assets/ts/components/hello-card.ts`)
   - Built with Lit Element
   - Compiled to JavaScript via Bun
   - Automatically imported in `main.ts`

2. **Hugo Shortcode** (`layouts/shortcodes/hello-card.html`)
   - Provides a Hugo-friendly way to use the component
   - Supports parameters like `name`

3. **Markup Config** (`config/_default/markup.toml`)
   - `unsafe = true` allows raw HTML in markdown
   - Enables both shortcode and direct HTML usage

## Usage Methods

### Method 1: Hugo Shortcode (Recommended)

Use Hugo's shortcode syntax for clean, Hugo-native integration:

```markdown
{{< hello-card name="Hugo Developer" >}}
```

**Advantages:**

- Hugo-native syntax
- Better error handling
- Easy to extend with more parameters
- Works with Hugo's content processing

### Method 2: Direct HTML

Use raw HTML tags directly in markdown:

```markdown
<hello-card name="World"></hello-card>
```

**Advantages:**

- Simpler syntax
- Works anywhere HTML is allowed
- More familiar for web developers

## Customizing the Shortcode

The shortcode at `layouts/shortcodes/hello-card.html` can be extended to support more parameters:

```html
{{- $name := .Get "name" | default "friend" -}} {{- $theme := .Get "theme" | default "default" -}}
<hello-card name="{{ $name }}" theme="{{ $theme }}"></hello-card>
```

Then use it like:

```markdown
{{< hello-card name="Developer" theme="dark" >}}
```

## Adding More Web Components

To add new web components:

1. **Create the component** in `assets/ts/components/`:

   ```typescript
   // assets/ts/components/my-component.ts
   import { LitElement, html, css } from 'lit';

   export class MyComponent extends LitElement {
     // Your component code
   }

   customElements.define('my-component', MyComponent);
   ```

2. **Import in main.ts**:

   ```typescript
   import './components/my-component';
   ```

3. **Create a shortcode** (optional) in `layouts/shortcodes/my-component.html`:

   ```html
   <my-component></my-component>
   ```

4. **Use in markdown**:
   ```markdown
   {{</* my-component */>}}
   ```

## Testing

Build the site to verify everything works:

```bash
hugo server -D
```

Then visit your post at `http://localhost:1313/posts/welcome/`

You should see:

- The interactive hello-card component rendered
- Click functionality working
- Custom event dispatching

## Current Implementation

Your `welcome.md` now includes:

```markdown
### Interactive Web Components

This site uses TypeScript and Lit to create interactive web components! Here's a live example:

{{< hello-card name="Hugo Developer" >}}

You can also use raw HTML since `unsafe = true` is enabled in markup config:

<hello-card name="World"></hello-card>
```

Both methods work and will render the component correctly!

## Benefits of This Approach

✅ **Type-safe**: Written in TypeScript
✅ **Modern**: Uses Lit Element for efficient web components
✅ **Fast**: Compiled with Bun for optimal performance
✅ **Flexible**: Use shortcodes or direct HTML
✅ **Reusable**: Define once, use anywhere
✅ **Interactive**: Full JavaScript functionality in static pages
✅ **SEO-friendly**: Renders on client-side but works with Hugo's static generation

## Next Steps

- Add more interactive components
- Extend shortcodes with more parameters
- Create component documentation
- Add component tests

Happy coding! 🚀

O
