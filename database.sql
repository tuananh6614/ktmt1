-- Tạo bảng courses
CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail VARCHAR(255),
    status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tạo bảng chapters
CREATE TABLE chapters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    chapter_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Tạo bảng lessons
CREATE TABLE lessons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    chapter_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    lesson_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
);

-- Tạo bảng pages
CREATE TABLE pages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lesson_id INT NOT NULL,
    page_number INT NOT NULL,
    page_type ENUM('text', 'video', 'other') DEFAULT 'text',
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- Thêm dữ liệu mẫu
-- Thêm khóa học
INSERT INTO courses (title, description, thumbnail, status) VALUES 
('Vi điều khiển STM32', 'Khóa học này cung cấp kiến thức từ cơ bản đến nâng cao về vi điều khiển STM32...', 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34', 'active');

-- Thêm các chương
INSERT INTO chapters (course_id, title, chapter_order) VALUES
(1, 'Giới thiệu về STM32', 1),
(1, 'Lập trình GPIO', 2),
(1, 'Timer và PWM', 3);

-- Thêm các bài học
INSERT INTO lessons (chapter_id, title, lesson_order) VALUES
-- Chương 1
(1, 'Tổng quan về vi điều khiển STM32', 1),
(1, 'Cài đặt môi trường phát triển', 2),
(1, 'Tạo project đầu tiên', 3),

-- Chương 2
(2, 'Cấu trúc GPIO trên STM32', 1),
(2, 'Điều khiển LED', 2),
(2, 'Đọc nút nhấn', 3),

-- Chương 3
(3, 'Giới thiệu về Timer', 1),
(3, 'Cấu hình PWM cơ bản', 2),
(3, 'Ứng dụng PWM điều khiển động cơ', 3);

-- Thêm các trang
INSERT INTO pages (lesson_id, page_number, page_type, content) VALUES
-- Bài 1 của Chương 1
(1, 1, 'text', 'STM32 là dòng vi điều khiển 32-bit sử dụng lõi ARM Cortex-M...'),
(1, 2, 'video', 'https://example.com/video1.mp4'),
(1, 3, 'text', 'Ưu điểm của STM32 so với các dòng vi điều khiển khác...'),

-- Bài 2 của Chương 1
(2, 1, 'text', 'Hướng dẫn cài đặt STM32CubeIDE...'),
(2, 2, 'video', 'https://example.com/video2.mp4'),

-- Bài 3 của Chương 1
(3, 1, 'text', 'Các bước tạo project mới trong STM32CubeIDE...'),
(3, 2, 'video', 'https://example.com/video3.mp4'),

-- Bài 1 của Chương 2
(4, 1, 'text', 'Cấu trúc và nguyên lý hoạt động của GPIO...'),
(4, 2, 'video', 'https://example.com/video4.mp4'),

-- Bài 2 của Chương 2
(5, 1, 'text', 'Hướng dẫn cấu hình GPIO để điều khiển LED...'),
(5, 2, 'video', 'https://example.com/video5.mp4'),

-- Bài 3 của Chương 2
(6, 1, 'text', 'Cấu hình GPIO Input để đọc nút nhấn...'),
(6, 2, 'video', 'https://example.com/video6.mp4'),

-- Bài 1 của Chương 3
(7, 1, 'text', 'Tổng quan về Timer trong STM32...'),
(7, 2, 'video', 'https://example.com/video7.mp4'),

-- Bài 2 của Chương 3
(8, 1, 'text', 'Các bước cấu hình PWM cơ bản...'),
(8, 2, 'video', 'https://example.com/video8.mp4'),

-- Bài 3 của Chương 3
(9, 1, 'text', 'Ứng dụng PWM để điều khiển tốc độ động cơ DC...'),
(9, 2, 'video', 'https://example.com/video9.mp4'); 