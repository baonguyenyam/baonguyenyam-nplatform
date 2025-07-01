# Performance Optimization Guide - nPlatform

## Tổng quan các cải thiện đã thực hiện

### 1. Database Performance Optimization

#### A. Thêm Database Indexes
- **User model**: Thêm indexes cho `email`, `role`, `published`, `createdAt`, `name`
- **Post model**: Thêm indexes cho `published`, `status`, `type`, `slug`, `title`, `createdAt`
- **Category model**: Thêm indexes cho `published`, `parent`, `type`, `status`, `slug`, `title`, `createdAt`
- **Order model**: Thêm indexes cho `status`, `published`, `total`, `createdAt`, `date_created`, `date_paid`, `date_completed`
- **Customer model**: Thêm indexes cho `email`, `type`, `published`, `name`, `company`, `createdAt`

#### B. Query Optimization
- Sử dụng `select` thay vì trả về toàn bộ object
- Thêm pagination mặc định (limit 20 items)
- Tối ưu hóa WHERE conditions
- Sử dụng parallel queries với `Promise.all`

### 2. Caching Implementation

#### A. Database Cache (`/src/lib/db-cache.ts`)
- In-memory caching cho các queries thường xuyên
- TTL (Time To Live) khác nhau cho từng loại data:
  - Default: 5 phút
  - User data: 15 phút
  - Static data: 30 phút
- Cache invalidation khi có mutations

#### B. Cached Functions
- `cachedGetUserById`
- `cachedGetUserByEmail`
- `cachedGetPostBySlug`
- `cachedGetSettings`
- `cachedGetCategories`

### 3. API Response Optimization

#### A. Standardized API Responses (`/src/lib/api-helpers.ts`)
- Consistent response format
- Built-in pagination support
- Error handling helpers
- Cache headers for better browser caching

#### B. Response Headers
- `Cache-Control`: Public caching với stale-while-revalidate
- Security headers: XSS protection, frame options, content type
- Rate limiting headers

### 4. Rate Limiting

#### A. Implementation (`/src/lib/rate-limiter.ts`)
- In-memory rate limiter
- Different limits based on user role:
  - Public: 100 requests/15 minutes
  - Authenticated: 500 requests/15 minutes
  - Admin: 1000 requests/15 minutes

#### B. Middleware Integration
- Automatic rate limiting cho tất cả API routes
- Headers thông báo remaining requests
- 429 status code khi exceed limit

### 5. Next.js Configuration Optimization

#### A. Image Optimization
- WebP và AVIF formats
- Responsive sizes
- 1 year cache TTL
- SVG security policies

#### B. Webpack Optimization
- Code splitting optimization
- Vendor chunk separation
- Common chunk reuse

#### C. Experimental Features
- Partial Prerendering (PPR)
- Package import optimization
- CSS chunking
- Memory optimizations

## Cách sử dụng các cải thiện

### 1. Database Queries
```typescript
// Trước
const users = await db.user.findMany();

// Sau - với caching và optimization
const users = await models.User.getAllUsers({
  take: 20,
  skip: 0,
  s: searchTerm,
  published: true
});
```

### 2. API Responses
```typescript
// Trước
return new Response(JSON.stringify({ data, success: true }));

// Sau - standardized
return successResponse(data, 'Success message', count, pagination);
```

### 3. Caching
```typescript
// Sử dụng cached functions
const user = await cachedGetUserById(userId);
const post = await cachedGetPostBySlug(slug);

// Clear cache khi update
clearCache('user-by-id:' + userId);
```

## Performance Metrics Expected

### 1. Database Performance
- **Query time reduction**: 40-60% cho các queries thường xuyên
- **Index usage**: Tăng efficiency cho WHERE, ORDER BY clauses
- **Connection optimization**: Giảm database load

### 2. API Response Time
- **Cached responses**: 80-90% faster cho repeated requests
- **Pagination**: Consistent response times với large datasets
- **Parallel queries**: 30-50% faster cho complex data fetching

### 3. Client-side Performance
- **Browser caching**: Giảm network requests
- **Image optimization**: 40-60% file size reduction
- **Code splitting**: Faster initial page load

## Environment Variables cần thiết

```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..." # Optional cho connection pooling

# File Upload
MAX_FILE_SIZE="10mb"

# Performance
NODE_ENV="production" # Enables production optimizations
```

## Monitoring và Debug

### 1. Rate Limiting Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1641024000
```

### 2. Cache Debug
```typescript
// Check cache status
console.log('Cache size:', cache.size);

// Manual cache clear
clearCache(); // Clear all
clearCache('user'); // Clear user-related cache
```

### 3. Database Query Analysis
- Sử dụng Prisma Studio để monitor query performance
- Enable database query logging trong development

## Bước tiếp theo để cải thiện thêm

### 1. Redis Cache (Production)
- Thay thế in-memory cache bằng Redis
- Shared cache across multiple instances
- Persistent cache across restarts

### 2. CDN Integration
- Static assets delivery
- Edge caching cho API responses
- Geographic performance optimization

### 3. Database Connection Pooling
- PgBouncer cho PostgreSQL
- Connection optimization
- Load balancing

### 4. Advanced Monitoring
- Application Performance Monitoring (APM)
- Database performance tracking
- Real-time metrics dashboard

## Lưu ý quan trọng

1. **Database Migration**: Cần chạy migration để apply indexes mới
2. **Memory Usage**: In-memory cache sẽ tăng RAM usage
3. **Development vs Production**: Các settings cache khác nhau
4. **Backward Compatibility**: API response format có thay đổi nhỏ

Các cải thiện này sẽ giúp nPlatform chạy nhanh hơn đáng kể, đặc biệt với large datasets và high traffic scenarios.
