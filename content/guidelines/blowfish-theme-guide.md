---
date: '2026-03-07T22:38:53+01:00'
lastmod: '2026-03-25T00:00:00+01:00'
title: 'Blowfish Theme Guide'
description: 'Overview of the Blowfish Hugo theme, including current project configuration, customization options, features, and best practices for this site.'
draft: false
slug: 'blowfish-theme-guide'
tags:
  - 'hugo'
  - 'blowfish'
  - 'theme'
  - 'configuration'
  - 'guidelines'
  - 'customization'
categories:
  - 'Guidelines'
  - 'Hugo'
  - 'Theme'
showDate: true
showAuthor: true
showReadingTime: true
showTableOfContents: true
---

## Overview

This Hugo site uses the **Blowfish** theme, a powerful and flexible Hugo theme designed for creating beautiful, feature-rich websites with minimal configuration. Blowfish provides extensive customization options while maintaining excellent performance and accessibility.

**Official Documentation:** [https://blowfish.page/docs/](https://blowfish.page/docs/)

## Theme Information

- **Theme Name:** Blowfish
- **Type:** Hugo Theme
- **License:** MIT
- **Repository:** [https://github.com/nunocoracao/blowfish](https://github.com/nunocoracao/blowfish)

## Current Configuration

### Site Settings (`config/_default/hugo.toml`)

```toml
theme = "blowfish"
baseURL = "https://danne.dev/"
defaultContentLanguage = "en"
enableRobotsTXT = true
summaryLength = 0
enableEmoji = true
```

### Theme Parameters (`config/_default/params.toml`)

#### Appearance

- **Color Scheme:** `forest`
- **Default Appearance:** `light`
- **Auto Switch Appearance:** `true` (respects user's system preferences)

#### Features Enabled

- ✅ Search functionality
- ✅ Automatic appearance switching (light/dark mode)
- ❌ Accessibility features (A11y)
- ❌ Code copy buttons
- ❌ Image optimization (disabled)

#### Layout Configurations

**Header:**

- Layout: `basic`
- Options: basic, fixed, fixed-fill, fixed-gradient, fixed-fill-blur

**Footer:**

- Show menu: ✅
- Show copyright: ✅
- Show theme attribution: ✅
- Show appearance switcher: ✅
- Show scroll to top: ✅

**Homepage:**

- Layout: `profile`
- Options: page, profile, hero, card, background, custom
- Show recent posts: ❌
- Card view: ❌

**Article:**

- Show date: ✅
- Show author: ✅
- Show hero: ❌
- Show breadcrumbs: ❌
- Show heading anchors: ✅
- Show pagination: ✅
- Show reading time: ✅
- Show table of contents: ❌
- Show taxonomies: ❌
- Show word count: ✅
- Zen mode: ❌

**List Pages:**

- Show hero: ❌
- Show breadcrumbs: ❌
- Show summary: ❌
- Group by year: ✅
- Card view: ❌

## Key Features

### 1. Multiple Layout Options

Blowfish offers various layout options for different page types:

- **Homepage Layouts:** profile, page, hero, card, background, custom
- **Article Hero Styles:** basic, big, background, thumbAndBackground
- **Header Styles:** basic, fixed, fixed-fill, fixed-gradient, fixed-fill-blur

### 2. Color Schemes

The theme includes built-in color schemes:

- `blowfish` (default)
- `avocado`
- `fire`
- `ocean`
- `forest` (currently used)
- `princess`
- `neon`
- `bloody`
- `terminal`
- `marvel`
- `noir`
- `autumn`
- `congo`
- `slate`

### 3. Dark Mode Support

Automatic dark mode switching based on:

- User's system preferences
- Manual toggle (appearance switcher in footer)
- Configurable default appearance

### 4. Content Features

- **Taxonomies:** Support for tags, authors, series, and categories
- **Related Content:** Automatic related post suggestions
- **Table of Contents:** Automatic generation from headings
- **Reading Time:** Automatic calculation
- **Word Count:** Display word count for articles
- **Pagination:** Configurable page navigation
- **Breadcrumbs:** Optional breadcrumb navigation

### 5. SEO & Performance

- **Sitemap Generation:** Automatic XML sitemap
- **RSS Feeds:** JSON and XML feed support
- **Robots.txt:** Enabled
- **Open Graph:** Social media sharing optimization
- **Fingerprinting:** SHA-512 asset fingerprinting for cache busting
- **Image Optimization:** Optional (currently disabled)

### 6. Analytics & Tracking Support

Blowfish supports multiple analytics platforms:

- Google Analytics
- Fathom Analytics
- Umami Analytics
- Seline Analytics
- Firebase

### 7. Social & Community Features

- **Reply by Email:** Contact form integration
- **Sharing Links:** Multiple social platform support (LinkedIn, Twitter, Bluesky, Mastodon, Reddit, etc.)
- **Author Pages:** Multi-author support with author profiles
- **Comments:** Integration support for comment systems

### 8. Developer Features

- **Emoji Support:** Native emoji rendering
- **Code Highlighting:** Syntax highlighting for code blocks
- **Code Copy:** Optional copy-to-clipboard buttons
- **Custom CSS/JS:** Easy asset extension via `assets/` directory
- **Partial Templates:** Extensible with custom partials

## Customization

### Changing Color Schemes

Edit `config/_default/params.toml`:

```toml
colorScheme = "forest"  # Change to any available scheme
```

### Modifying Layouts

**Homepage Layout:**

```toml
[homepage]
  layout = "profile"  # Change to: page, hero, card, background, custom
```

**Article Hero Style:**

```toml
[article]
  showHero = true
  heroStyle = "background"  # Options: basic, big, background, thumbAndBackground
```

### Extending the Theme

1. **Custom CSS/JS:** Place files in `assets/js/` or `assets/ts/` directories
2. **Extend Head:** Modify `layouts/partials/extend-head.html`
3. **Custom Layouts:** Override theme layouts in `layouts/` directory
4. **Custom Partials:** Create custom partials in `layouts/partials/`

### Featured Images

Add featured images to articles via front matter:

```yaml
---
title: 'My Post'
date: 2026-03-08
featuredImage: 'image.jpg'
---
```

### Author Configuration

Define authors in front matter or author files:

```yaml
---
title: 'My Post'
authors: ['Daniel']
---
```

## Content Organization

### Directory Structure

```
content/
├── about.md          # About page
├── posts/            # Blog posts
│   └── welcome.md
└── _index.md         # Homepage content
```

### Front Matter Options

Blowfish supports extensive front matter customization:

```yaml
---
title: 'Post Title'
date: 2026-03-08
draft: false
description: 'Post description'
tags: ['tag1', 'tag2']
series: ['series-name']
authors: ['Author Name']
featuredImage: 'image.jpg'
showTableOfContents: true
showHero: true
heroStyle: 'background'
---
```

## Useful Resources

### Official Documentation

- **Getting Started:** [https://blowfish.page/docs/getting-started/](https://blowfish.page/docs/getting-started/)
- **Configuration:** [https://blowfish.page/docs/configuration/](https://blowfish.page/docs/configuration/)
- **Content Examples:** [https://blowfish.page/docs/content-examples/](https://blowfish.page/docs/content-examples/)
- **Partials:** [https://blowfish.page/docs/partials/](https://blowfish.page/docs/partials/)
- **Shortcodes:** [https://blowfish.page/docs/shortcodes/](https://blowfish.page/docs/shortcodes/)

### Theme Samples

- **Demo Site:** [https://blowfish.page/](https://blowfish.page/)
- **Example Configurations:** [https://blowfish.page/docs/examples/](https://blowfish.page/docs/examples/)

### Community

- **GitHub Issues:** [https://github.com/nunocoracao/blowfish/issues](https://github.com/nunocoracao/blowfish/issues)
- **GitHub Discussions:** [https://github.com/nunocoracao/blowfish/discussions](https://github.com/nunocoracao/blowfish/discussions)

## Tips & Best Practices

### 1. Performance Optimization

- Enable image optimization for production:

  ```toml
  disableImageOptimization = false
  ```

- Use appropriate image sizes for featured images
- Leverage Hugo's built-in asset pipeline

### 2. Content Strategy

- Use meaningful taxonomies (tags, series, categories)
- Add featured images to improve visual appeal
- Write descriptive meta descriptions
- Use table of contents for long articles

### 3. Accessibility

- Enable A11y features:

  ```toml
  enableA11y = true
  ```

- Use semantic HTML in custom templates
- Ensure proper heading hierarchy
- Add alt text to images

### 4. SEO Enhancement

- Configure proper baseURL
- Add meta descriptions to content
- Use appropriate taxonomies
- Enable social sharing images:
  ```toml
  defaultFeaturedImage = "IMAGE.jpg"
  defaultSocialImage = "/android-chrome-512x512.png"
  ```

### 5. Development Workflow

- Test both light and dark modes
- Preview on multiple screen sizes
- Validate configuration changes incrementally
- Use Hugo's `--buildDrafts` flag for preview

## Common Configuration Tasks

### Adding Google Analytics

```toml
# config/_default/hugo.toml
googleAnalytics = "G-XXXXXXXXX"
```

### Enabling Search

```toml
# config/_default/params.toml
enableSearch = true

# config/_default/hugo.toml
[outputs]
  home = ["HTML", "RSS", "JSON"]  # JSON required for search
```

### Setting Up Social Sharing

```toml
# config/_default/params.toml
[article]
  sharingLinks = ["linkedin", "twitter", "reddit", "email"]
```

### Configuring Comments

Follow Blowfish documentation for integrating comment systems like Disqus, Utterances, or Giscus.

### Custom Fonts

Add custom fonts via `extend-head.html`:

```html
<!-- layouts/partials/extend-head.html -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Your+Font&display=swap" rel="stylesheet" />
```

## Troubleshooting

### Common Issues

1. **Theme not loading:** Ensure `theme = "blowfish"` is set in `hugo.toml`
2. **Search not working:** Verify JSON output is enabled in config
3. **Images not displaying:** Check path and image optimization settings
4. **Styles not applying:** Clear Hugo cache and rebuild: `hugo --gc`

### Debug Mode

Run Hugo with verbose output:

```bash
hugo server --verbose --debug
```

## Version Management

Keep the theme updated to receive:

- Bug fixes
- New features
- Security patches
- Performance improvements

Check for updates regularly on the [official repository](https://github.com/nunocoracao/blowfish).

## Conclusion

Blowfish is a powerful, well-documented theme that provides excellent flexibility for Hugo sites. This project is configured with a clean, professional setup focusing on readability and user experience. Refer to the official documentation for advanced features and customization options.

For project-specific customizations, see:

- `config/_default/` - Configuration files
- `layouts/` - Custom layouts and partials
- `assets/` - Custom CSS/JS/TypeScript files
