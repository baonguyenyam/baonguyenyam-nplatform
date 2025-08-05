# Docker Setup cho nPlatform

## Cài đặt và sử dụng

### 1. Khởi động PostgreSQL Database

```bash
# Khởi động database
./cmd/docker.sh start

# Hoặc sử dụng docker-compose trực tiếp
docker-compose up -d postgres
```

### 2. Kiểm tra trạng thái

```bash
# Xem trạng thái services
./cmd/docker.sh status

# Xem logs của PostgreSQL
./cmd/docker.sh logs
```

### 3. Chạy migration

```bash
# Sau khi database đã khởi động, chạy Prisma migrations
npm run prisma:migrate:dev
```

### 4. Kết nối database

Database sẽ có sẵn tại:

- **Host**: localhost
- **Port**: 5435
- **Database**: madeplatform
- **User**: postgres
- **Password**: root

Connection string:

```env
postgresql://postgres:root@localhost:5435/madeplatform
```

### 5. Quản lý Docker

```bash
# Khởi động services
./cmd/docker.sh start

# Dừng services
./cmd/docker.sh stop

# Restart services
./cmd/docker.sh restart

# Xem logs
./cmd/docker.sh logs

# Kết nối database shell
./cmd/docker.sh shell

# Reset database (xóa toàn bộ data)
./cmd/docker.sh reset

# Xem trạng thái
./cmd/docker.sh status
```

### 6. Chạy ứng dụng

```bash
# Sau khi database đã khởi động
npm run dev
```

## Lưu ý

- Database data sẽ được lưu trong Docker volume `postgres_data`
- File `.env.docker` chứa cấu hình environment cho Docker
- Khi reset database, toàn bộ data sẽ bị xóa
- PostgreSQL sẽ tự động khởi tạo database `madeplatform` khi lần đầu chạy

## Troubleshooting

### Database không kết nối được

```bash
# Kiểm tra trạng thái container
docker-compose ps

# Xem logs lỗi
docker-compose logs postgres

# Restart database
./cmd/docker.sh restart
```

### Port 5432 đã được sử dụng

Nếu bạn đã có PostgreSQL cài trên máy, hãy thay đổi port trong `docker-compose.yml`:

```yaml
ports:
  - "5433:5432"  # Thay đổi port bên trái
```

Và cập nhật DATABASE_URL trong `.env`:

```env
DATABASE_URL="postgresql://postgres:root@localhost:5433/madeplatform"
```
