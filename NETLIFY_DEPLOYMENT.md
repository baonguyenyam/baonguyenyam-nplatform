# Netlify Deployment Guide

Hướng dẫn deploy dự án Next.js standalone lên Netlify.

## Chuẩn bị

1. **Tài khoản Netlify**: Đảm bảo bạn có tài khoản [Netlify](https://netlify.com)
2. **Database**: Thiết lập database (Supabase, PlanetScale, hoặc PostgreSQL)
3. **Environment Variables**: Chuẩn bị các biến môi trường cần thiết

## Bước 1: Cấu hình Environment Variables

Truy cập Netlify Dashboard → Site Settings → Environment Variables và thêm:

```bash
# Database
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_database_url

# Authentication
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=https://your-site.netlify.app

# API
PUBLIC_API_URL=https://your-site.netlify.app/api

# Other required variables
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

## Bước 2: Deploy Methods

### Method 1: Git Integration (Recommended)

1. Push code lên GitHub/GitLab
2. Tại Netlify Dashboard: New site from Git
3. Chọn repository
4. Build settings sẽ tự động được detect từ `netlify.toml`

### Method 2: Manual Deploy

```bash
# Build for Netlify
npm run build:netlify

# Deploy using Netlify CLI
npx netlify deploy --dir=.netlify --prod
```

### Method 3: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Link site
netlify link

# Deploy
netlify deploy --build --prod
```

## Bước 3: Sau khi Deploy

1. **Database Migration**: Chạy migration nếu cần:
   ```bash
   npx prisma migrate deploy
   ```

2. **Seed Data**: Nếu cần dữ liệu mẫu:
   ```bash
   npx prisma db seed
   ```

3. **Test**: Kiểm tra website tại URL Netlify

## Build Commands

- `npm run build:netlify` - Build cho Netlify
- `npm run build:standalone` - Build standalone thông thường
- `npm run dev` - Development mode

## Troubleshooting

### Build Errors

1. **Prisma Issues**: 
   ```bash
   npx prisma generate --no-engine
   ```

2. **Memory Issues**: Tăng Node memory trong build command:
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" npm run build:netlify
   ```

3. **Dependencies**: Sử dụng legacy peer deps:
   ```bash
   npm install --legacy-peer-deps
   ```

### Runtime Errors

1. **Database Connection**: Kiểm tra DATABASE_URL
2. **Environment Variables**: Đảm bảo tất cả biến môi trường đã được set
3. **API Routes**: Kiểm tra logs tại Netlify Functions

## Performance Optimization

1. **Static Generation**: Sử dụng `getStaticProps` khi có thể
2. **Image Optimization**: Sử dụng Next.js Image component
3. **Bundle Analysis**: Chạy `npm run bundle:analyze`

## Monitoring

- **Netlify Analytics**: Bật tại Site Settings
- **Error Tracking**: Tích hợp Sentry hoặc LogRocket
- **Performance**: Sử dụng Web Vitals

## Support

Nếu gặp vấn đề, kiểm tra:
1. Netlify build logs
2. Function logs tại Netlify Dashboard
3. Browser console cho client errors
