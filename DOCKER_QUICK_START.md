# 🐳 Quick Start với Docker

## Khởi động nhanh

### 1. Chỉ cần 3 bước đơn giản:

```bash
# Bước 1: Khởi động PostgreSQL trong Docker
npm run docker:start

# Bước 2: Chuyển sang Docker environment
./cmd/env-switch.sh docker

# Bước 3: Chạy development server
npm run dev
```

### 2. Hoặc sử dụng script tự động:

```bash
# Setup hoàn chỉnh (database + migration + seed)
npm run docker:setup

# Chạy development với Docker database
npm run docker:dev
```

## Tại sao sử dụng Docker?

✅ **Không cần cài PostgreSQL lên máy** - Khỏi lo về version, conflict hay setup phức tạp  
✅ **Môi trường nhất quán** - Database giống hệt production  
✅ **Dễ dàng reset** - Xóa và tạo lại database trong vài giây  
✅ **Chia sẻ dễ dàng** - Team khác chỉ cần clone và chạy  

## Commands

| Script | Mô tả |
|--------|-------|
| `npm run docker:start` | Khởi động PostgreSQL |
| `npm run docker:stop` | Dừng PostgreSQL |
| `npm run docker:setup` | Setup hoàn chỉnh (DB + migration + seed) |
| `npm run docker:dev` | Chạy dev với Docker DB |
| `npm run docker:clean` | Xóa toàn bộ Docker data |

## Thông tin Database

- **Host**: localhost
- **Port**: 5435
- **Database**: madeplatform  
- **User**: postgres
- **Password**: root
- **URL**: `postgresql://postgres:root@localhost:5435/madeplatform`

## Troubleshooting

### Nếu port bị conflict
```bash
# Thay đổi port trong docker-compose.yml
ports:
  - "5436:5432"  # Thay đổi số đầu
```

### Reset database
```bash
npm run docker:clean  # Xóa toàn bộ
npm run docker:setup  # Setup lại từ đầu
```

### Xem logs
```bash
./cmd/docker.sh logs
```

## Chi tiết

Xem file [DOCKER_SETUP.md](./DOCKER_SETUP.md) để biết thêm chi tiết.
