
# Hướng dẫn thiết lập và chạy backend

## Yêu cầu trước khi chạy
- XAMPP (đã cài đặt và chạy MySQL)
- Node.js v14.x hoặc cao hơn
- npm v6.x hoặc cao hơn

## Bước 1: Tạo cơ sở dữ liệu
1. Khởi động XAMPP Control Panel
2. Bật module MySQL
3. Mở PHPMyAdmin (http://localhost/phpmyadmin)
4. Tạo database mới với tên `dbktmt1`
5. Chạy đoạn SQL sau để tạo bảng users:

```sql
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,   
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(255) NOT NULL,
    `phone_number` VARCHAR(10) NOT NULL,
    `school` VARCHAR(255),   
    `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    `status` ENUM('active', 'inactive', 'banned') NOT NULL DEFAULT 'active',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);
```

## Bước 2: Cài đặt các dependency
Mở terminal trong thư mục `server` và chạy lệnh:

```bash
npm install
```

## Bước 3: Chỉnh sửa file .env (nếu cần)
File `.env` đã được tạo với các giá trị mặc định. Nếu cấu hình MySQL của bạn khác, hãy sửa các thông số sau:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=dbktmt1
```

## Bước 4: Chạy server
Trong thư mục `server`, chạy lệnh:

```bash
node index.js
```

Server sẽ chạy tại http://localhost:3001

## Các API endpoints

### Đăng ký
- **URL:** `POST /api/users/register`
- **Body:** `{ email, password, full_name, phone_number, school }`

### Đăng nhập
- **URL:** `POST /api/users/login`
- **Body:** `{ email, password }`

### Đăng xuất
- **URL:** `GET /api/users/logout`

### Lấy thông tin người dùng
- **URL:** `GET /api/users/me`
- **Header:** `Authorization: Bearer {token}`

### Cập nhật thông tin
- **URL:** `PUT /api/users/updatedetails`
- **Header:** `Authorization: Bearer {token}`
- **Body:** `{ full_name, phone_number, school }`

### Đổi mật khẩu
- **URL:** `PUT /api/users/updatepassword`
- **Header:** `Authorization: Bearer {token}`
- **Body:** `{ currentPassword, newPassword }`
