const db = require('../config/database');

const enrollmentController = {
  // Đăng ký khóa học
  enrollCourse: async (req, res) => {
    try {
      const { course_id } = req.body;
      const user_id = req.user.id; // Lấy từ middleware xác thực

      // Kiểm tra xem người dùng đã đăng ký khóa học này chưa
      const [existingEnrollment] = await db.query(
        'SELECT * FROM enrollment WHERE user_id = ? AND course_id = ?',
        [user_id, course_id]
      );

      if (existingEnrollment.length > 0) {
        return res.status(400).json({ message: 'Bạn đã đăng ký khóa học này rồi' });
      }

      // Thêm enrollment mới
      const [result] = await db.query(
        'INSERT INTO enrollment (course_id, user_id, status) VALUES (?, ?, ?)',
        [course_id, user_id, 'enrolled']
      );

      res.status(201).json({
        message: 'Đăng ký khóa học thành công',
        enrollment_id: result.insertId
      });
    } catch (error) {
      console.error('Lỗi khi đăng ký khóa học:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Lấy danh sách khóa học đã đăng ký của người dùng
  getEnrolledCourses: async (req, res) => {
    try {
      const user_id = req.user.id;

      const [enrollments] = await db.query(`
        SELECT e.*, c.title, c.description, c.thumbnail 
        FROM enrollment e
        JOIN courses c ON e.course_id = c.id
        WHERE e.user_id = ? AND e.status != 'dropped'
        ORDER BY e.enrolled_date DESC
      `, [user_id]);

      res.json(enrollments);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khóa học:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Cập nhật tiến độ học tập
  updateProgress: async (req, res) => {
    try {
      const { enrollment_id, progress_percent } = req.body;
      const user_id = req.user.id;

      const [result] = await db.query(
        'UPDATE enrollment SET progress_percent = ? WHERE id = ? AND user_id = ?',
        [progress_percent, enrollment_id, user_id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Không tìm thấy enrollment' });
      }

      res.json({ message: 'Cập nhật tiến độ thành công' });
    } catch (error) {
      console.error('Lỗi khi cập nhật tiến độ:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Kiểm tra enrollment
  checkEnrollment: async (req, res) => {
    try {
      const { course_id } = req.params;
      const user_id = req.user.id;

      const [enrollment] = await db.query(
        'SELECT * FROM enrollment WHERE user_id = ? AND course_id = ?',
        [user_id, course_id]
      );

      res.json({
        isEnrolled: enrollment.length > 0
      });
    } catch (error) {
      console.error('Lỗi khi kiểm tra enrollment:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  }
};

module.exports = enrollmentController; 