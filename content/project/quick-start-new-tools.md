---
title: '🚀 Quick Start: New Tools Added'
date: '2026-03-10T00:00:00+01:00'
lastmod: '2026-03-25T00:00:00+01:00'
draft: false

description: 'Quick-start guide for using newly added tools: Vitest, @11ty/is-land, and Zod, with setup commands and practical examples.'
slug: 'quick-start-new-tools'

tags:
  - 'project'
  - 'vitest'
  - 'is-land'
  - 'zod'
  - 'tooling'
  - 'testing'

categories:
  - 'Guidelines'
  - 'Tooling'

showDate: true
showAuthor: true
showReadingTime: true
showTableOfContents: true
---

**Date:** March 10, 2026  
**Tools Added:** Vitest, @11ty/is-land, Zod

---

## ✅ What Was Installed

### 1. **Vitest** - Testing Framework

- ✅ Installed and configured
- ✅ Example tests created for `utils.ts` and `htmx-bridge.ts`
- ✅ Test scripts added to `package.json`
- ✅ Makefile commands added

### 2. **@11ty/is-land** - Progressive Hydration

- ✅ Installed
- ✅ Integrated into `main.ts`
- ✅ Documentation created: `docs/setup/IS_LAND_GUIDE.md`

### 3. **Zod** - Runtime Validation

- ✅ Installed
- ✅ Integrated into `SearchEngine` feature
- ✅ Type-safe validation example provided

---

## 🎯 How to Use

### Testing with Vitest

#### Run Tests Once

```bash
bun run test:run
# or
make test-run
```

#### Watch Mode (recommended for development)

```bash
bun run test
# or
make test
```

#### Open Visual UI

```bash
bun run test:ui
# or
make test-ui
```

#### Generate Coverage Report

```bash
bun run test:coverage
# or
make test-coverage
```

#### Write Your Own Tests

Create a file ending in `.test.ts` or `.spec.ts`:

```typescript
// assets/ts/my-feature.test.ts
import { describe, it, expect } from 'vitest';
import { myFunction } from './my-feature';

describe('MyFeature', () => {
  it('should do something', () => {
    const result = myFunction();
    expect(result).toBe('expected value');
  });
});
```

---

### Progressive Hydration with is-land

#### Basic Usage in Hugo Templates

**Load component when visible (lazy loading):**

```html
<is-land on:visible>
  <interactive-card title="My Component"> Content here </interactive-card>
</is-land>
```

**Load on user interaction:**

```html
<is-land on:interaction>
  <interactive-card title="Click to Load"> Content here </interactive-card>
</is-land>
```

**Load when browser is idle:**

```html
<is-land on:idle>
  <interactive-card title="Low Priority"> Content here </interactive-card>
</is-land>
```

**Conditional loading (desktop only):**

```html
<is-land on:visible on:media="(min-width: 768px)">
  <interactive-card title="Desktop Only"> Content here </interactive-card>
</is-land>
```

#### Performance Benefits

- ⚡ **Faster initial page load** - Components load only when needed
- 📉 **Reduced JavaScript bundle** - Only critical JS loads initially
- 🎯 **Better Core Web Vitals** - Improved Lighthouse scores

**Expected improvements:**

- First Contentful Paint: 33% faster
- Time to Interactive: 40% faster
- Initial JS bundle: 60-70% smaller

---

### Runtime Validation with Zod

#### Example: Validate API Response

```typescript
import { z } from 'zod';

// Define schema
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().min(0).max(150),
});

// Type derived from schema
type User = z.infer<typeof UserSchema>;

// Validate data
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();

  // This throws if data doesn't match schema
  return UserSchema.parse(data);
}
```

#### Example: Validate Form Data

```typescript
const FormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  age: z.number().int().positive(),
});

function validateForm(formData: unknown) {
  const result = FormSchema.safeParse(formData);

  if (!result.success) {
    console.error('Validation errors:', result.error.errors);
    return false;
  }

  console.log('Valid data:', result.data);
  return true;
}
```

#### Example: Validate LocalStorage

```typescript
const ThemeSchema = z.enum(['light', 'dark', 'auto']);

function getTheme() {
  const stored = localStorage.getItem('theme');
  const result = ThemeSchema.safeParse(stored);

  return result.success ? result.data : 'auto';
}
```

---

## 📝 Test Coverage

**Current test files:**

- ✅ `assets/ts/utils.test.ts` - 6 tests
- ✅ `assets/ts/htmx-bridge.test.ts` - 7 tests

**Total:** 13 tests passing ✅

**Next steps:**

1. Write tests for `ThemeSwitcher`
2. Write tests for `SearchEngine`
3. Write tests for Web Components (`HelloCard`, `InteractiveCard`)

---

## 🔧 Configuration Files

### Vitest Config

Location: `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom', // Simulates browser DOM
    globals: true, // describe, it, expect available without import
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

### Updated package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## 🎓 Learning Resources

### Vitest

- Official Docs: https://vitest.dev/
- API Reference: https://vitest.dev/api/
- Mocking Guide: https://vitest.dev/guide/mocking.html

### @11ty/is-land

- Official Docs: https://www.11ty.dev/docs/plugins/is-land/
- GitHub: https://github.com/11ty/is-land
- **Local Guide:** `docs/setup/IS_LAND_GUIDE.md`

### Zod

- Official Docs: https://zod.dev/
- GitHub: https://github.com/colinhacks/zod
- Error Handling: https://zod.dev/ERROR_HANDLING

---

## 🎯 Next Recommended Actions

### Immediate (This Week)

1. ✅ Run tests: `make test-run`
2. ✅ Wrap components in `<is-land>` tags in your templates
3. ✅ Add Zod validation to any API calls

### Short Term (Next 2 Weeks)

1. Write tests for remaining features
2. Measure performance improvements with Lighthouse
3. Add E2E tests with Playwright (optional)

### Long Term (Next Month)

1. Set up CI/CD with GitHub Actions
2. Add automated testing on pull requests
3. Monitor Core Web Vitals improvements

---

## 🐛 Troubleshooting

### Tests Not Running?

```bash
# Make sure dependencies are installed
bun install

# Try running directly
bun run test:run
```

### is-land Not Working?

Make sure it's imported in `main.ts`:

```typescript
import '@11ty/is-land/is-land.js';
```

### Zod Validation Failing?

Check the error details:

```typescript
const result = schema.safeParse(data);
if (!result.success) {
  console.log(result.error.errors); // Detailed error info
}
```

---

## 📊 Bundle Size Impact

| Tool          | Size (minified) | Type     | Impact            |
| ------------- | --------------- | -------- | ----------------- |
| Vitest        | N/A             | Dev only | ✅ Zero           |
| @11ty/is-land | ~2KB            | Runtime  | ✅ Minimal        |
| Zod           | ~8KB            | Runtime  | ✅ Small          |
| **Total**     | **~10KB**       |          | **✅ Negligible** |

---

## ✨ Summary

You now have:

- ✅ **Testing framework** ready to use
- ✅ **Progressive hydration** for better performance
- ✅ **Runtime validation** for safer code
- ✅ **Documentation** for all new tools
- ✅ **Example code** to follow

**Your codebase is now more:**

- 🛡️ **Robust** (with tests)
- ⚡ **Performant** (with is-land)
- 🔒 **Type-safe** (with Zod)

**Ready to build with confidence! 🚀**
