const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./config/database');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authController = require('./controllers/authController');
const auth = require('./middleware/auth');
const enrollmentController = require('./controllers/enrollmentController');
const questionController = require('./controllers/questionController');
const examController = require('./controllers/examController');
const adminAuth = require('./middleware/adminAuth');

// Thêm multer để xử lý upload file
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cấu hình multer cho avatar
const avatarStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/avatars/');
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const avatarUpload = multer({
    storage: avatarStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
    },
    fileFilter: function(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Chỉ chấp nhận file ảnh'));
        }
        cb(null, true);
    }
});

// Cấu hình multer cho thumbnail khóa học
const thumbnailStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Đảm bảo thư mục tồn tại
        const uploadDir = 'uploads/thumbnails/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'course-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const thumbnailUpload = multer({
    storage: thumbnailStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
    },
    fileFilter: function(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Chỉ chấp nhận file ảnh (jpg, jpeg, png, gif)'));
        }
        cb(null, true);
    }
});

// Cấu hình multer cho upload file đề thi
const examFileStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Đảm bảo thư mục tồn tại
        const uploadDir = 'uploads/exam_files/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'exam-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const examFileUpload = multer({
    storage: examFileStorage,
    limits: {
        fileSize: 10 * 1024 * 1024 // Giới hạn 10MB
    },
    fileFilter: function(req, file, cb) {
        // Chỉ cho phép file Word và PDF
        if (!file.originalname.match(/\.(doc|docx|pdf)$/)) {
            return cb(new Error('Chỉ chấp nhận file Word và PDF'));
        }
        cb(null, true);
    }
});

// Thêm middleware để phục vụ file tĩnh
const app = express();
app.use('/uploads', express.static('uploads'));
app.use('/documents', express.static('uploads/documents'));

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log('\n=== New Request ===');
    console.log(`Time: ${new Date().toLocaleString()}`);
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${req.url}`);
    console.log('Headers:', req.headers);
    if (req.method !== 'POST' || !req.url.includes('/upload')) {
        console.log('Body:', req.body);
    } else {
        console.log('Body: [Contains file upload data]');
    }
    console.log('==================\n');
    next();
});

// Auth routes
app.post('/api/register', authController.register);
app.post('/api/login', authController.login);

// API để lấy danh sách document categories
app.get('/api/document-categories', async(req, res) => {
    try {
        const [categories] = await db.execute('SELECT * FROM documents_categories ORDER BY category_name');
        res.json(categories);
    } catch (error) {
        console.error('Error fetching document categories:', error);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách danh mục tài liệu' });
    }
});

// API để lấy danh sách tài liệu (có thể lọc theo category_id)
app.get('/api/documents', async(req, res) => {
    try {
        const { category_id } = req.query;

        let query = `
      SELECT d.*, c.category_name 
      FROM documents d
      LEFT JOIN documents_categories c ON d.category_id = c.id
    `;

        const params = [];

        if (category_id) {
            query += ' WHERE d.category_id = ?';
            params.push(category_id);
        }

        query += ' ORDER BY d.created_at DESC';

        const [documents] = await db.execute(query, params);
        res.json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách tài liệu' });
    }
});

// API để thêm dữ liệu mẫu (chỉ sử dụng cho demo)
app.post('/api/seed-documents', async(req, res) => {
    try {
        // Kiểm tra đã có dữ liệu chưa
        const [existingDocs] = await db.execute('SELECT COUNT(*) as count FROM documents');

        if (existingDocs[0].count > 0) {
            return res.json({ message: 'Đã có dữ liệu mẫu, không cần thêm nữa' });
        }

        // Thêm dữ liệu mẫu
        const sampleDocs = [{
                title: 'Giáo trình Kỹ thuật máy tính cơ bản',
                description: 'Giáo trình đầy đủ về kiến thức cơ bản của kỹ thuật máy tính, bao gồm kiến trúc máy tính, tổ chức dữ liệu và thuật toán.',
                category_id: 1,
                price: 50000,
                file_path: '/uploads/documents/ktmt-basics.pdf'
            },
            {
                title: 'Kỹ thuật số - Từ cơ bản đến nâng cao',
                description: 'Tài liệu chuyên sâu về kỹ thuật số, bao gồm các hệ thống số, cổng logic, flip-flop và ứng dụng thực tế.',
                category_id: 2,
                price: 75000,
                file_path: '/uploads/documents/digital-electronics.pdf'
            },
            {
                title: 'Giáo trình Điện tử tương tự',
                description: 'Giới thiệu về các mạch điện tử tương tự, các linh kiện cơ bản và phân tích mạch điện tử.',
                category_id: 3,
                price: 65000,
                file_path: '/uploads/documents/analog-electronics.pdf'
            },
            {
                title: 'Lập trình Arduino cơ bản',
                description: 'Hướng dẫn chi tiết về lập trình vi điều khiển Arduino với các ví dụ thực tế và bài tập.',
                category_id: 4,
                price: 80000,
                file_path: '/uploads/documents/arduino-programming.pdf'
            },
            {
                title: 'Kỹ thuật điện - Lý thuyết và ứng dụng',
                description: 'Tài liệu tổng quan về kỹ thuật điện, các định luật cơ bản và ứng dụng trong thực tế.',
                category_id: 5,
                price: 60000,
                file_path: '/uploads/documents/electrical-engineering.pdf'
            }
        ];

        for (const doc of sampleDocs) {
            await db.execute(
                'INSERT INTO documents (title, description, category_id, price, file_path) VALUES (?, ?, ?, ?, ?)', [doc.title, doc.description, doc.category_id, doc.price, doc.file_path]
            );
        }

        res.json({ message: 'Đã thêm dữ liệu mẫu thành công', count: sampleDocs.length });
    } catch (error) {
        console.error('Error seeding documents:', error);
        res.status(500).json({ error: 'Lỗi khi thêm dữ liệu mẫu tài liệu' });
    }
});

// API để thêm danh mục tài liệu mẫu (chỉ sử dụng cho demo)
app.post('/api/seed-categories', async(req, res) => {
    try {
        // Kiểm tra đã có dữ liệu chưa
        const [existingCats] = await db.execute('SELECT COUNT(*) as count FROM documents_categories');

        if (existingCats[0].count > 0) {
            return res.json({ message: 'Đã có danh mục mẫu, không cần thêm nữa' });
        }

        // Thêm danh mục mẫu
        const sampleCategories = [
            'Kỹ thuật máy tính',
            'Điện tử số',
            'Điện tử tương tự',
            'Lập trình vi điều khiển',
            'Kỹ thuật điện'
        ];

        for (const category of sampleCategories) {
            await db.execute(
                'INSERT INTO documents_categories (category_name) VALUES (?)', [category]
            );
        }

        res.json({ message: 'Đã thêm danh mục mẫu thành công', count: sampleCategories.length });
    } catch (error) {
        console.error('Error seeding categories:', error);
        res.status(500).json({ error: 'Lỗi khi thêm danh mục mẫu' });
    }
});

// Protected routes
app.get('/api/profile', auth, async(req, res) => {
    try {
        const user = req.user;
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Lỗi khi lấy thông tin profile' });
    }
});

app.put('/api/profile/update', auth, async(req, res) => {
    try {
        const { full_name, school } = req.body;
        if (!full_name) {
            return res.status(400).json({ error: 'Tên không được để trống' });
        }

        console.log('Updating profile for user:', req.user.id);
        console.log('New name:', full_name);
        console.log('New school:', school);

        const [result] = await db.execute(
            'UPDATE users SET full_name = ?, school = ? WHERE id = ?', [full_name, school, req.user.id]
        );

        console.log('Update result:', result);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }

        res.json({
            message: 'Cập nhật thành công',
            user: {
                ...req.user,
                full_name,
                school
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Lỗi khi cập nhật thông tin' });
    }
});

app.put('/api/profile/change-password', auth, async(req, res) => {
    try {
        const { current_password, new_password } = req.body;

        if (!current_password || !new_password) {
            return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin' });
        }

        console.log('Changing password for user:', req.user.id);

        // Kiểm tra mật khẩu hiện tại
        const isMatch = await bcrypt.compare(current_password, req.user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Mật khẩu hiện tại không đúng' });
        }

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(new_password, 10);

        // Cập nhật mật khẩu
        const [result] = await db.execute(
            'UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]
        );

        console.log('Password update result:', result);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }

        res.json({ message: 'Đổi mật khẩu thành công' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Lỗi khi đổi mật khẩu' });
    }
});

// API cập nhật ảnh đại diện
app.put('/api/profile/avatar', auth, avatarUpload.single('avatar'), async(req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Không có file được tải lên' });
        }

        const avatarUrl = `/uploads/avatars/${req.file.filename}`;
        const fullAvatarUrl = `http://localhost:3000${avatarUrl}`;

        const [result] = await db.execute(
            'UPDATE users SET avatar_url = ? WHERE id = ?', [avatarUrl, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }

        res.json({
            message: 'Cập nhật ảnh đại diện thành công',
            avatar_url: avatarUrl,
            full_avatar_url: fullAvatarUrl
        });
    } catch (error) {
        console.error('Error updating avatar:', error);
        res.status(500).json({ error: 'Lỗi khi cập nhật ảnh đại diện' });
    }
});

