const db = require('../config/database');

const questionController = {
  // Lấy danh sách câu hỏi theo khóa học
  getQuestionsByCourse: async (req, res) => {
    try {
      const courseId = req.params.courseId;
      
      const [questions] = await db.query(`
        SELECT q.* 
        FROM questions q
        JOIN chapters c ON q.chapter_id = c.id
        WHERE c.course_id = ?
        ORDER BY c.chapter_order, q.id
      `, [courseId]);

      res.json(questions);
    } catch (error) {
      console.error('Lỗi khi lấy câu hỏi:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Thêm câu hỏi mẫu
  seedQuestions: async (req, res) => {
    try {
      const { courseId } = req.params;

      // Kiểm tra xem đã có câu hỏi cho khóa học này chưa
      const [existingQuestions] = await db.query(
        'SELECT q.* FROM questions q JOIN chapters c ON q.chapter_id = c.id WHERE c.course_id = ?',
        [courseId]
      );

      if (existingQuestions.length > 0) {
        return res.json({ message: 'Đã có câu hỏi cho khóa học này' });
      }

      // Lấy danh sách chapters của khóa học
      const [chapters] = await db.query(
        'SELECT id FROM chapters WHERE course_id = ?',
        [courseId]
      );

      if (chapters.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy chương nào cho khóa học này' });
      }

      // Mảng câu hỏi mẫu
      const sampleQuestions = [
        {
          question_text: 'Vi điều khiển STM32 sử dụng kiến trúc nào?',
          option_a: 'ARM Cortex-M',
          option_b: 'RISC-V',
          option_c: 'x86',
          option_d: 'MIPS',
          correct_answer: 'A'
        },
        {
          question_text: 'Đâu là đặc điểm của GPIO trong STM32?',
          option_a: 'Chỉ có thể cấu hình làm ngõ vào',
          option_b: 'Chỉ có thể cấu hình làm ngõ ra',
          option_c: 'Có thể cấu hình làm ngõ vào hoặc ra',
          option_d: 'Không thể cấu hình',
          correct_answer: 'C'
        },
        {
          question_text: 'Timer trong STM32 có thể được sử dụng để làm gì?',
          option_a: 'Tạo trễ',
          option_b: 'Tạo xung PWM',
          option_c: 'Đếm sự kiện',
          option_d: 'Tất cả các đáp án trên',
          correct_answer: 'D'
        }
      ];

      // Thêm câu hỏi cho mỗi chapter
      for (const chapter of chapters) {
        for (const question of sampleQuestions) {
          await db.query(
            'INSERT INTO questions (chapter_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
              chapter.id,
              question.question_text,
              question.option_a,
              question.option_b,
              question.option_c,
              question.option_d,
              question.correct_answer
            ]
          );
        }
      }

      res.json({ message: 'Đã thêm câu hỏi mẫu thành công' });
    } catch (error) {
      console.error('Lỗi khi thêm câu hỏi mẫu:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  }
};

module.exports = questionController; 