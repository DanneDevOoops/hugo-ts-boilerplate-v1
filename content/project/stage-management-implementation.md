---
title: 'State Management Implementation Guide'
date: '2026-03-25T00:00:00+01:00'
lastmod: '2026-03-25T00:00:00+01:00'
draft: false

description: 'Step-by-step implementation guide for integrating state management patterns, services, and workflows in this project.'
slug: 'stage-management-implementation'

tags:
  - 'project'
  - 'state-management'
  - 'implementation'
  - 'typescript'
  - 'hugo'
  - 'htmx'

categories:
  - 'Guidelines'
  - 'Architecture'

showDate: true
showAuthor: true
showReadingTime: true
showTableOfContents: true
---

## Quick Start

### 1. Environment Setup

Add these to your `.env.dev`:

```bash
# API Configuration
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# Cache Configuration
VITE_CACHE_TTL=300000  # 5 minutes in milliseconds
```

### 2. Basic Usage in Components

#### Fetching Data with Cache

```typescript
import { userService } from '../services/user.service';
import { appStore } from '../store/app-store';

// Fetch users (will use cache if available)
const users = await userService.fetchUsers();

// Update store
appStore.setState({ users });
```

#### Using Stale-While-Revalidate Pattern

```typescript
// Returns cached data immediately, revalidates in background
const { data, fromCache } = await cacheManager.swr('users:list', async () => {
  const response = await apiClient.get('/users');
  return response.data;
});

console.log('Data from cache?', fromCache);
```

#### Subscribing to State Changes

```typescript
// In component setup
const unsubscribe = useStore((state) => {
  console.log('Store changed:', state);
  // Update DOM here
});

// Cleanup
unsubscribe();
```

### 3. HTMX Integration

#### Option A: Cache Invalidation with Attributes

In your HTML templates, use data attributes to manage caching:

```html
<!-- Invalidate cache on successful swap -->
<div hx-post="/users/create" data-invalidate="user:list:*" hx-target="#user-list">
  Create User Form
</div>

<!-- Auto-refresh data after mutation -->
<button hx-post="/users/1/delete" data-invalidate="user:*" data-auto-refresh="true">
  Delete User
</button>
```

#### Option B: Listen to HTMX Events

```typescript
// Listen to HTMX swap events
document.body.addEventListener('htmx:afterSwap', (event) => {
  const target = (event as CustomEvent).detail.target;

  // Invalidate cache if needed
  if (target.getAttribute('data-invalidate')) {
    cacheManager.invalidatePattern(target.getAttribute('data-invalidate')!);
  }
});
```

### 4. Creating Your Own Service

Follow the `UserService` pattern for your domain models:

```typescript
// src/services/post.service.ts
import { apiClient } from '../api/api-client';
import { cacheManager } from '../store/cache-manager';
import { appStore } from '../store/app-store';

export class PostService {
  private cacheKeyPrefix = 'post';
  private cacheTTL = 10 * 60 * 1000; // 10 minutes

  async fetchPost(id: string): Promise<Post> {
    const cacheKey = `${this.cacheKeyPrefix}:${id}`;

    // Check cache first
    const cached = cacheManager.get<Post>(cacheKey);
    if (cached) return cached;

    // Fetch and deduplicate requests
    const post = await cacheManager.deduplicate(cacheKey, async () => {
      const response = await apiClient.get<Post>(`/posts/${id}`);
      return response.data;
    });

    cacheManager.set(cacheKey, post, this.cacheTTL);
    return post;
  }

  async createPost(data: CreatePostInput): Promise<Post> {
    // Use performAction for mutations with loading state
    return await appStore.performAction(
      'CREATE_POST',
      async () => {
        const response = await apiClient.post<Post>('/posts', data);
        // Invalidate list cache
        cacheManager.invalidatePattern(`${this.cacheKeyPrefix}:list:*`);
        return response.data;
      },
      'post.create', // Updates store.post.create.loading and .error
    );
  }

  async updatePost(id: string, updates: Partial<Post>): Promise<Post> {
    return await appStore.performAction(
      'UPDATE_POST',
      async () => {
        const response = await apiClient.patch<Post>(`/posts/${id}`, updates);
        // Invalidate related caches
        cacheManager.invalidate(`${this.cacheKeyPrefix}:${id}`);
        cacheManager.invalidatePattern(`${this.cacheKeyPrefix}:list:*`);
        return response.data;
      },
      'post.update',
    );
  }
}

export const postService = new PostService();
```