// API để lấy danh sách khóa học
app.get('/api/courses', async(req, res) => {
    try {
        const [courses] = await db.execute('SELECT * FROM courses ORDER BY created_at DESC');
        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách khóa học' });
    }
});

// API để lấy chi tiết khóa học theo ID
app.get('/api/courses/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const [courses] = await db.execute('SELECT * FROM courses WHERE id = ?', [id]);

        if (courses.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy khóa học' });
        }

        res.json(courses[0]);
    } catch (error) {
        console.error('Error fetching course details:', error);
        res.status(500).json({ error: 'Lỗi khi lấy chi tiết khóa học' });
    }
});

// API để thêm khóa học mới với upload file (yêu cầu quyền admin)
app.post('/api/courses/upload', auth, thumbnailUpload.single('thumbnail'), async(req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Không có quyền thực hiện hành động này' });
        }

        console.log('=== Processing course upload ===');
        const { title, description, status } = req.body;

        if (!title || !description) {
            return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Vui lòng tải lên hình ảnh thumbnail' });
        }

        // Lấy đường dẫn tương đối của file đã upload
        const thumbnailPath = `/uploads/thumbnails/${req.file.filename}`;
        console.log('Thumbnail path:', thumbnailPath);

        // Thêm khóa học mới vào database
        const [result] = await db.execute(
            'INSERT INTO courses (title, description, thumbnail, status) VALUES (?, ?, ?, ?)',
            [title, description, thumbnailPath, status || 'active']
        );

        console.log('Course created with ID:', result.insertId);

        res.status(201).json({
            message: 'Thêm khóa học thành công',
            id: result.insertId,
            thumbnail: thumbnailPath
        });
    } catch (error) {
        console.error('Error adding course with upload:', error);
        
        // Xóa file đã upload nếu có lỗi xảy ra
        if (req.file) {
            const filePath = path.join(__dirname, req.file.path);
            try {
                fs.unlinkSync(filePath);
                console.log('Deleted uploaded file due to error:', filePath);
            } catch (unlinkError) {
                console.error('Error deleting uploaded file:', unlinkError);
            }
        }
        
        res.status(500).json({ error: 'Lỗi khi thêm khóa học', details: error.message });
    }
});

// API để cập nhật thông tin khóa học (yêu cầu quyền admin)
app.put('/api/courses/:id', auth, async(req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Không có quyền thực hiện hành động này' });
        }

        const { id } = req.params;
        const { title, description, thumbnail, status } = req.body;

        if (!title || !description || !thumbnail) {
            return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
        }

        const [result] = await db.execute(
            'UPDATE courses SET title = ?, description = ?, thumbnail = ?, status = ? WHERE id = ?', [title, description, thumbnail, status || 'active', id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy khóa học' });
        }

        res.json({
            message: 'Cập nhật khóa học thành công',
            id: parseInt(id)
        });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ error: 'Lỗi khi cập nhật khóa học' });
    }
});

// API để xóa khóa học (yêu cầu quyền admin)
app.delete('/api/courses/:id', auth, async(req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Không có quyền thực hiện hành động này' });
        }

        const { id } = req.params;

        const [result] = await db.execute('DELETE FROM courses WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy khóa học' });
        }

        res.json({
            message: 'Xóa khóa học thành công',
            id: parseInt(id)
        });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ error: 'Lỗi khi xóa khóa học' });
    }
});

