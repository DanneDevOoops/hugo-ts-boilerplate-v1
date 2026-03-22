# State Management Quick Reference

## Files Created

```
assets/ts/
├── api/
│   └── api-client.ts          # HTTP client with error handling
├── store/
│   ├── app-store.ts           # Central state management
│   └── cache-manager.ts       # TTL-based caching with deduplication
├── services/
│   └── user.service.ts        # Example service pattern
└── features/
    └── store-integration.example.ts  # HTMX integration example

docs/guidelines/
├── STATE_MANAGEMENT.md              # Complete guide
├── STATE_MANAGEMENT_IMPLEMENTATION.md # Implementation examples
└── BACKEND_API_SETUP.md            # Backend recommendations
```

## 1-Minute Quick Start

### Environment Setup

```bash
# Add to .env.dev
VITE_API_URL=http://localhost:3000/api
VITE_CACHE_TTL=300000
```

### Fetch Data with Cache

```typescript
import { userService } from './services/user.service';

// Automatically cached and deduplicated
const users = await userService.fetchUsers();
```

### Subscribe to Changes

```typescript
import { useStore } from './store/app-store';

useStore((state) => {
  console.log('Store updated:', state);
});
```

### Invalidate Cache

```typescript
import { cacheManager } from './store/cache-manager';

// Clear specific cache
cacheManager.invalidate('user:1');

// Clear by pattern
cacheManager.invalidatePattern('user:*');

// Clear all
cacheManager.clear();
```

### HTMX Integration

```html
<!-- Invalidate cache on swap -->
<button hx-post="/users/create" data-invalidate="user:list:*" hx-target="#users">Add User</button>
```

## Core Concepts

### 1. API Client

- Handles HTTP requests
- Built-in timeout handling
- Automatic auth token injection
- Consistent error handling

```typescript
const response = await apiClient.get('/users/1');
// Returns: { data, status, statusText, headers, timestamp }
```

### 2. Cache Manager

- TTL-based expiration
- Request deduplication
- Pattern-based invalidation
- Stale-while-revalidate support

```typescript
// Simple cache
cacheManager.set('key', data, 5 * 60 * 1000);
const data = cacheManager.get('key');

// Deduplication (prevents duplicate requests)
const result = await cacheManager.deduplicate('key', fetcher);

// Stale-while-revalidate (return cache, refresh in background)
const { data, fromCache } = await cacheManager.swr('key', fetcher);
```

### 3. App Store

- Central state management
- Pub/sub pattern
- Action history tracking
- Integrated error handling

```typescript
// Update state
appStore.setState({ users: [...] });

// Get state
const state = appStore.getState();

// Subscribe
const unsubscribe = useStore((state) => { ... });

// Perform async action with loading state
await appStore.performAction('FETCH', asyncFn, 'stateKey');
```

### 4. Services

- Domain-specific data access
- Consistent patterns
- Integrated caching
- Cache invalidation on mutations

```typescript
await userService.fetchUser(id); // With cache
await userService.fetchUsers(); // With SWR
await userService.createUser(data); // Invalidates cache
await userService.updateUser(id, data); // Invalidates cache
await userService.deleteUser(id); // Invalidates cache
```

## Common Patterns

### Pattern 1: Fetch and Cache

```typescript
async fetchData(id: string) {
  const cached = cacheManager.get(id);
  if (cached) return cached;

  const data = await cacheManager.deduplicate(id, () =>
    apiClient.get(`/data/${id}`).then(r => r.data)
  );

  cacheManager.set(id, data, ttl);
  return data;
}
```

### Pattern 2: Stale-While-Revalidate

```typescript
const { data, fromCache } = await cacheManager.swr('key', () =>
  apiClient.get('/endpoint').then((r) => r.data),
);
// Immediately returns cached data, refreshes in background
```

### Pattern 3: Mutation with Cache Invalidation

```typescript
async updateData(id: string, updates: any) {
  const result = await apiClient.patch(`/data/${id}`, updates);
  cacheManager.invalidate(`data:${id}`);
  cacheManager.invalidatePattern(`data:list:*`);
  return result.data;
}
```

### Pattern 4: Loading State Management

```typescript
await appStore.performAction(
  'FETCH_USERS',
  () => userService.fetchUsers(),
  'users', // Creates users.loading and users.error
);

// Store now has:
// state.users.loading = false
// state.users.error = null or error message
```

## Error Handling

```typescript
import { NetworkError, TimeoutError } from './api/api-client';

try {
  const user = await userService.fetchUser(id);
} catch (error) {
  if (error instanceof NetworkError) {
    // Use cached version if available
    const cached = cacheManager.get(`user:${id}`);
    return cached || handleError(error);
  } else if (error instanceof TimeoutError) {
    console.error('Request timed out');
  }
}
```

## Cache TTL Recommendations

| Data Type         | TTL     | Strategy |
| ----------------- | ------- | -------- |
| User Profile      | 5 min   | SWR      |
| Posts/Articles    | 1-5 min | SWR      |
| Lists             | 1 min   | SWR      |
| Real-time         | None    | Events   |
| Static/Categories | 1 hour  | Cache    |
| Search Results    | 2 min   | Cache    |

## Testing

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { cacheManager } from './store/cache-manager';

describe('Cache Manager', () => {
  beforeEach(() => cacheManager.clear());

  it('should cache data', () => {
    cacheManager.set('key', 'value');
    expect(cacheManager.get('key')).toBe('value');
  });

  it('should expire after TTL', async () => {
    cacheManager.set('key', 'value', 10); // 10ms TTL
    await new Promise((r) => setTimeout(r, 20));
    expect(cacheManager.get('key')).toBeNull();
  });
});
```

## Debugging Commands

```javascript
// Browser console

// View cache stats
cacheManager.getStats();

// View all state
appStore.getState();

// View action history
appStore.getActionHistory();

// View specific state value
appStore.get('users');

// Clear everything
cacheManager.clear();
appStore.reset();
```

## Next Steps

1. Create services for your domain models
2. Set environment variables
3. Integrate with HTMX using data attributes
4. Test cache hit rates
5. Optimize TTLs based on usage
6. Add monitoring and logging
7. Deploy backend API
8. Monitor in production

## Resources

- [API Client Docs](backend-api-setup.md)
- [State Management Docs](state-management.md)
- [Implementation Guide](stage-management-implementation.md)
- [HTTP Caching Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
