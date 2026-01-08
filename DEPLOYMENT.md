# 🚀 Hướng Dẫn Docker Deployment với HTTPS

## Yêu Cầu

- Docker Engine 20.10+
- Docker Compose 2.0+
- Tối thiểu 4GB RAM
- Domain đã trỏ về VPS IP

## 🔧 Các Bước Deploy

### 1. Clone và cấu hình

```bash
git clone https://github.com/your-repo/realtime-chat.git
cd realtime-chat

# Tạo file .env từ template
cp .env.production .env

# QUAN TRỌNG: Đổi password và key!
nano .env
```

**Bắt buộc thay đổi trong `.env`:**

```bash
# Tạo password SQL mạnh
SA_PASSWORD=$(openssl rand -base64 24)

# Tạo JWT key mạnh
JWT_KEY=$(openssl rand -base64 32)
```

### 2. Trỏ DNS

Thêm A record:

```
chat.cloverhand.click → 164.152.167.138
```

### 3. Chạy script khởi tạo SSL

```bash
# Sửa email trong script
nano init-ssl.sh

# Chạy script
chmod +x init-ssl.sh
./init-ssl.sh
```

### Hoặc làm thủ công:

```bash
# Bước 1: Copy config HTTP tạm
cp nginx/nginx-init.conf nginx/nginx.conf

# Bước 2: Tạo thư mục cho Certbot
mkdir -p certbot/conf certbot/www

# Bước 3: Build và chạy
docker compose build
docker compose up -d

# Bước 4: Lấy SSL Certificate
docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email tranthecong99@gmail.com \
    --agree-tos \
    --no-eff-email \
    -d chat.cloverhand.click

# Bước 5: Copy config HTTPS
# (file nginx/nginx.conf gốc đã có cấu hình SSL)

# Bước 6: Reload Nginx
docker compose exec nginx nginx -s reload
```

## 🌐 Truy Cập

| Service     | URL                                   |
| ----------- | ------------------------------------- |
| Frontend    | https://chat.cloverhand.click         |
| Backend API | https://chat.cloverhand.click/api     |
| SignalR Hub | wss://chat.cloverhand.click/hubs/chat |

## 🔒 Bảo Mật Đã Áp Dụng

- ✅ SQL Server không expose ra internet
- ✅ Backend API chỉ truy cập qua Nginx
- ✅ HTTPS với Let's Encrypt SSL
- ✅ Security headers (X-Frame-Options, etc.)
- ✅ Non-root user trong containers

## 🔄 Các Lệnh Hữu Ích

```bash
# Xem logs
docker compose logs -f

# Restart tất cả
docker compose restart

# Rebuild một service
docker compose build frontend
docker compose up -d frontend

# Gia hạn SSL (tự động bởi certbot container)
docker compose run --rm certbot renew
```

## ❗ Troubleshooting

### SSL không hoạt động

- Kiểm tra DNS đã propagate: `nslookup chat.cloverhand.click`
- Kiểm tra firewall mở port 80, 443

### WebSocket không kết nối

- Kiểm tra Nginx config có `proxy_set_header Upgrade`
- Xem logs: `docker compose logs nginx`
