const db = require('../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { promisify } = require('util');
const mammoth = require('mammoth'); // Thêm thư viện xử lý file Word
const pdf = require('pdf-parse'); // Thêm thư viện xử lý file PDF

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

      // Kiểm tra quyền admin
      if (req.user && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Không có quyền thực hiện hành động này' });
      }

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
  },

  // Thêm câu hỏi mới
  addQuestion: async (req, res) => {
    try {
      // Kiểm tra quyền admin
      if (req.user && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Không có quyền thực hiện hành động này' });
      }

      const { chapter_id, question_text, option_a, option_b, option_c, option_d, correct_answer } = req.body;

      if (!chapter_id || !question_text || !option_a || !option_b || !option_c || !option_d || !correct_answer) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin câu hỏi' });
      }

      // Kiểm tra chapter tồn tại
      const [chapters] = await db.query('SELECT * FROM chapters WHERE id = ?', [chapter_id]);
      if (chapters.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy chương' });
      }

      // Thêm câu hỏi mới
      const [result] = await db.query(
        'INSERT INTO questions (chapter_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [chapter_id, question_text, option_a, option_b, option_c, option_d, correct_answer]
      );

      res.status(201).json({
        message: 'Thêm câu hỏi thành công',
        id: result.insertId,
        chapter_id,
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer
      });
    } catch (error) {
      console.error('Lỗi khi thêm câu hỏi mới:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Cập nhật câu hỏi
  updateQuestion: async (req, res) => {
    try {
      // Kiểm tra quyền admin
      if (req.user && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Không có quyền thực hiện hành động này' });
      }

      const { id } = req.params;
      const { question_text, option_a, option_b, option_c, option_d, correct_answer } = req.body;

      if (!question_text || !option_a || !option_b || !option_c || !option_d || !correct_answer) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin câu hỏi' });
      }

      // Kiểm tra câu hỏi tồn tại
      const [questions] = await db.query('SELECT * FROM questions WHERE id = ?', [id]);
      if (questions.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy câu hỏi' });
      }

      // Cập nhật câu hỏi
      await db.query(
        'UPDATE questions SET question_text = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_answer = ? WHERE id = ?',
        [question_text, option_a, option_b, option_c, option_d, correct_answer, id]
      );

      res.json({
        message: 'Cập nhật câu hỏi thành công',
        id,
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer
      });
    } catch (error) {
      console.error('Lỗi khi cập nhật câu hỏi:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Xóa câu hỏi
  deleteQuestion: async (req, res) => {
    try {
      // Kiểm tra quyền admin
      if (req.user && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Không có quyền thực hiện hành động này' });
      }

      const { id } = req.params;

      // Kiểm tra câu hỏi tồn tại
      const [questions] = await db.query('SELECT * FROM questions WHERE id = ?', [id]);
      if (questions.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy câu hỏi' });
      }

      // Xóa câu hỏi
      await db.query('DELETE FROM questions WHERE id = ?', [id]);

      res.json({
        message: 'Xóa câu hỏi thành công',
        id
      });
    } catch (error) {
      console.error('Lỗi khi xóa câu hỏi:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // API upload file đề thi và trích xuất câu hỏi tự động
  uploadExamFile: async (req, res) => {
    try {
      // Kiểm tra file upload
      if (!req.file) {
        return res.status(400).json({ message: 'Vui lòng tải lên file đề thi' });
      }

      const { courseId, chapterId } = req.body;
      
      if (!courseId || !chapterId) {
        return res.status(400).json({ message: 'Thiếu thông tin khóa học hoặc chương' });
      }

      // Lấy thông tin file
      const filePath = req.file.path;
      const fileExt = path.extname(req.file.originalname).toLowerCase();
      
      // Biến lưu nội dung text
      let textContent = '';
      
      // Phân tích file dựa vào định dạng
      if (fileExt === '.docx' || fileExt === '.doc') {
        // Xử lý file Word
        const result = await mammoth.extractRawText({ path: filePath });
        textContent = result.value;
      } else if (fileExt === '.pdf') {
        // Xử lý file PDF
        const dataBuffer = await fs.readFile(filePath);
        const data = await pdf(dataBuffer);
        textContent = data.text;
      } else {
        return res.status(400).json({ message: 'Định dạng file không được hỗ trợ' });
      }

      // Xử lý nội dung để trích xuất câu hỏi và đáp án
      const questions = extractQuestions(textContent);
      
      res.json({
        message: 'Tải lên và xử lý file thành công',
        count: questions.length,
        questions
      });
      
      // Xóa file tạm sau khi xử lý xong
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Lỗi khi xử lý file đề thi:', error);
      res.status(500).json({ message: 'Lỗi khi xử lý file đề thi', error: error.message });
    }
  },

  // API tạo hàng loạt câu hỏi
  createQuestionBatch: async (req, res) => {
    try {
      const { questions, chapterId } = req.body;
      
      if (!Array.isArray(questions) || questions.length === 0 || !chapterId) {
        return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
      }

      // Kiểm tra chương tồn tại
      const [chapter] = await db.query('SELECT * FROM chapters WHERE id = ?', [chapterId]);
      if (!chapter.length) {
        return res.status(404).json({ message: 'Không tìm thấy chương' });
      }

      // Tạo câu hỏi hàng loạt
      const createdQuestions = [];
      for (const question of questions) {
        const [result] = await db.query(`
          INSERT INTO questions 
          (chapter_id, question_text, option_a, option_b, option_c, option_d, correct_answer) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          chapterId,
          question.question_text,
          question.option_a,
          question.option_b,
          question.option_c,
          question.option_d,
          question.correct_answer
        ]);
        
        createdQuestions.push({
          id: result.insertId,
          ...question
        });
      }

      res.status(201).json({
        message: `Đã thêm ${createdQuestions.length} câu hỏi thành công`,
        questions: createdQuestions
      });
    } catch (error) {
      console.error('Lỗi khi tạo câu hỏi hàng loạt:', error);
      res.status(500).json({ message: 'Lỗi khi tạo câu hỏi', error: error.message });
    }
  }
};

// Hàm trích xuất câu hỏi từ văn bản
function extractQuestions(text) {
  // Array để lưu câu hỏi
  const extractedQuestions = [];
  
  // Tách văn bản thành các dòng
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  
  // Regex để tìm các câu hỏi và đáp án
  const questionRegex = /Câu\s*(\d+)[:.]\s*(.*)/i;
  const optionRegex = /([A-D])[:.)\s]\s*(.*)/i;
  
  let currentQuestion = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Tìm câu hỏi mới
    const questionMatch = line.match(questionRegex);
    if (questionMatch) {
      // Lưu câu hỏi trước đó nếu có
      if (currentQuestion && currentQuestion.option_a && currentQuestion.option_b && 
          currentQuestion.option_c && currentQuestion.option_d) {
        extractedQuestions.push(currentQuestion);
      }
      
      // Tạo câu hỏi mới
      currentQuestion = {
        question_text: questionMatch[2],
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_answer: ''
      };
      
      continue;
    }
    
    // Nếu đang trong một câu hỏi, tìm các đáp án
    if (currentQuestion) {
      const optionMatch = line.match(optionRegex);
      if (optionMatch) {
        const optionLetter = optionMatch[1];
        const optionText = optionMatch[2];
        
        // Lưu đáp án
        currentQuestion[`option_${optionLetter.toLowerCase()}`] = optionText;
        
        // Kiểm tra đáp án đúng (đánh dấu bằng dấu * hoặc đặc biệt khác)
        if (optionText.includes('*') || optionText.includes('(đúng)') || 
            line.includes('*') || line.toLowerCase().includes('đúng')) {
          currentQuestion.correct_answer = optionLetter;
          // Xóa dấu * khỏi đáp án để hiển thị
          currentQuestion[`option_${optionLetter.toLowerCase()}`] = optionText.replace(/\*/g, '').replace(/\(đúng\)/g, '').trim();
        }
      }
    }
  }
  
  // Thêm câu hỏi cuối cùng nếu có
  if (currentQuestion && currentQuestion.option_a && currentQuestion.option_b && 
      currentQuestion.option_c && currentQuestion.option_d) {
    extractedQuestions.push(currentQuestion);
  }
  
  // Nếu không xác định được đáp án đúng, mặc định chọn A
  extractedQuestions.forEach(q => {
    if (!q.correct_answer) {
      q.correct_answer = 'A';
    }
  });
  
  return extractedQuestions;
}

module.exports = questionController; 