// API để cập nhật thông tin chapter (yêu cầu quyền admin)
app.put('/api/chapters/:id', auth, async(req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Không có quyền thực hiện hành động này' });
        }

        const { id } = req.params;
        const { title, chapter_order } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
        }

        const [result] = await db.execute(
            'UPDATE chapters SET title = ?, chapter_order = ? WHERE id = ?', 
            [title, chapter_order, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy chương' });
        }

        res.json({
            message: 'Cập nhật chương thành công',
            id: parseInt(id)
        });
    } catch (error) {
        console.error('Error updating chapter:', error);
        res.status(500).json({ error: 'Lỗi khi cập nhật chương' });
    }
});

// API để thêm mới chapter (yêu cầu quyền admin)
app.post('/api/chapters', auth, async(req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Không có quyền thực hiện hành động này' });
        }

        const { course_id, title, chapter_order } = req.body;

        if (!course_id || !title) {
            return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
        }

        const [result] = await db.execute(
            'INSERT INTO chapters (course_id, title, chapter_order) VALUES (?, ?, ?)', 
            [course_id, title, chapter_order || 1]
        );

        res.status(201).json({
            message: 'Thêm chương mới thành công',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error adding chapter:', error);
        res.status(500).json({ error: 'Lỗi khi thêm chương' });
    }
});

// API để xóa chapter (yêu cầu quyền admin)
app.delete('/api/chapters/:id', auth, async(req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Không có quyền thực hiện hành động này' });
        }

        const { id } = req.params;

        const [result] = await db.execute('DELETE FROM chapters WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy chương' });
        }

        res.json({
            message: 'Xóa chương thành công',
            id: parseInt(id)
        });
    } catch (error) {
        console.error('Error deleting chapter:', error);
        res.status(500).json({ error: 'Lỗi khi xóa chương' });
    }
});

// API để cập nhật thông tin lesson (yêu cầu quyền admin)
app.put('/api/lessons/:id', auth, async(req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Không có quyền thực hiện hành động này' });
        }

        const { id } = req.params;
        const { title, lesson_order } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
        }

        const [result] = await db.execute(
            'UPDATE lessons SET title = ?, lesson_order = ? WHERE id = ?', 
            [title, lesson_order, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy bài học' });
        }

        res.json({
            message: 'Cập nhật bài học thành công',
            id: parseInt(id)
        });
    } catch (error) {
        console.error('Error updating lesson:', error);
        res.status(500).json({ error: 'Lỗi khi cập nhật bài học' });
    }
});

// API để thêm mới lesson (yêu cầu quyền admin)
app.post('/api/lessons', auth, async(req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Không có quyền thực hiện hành động này' });
        }

        const { chapter_id, title, lesson_order } = req.body;

        if (!chapter_id || !title) {
            return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
        }

        const [result] = await db.execute(
            'INSERT INTO lessons (chapter_id, title, lesson_order) VALUES (?, ?, ?)', 
            [chapter_id, title, lesson_order || 1]
        );

        res.status(201).json({
            message: 'Thêm bài học mới thành công',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error adding lesson:', error);
        res.status(500).json({ error: 'Lỗi khi thêm bài học' });
    }
});

// API để xóa lesson (yêu cầu quyền admin)
app.delete('/api/lessons/:id', auth, async(req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Không có quyền thực hiện hành động này' });
        }

        const { id } = req.params;

        const [result] = await db.execute('DELETE FROM lessons WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy bài học' });
        }

        res.json({
            message: 'Xóa bài học thành công',
            id: parseInt(id)
        });
    } catch (error) {
        console.error('Error deleting lesson:', error);
        res.status(500).json({ error: 'Lỗi khi xóa bài học' });
    }
});

// API để cập nhật thông tin page (yêu cầu quyền admin)
app.put('/api/pages/:id', auth, async(req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Không có quyền thực hiện hành động này' });
        }

        const { id } = req.params;
        const { page_number, page_type, content } = req.body;

        if (!page_type || !content) {
            return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
        }

        const [result] = await db.execute(
            'UPDATE pages SET page_number = ?, page_type = ?, content = ? WHERE id = ?', 
            [page_number, page_type, content, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy trang nội dung' });
        }

        res.json({
            message: 'Cập nhật trang nội dung thành công',
            id: parseInt(id)
        });
    } catch (error) {
        console.error('Error updating page:', error);
        res.status(500).json({ error: 'Lỗi khi cập nhật trang nội dung' });
    }
});

// API để thêm mới page (yêu cầu quyền admin)
app.post('/api/pages', auth, async(req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Không có quyền thực hiện hành động này' });
        }

        const { lesson_id, page_number, page_type, content } = req.body;

        if (!lesson_id || !page_type || !content) {
            return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
        }

        const [result] = await db.execute(
            'INSERT INTO pages (lesson_id, page_number, page_type, content) VALUES (?, ?, ?, ?)', 
            [lesson_id, page_number, page_type, content]
        );

        res.status(201).json({
            message: 'Thêm trang nội dung mới thành công',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error adding page:', error);
        res.status(500).json({ error: 'Lỗi khi thêm trang nội dung' });
    }
});

// API để xóa page (yêu cầu quyền admin)
app.delete('/api/pages/:id', auth, async(req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Không có quyền thực hiện hành động này' });
        }

        const { id } = req.params;

        const [result] = await db.execute('DELETE FROM pages WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy trang nội dung' });
        }

        res.json({
            message: 'Xóa trang nội dung thành công',
            id: parseInt(id)
        });
    } catch (error) {
        console.error('Error deleting page:', error);
        res.status(500).json({ error: 'Lỗi khi xóa trang nội dung' });
    }
});

// API để tạo dữ liệu mẫu cho khóa học (chỉ sử dụng cho demo)
app.post('/api/seed-courses', async(req, res) => {
    try {
        // Kiểm tra đã có dữ liệu chưa
        const [existingCourses] = await db.execute('SELECT COUNT(*) as count FROM courses');

        if (existingCourses[0].count > 0) {
            return res.json({ message: 'Đã có dữ liệu khóa học, không cần thêm nữa' });
        }

        // Nhận dữ liệu từ request body
        const courses = req.body.courses;

        if (!courses || !Array.isArray(courses) || courses.length === 0) {
            return res.status(400).json({ error: 'Vui lòng cung cấp mảng dữ liệu khóa học' });
        }

        let insertedCount = 0;

        for (const course of courses) {
            if (!course.title || !course.description || !course.thumbnail) {
                continue; // Bỏ qua các khóa học không đủ thông tin
            }

            await db.execute(
                'INSERT INTO courses (title, description, thumbnail, status) VALUES (?, ?, ?, ?)', [course.title, course.description, course.thumbnail, course.status || 'active']
            );

            insertedCount++;
        }

        res.json({ message: 'Đã thêm dữ liệu khóa học thành công', count: insertedCount });
    } catch (error) {
        console.error('Error seeding courses:', error);
        res.status(500).json({ error: 'Lỗi khi thêm dữ liệu khóa học' });
    }
});

