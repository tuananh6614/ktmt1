const db = require('../config/database');

const enrollmentController = {
  // Đăng ký khóa học
  enrollCourse: async (req, res) => {
    try {
      const { course_id } = req.body;
      const user_id = req.user.id; // Lấy từ middleware xác thực

      // Kiểm tra xem người dùng đã đăng ký khóa học này chưa
      const [existingEnrollment] = await db.execute(
        'SELECT * FROM enrollment WHERE user_id = ? AND course_id = ?',
        [user_id, course_id]
      );

      if (existingEnrollment.length > 0) {
        return res.status(400).json({ message: 'Bạn đã đăng ký khóa học này rồi' });
      }

      // Thêm enrollment mới
      const [result] = await db.execute(
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

  // Hàm tính toán lại tiến độ học tập cho một khóa học cụ thể
  refreshEnrollmentProgress: async (user_id, course_id) => {
    try {
      console.log(`Đang tính toán lại tiến độ cho user_id=${user_id}, course_id=${course_id}`);
      
      // Lấy thông tin enrollment
      const [enrollments] = await db.execute(
        'SELECT * FROM enrollment WHERE user_id = ? AND course_id = ?',
        [user_id, course_id]
      );
      
      if (enrollments.length === 0) {
        console.log(`Không tìm thấy enrollment cho user_id=${user_id}, course_id=${course_id}`);
        return false;
      }
      
      const enrollment = enrollments[0];
      
      // Lấy tổng số chương của khóa học
      const [chapters] = await db.execute(
        'SELECT id FROM chapters WHERE course_id = ?',
        [course_id]
      );
      
      // Nếu không có chương nào, tiếp tục với khóa học tiếp theo
      if (chapters.length === 0) {
        await db.execute(
          'UPDATE enrollment SET progress_percent = ? WHERE id = ?',
          [0, enrollment.id]
        );
        return true;
      }

      // Tổng số bài kiểm tra (số chương + 1 bài cuối khóa)
      const totalExams = chapters.length + 1;
      
      // Lấy danh sách bài kiểm tra người dùng đã hoàn thành và đạt yêu cầu (score >= 70)
      const [completedExams] = await db.execute(`
        SELECT e.chapter_id, ue.score
        FROM user_exam ue
        JOIN exams e ON ue.exam_id = e.id
        WHERE ue.user_id = ? AND e.course_id = ? AND ue.completed_at IS NOT NULL AND ue.score >= 70
      `, [user_id, course_id]);
      
      // Kiểm tra bài kiểm tra cuối khóa đã hoàn thành chưa
      const finalExamPassed = completedExams.some(exam => exam.chapter_id === null);
      
      // Đếm số chương đã hoàn thành
      const completedChapters = new Set();
      completedExams.forEach(exam => {
        if (exam.chapter_id !== null) {
          completedChapters.add(exam.chapter_id);
        }
      });
      
      // Tính tiến độ
      let progressPercent = 0;
      
      if (finalExamPassed) {
        // Nếu đã hoàn thành bài kiểm tra cuối khóa và tất cả các chương, tiến độ 100%
        if (completedChapters.size === chapters.length) {
          progressPercent = 100;
        } else {
          // Nếu hoàn thành bài cuối khóa nhưng chưa hoàn thành tất cả chương
          // thì phần trăm = (số chương đã học + 1 bài cuối khóa) / tổng số bài kiểm tra * 100
          progressPercent = Math.round((completedChapters.size + 1) / totalExams * 100);
        }
      } else {
        // Nếu chưa hoàn thành bài cuối khóa, tiến độ chỉ dựa trên số chương đã hoàn thành
        progressPercent = Math.round(completedChapters.size / totalExams * 100);
      }
      
      // Cập nhật tiến độ vào database
      await db.execute(
        'UPDATE enrollment SET progress_percent = ? WHERE id = ?',
        [progressPercent, enrollment.id]
      );
      
      console.log(`Đã cập nhật tiến độ cho user_id=${user_id}, course_id=${course_id} thành ${progressPercent}%`);
      return true;
    } catch (error) {
      console.error(`Lỗi khi tính toán tiến độ cho khóa học ${course_id}:`, error);
      return false;
    }
  },

  // Lấy danh sách khóa học đã đăng ký của người dùng
  getEnrolledCourses: async (req, res) => {
    try {
      const user_id = req.user.id;

      // Log chi tiết về request
      console.log(`=== Processing enrolled courses request for user ${user_id} ===`);
      console.log(`Timestamp: ${new Date().toISOString()}`);
      console.log(`Request URL: ${req.url}`);
      
      // Lấy danh sách khóa học đã đăng ký
      const [enrollments] = await db.execute(`
        SELECT e.*, c.title, c.description, c.thumbnail 
        FROM enrollment e
        JOIN courses c ON e.course_id = c.id
        WHERE e.user_id = ? AND e.status != 'dropped'
        ORDER BY e.enrolled_date DESC
      `, [user_id]);

      console.log(`Tìm thấy ${enrollments.length} khóa học đã đăng ký ban đầu`);

      // Duyệt qua từng khóa học để tính toán tiến độ dựa trên bài kiểm tra đã hoàn thành
      for (const enrollment of enrollments) {
        // Tính toán lại tiến độ cho mỗi khóa học đã đăng ký
        await enrollmentController.refreshEnrollmentProgress(user_id, enrollment.course_id);
      }
      
      // Lấy lại dữ liệu đã cập nhật
      const [updatedEnrollments] = await db.execute(`
        SELECT e.*, c.title, c.description, c.thumbnail 
        FROM enrollment e
        JOIN courses c ON e.course_id = c.id
        WHERE e.user_id = ? AND e.status != 'dropped'
        ORDER BY e.enrolled_date DESC
      `, [user_id]);
      
      console.log(`Đã lấy ${updatedEnrollments.length} khóa học đã đăng ký cho user_id=${user_id}`);
      
      // Thêm header để ngăn chặn cache
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      res.set('X-Content-Type-Options', 'nosniff');
      
      console.log(`=== Completed enrolled courses request for user ${user_id} ===`);
      return res.json(updatedEnrollments);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khóa học:', error);
      return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // Cập nhật tiến độ học tập
  updateProgress: async (req, res) => {
    try {
      const { enrollment_id, progress_percent } = req.body;
      const user_id = req.user.id;

      const [result] = await db.execute(
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

      const [enrollment] = await db.execute(
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