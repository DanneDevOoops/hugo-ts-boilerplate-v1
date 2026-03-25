---
title: "TypeScript + Bun Setup Checklist"
date: "2026-03-25T09:30:00+01:00"
draft: false
description: "Step-by-step checklist for installing and validating TypeScript + Bun in Hugo."
tags: ["setup", "checklist", "typescript", "bun", "hugo"]
categories: ["Setup"]
showDate: true
showAuthor: false
showReadingTime: true
showTableOfContents: true
---

## ✅ Pre-Setup Verification

Before starting, verify:

- [ ] macOS/Linux/WSL system ready
- [ ] Internet connection available (for downloads)
- [ ] Write access to project directory
- [ ] At least 500MB free disk space

## 📦 Installation Steps

### Step 1: Install Bun (One Time Only)

```bash
curl -fsSL https://bun.sh/install | bash
```

Verify:
```bash
bun --version
# Should output: bun x.y.z
```

Expected output: `bun 1.0.0` or higher

**Status:** [ ] Done

### Step 2: Install Project Dependencies

```bash
cd /Users/daniel/GolandProjects/Hugo/hugo-site
bun install
```

Expected output:
```
+ [package count] packages installed
```

Creates:
- `node_modules/` directory
- `bun.lockb` lock file

**Status:** [ ] Done

### Step 3: Build TypeScript

```bash
bun run build:ts
```

Expected output:
```
./src/ts/main.ts   [bundled]
```

Creates:
- `assets/js/main.js` (bundled code)
- `assets/js/main.js.map` (source maps)

**Status:** [ ] Done

## 🔧 Integration Steps

### Step 4: Update Hugo Layout

Find your main template file (usually `layouts/baseof.html` or similar).

Add this line before closing `</body>`:

```html
<script src="{{ "js/main.js" | relURL }}" defer></script>
```

Or at the end of `<head>`:

```html
<script src="{{ "js/main.js" | relURL }}" async></script>
```

**Recommendation:** Use `defer` in `<head>` or at end of `<body>`

**Status:** [ ] Done

### Step 5: Test the Build

```bash
# Terminal 1: Start Hugo
bun run server

# Should output:
# Start building sites ...
# Built in X ms
# Web Server is available at http://localhost:1313
```

Visit: `http://localhost:1313`

Open DevTools (F12) → Console

**Status:** [ ] See "Hugo site loaded with TypeScript via Bun!" in console

## 🚀 Development Setup

### Step 6: Watch Mode (Optional but Recommended)

```bash
# Terminal 2: Watch TypeScript
bun run dev

# Should output:
# $ bun build ./src/ts/main.ts ... 
# watch: src/ts/ recompiling...
```

Now when you edit files in `src/ts/`, they automatically rebuild.

**Status:** [ ] Watching for changes

### Step 7: Verify Auto-Rebuild

1. Edit `src/ts/main.ts`
2. Change the console.log message to something else
3. Save the file
4. Watch terminal should show rebuild
5. Hard refresh browser (Cmd+Shift+R)
6. Check DevTools console for new message

**Status:** [ ] Auto-rebuild working

## 📝 Project Structure Verification

Verify these files exist:

```
hugo-site/
├─ package.json              [ ] ✓
├─ tsconfig.json             [ ] ✓
├─ bunfig.toml               [ ] ✓
├─ Makefile                  [ ] ✓
├─ assets/ts/
│  ├─ main.ts               [ ] ✓
│  ├─ utils.ts              [ ] ✓
│  └─ features/
│     ├─ search.ts          [ ] ✓
│     └─ theme-switcher.ts  [ ] ✓
└─ assets/js/
   └─ main.js               [ ] ✓ (created after build)
```

## 🎯 First Feature Development

### Create Your First TypeScript Module

1. Create file: `assets/ts/features/hello.ts`

```typescript
export function sayHello(name: string): void {
  console.log(`Hello, ${name}!`);
}
```

2. Import in `assets/ts/main.ts`:

```typescript
import { sayHello } from './features/hello';

// ... existing code ...

sayHello('World');
```

3. Rebuild:

```bash
bun run build:ts
```

4. Check in browser console (F12)

