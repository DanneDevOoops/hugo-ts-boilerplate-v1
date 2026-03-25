---
title: 'Environment Configuration'
date: '2026-03-07T22:38:53+01:00'
lastmod: '2026-03-25T00:00:00+01:00'
draft: false

description: 'Reference guide for configuring frontend and backend environment variables across development, staging, production, and test environments in this Hugo-based project.'
slug: 'environment-configuration'

tags:
  - 'guidelines'
  - 'environment'
  - 'configuration'
  - 'vite'
  - 'frontend'
  - 'backend'
  - 'deployment'
  - 'caching'

categories:
  - 'Guidelines'
  - 'Configuration'

showDate: true
showAuthor: true
showReadingTime: true
showTableOfContents: true
---

## Frontend Environment Variables

Copy the appropriate section to your `.env.dev`, `.env.staging`, or `.env.prod` files.

### Development Environment

```bash
# .env.dev

# API Configuration
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# Cache Configuration (milliseconds)
VITE_CACHE_TTL=300000  # 5 minutes - Use shorter TTL during development

# Debugging
DEBUG_STATE_MANAGEMENT=true
DEBUG_API_CALLS=true
DEBUG_CACHE=true
```

### Staging Environment

```bash
# .env.staging

# API Configuration
VITE_API_URL=https://api-staging.example.com/api
VITE_API_TIMEOUT=15000

# Cache Configuration
VITE_CACHE_TTL=600000  # 10 minutes

# Debugging
DEBUG_STATE_MANAGEMENT=false
DEBUG_API_CALLS=true
DEBUG_CACHE=false
```

### Production Environment

```bash
# .env.prod

# API Configuration
VITE_API_URL=https://api.example.com/api
VITE_API_TIMEOUT=10000

# Cache Configuration (longer TTL for better performance)
VITE_CACHE_TTL=900000  # 15 minutes

# Debugging (disabled in production)
DEBUG_STATE_MANAGEMENT=false
DEBUG_API_CALLS=false
DEBUG_CACHE=false
```

## Backend Environment Variables

If you're building your backend API:

### Express.js Backend

```bash
# .env (backend)

# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/hugo_db

# CORS
FRONTEND_URL=http://localhost:1313

# JWT
JWT_SECRET=your-secret-key-change-in-production

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Cache
REDIS_URL=redis://localhost:6379
CACHE_TTL=300  # seconds

# Logging
LOG_LEVEL=debug
```

### For Production

```bash
# .env.production (backend)

PORT=3000
NODE_ENV=production

DATABASE_URL=postgresql://user:password@db-host:5432/hugo_db_prod

FRONTEND_URL=https://mysite.example.com

JWT_SECRET=your-super-secret-key-generate-with-uuid

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000

REDIS_URL=redis://redis-host:6379

LOG_LEVEL=error

# Add monitoring
SENTRY_DSN=your-sentry-dsn
```

## Environment Variable Reference

### Frontend (Vite)

| Variable                 | Description                | Default                     | Example                       |
| ------------------------ | -------------------------- | --------------------------- | ----------------------------- |
| `VITE_API_URL`           | Backend API base URL       | `http://localhost:3000/api` | `https://api.example.com/api` |
| `VITE_API_TIMEOUT`       | Request timeout in ms      | `30000`                     | `10000`                       |
| `VITE_CACHE_TTL`         | Default cache TTL in ms    | `300000`                    | `600000`                      |
| `DEBUG_STATE_MANAGEMENT` | Enable state debug logging | `false`                     | `true`                        |
| `DEBUG_API_CALLS`        | Log all API calls          | `false`                     | `true`                        |
| `DEBUG_CACHE`            | Log cache operations       | `false`                     | `true`                        |

### Backend (Node.js)

| Variable                  | Description                | Example                                |
| ------------------------- | -------------------------- | -------------------------------------- |
| `PORT`                    | Server port                | `3000`                                 |
| `NODE_ENV`                | Environment                | `development`, `staging`, `production` |
| `DATABASE_URL`            | Database connection string | `postgresql://user:pass@host/db`       |
| `FRONTEND_URL`            | CORS origin                | `https://mysite.com`                   |
| `JWT_SECRET`              | JWT signing secret         | (generate with `openssl rand -hex 32`) |
| `RATE_LIMIT_WINDOW_MS`    | Rate limit window          | `900000`                               |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window    | `100`                                  |
| `REDIS_URL`               | Redis connection           | `redis://localhost:6379`               |
| `LOG_LEVEL`               | Logging level              | `debug`, `info`, `warn`, `error`       |

