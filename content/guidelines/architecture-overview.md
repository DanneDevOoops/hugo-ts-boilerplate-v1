---
title: 'State Management Architecture Overview'
date: 2026-03-10
lastmod: 2026-03-25
draft: false

description: 'Architecture and data-flow overview for a lightweight state management system in Hugo + HTMX + TypeScript, including cache strategy, service boundaries, and performance patterns.'
slug: 'architecture-overview'
aliases:
  - '/guidelines/arcitechture-overview/'

tags:
  - 'guidelines'
  - 'state management'
  - 'architecture'
  - 'typescript'
  - 'htmx'
  - 'caching'
  - 'hugo'

categories:
  - 'Guidelines'
  - 'Architecture'

showDate: true
showReadingTime: true
showTableOfContents: true
---

## What You Get

A **lightweight, production-ready state management system** optimized for Hugo + HTMX + TypeScript applications with minimal dependencies.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Your Hugo Templates (HTML)                   │
│              with HTMX for dynamic content swaps                │
└──────────────────────────┬──────────────────────────────────────┘
                           │ hx-get, hx-post, hx-trigger
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                   TypeScript Components Layer                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Web Components, Interactive Elements, Features             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                           ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Services Layer (e.g., UserService, PostService)           │ │
│  │  - Encapsulates business logic                             │ │
│  │  - Manages cache invalidation                              │ │
│  │  - Handles data transformations                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                           ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              State Management Layer                        │ │
│  │  ┌──────────────────┐    ┌──────────────────────────────┐  │ │
│  │  │   App Store      │    │   Cache Manager              │  │ │
│  │  │  - Pub/Sub       │    │  - TTL expiration            │  │ │
│  │  │  - State         │    │  - Request deduplication     │  │ │
│  │  │  - Mutations     │    │  - Pattern invalidation      │  │ │
│  │  │  - History       │    │  - SWR pattern               │  │ │
│  │  └──────────────────┘    └──────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                           ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              API Client Layer                              │ │
│  │  - GET, POST, PUT, PATCH, DELETE                           │ │
│  │  - Timeout handling                                        │ │
│  │  - Error handling                                          │ │
│  │  - Type safety                                             │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP/REST Requests
                           ↓
         ┌─────────────────────────────────────┐
         │   Backend API (Express/Fastify)     │
         │  - Authentication                   │
         │  - Rate limiting                    │
         │  - Cache headers                    │
         │  - Database queries                 │
         └─────────────────────────────────────┘
                           │
                           ↓
         ┌─────────────────────────────────────┐
         │   Database (PostgreSQL/MongoDB)     │
         └─────────────────────────────────────┘
```

## Data Flow Examples

### Example 1: Fetch User (with Cache)

```
User clicks "View Profile"
       ↓
Component calls: userService.fetchUser('123')
       ↓
Service checks cache
  → Cache HIT: Return immediately
  → Cache MISS: Continue...
       ↓
Service deduplicates request (prevents duplicates)
       ↓
API Client sends: GET /api/users/123
       ↓
Backend validates & queries DB
       ↓
API returns response
       ↓
Service caches result for 5 minutes
       ↓
Component receives user object
       ↓
Store updates → Components re-render
```

### Example 2: Create User (with Cache Invalidation)

```
User submits form
       ↓
HTMX sends: POST /users/create
       ↓
Component calls: userService.createUser(formData)
       ↓
Service uses: appStore.performAction() → Sets loading=true
       ↓
API Client sends: POST /api/users
       ↓
Backend validates & inserts into DB
       ↓
API returns: 201 Created + new user
       ↓
Service invalidates cache:
  - Delete "user:list:*"
  - Delete "user:search:*"
       ↓
HTMX swaps content
       ↓
Component updates Store
       ↓
Components re-render with new data
```

### Example 3: Stale-While-Revalidate

```
User navigates to posts page
       ↓
