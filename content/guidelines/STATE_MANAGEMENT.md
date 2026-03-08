# State Management Guide

## Overview

This guide outlines best practices for managing state in your Hugo TypeScript application with a backend API to minimize data requests and improve performance.

## Recommended Architecture

### 1. **Client-Side State Management (Recommended for Hugo + HTMX)**

Given your tech stack (Hugo + HTMX + TypeScript), we recommend a **lightweight state store** pattern combined with strategic caching:

#### Why This Approach?

- Hugo generates static HTML at build time
- HTMX handles dynamic content swaps without full page reloads
- Minimal framework overhead is ideal
- Perfect for progressive enhancement

### 2. **State Management Options**

#### Option A: Simple Store Pattern (Recommended for Most Use Cases)

**Best for**: Small to medium apps, event-driven architecture

- Lightweight, no dependencies
- Works perfectly with HTMX lifecycle events
- Built on top of your existing htmx-bridge
- Easy to understand and debug

**Implementation**: See `assets/ts/store/app-store.ts`

#### Option B: TanStack Query/React Query (Best for Complex Data Fetching)

**Best for**: Complex data dependencies, real-time updates, pagination

- Automatic request deduplication
- Smart caching with stale-while-revalidate
- Built-in refetch strategies
- Excellent for API integrations

**Installation**:

```bash
bun add @tanstack/query-core
```

#### Option C: Zustand (Best for Complex State Logic)

**Best for**: Complex state transformations, middleware support

- Lightweight (~2KB)
- TypeScript-first
- Middleware support
- Works great with vanilla JS

**Installation**:

```bash
bun add zustand
```

---

## Recommended Solution: Store + Cache Pattern

### Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│               HUGO + HTMX Frontend                   │
├─────────────────────────────────────────────────────┤
│                                                       │
│  Components (Web Components / JavaScript)             │
│            ↓                                          │
│    ┌─────────────────┐                               │
│    │  App State Store │ ← Central state management    │
│    └────────┬────────┘                               │
│             ↓                                        │
│    ┌─────────────────┐                               │
│    │  Cache Manager  │ ← Minimize API calls          │
│    └────────┬────────┘                               │
│             ↓                                        │
│    ┌─────────────────┐                               │
│    │  API Client     │ ← Handles HTTP requests      │
│    └────────┬────────┘                               │
│             ↓                                        │
└─────────────────────────────────────────────────────┘
             Network
             ↓
┌─────────────────────────────────────────────────────┐
│           Backend API (Go, Node, etc)                │
├─────────────────────────────────────────────────────┤
│  Endpoints for data fetching, mutations, etc        │
└─────────────────────────────────────────────────────┘
```

---

## Implementation Guide

### Step 1: Create API Client

File: `assets/ts/api/api-client.ts`

Handles all HTTP requests with error handling and request configuration.

### Step 2: Create Cache Manager

File: `assets/ts/store/cache-manager.ts`

Implements:

- TTL-based cache expiration
- Cache invalidation
- Request deduplication
- Stale-while-revalidate pattern

### Step 3: Create App Store

File: `assets/ts/store/app-store.ts`

Central state management with:

- Observable pattern or simple pub/sub
- State subscriptions
- Actions for state mutations
- Integration with HTMX bridge

### Step 4: Integrate with HTMX

Use the existing `htmx-bridge.ts` to:

- Initialize stores on component load
- Listen to HTMX events for cache invalidation
- Update state on content swaps

---

## Best Practices

### 1. **Cache Strategy**

```
┌─ Data Type ──┬─ TTL ──┬─ Strategy ┐
├──────────────┼────────┼────────────┤
│ User Profile │ 5 min  │ SWR        │
│ Posts/Items  │ 1 min  │ SWR        │
│ Real-time    │ None   │ WebSocket  │
│ Static       │ 1 hour │ Cache      │
└──────────────┴────────┴────────────┘
```

### 2. **Request Deduplication**

Prevent multiple identical requests while one is in-flight:

```typescript
// Bad: Multiple identical requests
fetchUser(id);
fetchUser(id); // Duplicated request!

// Good: Deduplication
const user = await store.fetchUser(id); // First request
const user2 = await store.fetchUser(id); // Waits for first request
```

### 3. **HTMX Integration**

```typescript
// Listen to HTMX events to invalidate cache
document.body.addEventListener('htmx:afterSwap', (event) => {
  const target = (event as CustomEvent).detail.target;
  const invalidationKey = target.dataset.invalidate;

  if (invalidationKey) {
    cacheManager.invalidate(invalidationKey);
  }
});
```

### 4. **Error Handling**

```typescript
try {
  const data = await store.fetchData(id);
} catch (error) {
  if (error instanceof NetworkError) {
    // Use cached data if available
    return getCachedData(id);
  }
  throw error;
}
```

### 5. **Typed Responses**

Always define types for API responses:

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  timestamp: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

// Type-safe API calls
const response: ApiResponse<User> = await apiClient.get('/users/1');
```

---

## Implementation Recommendations by Use Case

### Use Case 1: Blog/News Site with Comments

```
Store Pattern + Cache
├─ Cache posts (5 min TTL)
├─ Cache comments (1 min TTL)
└─ Invalidate on form submission
```

### Use Case 2: E-commerce Site

```
TanStack Query
├─ Product listing (with pagination)
├─ Cart state (localStorage sync)
├─ User data (with refetch on login)
└─ Real-time inventory updates
```

### Use Case 3: Dashboard/Admin Panel

```
Zustand + Middleware
├─ Global UI state (sidebars, modals)
├─ User permissions
├─ Theme/layout preferences
└─ Persist to localStorage
```

### Use Case 4: Real-time Collaboration

```
Store + WebSocket Bridge
├─ Optimistic updates
├─ Conflict resolution
├─ Offline queue
└─ Sync on reconnect
```

---

## Performance Metrics to Track

1. **API Call Count**: Monitor the number of API calls per page load
2. **Cache Hit Rate**: Track cache effectiveness
3. **Time to Interactive (TTI)**: Measure with caching enabled/disabled
4. **Network Waterfall**: Identify unnecessary requests

---

## Environment Configuration

Set API endpoints in `.env` files:

```bash
# .env.dev
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000
VITE_CACHE_TTL=300000

# .env.prod
VITE_API_URL=https://api.mysite.com/api
VITE_API_TIMEOUT=5000
VITE_CACHE_TTL=600000
```

Access in code:

```typescript
const API_URL = import.meta.env.VITE_API_URL;
const CACHE_TTL = import.meta.env.VITE_CACHE_TTL;
```

---

## Next Steps

1. **Choose your approach** (Simple Store, TanStack Query, or Zustand)
2. **Set up API client** with proper error handling
3. **Implement cache manager** with appropriate TTLs
4. **Create state store** tied to your app's domain
5. **Test cache hit rates** and optimize TTLs based on data freshness needs
6. **Monitor API calls** to ensure deduplication is working

---

## Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [HTTP Caching Strategies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [Web Components Lifecycle](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)
