# 🚀 Hướng Dẫn Docker Deployment

Hướng dẫn chi tiết để deploy Realtime Chat Application lên VPS sử dụng Docker.

## 📋 Yêu Cầu

- Docker Engine 20.10+
- Docker Compose 2.0+
- Tối thiểu 2GB RAM (khuyến nghị 4GB cho SQL Server)
- 10GB disk space

## 🔧 Cài Đặt Nhanh

### 1. Clone Repository

```bash
git clone https://github.com/your-repo/realtime-chat.git
cd realtime-chat
```

### 2. Cấu Hình Environment

```bash
# Copy file cấu hình mẫu
cp .env.docker.example .env

# Chỉnh sửa file .env với thông tin của bạn
nano .env
```

**Quan trọng:** Thay đổi các giá trị sau trong file `.env`:

| Variable              | Mô tả                           | Ví dụ                                |
| --------------------- | ------------------------------- | ------------------------------------ |
| `SA_PASSWORD`         | Mật khẩu SQL Server (phải mạnh) | `YourStrong!Passw0rd123`             |
| `JWT_KEY`             | Secret key cho JWT              | `your-super-secret-key-min-32-chars` |
| `NEXT_PUBLIC_API_URL` | URL của backend API             | `http://your-domain.com:5053`        |

### 3. Build và Chạy

```bash
# Build tất cả images
docker-compose build

# Chạy services (background mode)
docker-compose up -d

# Xem logs
docker-compose logs -f
```

### 4. Kiểm Tra Trạng Thái

```bash
# Xem status của containers
docker-compose ps

# Kiểm tra health của backend
curl http://localhost:5053/health
```

## 🌐 Truy Cập Services

| Service     | URL                           | Mô tả                   |
| ----------- | ----------------------------- | ----------------------- |
| Frontend    | http://localhost:3000         | Giao diện người dùng    |
| Backend API | http://localhost:5053         | REST API                |
| Swagger     | http://localhost:5053/swagger | API Documentation       |
| SQL Server  | localhost:1433                | Database (chỉ internal) |

## 🔒 Cấu Hình Production

### Sử Dụng Nginx Reverse Proxy

Tạo file `nginx.conf`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5053;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # SignalR Hub
    location /hubs {
        proxy_pass http://localhost:5053;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL/HTTPS với Certbot

```bash
# Cài đặt certbot
sudo apt install certbot python3-certbot-nginx

# Tạo certificate
sudo certbot --nginx -d your-domain.com
```

## 🛠️ Các Lệnh Hữu Ích

```bash
# Dừng tất cả services
docker-compose down

# Dừng và xóa volumes (CẢNH BÁO: xóa dữ liệu)
docker-compose down -v

# Rebuild một service cụ thể
docker-compose build backend
docker-compose up -d backend

# Xem logs của một service
docker-compose logs -f backend

# Truy cập shell của container
docker-compose exec backend bash
docker-compose exec db /bin/bash

# Kết nối SQL Server
docker-compose exec db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'YourPassword' -C
```

## 📊 Database Migration

Để chạy Entity Framework migrations trong Docker:

```bash
# Truy cập container backend
docker-compose exec backend bash

# Hoặc chạy migration từ local với connection string tới Docker
dotnet ef database update --connection "Server=localhost,1433;Database=CoongChatDB;User Id=sa;Password=YourPassword;TrustServerCertificate=True"
```

## 🔄 Cập Nhật Ứng Dụng

```bash
# Pull code mới
git pull origin main

# Rebuild và restart
docker-compose build
docker-compose up -d
```

## ❗ Troubleshooting

### SQL Server không khởi động

- Kiểm tra password đủ mạnh (ít nhất 8 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt)
- Kiểm tra RAM >= 2GB
- Xem logs: `docker-compose logs db`

### Backend không kết nối được database

- Đợi SQL Server healthy (khoảng 30-60 giây sau khi start)
- Kiểm tra connection string trong file `.env`
- Xem logs: `docker-compose logs backend`

### Frontend không kết nối được backend

- Kiểm tra `NEXT_PUBLIC_API_URL` trong file `.env`
- Đảm bảo backend đã chạy và healthy
- Kiểm tra CORS configuration

### Xóa và tạo lại từ đầu

```bash
docker-compose down -v
docker system prune -a
docker-compose build --no-cache
docker-compose up -d
```

## 📁 Cấu Trúc Volumes

| Volume           | Đường dẫn Container    | Mô tả              |
| ---------------- | ---------------------- | ------------------ |
| `sqlserver_data` | `/var/opt/mssql`       | Dữ liệu SQL Server |
| `uploads_data`   | `/app/wwwroot/uploads` | File uploads       |

## 🔐 Bảo Mật

1. **Thay đổi mật khẩu mặc định** - Không sử dụng mật khẩu trong file example
2. **Sử dụng HTTPS** - Cấu hình SSL certificate cho production
3. **Firewall** - Chỉ mở ports cần thiết (80, 443)
4. **Backup định kỳ** - Sao lưu database và uploads

## 📞 Hỗ Trợ

Nếu gặp vấn đề, vui lòng tạo issue trên GitHub repository.
