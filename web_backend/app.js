const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./config/database');
require('dotenv').config();

const authController = require('./controllers/authController');
const auth = require('./middleware/auth');
const enrollmentController = require('./controllers/enrollmentController');

// Thêm multer để xử lý upload file
const multer = require('multer');
const path = require('path');

// Cấu hình multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatars/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
  },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Chỉ chấp nhận file ảnh'));
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
    console.log('Body:', req.body);
    console.log('==================\n');
    next();
});

// Auth routes
app.post('/api/register', authController.register);
app.post('/api/login', authController.login);

// API để lấy danh sách document categories
app.get('/api/document-categories', async (req, res) => {
  try {
    const [categories] = await db.execute('SELECT * FROM documents_categories ORDER BY category_name');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching document categories:', error);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách danh mục tài liệu' });
  }
});

// API để lấy danh sách tài liệu (có thể lọc theo category_id)
app.get('/api/documents', async (req, res) => {
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
app.post('/api/seed-documents', async (req, res) => {
  try {
    // Kiểm tra đã có dữ liệu chưa
    const [existingDocs] = await db.execute('SELECT COUNT(*) as count FROM documents');
    
    if (existingDocs[0].count > 0) {
      return res.json({ message: 'Đã có dữ liệu mẫu, không cần thêm nữa' });
    }
    
    // Thêm dữ liệu mẫu
    const sampleDocs = [
      {
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
        'INSERT INTO documents (title, description, category_id, price, file_path) VALUES (?, ?, ?, ?, ?)',
        [doc.title, doc.description, doc.category_id, doc.price, doc.file_path]
      );
    }
    
    res.json({ message: 'Đã thêm dữ liệu mẫu thành công', count: sampleDocs.length });
  } catch (error) {
    console.error('Error seeding documents:', error);
    res.status(500).json({ error: 'Lỗi khi thêm dữ liệu mẫu tài liệu' });
  }
});

// API để thêm danh mục tài liệu mẫu (chỉ sử dụng cho demo)
app.post('/api/seed-categories', async (req, res) => {
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
        'INSERT INTO documents_categories (category_name) VALUES (?)',
        [category]
      );
    }
    
    res.json({ message: 'Đã thêm danh mục mẫu thành công', count: sampleCategories.length });
  } catch (error) {
    console.error('Error seeding categories:', error);
    res.status(500).json({ error: 'Lỗi khi thêm danh mục mẫu' });
  }
});

// Protected routes
app.get('/api/profile', auth, async (req, res) => {
    try {
        const user = req.user;
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Lỗi khi lấy thông tin profile' });
    }
});