## Using in Code

### Access Environment Variables in TypeScript

```typescript
// src/config.ts

// Frontend
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10);
export const CACHE_TTL = parseInt(import.meta.env.VITE_CACHE_TTL || '300000', 10);
export const DEBUG = import.meta.env.VITE_DEBUG === 'true';

// Backend (Node.js)
export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const DATABASE_URL = process.env.DATABASE_URL || '';
export const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:1313';
```

### Usage in Components

```typescript
import { API_URL, CACHE_TTL } from '../config';

// Use in your services
const apiClient = new ApiClient({
  baseURL: API_URL,
  timeout: 30000,
});

const cacheManager = new CacheManager({
  defaultTTL: CACHE_TTL,
});
```

## Performance Recommendations

### Development

- **Shorter TTL**: 5 minutes (fast feedback)
- **Debug logging**: Enabled (easier troubleshooting)
- **API timeout**: 30 seconds (allows debugging)

### Production

- **Longer TTL**: 15-30 minutes (better performance)
- **Debug logging**: Disabled (faster execution)
- **API timeout**: 5-10 seconds (fail fast)
- **Rate limiting**: Higher limits for known sources

## Cache TTL by Environment

```typescript
const getTTL = (dataType: string): number => {
  const isDev = import.meta.env.DEV;

  const devTTLs: Record<string, number> = {
    user: 1 * 60 * 1000, // 1 min
    post: 2 * 60 * 1000, // 2 min
    list: 1 * 60 * 1000, // 1 min
    search: 2 * 60 * 1000, // 2 min
  };

  const prodTTLs: Record<string, number> = {
    user: 5 * 60 * 1000, // 5 min
    post: 10 * 60 * 1000, // 10 min
    list: 5 * 60 * 1000, // 5 min
    search: 5 * 60 * 1000, // 5 min
  };

  const ttls = isDev ? devTTLs : prodTTLs;
  return ttls[dataType] || 5 * 60 * 1000;
};
```

## Generating Secrets

### JWT Secret (for Backend)

```bash
# macOS/Linux
openssl rand -hex 32

# Output: a1b2c3d4e5f6... (64 character hex string)
```

### API Key (if needed)

```bash
# Generate random API key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Security Notes

⚠️ **Never commit `.env` files** - They contain secrets!

✅ **Use `.env.example`** - Commit this instead with placeholder values

```bash
# .env.example
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
VITE_CACHE_TTL=300000
```

✅ **Use `.env.local`** for personal overrides (add to `.gitignore`)

✅ **In CI/CD**, use environment secrets in your CI/CD platform (GitHub Actions, GitLab CI, etc.)

## Environment-Specific Features

### Enable Debug Logging

```typescript
if (import.meta.env.VITE_DEBUG === 'true') {
  useStore((state) => {
    console.debug('[Store]', state);
  });
}
```

### Different API Endpoints per Environment

```typescript
const endpoints = {
  development: 'http://localhost:3000/api',
  staging: 'https://api-staging.example.com/api',
  production: 'https://api.example.com/api',
};

const currentEnv = import.meta.env.MODE; // 'dev', 'staging', 'production'
const apiURL = endpoints[currentEnv] || endpoints.development;
```

### Conditional Caching

```typescript
const shouldCache = import.meta.env.PROD;
const ttl = shouldCache ? 15 * 60 * 1000 : 1 * 60 * 1000;
```

## Testing Environment Configuration

```bash
# .env.test
VITE_API_URL=http://localhost:3001/api
VITE_API_TIMEOUT=5000
VITE_CACHE_TTL=0  # No cache in tests
DEBUG_STATE_MANAGEMENT=true
```

## Common Issues

### "VITE_API_URL is undefined"

**Solution**: Ensure variable is prefixed with `VITE_` and you're using `import.meta.env`

```typescript
// ❌ Wrong
const url = process.env.VITE_API_URL;

// ✅ Correct
const url = import.meta.env.VITE_API_URL;
```

### ".env file not loading"

**Solution**: Restart dev server after creating/updating `.env` file

```bash
# Stop dev server and restart
bun run dev:env
```

### "Different behavior in dev vs production"

**Solution**: Check environment-specific TTLs and caching logic

```typescript
console.log('Current environment:', import.meta.env.MODE);
console.log('API URL:', import.meta.env.VITE_API_URL);
```

## Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Node.js dotenv](https://github.com/motdotla/dotenv)
- [12 Factor App - Config](https://12factor.net/config)
