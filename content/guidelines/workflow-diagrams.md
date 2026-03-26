---
title: 'TypeScript + Bun Workflow Diagram'
date: '2026-03-25T00:00:00+01:00'
lastmod: '2026-03-25T00:00:00+01:00'
draft: false

description: 'Workflow diagrams for TypeScript and Bun build processes, development loops, and deployment flow in this project.'
slug: 'workflow-diagrams'

tags:
  - 'guidelines'
  - 'workflow'
  - 'diagrams'
  - 'typescript'
  - 'bun'
  - 'build'

categories:
  - 'Guidelines'
  - 'Tooling'

showDate: true
showAuthor: true
showReadingTime: true
showTableOfContents: true
---

## Build Process Flow

```
                    ┌─────────────────┐
                    │   You write     │
                    │ TypeScript code │
                    │  (assets/ts/)   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Run:           │
                    │ bun run build:ts│
                    └────────┬────────┘
                             │
         ┌───────────────────▼───────────────────┐
         │      Bun Bundler Process              │
         ├───────────────────────────────────────┤
         │ 1. Read assets/ts/main.ts             │
         │ 2. Follow imports                     │
         │ 3. Compile TypeScript → JavaScript    │
         │ 4. Merge all code into one file       │
         │ 5. Minify (remove whitespace)         │
         │ 6. Generate source maps               │
         └───────────────────┬───────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Output:       │
                    │ assets/js/      │
                    │  main.js        │
                    │  main.js.map    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ Hugo processes  │
                    │    assets/      │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   Browser gets  │
                    │  final HTML +   │
                    │  JS bundled     │
                    └─────────────────┘
```

## File Organization

```
assets/ts/
├── main.ts          ← Always import here
│   └── imports from:
│       ├── utils.ts
│       └── features/*
├── utils.ts         ← Shared utilities
└── features/        ← Feature modules
    ├── search.ts
    ├── theme-switcher.ts
    └── ...

↓ Bun bundles ↓

assets/js/
├── main.js          ← Minified bundle
└── main.js.map      ← Debug source map
```

## Development Workflow

```
┌─────────────────────────────────────────┐
│     DEVELOPMENT WORKFLOW                │
└─────────────────────────────────────────┘

Start watching:
  bun run dev
       │
       ├─ Watches assets/ts/ for changes
       │
       └─ Auto-rebuilds on save
            │
            └─ Updates assets/js/main.js

Meanwhile, in another terminal:
  bun run server
       │
       └─ Starts Hugo at localhost:1313
            │
            └─ Hugo reloads on file changes
                 │
                 └─ Browser refreshes
                      │
                      └─ You see changes instantly
```

## Code Structure Example

```typescript
// main.ts (entry point)
import './components/hello-card';
import { initializeSearch } from './features/search';
import { initializeTheme } from './features/theme-switcher';

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeSearch();
    initializeTheme();
  });
} else {
  initializeSearch();
  initializeTheme();
}

↓ Bun processes ↓

// main.js (bundled output)
// Contains:
// - All code from main.ts
// - All imports inlined
// - All dependencies included
// - Everything minified
// - Total size depends on features
```

## Dependency Tree Example

```
main.ts
├── features/search.ts
│   └── (no dependencies)
├── features/theme-switcher.ts
│   └── (no dependencies)
└── utils.ts
    └── (no dependencies)

When bundled, all become one file:
main.js = main.ts + search.ts + theme.ts + utils.ts (minified)
```

## With External Libraries

```
// package.json with npm packages
{
  "dependencies": {
    "fuse.js": "^7.1.0"
  }
}

main.ts
├── features/search.ts
│   └── import Fuse from 'fuse.js'
│       └── node_modules/fuse.js/
│
└── features/analytics.ts

↓ Bun includes node_modules ↓

main.js
├── Your code
├── fuse.js code
├── analytics code
└── All minified into one file
```

## Watch Mode Visualization