Component calls: cacheManager.swr('posts', fetcher)
       ↓
Check cache
  → Has cached posts from 30 seconds ago
  → Return immediately {data: posts, fromCache: true}
       ↓
UI shows cached posts instantly ⚡
       ↓
Meanwhile, in background:
  Service calls: apiClient.get('/posts')
       ↓
  Backend returns fresh posts
       ↓
  Service updates cache
       ↓
  Store updates → Component re-renders with fresh data
```

## Component Responsibilities

### API Client

```
Responsibilities:
✓ Format requests
✓ Handle errors
✓ Inject auth tokens
✓ Set timeouts
✓ Parse responses

Does NOT:
✗ Cache data
✗ Deduplicate requests
✗ Manage state
```

### Cache Manager

```
Responsibilities:
✓ Store data with TTL
✓ Auto-expire old data
✓ Deduplicate requests
✓ Invalidate patterns
✓ Track hit rates

Does NOT:
✗ Make HTTP requests
✗ Manage application state
✗ Handle UI updates
```

### App Store

```
Responsibilities:
✓ Manage application state
✓ Notify listeners of changes
✓ Track action history
✓ Handle loading states
✓ Manage error states

Does NOT:
✗ Fetch data
✗ Cache data
✗ Make HTTP requests
✗ Update DOM directly
```

### Services (e.g., UserService)

```
Responsibilities:
✓ Orchestrate API + Cache + Store
✓ Handle domain logic
✓ Manage cache invalidation
✓ Provide consistent API

Uses:
- API Client for HTTP
- Cache Manager for caching
- App Store for state
```

## Caching Strategy Matrix

```
┌──────────────────┬──────────┬───────────────┬─────────────────┐
│ Data Type        │ TTL      │ Strategy      │ Invalidates On  │
├──────────────────┼──────────┼───────────────┼─────────────────┤
│ User Profile     │ 5 min    │ SWR           │ User update     │
│ Blog Posts       │ 5 min    │ SWR           │ Post create     │
│ Post List        │ 1 min    │ SWR           │ Post create     │
│ Comments         │ 1 min    │ SWR           │ Comment create  │
│ Search Results   │ 2 min    │ Cache         │ Manual          │
│ Categories       │ 1 hour   │ Cache         │ Admin update    │
│ User Settings    │ 10 min   │ SWR           │ Settings save   │
│ Real-time Data   │ None     │ WebSocket     │ N/A             │
└──────────────────┴──────────┴───────────────┴─────────────────┘
```

## State Mutation Patterns

### Pattern 1: Read-Only State

```typescript
const users = await userService.fetchUsers();
// State is read from cache/API, not mutated
```

### Pattern 2: Optimistic Update

```typescript
// Update UI immediately
appStore.setState({ users: [...users, newUser] });

// Send to server
await userService.createUser(newUser);

// If error, revert (not implemented in basic version)
```

### Pattern 3: Loading State

```typescript
await appStore.performAction(
  'CREATE_USER',
  () => userService.createUser(data),
  'user', // Creates: state.user.loading, state.user.error
);

// Can bind to UI:
// if (store.get('user')?.loading) { show spinner }
// if (store.get('user')?.error) { show error }
```

## Performance Characteristics

| Operation        | Latency  | Notes                               |
| ---------------- | -------- | ----------------------------------- |
| Cache HIT        | <1ms     | Instant                             |
| Cache MISS + API | 50-500ms | Network dependent                   |
| SWR (cached)     | <1ms     | Returns cache, refreshes background |
| Request Dedup    | 0ms      | Waits for in-flight request         |
| Cache Invalidate | <1ms     | Instant pattern match               |
| Store Update     | <1ms     | Instant state mutation              |
| Listener Notify  | 1-10ms   | Depends on listener count           |

## Memory Usage

```
Cache Size: ~2-5KB per entry
Store Size: Depends on your state (usually <50KB)
Total Overhead: < 100KB for typical app

