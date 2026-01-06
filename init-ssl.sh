#!/bin/bash
# ==============================================
# Script lấy SSL Certificate từ Let's Encrypt
# Domain: chat.cloverhand.click
# ==============================================

set -e

DOMAIN="chat.cloverhand.click"
EMAIL="tranthecong99@gmail.com" 

echo "=== Bước 1: Copy nginx-init.conf (HTTP only) ==="
cp nginx/nginx-init.conf nginx/nginx.conf

echo "=== Bước 2: Tạo thư mục cho Certbot ==="
mkdir -p certbot/conf certbot/www

echo "=== Bước 3: Khởi động services ==="
docker-compose up -d db backend frontend nginx

echo "=== Bước 4: Đợi services khởi động (30s) ==="
sleep 30

echo "=== Bước 5: Lấy SSL Certificate ==="
docker-compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN

echo "=== Bước 6: Copy nginx.conf (HTTPS) ==="
cp nginx/nginx.conf.bak nginx/nginx.conf 2>/dev/null || true
# Nếu có file nginx.conf gốc với SSL, copy lại
cat > nginx/nginx.conf << 'NGINX_CONF'
server {
    listen 80;
    server_name chat.cloverhand.click;
    
    location / {
        return 301 https://$server_name$request_uri;
    }

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
}

server {
    listen 443 ssl http2;
    server_name chat.cloverhand.click;

    ssl_certificate /etc/letsencrypt/live/chat.cloverhand.click/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/chat.cloverhand.click/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    location / {
        proxy_pass http://frontend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        proxy_pass http://backend:5053;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /hubs {
        proxy_pass http://backend:5053;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400s;
    }

    location /uploads {
        proxy_pass http://backend:5053;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /health {
        proxy_pass http://backend:5053;
    }
}
NGINX_CONF

echo "=== Bước 7: Reload Nginx với SSL ==="
docker-compose exec nginx nginx -s reload

echo "=== HOÀN TẤT! ==="
echo "Truy cập: https://chat.cloverhand.click"
