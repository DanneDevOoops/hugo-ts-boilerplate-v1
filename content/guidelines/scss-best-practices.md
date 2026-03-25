---
title: 'SCSS Folder Structure and Best Practices Guide'
date: '2026-03-25T00:00:00+01:00'
lastmod: '2026-03-25T00:00:00+01:00'
draft: false

description: 'Guide to organizing SCSS files, naming conventions, and maintainable styling patterns for this project.'
slug: 'scss-best-practices'

tags:
  - 'guidelines'
  - 'scss'
  - 'css'
  - 'frontend'
  - 'styling'
  - 'architecture'

categories:
  - 'Guidelines'
  - 'Frontend'

showDate: true
showAuthor: true
showReadingTime: true
showTableOfContents: true
---

## 📁 Your Current Structure

```
assets/css/scss/
├── style.scss           # ✅ Main entrypoint (orchestrates all imports)
├── _variables.scss      # Colors, fonts, spacing, breakpoints
├── _mixins.scss         # Reusable SCSS logic
├── _base.scss           # Global styles and resets
├── _layout.scss         # Page structure (container, grid)
├── _components.scss     # UI components (buttons, cards, alerts, nav)
└── _utilities.scss      # Single-purpose utility classes (optional)
```

## 🎯 What Each File Does

### `style.scss` - Main Entrypoint ⭐

**Purpose:** Orchestrates all partials in correct import order
**What to do:** Only import other files here, never add direct styles!

```scss
@import 'variables'; // Must be first (no CSS output)
@import 'mixins'; // Second (no CSS output)
@import 'base'; // Third (global styles)
@import 'layout'; // Fourth (structure)
@import 'components'; // Fifth (UI elements)
@import 'utilities'; // Sixth (helpers - can override anything)
```

### `_variables.scss` - Design Tokens

**Purpose:** Store all reusable values (colors, sizes, fonts)
**Why:** Single source of truth for your design system

```scss
// Colors
$color-primary: #3b82f6;
$color-success: #10b981;
$color-danger: #ef4444;
// Typography
$font-size-base: 1rem;
$font-size-lg: 1.25rem;
$line-height-normal: 1.5;
// Spacing (use consistent units)
$spacing-xs: 0.25rem;
$spacing-sm: 0.5rem;
$spacing-md: 1rem;
$spacing-lg: 1.5rem;
$spacing-xl: 2rem;
// Breakpoints (mobile-first)
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
```

### `_mixins.scss` - Reusable Logic

**Purpose:** DRY principle - avoid repeating code
**Common uses:** media queries, flexbox, transitions

```scss
// Media queries
@mixin media-md {
  @media (min-width: $breakpoint-md) {
    @content;
  }
}
// Flexbox helpers
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
// Transitions
@mixin transition($prop: all) {
  transition: $prop 250ms ease-in-out;
}
// Usage:
.button {
  @include transition;
  @include media-md {
    font-size: $font-size-lg;
  }
}
```

### `_base.scss` - Global Foundation

**Purpose:** Resets, typography, form defaults
**What goes here:**

- CSS reset (`* { margin: 0; padding: 0; }`)
- Body styles
- Heading styles
- Link styles
- Form elements

```scss
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: $font-family-base;
  font-size: $font-size-base;
  line-height: $line-height-normal;
  color: $color-text;
  background-color: $color-bg;
}
h1,
h2,
h3 {
  font-weight: 600;
  line-height: 1.25;
}
a {
  color: $color-primary;
  text-decoration: none;
  transition: color 250ms;
  &:hover {
    color: darken($color-primary, 10%);
  }
}
```

### `_layout.scss` - Page Structure

**Purpose:** Containers, grids, flexbox layouts
**What goes here:**

- `.container` class
- `.grid` layouts
- `.flex` utilities
- Main layout structure