Example:
- 50 cached items @ 5KB each = 250KB
- State object (nested) = 50KB
- Total ≈ 300KB (negligible)
```

## Network Optimization

### Without State Management

```
User navigates to 5 pages
→ 5 × 10 API calls = 50 API requests
→ ~50 network requests total
→ ~5-10 seconds load time
```

### With State Management + Cache

```
User navigates to 5 pages
→ Page 1: 10 API calls (cache misses)
→ Page 2: 2 API calls (8 cache hits)
→ Page 3: 1 API call (9 cache hits)
→ Page 4: 1 API call (9 cache hits)
→ Page 5: 0 API calls (10 cache hits)
→ Total: ~14 API requests (72% reduction!)
→ ~1-2 seconds load time
```

## Error Handling Flow

```
API Request
  ↓
Network Error? → Check cache
  → Have cache → Use it (graceful degradation)
  → No cache → Show error message
  ↓
Timeout? → Retry with exponential backoff
  ↓
4xx Error? → Show validation errors
  ↓
5xx Error? → Retry with exponential backoff
  ↓
Success? → Cache + Update store
```

## HTMX Integration Points

### 1. On htmx:beforeRequest

```typescript
// Check if endpoint is cached
const cached = cacheManager.get(endpoint);
if (cached) {
  // Could optimize by skipping request
}
```

### 2. On htmx:afterSwap

```typescript
// Check for cache invalidation attribute
const invalidate = element.getAttribute('data-invalidate');
if (invalidate) {
  cacheManager.invalidatePattern(invalidate);
}
```

### 3. On htmx:load

```typescript
// Initialize components with fresh data
initializeComponents(swappedElement);
```

## Monitoring & Debugging

```typescript
// In browser console

// Cache Stats
cacheManager.getStats();
// { size: 15, entries: ['user:1', 'posts:1', ...] }

// Store State
appStore.getState();
// { users: [...], loading: false, ... }

// Action History
appStore.getActionHistory();
// [{ action: 'FETCH_USERS', timestamp: 1234567890 }, ...]

// Subscribe to changes
useStore((state) => console.log('Updated:', state));
```

## Comparison with Other Solutions

| Feature          | Simple Store | React Query | Zustand | Redux |
| ---------------- | ------------ | ----------- | ------- | ----- |
| Bundle Size      | 2KB          | 9KB         | 2KB     | 4KB   |
| Learning Curve   | Easy         | Medium      | Easy    | Hard  |
| HTMX Friendly    | ✅           | ⚠️          | ✅      | ⚠️    |
| Built-in Cache   | ✅           | ✅          | ❌      | ❌    |
| Middleware       | ❌           | ❌          | ✅      | ✅    |
| DevTools         | ❌           | ✅          | ❌      | ✅    |
| Perfect for Hugo | ✅           | ⚠️          | ✅      | ❌    |

## Recommended Setup

```
Development:
├─ Cache TTL: 1-5 min (fast feedback)
├─ Debug logs: ON
├─ API timeout: 30s
└─ Rate limit: Disabled

Staging:
├─ Cache TTL: 5-10 min
├─ Debug logs: Errors only
├─ API timeout: 15s
└─ Rate limit: 100 req/15min

Production:
├─ Cache TTL: 15-30 min
├─ Debug logs: OFF
├─ API timeout: 5-10s
└─ Rate limit: 1000 req/15min
```

## Next Actions

1. **Review the code** - Understand each component
2. **Create services** - For your domain models
3. **Set env vars** - Configure URLs and cache TTLs
4. **Build API** - Implement backend endpoints
5. **Test cache** - Verify hit rates and performance
6. **Deploy** - Monitor in production

---

**Total Implementation Time**: 2-4 hours
**Maintenance**: Minimal (mostly adjusting cache TTLs)
**Benefits**: 60-80% reduction in API calls + better UX