```
File Changes           Bun Action           Browser Result
─────────────        ─────────────        ──────────────

Edit main.ts    →    Rebuild          →   Page unchanged
Save              (rebuilds assets/js)     (no reload yet)

Edit search.ts   →   Rebuild main.js   →   Browser reloads
Save                                       JS updated

Hugo watches ────────→ File change ─→ Hugo reloads ──→ Browser refresh
```

## Bun vs Traditional Build Tools

```
Traditional Setup:
├── package.json (npm)
├── webpack.config.js
├── babel.config.js
├── postcss.config.js
└── tsconfig.json
      ↓
    Takes 5+ seconds to build

Bun Setup:
├── package.json (bun)
├── tsconfig.json
└── bunfig.toml (optional)
      ↓
    Takes milliseconds to build
```

## Performance Impact

```
File Size (example with current features)
─────────
main.ts (source):        ~2KB
All features combined:   ~5-10KB
Dependencies (lit):      ~20-30KB
Minified bundle:         ~15-25KB  ← This is what browser gets
With source map:         ~50KB+    ← Dev only, not in production

Build Time
──────────
Bun compilation: <100ms (typically ~10-50ms)
Hugo build: 100-500ms (depends on content)

Load Time
────────
JavaScript execution: <10ms
DOM ready: varies
Page interactive: varies
```

## Directory Structure with All Details

```
hugo-site/
│
├─ assets/ts/                          ← YOU EDIT THESE
│  ├─ main.ts                       ← Entry point
│  ├─ utils.ts                      ← Shared code
│  ├─ components/                   ← Reusable components
│  │  └─ hello-card.ts              ← Example web component
│  └─ features/                     ← Organized feature modules
│     ├─ search.ts
│     ├─ theme-switcher.ts
│     └─ ...add more here...
│
├─ assets/js/                       ← BUN GENERATES THESE
│  ├─ main.js                       ← Minified bundle
│  └─ main.js.map                   ← Source map
│
├─ config/                          ← Hugo configuration
│  └─ _default/
│     ├─ hugo.toml
│     ├─ languages.en.toml
│     ├─ markup.toml
│     ├─ menus.en.toml
│     ├─ module.toml
│     └─ params.toml
│
├─ content/                         ← Hugo content (Markdown)
│  ├─ about.md
│  └─ posts/
│
├─ layouts/                         ← Hugo templates
│  ├─ baseof.example.html           ← Example: <script src="{{"/js/main.js" | relURL}}">
│  └─ partials/
│
├─ scripts/                         ← Build automation scripts
│  ├─ build.sh                      ← Production build
│  └─ dev.sh                        ← Development workflow
│
├─ package.json                     ← Dependencies + scripts
├─ tsconfig.json                    ← TypeScript settings
├─ bunfig.toml                      ← Bun build settings
├─ Makefile                         ← Quick commands
│
└─ docs/                            ← Documentation
   ├─ setup/
   │  ├─ QUICKSTART.md
   │  └─ TYPESCRIPT_BUN_SETUP.md
   └─ guidelines/
      ├─ TYPESCRIPT_BUN_GUIDE.md
      └─ WORKFLOW_DIAGRAMS.md
```

## Quick Reference Commands

```
bun run build:ts       →  Compile once (with minify)
bun run dev            →  Watch and rebuild on changes
bun run build:all      →  TS + Hugo build
bun run server         →  Hugo dev server
bun install            →  Install dependencies
bun add <package>      →  Add npm package
make help              →  See all Makefile commands
make dev-all           →  TypeScript watch + Hugo server
make build-fast        →  Fast production build

# Direct Bun commands (if needed):
bun build ./assets/ts/main.ts --outdir ./assets/js --target browser --minify --sourcemap=external
```

## Troubleshooting Decision Tree

```
         Problem?
              │
    ┌─────────┼─────────┐
    │         │         │
Error?    No change   Slow?
    │         │         │
    ▼         ▼         ▼
Check  Hard  Update
logs   refresh Bun
```