```scss
.container {
  width: 100%;
  max-width: $breakpoint-lg;
  margin: 0 auto;
  padding: 0 $spacing-md;
}
.grid {
  display: grid;
  gap: $spacing-md;
  @include media-md {
    grid-template-columns: repeat(2, 1fr);
  }
  @include media-lg {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### `_components.scss` - UI Elements

**Purpose:** Buttons, cards, alerts, navigation, etc.
**When to create separate file:** If it exceeds 500 lines, split into:

```
components/
├── _buttons.scss
├── _cards.scss
├── _alerts.scss
└── _navigation.scss
```

```scss
// Button component (BEM naming)
.btn {
  padding: $spacing-sm $spacing-md;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  @include transition;
  &--primary {
    background-color: $color-primary;
    color: white;
  }
  &--secondary {
    background-color: $color-gray-100;
    color: $color-text;
  }
  &:hover {
    opacity: 0.8;
  }
}
// Card component
.card {
  background: $color-bg;
  border: 1px solid $color-border;
  border-radius: 6px;
  padding: $spacing-lg;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  &__header {
    margin-bottom: $spacing-md;
    border-bottom: 1px solid $color-border;
  }
  &__body {
    margin-bottom: $spacing-md;
  }
  &__footer {
    padding-top: $spacing-md;
    border-top: 1px solid $color-border;
  }
}
```

### `_utilities.scss` - Helper Classes

**Purpose:** Single-purpose utility classes
**When to use:** Quick layout fixes, spacing, text alignment

```scss
.text-center {
  text-align: center;
}
.text-sm {
  font-size: $font-size-sm;
}
.font-bold {
  font-weight: 600;
}
.m-0 {
  margin: 0;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.w-full {
  width: 100%;
}
.hidden {
  display: none;
}
```

## 📐 SCSS Architecture: ITCSS

**ITCSS** = Inverted Triangle CSS (lowest to highest specificity)

```
           Settings ← Configuration
              ↓
           Tools ← Mixins/Functions
              ↓
          Generic ← Reset/Normalize
              ↓
          Layout ← Structure
              ↓
        Components ← UI Elements
              ↓
         Utilities ← Overrides
           (Highest specificity)
```

**Why this order?**

1. Low specificity items first
2. General rules before specific
3. Utilities can override anything
4. Easy to maintain and extend

## 🏷️ BEM Naming Convention

**BEM** = Block, Element, Modifier

```scss
.card {
  // Block (standalone component)
  &__header {
    // Element (part of block)
    color: blue;
  }
  &__title {
    // Element
    font-size: large;
  }
  &--featured {
    // Modifier (variation)
    border: 2px solid gold;
  }
}
```

**Usage in HTML:**

```html
<div class="card card--featured">
  <div class="card__header">
    <h2 class="card__title">Featured Article</h2>
  </div>
</div>
```

## 📱 Mobile-First Responsive Design

Always start with mobile, then enhance:

```scss
.hero {
  padding: $spacing-md;
  font-size: $font-size-base;
  // Tablet and up
  @include media-md {
    padding: $spacing-lg;
    font-size: $font-size-lg;
  }
  // Desktop and up
  @include media-lg {
    padding: $spacing-2xl;
    font-size: $font-size-2xl;
  }
}
```

## ✅ Best Practices Checklist

- [ ] Store all colors/sizes in `_variables.scss`
- [ ] Use mixins to avoid code repetition
- [ ] Keep selectors simple (max 3 levels deep)
- [ ] Use mobile-first approach for responsive design
- [ ] Follow BEM naming convention
- [ ] Keep files focused and under 500 lines
- [ ] Never use `!important` (except in utilities)
- [ ] Never add styles directly in `style.scss`
- [ ] Import files in correct order (ITCSS)
- [ ] Use semantic class names

## ❌ Anti-Patterns to Avoid

```scss
// ❌ Don't use magic numbers
.button {
  padding: 10px 15px; // Use $spacing-md instead
  margin-bottom: 20px;
}
// ❌ Don't nest too deeply
.nav {
  ul {
    li {
      a {
        // Too many levels!
      }
    }
  }
}
// ❌ Don't use !important (breaks cascading)
.text-red {
  color: red !important;
}
// ❌ Don't repeat media queries
.card {
  @media (min-width: 768px) {
    width: 50%;
  }
}
.button {
  @media (min-width: 768px) {
    font-size: large;
  }
}
// Use @mixin media-md instead!
// ✅ Do this:
.card {
  @include media-md {
    width: 50%;
  }
}
.button {
  @include media-md {
    font-size: large;
  }
}
```

## 🚀 Typical File Sizes

- `_variables.scss` - 50-100 lines
- `_mixins.scss` - 100-200 lines
- `_base.scss` - 150-250 lines
- `_layout.scss` - 100-200 lines
- `_components.scss` - 300-600 lines (split if larger)
- `_utilities.scss` - 100-200 lines
  **Total:** ~1000-1500 lines of maintainable SCSS

## 🔄 Development Workflow

```bash
# Watch SCSS for changes (auto-compile)
npm run watch:css
# Build once for production
npm run build:css
# In Docker (watches both TS and SCSS)
npm run server:docker
# Check compiled CSS
cat assets/css/style.css
```

## 📚 Resources

- [Sass Documentation](https://sass-lang.com/documentation)
- [SMACSS Architecture](http://smacss.com/)
- [ITCSS Methodology](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/)
- [BEM Naming Convention](http://getbem.com/)
- [7-1 Pattern](https://sass-guidelin.es/#the-7-1-pattern)

## 🎯 Quick Example: Adding a New Component

Let's say you need to add a `.quote` component:
**Step 1:** Add to `_components.scss`

```scss
.quote {
  padding: $spacing-lg;
  border-left: 4px solid $color-primary;
  background-color: rgba($color-primary, 0.05);
  font-style: italic;
  &__author {
    margin-top: $spacing-md;
    font-style: normal;
    font-weight: 600;
    color: $color-text-light;
  }
}
```

**Step 2:** Use in HTML

```html
<blockquote class="quote">
  <p>Great things never came from comfort zones.</p>
  <p class="quote__author">— Unknown</p>
</blockquote>
```

## **Step 3:** That's it! No need to import - it's already in `style.scss`

Happy styling! 🎨