// API để lấy danh sách chapters của một khóa học
app.get('/api/courses/:courseId/chapters', async(req, res) => {
    try {
        const { courseId } = req.params;

        const [chapters] = await db.execute(
            'SELECT * FROM chapters WHERE course_id = ? ORDER BY chapter_order ASC', [courseId]
        );

        if (chapters.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy chương nào cho khóa học này' });
        }

        res.json(chapters);
    } catch (error) {
        console.error('Error fetching chapters:', error);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách chương' });
    }
});

// API để lấy danh sách lessons của một chapter
app.get('/api/chapters/:chapterId/lessons', async(req, res) => {
    try {
        const { chapterId } = req.params;

        const [lessons] = await db.execute(
            'SELECT * FROM lessons WHERE chapter_id = ? ORDER BY lesson_order ASC', [chapterId]
        );

        if (lessons.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy bài học nào cho chương này' });
        }

        res.json(lessons);
    } catch (error) {
        console.error('Error fetching lessons:', error);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách bài học' });
    }
});

// API để lấy nội dung chi tiết của một bài học
app.get('/api/lessons/:lessonId/pages', async(req, res) => {
    try {
        const { lessonId } = req.params;

        const [pages] = await db.execute(
            'SELECT * FROM pages WHERE lesson_id = ? ORDER BY page_number ASC', [lessonId]
        );

        if (pages.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy nội dung cho bài học này' });
        }

        res.json(pages);
    } catch (error) {
        console.error('Error fetching pages:', error);
        res.status(500).json({ error: 'Lỗi khi lấy nội dung bài học' });
    }
});

// API để lấy cấu trúc đầy đủ của một khóa học (bao gồm chapters và lessons)
app.get('/api/courses/:courseId/structure', async(req, res) => {
    try {
        const { courseId } = req.params;

        // Lấy thông tin khóa học
        const [courses] = await db.execute('SELECT * FROM courses WHERE id = ?', [courseId]);

        if (courses.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy khóa học' });
        }

        const course = courses[0];

        // Lấy danh sách chapters
        const [chapters] = await db.execute(
            'SELECT * FROM chapters WHERE course_id = ? ORDER BY chapter_order ASC', [courseId]
        );

        // Lấy danh sách lessons và pages cho mỗi chapter
        const chaptersWithLessons = await Promise.all(
            chapters.map(async(chapter) => {
                const [lessons] = await db.execute(
                    'SELECT * FROM lessons WHERE chapter_id = ? ORDER BY lesson_order ASC', [chapter.id]
                );
                
                // Lấy pages cho mỗi lesson
                const lessonsWithPages = await Promise.all(
                    lessons.map(async(lesson) => {
                        const [pages] = await db.execute(
                            'SELECT * FROM pages WHERE lesson_id = ? ORDER BY page_number ASC', [lesson.id]
                        );
                        
                        return {
                            ...lesson,
                            pages
                        };
                    })
                );

                return {
                    ...chapter,
                    lessons: lessonsWithPages
                };
            })
        );

        res.json({
            ...course,
            chapters: chaptersWithLessons
        });
    } catch (error) {
        console.error('Error fetching course structure:', error);
        res.status(500).json({ error: 'Lỗi khi lấy cấu trúc khóa học' });
    }
});

// API để tạo dữ liệu mẫu cho cấu trúc khóa học (chỉ sử dụng cho demo)
app.post('/api/seed-course-structure', async(req, res) => {
    try {
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({ error: 'Vui lòng cung cấp course_id' });
        }

        // Kiểm tra khóa học tồn tại
        const [courses] = await db.execute('SELECT * FROM courses WHERE id = ?', [courseId]);

        if (courses.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy khóa học' });
        }

        // Kiểm tra đã có dữ liệu chưa
        const [existingChapters] = await db.execute('SELECT COUNT(*) as count FROM chapters WHERE course_id = ?', [courseId]);

        if (existingChapters[0].count > 0) {
            return res.json({ message: `Đã có dữ liệu cho khóa học ${courseId}, không cần thêm nữa` });
        }

        // Tạo 3 chương mẫu
        const chapterTitles = [
            'Chương 1: Giới thiệu tổng quan',
            'Chương 2: Kiến thức cơ bản',
            'Chương 3: Ứng dụng thực tiễn'
        ];

        let chaptersInserted = 0;
        let lessonsInserted = 0;
        let pagesInserted = 0;

        for (let i = 0; i < chapterTitles.length; i++) {
            // Thêm chapter
            const [chapterResult] = await db.execute(
                'INSERT INTO chapters (course_id, title, chapter_order) VALUES (?, ?, ?)', [courseId, chapterTitles[i], i + 1]
            );

            const chapterId = chapterResult.insertId;
            chaptersInserted++;

            // Tạo 3-5 bài học cho mỗi chương
            const lessonCount = 3 + Math.floor(Math.random() * 3);

            for (let j = 0; j < lessonCount; j++) {
                const [lessonResult] = await db.execute(
                    'INSERT INTO lessons (chapter_id, title, lesson_order) VALUES (?, ?, ?)', [chapterId, `Bài ${j + 1}: Nội dung bài học ${j + 1} của ${chapterTitles[i]}`, j + 1]
                );

                const lessonId = lessonResult.insertId;
                lessonsInserted++;

                // Tạo 2-4 trang cho mỗi bài học
                const pageCount = 2 + Math.floor(Math.random() * 3);

                for (let k = 0; k < pageCount; k++) {
                    const pageType = k === 0 ? 'text' : (Math.random() > 0.7 ? 'video' : 'text');
                    let content = '';

                    if (pageType === 'text') {
                        content = `<h2>Nội dung trang ${k + 1} của bài ${j + 1}</h2>
<p>Đây là nội dung mẫu được tạo tự động cho khóa học. Bạn có thể thay thế bằng nội dung thực tế sau.</p>
<p>Đoạn văn thứ hai để minh họa định dạng.</p>
<ul>
  <li>Điểm thứ nhất cần ghi nhớ</li>
  <li>Điểm thứ hai cần ghi nhớ</li>
  <li>Điểm thứ ba cần ghi nhớ</li>
</ul>`;
                    } else if (pageType === 'video') {
                        content = `{"videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ", "title": "Video minh họa cho bài học"}`;
                    }

                    await db.execute(
                        'INSERT INTO pages (lesson_id, page_number, page_type, content) VALUES (?, ?, ?, ?)', [lessonId, k + 1, pageType, content]
                    );

                    pagesInserted++;
                }
            }
        }

        res.json({
            message: 'Đã tạo dữ liệu mẫu thành công',
            stats: {
                chaptersInserted,
                lessonsInserted,
                pagesInserted
            }
        });
    } catch (error) {
        console.error('Error seeding course structure:', error);
        res.status(500).json({ error: 'Lỗi khi tạo dữ liệu mẫu cho cấu trúc khóa học' });
    }
});

