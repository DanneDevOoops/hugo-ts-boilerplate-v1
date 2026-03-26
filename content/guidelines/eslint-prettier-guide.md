---
title: 'ESLint and Prettier Guide'
date: '2026-03-25T00:00:00+01:00'
lastmod: '2026-03-25T00:00:00+01:00'
draft: false

description: 'Guide to linting and formatting with ESLint, Prettier, and typescript-eslint in this Hugo, TypeScript, and Bun project.'
slug: 'eslint-prettier-guide'

tags:
  - 'guidelines'
  - 'eslint'
  - 'prettier'
  - 'typescript'
  - 'tooling'
  - 'formatting'
  - 'code-quality'
  - 'bun'

categories:
  - 'Guidelines'
  - 'Tooling'

showDate: true
showAuthor: true
showReadingTime: true
showTableOfContents: true
---

This project is configured with **ESLint** for code quality and **Prettier** for code formatting.

## Overview

- **ESLint**: Finds and fixes problems in JavaScript/TypeScript code
- **Prettier**: Automatically formats code for consistency
- **typescript-eslint**: ESLint support for TypeScript

## Available Commands

### Linting

```bash
# Check for linting issues
bun run lint

# Fix linting issues automatically
bun run lint:fix
```

### Formatting

```bash
# Format code with Prettier
bun run format

# Check if code is properly formatted
bun run format:check
```

## Configuration Files

### ESLint Configuration (`eslint.config.js`)

The new ESLint v9+ flat configuration format with:

- TypeScript support via `typescript-eslint`
- Prettier integration via `eslint-plugin-prettier/recommended`
- Browser and Node.js environment support
- ES2020 module syntax
- Recommended rules with custom tweaks

**Key Rules:**

- `prefer-const`: Error - Prefer `const` over `let`
- `no-var`: Error - Don't use `var`
- `no-console`: Warning - Warn about console statements (useful for debugging)
- `@typescript-eslint/no-explicit-any`: Warning - Warn about `any` types
- `@typescript-eslint/explicit-module-boundary-types`: Off - Not required for return types
- `prettier/prettier`: Error - Enforce Prettier formatting

### Prettier Configuration (`prettier.config.js`)

```js
export default {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  arrowParens: 'always',
};
```

**Configuration Breakdown:**

- `semi`: Require semicolons
- `trailingComma`: Trailing commas where valid in ES5
- `singleQuote`: Use single quotes
- `printWidth`: Line width limit
- `tabWidth`: 2 spaces per tab
- `useTabs`: Use spaces, not tabs
- `arrowParens`: Parentheses around arrow function parameters

### Ignore Files

- `.prettierignore`: Directories to ignore for Prettier
- **Note:** ESLint ignores are configured in `eslint.config.js` under the `ignores` property

## Workflow

### During Development

```bash
# Watch mode for TypeScript compilation
bun run dev

# In another terminal, start Hugo
bun run server

# Check code quality
bun run lint

# Auto-fix issues
bun run lint:fix

# Format code
bun run format
```

### Before Committing

```bash
# Check for any remaining issues
bun run lint

# Check formatting
bun run format:check

# If issues exist, fix them
bun run lint:fix
bun run format
```

### Build Process

```bash
# Build TypeScript
bun run build:ts

# Build everything
bun run build:all
```

## Understanding Warnings vs Errors

### Errors

These must be fixed before the build/lint process completes:

- TypeScript type errors
- Formatting issues (from Prettier)
- Critical code quality issues

### Warnings

These don't block the process but should be reviewed:

- `no-console`: Remove debug console.log() statements before production
- `@typescript-eslint/no-explicit-any`: Try to use specific types instead of `any`

## IDE Integration

### VS Code

Install these extensions for better integration:

- ESLint (dbaeumer.vscode-eslint)
- Prettier - Code formatter (esbenp.prettier-vscode)

Then add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "eslint.validate": ["javascript", "typescript"]
}
```

### JetBrains IDEs (GoLand, WebStorm)

1. Go to **Settings → Languages & Frameworks → TypeScript → ESLint**
2. Enable ESLint
3. Go to **Settings → Languages & Frameworks → TypeScript → Prettier**
4. Enable Prettier

## Tips

### Disable Rules for Specific Lines

```typescript
// eslint-disable-next-line no-console
console.log('Debug info');

// eslint-disable @typescript-eslint/no-explicit-any
const value: any = something;
```

### Disable for Entire Block

```typescript
/* eslint-disable no-console */
console.log('Multiple debug statements');
console.log('More debugging');
/* eslint-enable no-console */
```

## Common Issues

### "Replace with single quotes"

Prettier enforces single quotes. Run `bun run lint:fix` to auto-fix.

### "Delete unnecessary whitespace"

ESLint and Prettier work together to clean up formatting. Run `bun run lint:fix`.

### Console statement warnings

These are intentional to catch debug code. Remove them before production or add `eslint-disable` comments.

## Further Reading

- [ESLint Documentation](https://eslint.org/docs/)
- [Prettier Documentation](https://prettier.io/docs/)
- [TypeScript ESLint Documentation](https://typescript-eslint.io/)
- [ESLint Migration Guide (v8 → v9)](https://eslint.org/docs/latest/use/configure/migration-guide)
