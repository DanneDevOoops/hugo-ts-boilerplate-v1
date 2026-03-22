---
date: '2026-03-07T22:38:53+01:00'
draft: false
title: 'Welcome to My Hugo Site1'
description: 'My first blog post using Hugo and the Blowfish theme'
tags: ['hugo', 'blogging', 'web development']
categories: ['Getting Started']
showDate: true
showAuthor: true
showReadingTime: true
showTableOfContents: true
---

## Welcome! 🎉

This is my first blog post created with Hugo! Hugo is an amazing static site generator that makes it easy to create fast, secure websites.

### Why Hugo?

- **Fast** - Hugo builds sites incredibly quickly
- **Flexible** - Works with any type of website
- **Secure** - No database or server-side code means fewer vulnerabilities
- **Easy** - Simple markdown syntax for content

### Getting Started

Creating content is as simple as:

```bash
hugo new posts/my-post.md
```

Then just write your content in markdown!

### Code Examples

Hugo supports syntax highlighting out of the box:

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, Hugo!")
}
```

### Images and Links

You can add images and links easily:

- [Visit Hugo Documentation](https://gohugo.io/)
- [Blowfish Theme Docs](https://blowfish.page/)

### Interactive Web Components

This site uses TypeScript and Lit to create interactive web components! Here's a live example:

{{< hello-card name="Hugo Developer" >}}

You can also use raw HTML since `unsafe = true` is enabled in markup config:

<hello-card name="World"></hello-card>

### What's Next?

Stay tuned for more posts about web development, Hugo tips, and more!