// Enrollment routes
app.post('/api/enrollments', auth, enrollmentController.enrollCourse);
app.get('/api/enrollments', auth, enrollmentController.getEnrolledCourses);
app.get('/api/enrollments/check/:course_id', auth, enrollmentController.checkEnrollment);
app.put('/api/enrollments/progress', auth, enrollmentController.updateProgress);

// API để lấy thông tin chi tiết của một bài học
app.get('/api/lessons/:lessonId', auth, async(req, res) => {
    try {
        const { lessonId } = req.params;

        const [lessons] = await db.execute(
            'SELECT * FROM lessons WHERE id = ?', [lessonId]
        );

        if (lessons.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy bài học' });
        }

        const lesson = lessons[0];

        // Lấy thông tin chapter
        const [chapters] = await db.execute(
            'SELECT * FROM chapters WHERE id = ?', [lesson.chapter_id]
        );

        if (chapters.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy chương học' });
        }

        // Lấy danh sách trang của bài học
        const [pages] = await db.execute(
            'SELECT * FROM pages WHERE lesson_id = ? ORDER BY page_number ASC', [lessonId]
        );

        res.json({
            ...lesson,
            chapter: chapters[0],
            pages
        });
    } catch (error) {
        console.error('Error fetching lesson details:', error);
        res.status(500).json({ error: 'Lỗi khi lấy thông tin bài học' });
    }
});

// Routes cho câu hỏi
app.get('/api/questions/:courseId', auth, questionController.getQuestionsByCourse);
app.post('/api/questions', adminAuth, questionController.addQuestion);
app.put('/api/questions/:id', adminAuth, questionController.updateQuestion);
app.delete('/api/questions/:id', adminAuth, questionController.deleteQuestion);

// Thêm routes mới cho API trích xuất câu hỏi từ file đề thi
app.post('/api/questions/upload-exam', adminAuth, examFileUpload.single('examFile'), questionController.uploadExamFile);
app.post('/api/questions/batch', adminAuth, questionController.createQuestionBatch);

// Exam routes
app.get('/api/exams', auth, examController.getExams);
app.get('/api/exams/:id', auth, examController.getExamById);
app.post('/api/user-exams', auth, examController.createUserExam);
app.get('/api/user-exams/:id/questions', auth, examController.getUserExamQuestions);
app.post('/api/user-exams/:id/submit', auth, examController.submitUserExam);
app.get('/api/user-exam-results', auth, examController.getUserExamResults);

// Admin exam routes
app.get('/api/admin/exams', adminAuth, examController.getAdminExams);
app.post('/api/admin/exams', adminAuth, examController.createExam);
app.put('/api/admin/exams/:id', adminAuth, examController.updateExam);
app.delete('/api/admin/exams/:id', adminAuth, examController.deleteExam);
app.get('/api/admin/exam-results', adminAuth, examController.getAdminExamResults);

// Add route to get information about chapters
app.get('/api/chapters/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const [chapters] = await db.execute('SELECT * FROM chapters WHERE id = ?', [id]);

        if (!chapters || chapters.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy chương' });
        }

        res.json(chapters[0]);
    } catch (error) {
        console.error('Error fetching chapter:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});

// Admin routes
app.post('/api/admin/login', authController.adminLogin);
app.get('/api/admin/dashboard', adminAuth, async(req, res) => {
    try {
        const user = req.user;
        res.json({
            message: 'Welcome to admin dashboard',
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error in admin dashboard:', error);
        res.status(500).json({ error: 'Lỗi khi truy cập admin dashboard' });
    }
});

// API lấy danh sách người dùng
app.get('/api/admin/users', adminAuth, async(req, res) => {
    try {
        const [users] = await db.execute(`
            SELECT id, email, full_name, phone_number, school, status, role, created_at 
            FROM users 
            WHERE role != 'admin'
            ORDER BY created_at DESC
        `);
        
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách người dùng' });
    }
});

// API cập nhật trạng thái người dùng
app.put('/api/admin/users/:id/status', adminAuth, async(req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        console.log('=== Updating User Status ===');
        console.log('User ID:', id);
        console.log('New status:', status);

        if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
        }

        // Kiểm tra người dùng tồn tại
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }

        // Cập nhật trạng thái
        const [result] = await db.execute(
            'UPDATE users SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không thể cập nhật trạng thái' });
        }

        console.log('Status updated successfully');
        res.json({ 
            message: 'Cập nhật trạng thái thành công',
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                status: status
            }
        });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ error: 'Lỗi khi cập nhật trạng thái người dùng' });
    }
});

// API xóa tài khoản người dùng
app.delete('/api/admin/users/:id', adminAuth, async(req, res) => {
    try {
        const { id } = req.params;

        console.log('=== Deleting User ===');
        console.log('User ID:', id);

        // Kiểm tra người dùng tồn tại
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }

        // Không cho phép xóa tài khoản admin
        if (user.role === 'admin') {
            return res.status(403).json({ error: 'Không thể xóa tài khoản admin' });
        }

        // Xóa người dùng
        const [result] = await db.execute(
            'DELETE FROM users WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không thể xóa người dùng' });
        }

        console.log('User deleted successfully');
        res.json({ 
            message: 'Xóa tài khoản thành công',
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name
            }
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Lỗi khi xóa tài khoản người dùng' });
    }
});