## Caching Strategies by Data Type

### Real-time Data (Chat, Notifications)

```typescript
// No cache, listen to events
userService.subscribeToNotifications((notification) => {
  appStore.setState({
    notifications: [notification, ...appStore.get('notifications')],
  });
});
```

### Frequently Updated Data (Cart, Wishlist)

```typescript
// Short TTL + Stale-While-Revalidate
const { data } = await cacheManager.swr(
  'cart',
  () => apiClient.get('/cart'),
  1 * 60 * 1000, // 1 minute
);
```

### Stable Data (User Profile, Settings)

```typescript
// Longer TTL, invalidate on update
const profile = await userService.fetchProfile();
// Cache for 30 minutes
cacheManager.set('profile', profile, 30 * 60 * 1000);
```

### Static Data (Categories, Taxonomies)

```typescript
// Very long TTL, or permanent cache
const categories = await categoryService.fetchCategories();
cacheManager.set('categories', categories, 24 * 60 * 60 * 1000); // 24 hours
```

## Error Handling

### Network Errors

```typescript
import { NetworkError, TimeoutError } from '../api/api-client';

try {
  const user = await userService.fetchUser(id);
} catch (error) {
  if (error instanceof NetworkError) {
    // Try cached version
    const cached = cacheManager.get(`user:${id}`);
    if (cached) return cached;

    console.error('Network error:', error.status);
  } else if (error instanceof TimeoutError) {
    console.error('Request timed out');
  } else {
    console.error('Unknown error:', error);
  }
}
```

### Handling in Store

```typescript
// performAction automatically manages error state
await appStore.performAction(
  'FETCH_USERS',
  () => userService.fetchUsers(),
  'users', // Creates users.loading and users.error in store
);

// Check error state
const errorState = appStore.get('users');
if (errorState && (errorState as Record<string, unknown>).error) {
  console.log('Error:', (errorState as Record<string, unknown>).error);
}
```

## Debugging

### View Cache Stats

```typescript
// In browser console
cacheManager.getStats();
// Output: { size: 5, entries: ['user:1', 'user:list', ...] }
```

### View Action History

```typescript
// In browser console
appStore.getActionHistory();
// Shows all state mutations with timestamps
```

### Monitor Store State

```typescript
// Subscribe to all changes
useStore((state) => {
  console.log('Current store:', state);
});
```

### Clear Everything

```typescript
// Full reset
cacheManager.clear();
appStore.reset();
```

## Performance Tips

1. **Set appropriate TTLs** - Don't cache too long, but not too short
2. **Use request deduplication** - Automatically built in for identical requests
3. **Implement SWR** - Show cached data while revalidating
4. **Clear cache on mutations** - Invalidate related cache entries
5. **Monitor cache hit rates** - Adjust TTLs based on usage patterns

## Testing

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { userService } from '../services/user.service';
import { cacheManager } from '../store/cache-manager';

describe('UserService', () => {
  beforeEach(() => {
    cacheManager.clear();
  });

  it('should cache user data', async () => {
    const user = await userService.fetchUser('1');

    // Second call should use cache
    const cached = cacheManager.get('user:1');
    expect(cached).toEqual(user);
  });

  it('should invalidate cache on update', async () => {
    await userService.fetchUser('1');
    expect(cacheManager.has('user:1')).toBe(true);

    // Update invalidates cache
    await userService.updateUser('1', { name: 'New Name' });
    expect(cacheManager.has('user:1')).toBe(false);
  });
});
```

## Next Steps

1. ✅ Set up environment variables
2. ✅ Create services for your domain models
3. ✅ Integrate with HTMX using data attributes
4. ✅ Test cache hit rates
5. ✅ Optimize TTLs based on real usage
6. ✅ Add error boundaries and fallbacks
7. ✅ Monitor performance in production
