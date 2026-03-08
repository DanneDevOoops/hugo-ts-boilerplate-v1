# Content Directory

This is where all your markdown content lives for your Hugo site.

## Quick Reference: Adding Content

### Create New Content

```bash
# Blog post
hugo new posts/my-post-name.md

# Page
hugo new about.md
hugo new contact.md

# Other sections
hugo new projects/project-name.md
hugo new docs/documentation.md
```

### Content Structure

```
content/
├── _index.md           # Homepage content
├── about.md            # About page (example created)
├── posts/              # Blog posts
│   ├── _index.md      # Posts list page settings
│   └── welcome.md     # Example post created
└── [other-sections]/  # Add more as needed
```

### Front Matter Template

```toml
+++
title = "Your Title"
date = 2026-03-07
draft = false                    # Set to false to publish
description = "Brief description"
tags = ["tag1", "tag2"]
categories = ["Category"]
showDate = true
showAuthor = true
showReadingTime = true
showTableOfContents = true
+++
```

### Preview Your Content

```bash
# With drafts
hugo server -D

# Published only
hugo server
```

Visit: http://localhost:1313

### Publishing

Change `draft = true` to `draft = false` in your content files when ready to publish.

## Examples Created

Two example files have been created for you:

1. **`posts/welcome.md`** - A sample blog post with various markdown examples
2. **`about.md`** - A sample about page

Feel free to edit or delete these examples!