app.put('/api/profile/update', auth, async (req, res) => {
    try {
        const { full_name, school } = req.body;
        if (!full_name) {
            return res.status(400).json({ error: 'Tên không được để trống' });
        }

        console.log('Updating profile for user:', req.user.id);
        console.log('New name:', full_name);
        console.log('New school:', school);

        const [result] = await db.execute(
            'UPDATE users SET full_name = ?, school = ? WHERE id = ?',
            [full_name, school, req.user.id]
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

app.put('/api/profile/change-password', auth, async (req, res) => {
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
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, req.user.id]
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
app.put('/api/profile/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file được tải lên' });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const fullAvatarUrl = `http://localhost:3000${avatarUrl}`;
    
    const [result] = await db.execute(
      'UPDATE users SET avatar_url = ? WHERE id = ?',
      [avatarUrl, req.user.id]
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
app.get('/api/courses', async (req, res) => {
  try {
    const [courses] = await db.execute('SELECT * FROM courses ORDER BY created_at DESC');
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách khóa học' });
  }
});

// API để lấy chi tiết khóa học theo ID
app.get('/api/courses/:id', async (req, res) => {
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

// API để thêm khóa học mới (yêu cầu quyền admin)
app.post('/api/courses', auth, async (req, res) => {
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
      'INSERT INTO courses (title, description, thumbnail, status) VALUES (?, ?, ?, ?)',
      [title, description, thumbnail, status || 'active']
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

// API để cập nhật thông tin khóa học (yêu cầu quyền admin)
app.put('/api/courses/:id', auth, async (req, res) => {
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
      'UPDATE courses SET title = ?, description = ?, thumbnail = ?, status = ? WHERE id = ?',
      [title, description, thumbnail, status || 'active', id]
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
app.delete('/api/courses/:id', auth, async (req, res) => {
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

// API để tạo dữ liệu mẫu cho khóa học (chỉ sử dụng cho demo)
app.post('/api/seed-courses', async (req, res) => {
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
        'INSERT INTO courses (title, description, thumbnail, status) VALUES (?, ?, ?, ?)',
        [course.title, course.description, course.thumbnail, course.status || 'active']
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
app.get('/api/courses/:courseId/chapters', async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const [chapters] = await db.execute(
      'SELECT * FROM chapters WHERE course_id = ? ORDER BY chapter_order ASC',
      [courseId]
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
app.get('/api/chapters/:chapterId/lessons', async (req, res) => {
  try {
    const { chapterId } = req.params;
    
    const [lessons] = await db.execute(
      'SELECT * FROM lessons WHERE chapter_id = ? ORDER BY lesson_order ASC',
      [chapterId]
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
app.get('/api/lessons/:lessonId/pages', async (req, res) => {
  try {
    const { lessonId } = req.params;
    
    const [pages] = await db.execute(
      'SELECT * FROM pages WHERE lesson_id = ? ORDER BY page_number ASC',
      [lessonId]
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
app.get('/api/courses/:courseId/structure', async (req, res) => {
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
      'SELECT * FROM chapters WHERE course_id = ? ORDER BY chapter_order ASC',
      [courseId]
    );
    
    // Lấy danh sách lessons cho mỗi chapter
    const chaptersWithLessons = await Promise.all(
      chapters.map(async (chapter) => {
        const [lessons] = await db.execute(
          'SELECT * FROM lessons WHERE chapter_id = ? ORDER BY lesson_order ASC',
          [chapter.id]
        );
        
        return {
          ...chapter,
          lessons
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
app.post('/api/seed-course-structure', async (req, res) => {
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
        'INSERT INTO chapters (course_id, title, chapter_order) VALUES (?, ?, ?)',
        [courseId, chapterTitles[i], i + 1]
      );
      
      const chapterId = chapterResult.insertId;
      chaptersInserted++;
      
      // Tạo 3-5 bài học cho mỗi chương
      const lessonCount = 3 + Math.floor(Math.random() * 3);
      
      for (let j = 0; j < lessonCount; j++) {
        const [lessonResult] = await db.execute(
          'INSERT INTO lessons (chapter_id, title, lesson_order) VALUES (?, ?, ?)',
          [chapterId, `Bài ${j + 1}: Nội dung bài học ${j + 1} của ${chapterTitles[i]}`, j + 1]
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
            'INSERT INTO pages (lesson_id, page_number, page_type, content) VALUES (?, ?, ?, ?)',
            [lessonId, k + 1, pageType, content]
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
app.get('/api/lessons/:lessonId', auth, async (req, res) => {
  try {
    const { lessonId } = req.params;
    
    const [lessons] = await db.execute(
      'SELECT * FROM lessons WHERE id = ?',
      [lessonId]
    );
    
    if (lessons.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy bài học' });
    }
    
    const lesson = lessons[0];
    
    // Lấy thông tin chapter
    const [chapters] = await db.execute(
      'SELECT * FROM chapters WHERE id = ?',
      [lesson.chapter_id]
    );
    
    if (chapters.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy chương học' });
    }
    
    // Lấy danh sách trang của bài học
    const [pages] = await db.execute(
      'SELECT * FROM pages WHERE lesson_id = ? ORDER BY page_number ASC',
      [lessonId]
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