**Status:** [ ] First feature working

## 🔍 Quality Checks

### Build Verification

```bash
# Check TypeScript compilation
bun run build:ts

# Should complete without errors
```

**Status:** [ ] Build succeeds

### Browser Console Check

Open DevTools (F12) → Console tab

You should see:
```
Hugo site loaded with TypeScript via Bun!
```

No red errors (warnings are OK)

**Status:** [ ] Clean console output

### File Size Check

Check generated file:
```bash
ls -lh assets/js/main.js
# Should be < 10KB for basic setup
```

**Status:** [ ] File size reasonable

## 📚 Documentation Review

Read in this order:

1. [ ] `QUICKSTART.md` (5 minutes) - Overview
2. [ ] `TYPESCRIPT_BUN_GUIDE.md` (15 minutes) - Detailed guide
3. [ ] `TYPESCRIPT_BUN_SETUP.md` (20 minutes) - Comprehensive reference
4. [ ] `WORKFLOW_DIAGRAMS.md` (10 minutes) - Visual guides

## 🎓 Next Steps Checklist

### Immediate (Today)

- [ ] Complete steps 1-7 above
- [ ] Read QUICKSTART.md
- [ ] Create first feature module
- [ ] Get comfortable with `bun run dev`

### Short Term (This Week)

- [ ] Add 2-3 more features in assets/ts/
- [ ] Import external libraries
- [ ] Set up editor for TypeScript
- [ ] Configure IDE type checking

### Medium Term (This Month)

- [ ] Build search functionality
- [ ] Add theme switcher
- [ ] Create analytics module
- [ ] Optimize bundle size

### Long Term (Ongoing)

- [ ] Add tests
- [ ] Set up CI/CD
- [ ] Monitor performance
- [ ] Update dependencies

## 🛠️ Troubleshooting Checklist

### Issue: "bun: command not found"

- [ ] Run: `curl -fsSL https://bun.sh/install | bash`
- [ ] Close and reopen terminal
- [ ] Try again: `bun --version`

### Issue: "Module not found"

- [ ] Check file path is correct
- [ ] Verify file exists
- [ ] Ensure export statement in source file
- [ ] Check import path matches file name

### Issue: "Changes not showing"

- [ ] Run: `bun run build:ts`
- [ ] Hard refresh: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)
- [ ] Check for console errors (F12)
- [ ] Verify assets/js/main.js is updated

### Issue: "Package not found"

- [ ] Install package: `bun add package-name`
- [ ] Run: `bun run build:ts`
- [ ] Verify in package.json

### Issue: "Slow build"

- [ ] Update Bun: `bun upgrade`
- [ ] Check disk space: `df -h`
- [ ] Restart terminal
- [ ] Clear cache: `bun clean`

## ✨ Success Criteria

Your setup is complete when:

- [x] `bun install` runs without errors
- [x] `bun run build:ts` creates `assets/js/main.js`
- [x] Hugo loads the script without console errors
- [x] Console shows "Hugo site loaded with TypeScript via Bun!"
- [x] Editing `src/ts/` files auto-rebuilds
- [x] Changes appear in browser after refresh
- [x] You can create new .ts files and import them
- [x] You understand the build process

## 📞 Getting Help

### If stuck on a step:

1. Re-read the QUICKSTART.md
2. Check TROUBLESHOOTING.md section
3. Verify file paths are correct
4. Try: `bun upgrade` (update Bun)
5. Try: `bun install` (reinstall deps)

### Useful commands:

```bash
# See all available scripts
cat package.json | grep '"scripts"' -A 10

# List generated files
ls -la assets/js/

# See TypeScript config
cat tsconfig.json

# Check Bun version
bun --version

# View build output
cat assets/js/main.js | head -20
```

## 🎉 You're All Set!

When you've completed all steps above, you're ready to:

✅ Build features with TypeScript
✅ Use modern JavaScript syntax
✅ Organize code in modules
✅ Debug with source maps
✅ Deploy minified JavaScript

**Start building!** 🚀

---

**Questions?** Reference the documentation files or check Bun/TypeScript official docs.

**Note:** This checklist assumes macOS/Linux. WSL and Windows users should work fine too.