// API để thêm khóa học mới (yêu cầu quyền admin)
app.post('/api/courses', auth, async(req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Không có quyền thực hiện hành động này' });
        }

        const { title, description, thumbnail, status } = req.body;

        if (!title || !description || !thumbnail) {
            return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
        }

        const [result] = await db.execute(
            'INSERT INTO courses (title, description, thumbnail, status) VALUES (?, ?, ?, ?)', [title, description, thumbnail, status || 'active']
        );

        res.status(201).json({
            message: 'Thêm khóa học thành công',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error adding course:', error);
        res.status(500).json({ error: 'Lỗi khi thêm khóa học' });
    }
});

// API quản lý tài liệu (Admin)

// Xóa API tạo bảng document_purchases và thay bằng API kiểm tra bảng documents_user
app.post('/api/check-documents-user-table', async(req, res) => {
    try {
        // Kiểm tra bảng documents_user đã tồn tại
        const [tables] = await db.execute(`
            SELECT TABLE_NAME 
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'documents_user'
        `, [process.env.DB_NAME || 'ktmt_db']);
        
        if (tables.length > 0) {
            res.json({ message: 'Bảng documents_user đã tồn tại', exists: true });
        } else {
            res.json({ message: 'Bảng documents_user chưa tồn tại', exists: false });
        }
    } catch (error) {
        console.error('Lỗi khi kiểm tra bảng documents_user:', error);
        res.status(500).json({ message: 'Lỗi khi kiểm tra bảng' });
    }
});

// Cập nhật API mua tài liệu để sử dụng bảng documents_user
app.post('/api/documents/purchase', auth, async(req, res) => {
    try {
        const { document_id } = req.body;
        const user_id = req.user.id;
        
        if (!document_id) {
            return res.status(400).json({ message: 'Vui lòng cung cấp document_id' });
        }
        
        // Kiểm tra tài liệu tồn tại
        const [documents] = await db.execute('SELECT * FROM documents WHERE id = ?', [document_id]);
        if (documents.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
        }
        
        const document = documents[0];
        
        // Kiểm tra xem người dùng đã mua tài liệu này chưa
        const [existingPurchases] = await db.execute(
            'SELECT * FROM documents_user WHERE user_id = ? AND document_id = ?', 
            [user_id, document_id]
        );
        
        if (existingPurchases.length > 0) {
            return res.json({ 
                already_purchased: true,
                message: 'Bạn đã mua tài liệu này rồi',
                purchase_id: existingPurchases[0].id 
            });
        }
        
        // Ghi nhận giao dịch mua tài liệu vào bảng documents_user
        const [result] = await db.execute(
            'INSERT INTO documents_user (user_id, document_id, payment_method, details) VALUES (?, ?, ?, ?)',
            [user_id, document_id, 'card', `{"price": ${document.price}, "status": "completed"}`]
        );
        
        res.status(201).json({
            message: 'Mua tài liệu thành công',
            purchase_id: result.insertId,
            document_id,
            title: document.title
        });
    } catch (error) {
        console.error('Lỗi khi mua tài liệu:', error);
        res.status(500).json({ message: 'Lỗi server khi xử lý giao dịch' });
    }
});

// Cập nhật API kiểm tra người dùng đã mua tài liệu chưa
app.get('/api/documents/purchase/check/:document_id', auth, async(req, res) => {
    try {
        const { document_id } = req.params;
        const user_id = req.user.id;
        
        console.log(`Kiểm tra mua tài liệu - User ID: ${user_id}, Document ID: ${document_id}`);
        
        // Kiểm tra xem người dùng đã mua tài liệu này chưa từ bảng documents_user
        const [purchases] = await db.execute(
            'SELECT * FROM documents_user WHERE user_id = ? AND document_id = ?', 
            [user_id, document_id]
        );
        
        const purchased = purchases.length > 0;
        console.log(`Kết quả kiểm tra: ${purchased ? 'Đã mua' : 'Chưa mua'}`);
        
        res.json({
            purchased: purchased,
            document_id
        });
    } catch (error) {
        console.error('Lỗi khi kiểm tra tài liệu đã mua:', error);
        res.status(500).json({ 
            message: 'Lỗi server',
            error: error.message
        });
    }
});

