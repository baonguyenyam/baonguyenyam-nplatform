# Standalone Deployment Guide

Dự án này đã được cấu hình để có thể chạy dạng **standalone** - nghĩa là có thể chạy độc lập mà không cần Vercel hoặc bất kỳ platform nào khác.

## 🚀 Cách sử dụng

### 1. Build Standalone

```bash
# Sử dụng script có sẵn
npm run build:standalone

# Hoặc chạy trực tiếp
./cmd/build-standalone.sh
```

### 2. Chạy Standalone

```bash
# Sử dụng script có sẵn
npm run start:standalone

# Hoặc chạy trực tiếp
./cmd/start-standalone.sh
```

### 3. Deploy lên Server

#### Bước 1: Copy files cần thiết lên server
```bash
# Copy toàn bộ thư mục standalone
scp -r .next/standalone/ user@your-server:/path/to/app/

# Copy static files
scp -r .next/static/ user@your-server:/path/to/app/.next/

# Copy public files
scp -r public/ user@your-server:/path/to/app/
```

#### Bước 2: Cài đặt Node.js trên server (nếu chưa có)
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs
```

#### Bước 3: Set environment variables
```bash
# Tạo file .env hoặc set environment variables
export DATABASE_URL="your_database_url"
export NEXTAUTH_SECRET="your_secret"
export NEXTAUTH_URL="http://your-domain.com"
export PORT=3000
# ... các variables khác
```

#### Bước 4: Chạy ứng dụng
```bash
cd /path/to/app
node server.js
```

## 🐳 Sử dụng Docker

### Build Docker image
```bash
docker build -t nplatform .
```

### Chạy với Docker
```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="your_database_url" \
  -e NEXTAUTH_SECRET="your_secret" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  nplatform
```

### Chạy với Docker Compose
```bash
docker-compose up -d
```

## 🔧 Production Setup

### 1. Sử dụng Process Manager (PM2)
```bash
# Cài đặt PM2
npm install -g pm2

# Tạo ecosystem file
echo 'module.exports = {
  apps: [{
    name: "nplatform",
    script: "server.js",
    instances: "max",
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production",
      PORT: 3000
    }
  }]
}' > ecosystem.config.js

# Chạy với PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 2. Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📋 Environment Variables cần thiết

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://your-domain.com"

# Google OAuth (nếu sử dụng)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth (nếu sử dụng)
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"

# Email (nếu sử dụng)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@your-domain.com"

# File Upload
MAX_FILE_SIZE="10mb"

# API
PUBLIC_API_URL="http://your-domain.com/api"
```

## ✅ Ưu điểm của Standalone

1. **Độc lập hoàn toàn**: Không phụ thuộc vào Vercel hay platform nào
2. **Performance tốt**: Tất cả API routes hoạt động bình thường
3. **Dễ deploy**: Chỉ cần Node.js runtime
4. **Kiểm soát hoàn toàn**: Có thể tùy chỉnh server configuration
5. **Cost-effective**: Không bị giới hạn bởi platform pricing

## 🔍 Kiểm tra

Sau khi deploy, bạn có thể kiểm tra:

1. **Frontend**: `http://your-domain.com`
2. **API Health**: `http://your-domain.com/api/v1`
3. **Admin API**: `http://your-domain.com/api/v1/admin`
4. **Public API**: `http://your-domain.com/api/v1/public`

Tất cả các API routes sẽ hoạt động bình thường như khi chạy trên Vercel!