// Cập nhật API lấy danh sách tài liệu đã mua
app.get('/api/documents/purchased', auth, async(req, res) => {
    try {
        const user_id = req.user.id;
        
        // Lấy danh sách tài liệu đã mua từ bảng documents_user
        const [purchases] = await db.execute(`
            SELECT d.*, c.category_name, du.transaction_date as purchase_date
            FROM documents_user du
            JOIN documents d ON du.document_id = d.id
            LEFT JOIN documents_categories c ON d.category_id = c.id
            WHERE du.user_id = ?
            ORDER BY du.transaction_date DESC
        `, [user_id]);
        
        res.json(purchases);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách tài liệu đã mua:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// API để lấy danh sách tài liệu đã mua của người dùng
app.get('/api/user/documents', auth, async(req, res) => {
    try {
        const user_id = req.user.id;
        
        // Lấy danh sách tài liệu đã mua từ bảng documents_user
        const [purchases] = await db.execute(`
            SELECT d.*, c.category_name, du.transaction_date as purchase_date
            FROM documents_user du
            JOIN documents d ON du.document_id = d.id
            LEFT JOIN documents_categories c ON d.category_id = c.id
            WHERE du.user_id = ?
            ORDER BY du.transaction_date DESC
        `, [user_id]);
        
        res.json(purchases);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách tài liệu đã mua:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Middleware để xác thực qua token query parameter
const authByQuery = async (req, res, next) => {
    try {
        // Kiểm tra token
        const token = req.query.token;
        if (!token) {
            return res.status(401).json({ message: 'Token không được cung cấp' });
        }

        console.log('Token từ query:', token);
        
        try {
            // Đảm bảo jwt đã được import
            if (typeof jwt === 'undefined') {
                throw new Error('jwt module is not loaded properly');
            }
            
            // Xác minh token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
            console.log('Decoded token payload:', decoded);
            
            // Lấy userId từ token (có thể là user_id hoặc userId tùy vào cách tạo token)
            const userId = decoded.userId || decoded.user_id || decoded.id;
            
            if (!userId) {
                console.error('Không tìm thấy userId trong token payload:', decoded);
                return res.status(401).json({ message: 'Token không hợp lệ - không có userId' });
            }
            
            // Kiểm tra người dùng
            const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
            
            if (!rows.length) {
                return res.status(401).json({ message: 'Người dùng không tồn tại' });
            }
            
            // Lưu thông tin người dùng vào request
            req.user = rows[0];
            next();
        } catch (jwtError) {
            console.error('Lỗi JWT:', jwtError);
            return res.status(401).json({ message: 'Token không hợp lệ', error: jwtError.message });
        }
    } catch (error) {
        console.error('Lỗi xác thực token trong query:', error);
        return res.status(401).json({ message: 'Lỗi xác thực', error: error.message });
    }
};

// Cập nhật API tải xuống tài liệu để hỗ trợ xác thực thông thường
app.get('/api/documents/download/:document_id', auth, async(req, res) => {
    try {
        const { document_id } = req.params;
        const user_id = req.user.id;
        
        console.log(`Đang xử lý yêu cầu tải xuống tài liệu ID: ${document_id} cho user ${user_id}`);
        
        // Kiểm tra xem người dùng đã mua tài liệu này chưa từ bảng documents_user
        const [purchases] = await db.execute(
            'SELECT * FROM documents_user WHERE user_id = ? AND document_id = ?', 
            [user_id, document_id]
        );
        
        if (purchases.length === 0) {
            console.log(`Người dùng ${user_id} chưa mua tài liệu ${document_id}`);
            return res.status(403).json({ message: 'Bạn chưa mua tài liệu này' });
        }
        
        // Lấy thông tin tài liệu
        const [documents] = await db.execute('SELECT * FROM documents WHERE id = ?', [document_id]);
        
        if (documents.length === 0) {
            console.log(`Không tìm thấy tài liệu ID: ${document_id}`);
            return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
        }
        
        const document = documents[0];
        console.log(`Tìm thấy tài liệu: ${document.title}, đường dẫn: ${document.file_path}`);
        
        // Xử lý đường dẫn file
        let filePath;
        if (!document.file_path) {
            console.error('Không có đường dẫn file cho tài liệu ID:', document_id);
            return res.status(404).json({ message: 'Không có đường dẫn file cho tài liệu này' });
        }
        
        // Loại bỏ / ở đầu nếu có
        const cleanPath = document.file_path.replace(/^\/+/, '');
        
        if (path.isAbsolute(cleanPath)) {
            // Đường dẫn tuyệt đối
            filePath = cleanPath;
        } else {
            // Đường dẫn tương đối
            filePath = path.join(__dirname, cleanPath);
        }
        
        console.log(`Đường dẫn file đầy đủ: ${filePath}`);
        
        // Kiểm tra file tồn tại
        try {
            const fileExists = await fs.promises.access(filePath, fs.constants.R_OK)
                .then(() => true)
                .catch(() => false);
            
            if (!fileExists) {
                console.error(`File không tồn tại: ${filePath}`);
                return res.status(404).json({ message: 'File không tồn tại' });
            }
            
            console.log(`File tồn tại và có thể đọc: ${filePath}`);
        } catch (e) {
            console.error(`Lỗi truy cập file: ${e.message}`);
            return res.status(404).json({ message: 'File không tồn tại hoặc không thể truy cập' });
        }
        
        // Lấy kích thước file để thiết lập header Content-Length
        const stats = await fs.promises.stat(filePath);
        
        // Lấy tên file gốc
        const originalFileName = path.basename(filePath);
        const safeFileName = encodeURIComponent(originalFileName);
        
        // Xác định Content-Type dựa trên phần mở rộng của file
        const fileExtension = path.extname(filePath).toLowerCase();
        let contentType = 'application/octet-stream'; // Mặc định
        
        switch (fileExtension) {
            case '.pdf':
                contentType = 'application/pdf';
                break;
            case '.doc':
                contentType = 'application/msword';
                break;
            case '.docx':
                contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                break;
            case '.xls':
                contentType = 'application/vnd.ms-excel';
                break;
            case '.xlsx':
                contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                break;
            case '.ppt':
                contentType = 'application/vnd.ms-powerpoint';
                break;
            case '.pptx':
                contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
                break;
            case '.txt':
                contentType = 'text/plain';
                break;
            case '.csv':
                contentType = 'text/csv';
                break;
            // Thêm các định dạng khác nếu cần
        }
        
        // Thiết lập headers cho việc tải xuống
        res.setHeader('Content-Disposition', `attachment; filename="${safeFileName}"`);
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', stats.size);
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
        // Ghi log thông tin tải xuống
        console.log(`User ${user_id} đang tải xuống tài liệu ${document_id}: ${filePath}`);
        
        // Sử dụng phương thức sendFile
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Lỗi khi gửi file:', err);
                if (!res.headersSent) {
                    res.status(500).json({ message: 'Lỗi khi tải xuống file' });
                }
            } else {
                console.log(`Tải xuống hoàn tất cho user ${user_id}, tài liệu ${document_id}`);
            }
        });
    } catch (error) {
        console.error('Lỗi khi tải xuống tài liệu:', error);
        res.status(500).json({ message: 'Lỗi server khi tải xuống tài liệu', error: error.message });
    }
});

// API để chuyển đổi file docx sang html để xem trước
app.get('/api/documents/preview/:document_id', async(req, res) => {
    try {
        const { document_id } = req.params;
        
        // Lấy thông tin tài liệu
        const [documents] = await db.execute('SELECT * FROM documents WHERE id = ?', [document_id]);
        
        if (documents.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
        }
        
        const document = documents[0];
        const filePath = path.join(__dirname, document.file_path.replace(/^\//, ''));
        
        // Kiểm tra file tồn tại
        try {
            await fs.access(filePath);
        } catch (e) {
            return res.status(404).json({ message: 'File không tồn tại' });
        }
        
        // Xử lý preview dựa vào loại file
        const fileExtension = path.extname(filePath).toLowerCase();
        
        if (fileExtension === '.docx' || fileExtension === '.doc') {
            const mammoth = require('mammoth');
            const buffer = await fs.readFile(filePath);
            
            try {
                const result = await mammoth.convertToHtml({ buffer });
                const htmlContent = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <title>Preview: ${document.title}</title>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
                            img { max-width: 100%; height: auto; }
                            table { border-collapse: collapse; width: 100%; margin-bottom: 15px; }
                            table, th, td { border: 1px solid #ddd; }
                            th, td { padding: 8px; text-align: left; }
                            h1, h2, h3, h4, h5, h6 { color: #333; }
                            .preview-watermark { position: fixed; bottom: 10px; right: 10px; font-size: 12px; color: #999; }
                        </style>
                    </head>
                    <body>
                        <div class="preview-container">
                            ${result.value}
                        </div>
                        <div class="preview-watermark">Xem trước - ${document.title}</div>
                    </body>
                    </html>
                `;
                
                res.setHeader('Content-Type', 'text/html');
                return res.send(htmlContent);
            } catch (error) {
                console.error('Lỗi khi chuyển đổi docx sang HTML:', error);
                return res.status(500).json({ message: 'Không thể tạo bản xem trước cho file này' });
            }
        } else if (fileExtension === '.pdf') {
            // Chuyển hướng đến file PDF gốc
            return res.redirect(document.file_path);
        } else {
            return res.status(400).json({ message: 'Loại file không được hỗ trợ xem trước' });
        }
    } catch (error) {
        console.error('Lỗi khi tạo bản xem trước tài liệu:', error);
        res.status(500).json({ message: 'Lỗi server khi tạo bản xem trước' });
    }
});

// Cấu hình multer cho upload tài liệu
const documentStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Đảm bảo thư mục tồn tại
        const uploadDir = 'uploads/documents/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        cb(null, 'doc-' + uniqueSuffix + '-' + sanitizedName);
    }
});

const documentUpload = multer({
    storage: documentStorage,
    limits: {
        fileSize: 10 * 1024 * 1024 // Giới hạn 10MB
    },
    fileFilter: function(req, file, cb) {
        if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
            return cb(new Error('Chỉ chấp nhận file PDF, DOC, DOCX'));
        }
        cb(null, true);
    }
});

// Thêm tài liệu mới (Admin)
app.post('/api/admin/documents', adminAuth, documentUpload.single('document_file'), async(req, res) => {
    try {
        const { title, description, category_id, price } = req.body;

        if (!title || !description || !category_id || !price || !req.file) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin' });
        }

        const file_path = `/uploads/documents/${req.file.filename}`;

        const [result] = await db.execute(
            'INSERT INTO documents (title, description, category_id, price, file_path, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
            [title, description, category_id, price, file_path]
        );

        res.status(201).json({
            id: result.insertId,
            title,
            description,
            category_id,
            price,
            file_path,
            message: 'Thêm tài liệu thành công'
        });
    } catch (error) {
        console.error('Lỗi khi thêm tài liệu:', error);
        res.status(500).json({ message: 'Lỗi server khi thêm tài liệu' });
    }
});

// Cập nhật tài liệu (Admin) - không có file
app.put('/api/admin/documents/:id', adminAuth, async(req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category_id, price } = req.body;

        if (!title || !description || !category_id || !price) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin' });
        }

        // Kiểm tra tài liệu tồn tại
        const [documents] = await db.execute('SELECT * FROM documents WHERE id = ?', [id]);
        if (documents.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
        }

        await db.execute(
            'UPDATE documents SET title = ?, description = ?, category_id = ?, price = ?, updated_at = NOW() WHERE id = ?',
            [title, description, category_id, price, id]
        );

        res.json({
            id: parseInt(id),
            title,
            description,
            category_id,
            price,
            message: 'Cập nhật tài liệu thành công'
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật tài liệu:', error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật tài liệu' });
    }
});

// Cập nhật tài liệu với file mới (Admin)
app.put('/api/admin/documents/:id/upload', adminAuth, documentUpload.single('document_file'), async(req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category_id, price } = req.body;

        if (!title || !description || !category_id || !price || !req.file) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin và file' });
        }

        // Kiểm tra tài liệu tồn tại
        const [documents] = await db.execute('SELECT * FROM documents WHERE id = ?', [id]);
        if (documents.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
        }

        const oldDocument = documents[0];
        
        // Xóa file cũ nếu tồn tại
        try {
            const oldFilePath = path.join(__dirname, oldDocument.file_path.replace(/^\//, ''));
            await fs.access(oldFilePath);
            await fs.unlink(oldFilePath);
        } catch (fileError) {
            console.log('File cũ không tồn tại hoặc không thể xóa:', fileError);
        }

        const file_path = `/uploads/documents/${req.file.filename}`;

        await db.execute(
            'UPDATE documents SET title = ?, description = ?, category_id = ?, price = ?, file_path = ?, updated_at = NOW() WHERE id = ?',
            [title, description, category_id, price, file_path, id]
        );

        res.json({
            id: parseInt(id),
            title,
            description,
            category_id,
            price,
            file_path,
            message: 'Cập nhật tài liệu thành công'
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật tài liệu:', error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật tài liệu' });
    }
});

// Xóa tài liệu (Admin)
app.delete('/api/admin/documents/:id', adminAuth, async(req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra tài liệu tồn tại
        const [documents] = await db.execute('SELECT * FROM documents WHERE id = ?', [id]);
        if (documents.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
        }

        const document = documents[0];
        
        // Xóa file tài liệu nếu tồn tại
        try {
            const filePath = path.join(__dirname, document.file_path.replace(/^\//, ''));
            await fs.access(filePath);
            await fs.unlink(filePath);
        } catch (fileError) {
            console.log('File không tồn tại hoặc không thể xóa:', fileError);
        }

        await db.execute('DELETE FROM documents WHERE id = ?', [id]);

        res.json({ message: 'Xóa tài liệu thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa tài liệu:', error);
        res.status(500).json({ message: 'Lỗi server khi xóa tài liệu' });
    }
});

// Thêm danh mục tài liệu (Admin)
app.post('/api/admin/document-categories', adminAuth, async(req, res) => {
    try {
        const { category_name } = req.body;

        if (!category_name) {
            return res.status(400).json({ message: 'Vui lòng cung cấp tên danh mục' });
        }

        const [result] = await db.execute(
            'INSERT INTO documents_categories (category_name) VALUES (?)',
            [category_name]
        );

        res.status(201).json({
            id: result.insertId,
            category_name,
            message: 'Thêm danh mục thành công'
        });
    } catch (error) {
        console.error('Lỗi khi thêm danh mục:', error);
        res.status(500).json({ message: 'Lỗi server khi thêm danh mục' });
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error('\n=== Error ===');
    console.error('Error stack:', err.stack);
    console.error('==================\n');
    res.status(500).json({ error: 'Lỗi server', details: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('\n=== Server Started ===');
    console.log(`Server đang chạy trên port ${PORT}`);
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('=====================\n');
});

module.exports = app;