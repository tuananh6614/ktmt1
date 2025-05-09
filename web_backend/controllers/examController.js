const db = require('../config/database');

// Get exam information by course_id and chapter_id (if provided)
exports.getExams = async(req, res) => {
    try {
        const { course_id, chapter_id, is_final } = req.query;

        if (!course_id) {
            return res.status(400).json({ message: 'Thiếu course_id' });
        }

        let query = 'SELECT * FROM exams WHERE course_id = ?';
        let params = [course_id];

        if (chapter_id) {
            query += ' AND chapter_id = ?';
            params.push(chapter_id);
        } else if (is_final === 'true') {
            query += ' AND chapter_id IS NULL';
        }

        // Thêm lệnh cập nhật database để đảm bảo dữ liệu mới nhất
        console.log('Fetching exam data with query:', query);
        console.log('Query parameters:', params);

        const [exams] = await db.execute(query, params);

        if (!exams || exams.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy bài kiểm tra' });
        }

        console.log(`Found ${exams.length} exams for query`);
        res.json(exams);
    } catch (error) {
        console.error('Error in getExams:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// Get a specific exam by id
exports.getExamById = async(req, res) => {
    try {
        const { id } = req.params;

        const [exams] = await db.execute('SELECT * FROM exams WHERE id = ?', [id]);

        if (!exams || exams.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy bài kiểm tra' });
        }

        res.json(exams[0]);
    } catch (error) {
        console.error('Error in getExamById:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// Create a user exam entry and select random questions
exports.createUserExam = async(req, res) => {
    try {
        const userId = req.user.id;
        const { exam_id } = req.body;

        console.log("\n=== STARTING CREATE USER EXAM ===");
        console.log("User ID:", userId, "Exam ID:", exam_id);

        if (!exam_id) {
            return res.status(400).json({ message: 'Thiếu exam_id' });
        }

        // Get exam info to determine number of questions
        const [exams] = await db.execute('SELECT * FROM exams WHERE id = ?', [exam_id]);

        if (!exams || exams.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy bài kiểm tra' });
        }

        const exam = exams[0];
        console.log("Exam configuration:", JSON.stringify(exam));

        // THÊM: Xóa tất cả các bài kiểm tra cũ của người dùng với exam này
        try {
            // First, find all existing user exams for this exam and user
            const [existingExams] = await db.execute(
                'SELECT id FROM user_exam WHERE exam_id = ? AND user_id = ?', [exam_id, userId]
            );

            console.log(`Found ${existingExams.length} existing exams to clean up`);

            // For each existing exam, delete related question_test entries
            for (const existingExam of existingExams) {
                await db.execute(
                    'DELETE FROM question_test WHERE user_exam_id = ?', [existingExam.id]
                );
                console.log(`Deleted question_test entries for user_exam ${existingExam.id}`);
            }

            // Then delete all user exams for this exam and user
            const [deleteResult] = await db.execute(
                'DELETE FROM user_exam WHERE exam_id = ? AND user_id = ?', [exam_id, userId]
            );

            console.log(`Deleted ${deleteResult.affectedRows} user_exam entries`);
        } catch (cleanupError) {
            console.error("Error cleaning up old exams:", cleanupError);
            // Continue with the process even if cleanup fails
        }

        // Create a new user exam entry
        const [result] = await db.execute(
            'INSERT INTO user_exam (exam_id, user_id, attempt_count, created_at) VALUES (?, ?, ?, NOW())', [exam_id, userId, 1]
        );

        const userExamId = result.insertId;
        console.log("Created new attempt:", userExamId);

        // Get chapter_id from the exam
        const chapterId = exam.chapter_id;
        console.log("Chapter ID:", chapterId, "Total questions required:", exam.total_questions);

        // Lấy course_id từ exam để sử dụng cho bài kiểm tra kết thúc
        const courseId = exam.course_id;
        console.log("Course ID:", courseId);

        let allQuestions = [];

        if (chapterId) {
            // TRUY VẤN TRỰC TIẾP: Lấy tất cả câu hỏi cho chapter này
            console.log(`Fetching questions for chapter ${chapterId}`);
            const [chapterQuestions] = await db.execute(
                'SELECT * FROM questions WHERE chapter_id = ?', [chapterId]
            );

            console.log(`Found ${chapterQuestions.length} questions for chapter ${chapterId}`);

            // Ghi log chi tiết về các câu hỏi tìm thấy
            if (chapterQuestions.length > 0) {
                console.log("First question sample:", JSON.stringify(chapterQuestions[0]));
            }

            allQuestions = chapterQuestions;
        } else {
            // Đây là bài kiểm tra kết thúc khóa, lấy câu hỏi từ tất cả chương của khóa học
            console.log(`Fetching all questions for final exam of course ${courseId}`);

            try {
                // Truy vấn trực tiếp tất cả câu hỏi từ tất cả chương của khóa học
                const [courseQuestions] = await db.execute(
                    `SELECT q.* FROM questions q
                     JOIN chapters c ON q.chapter_id = c.id
                     WHERE c.course_id = ?`, [courseId]
                );

                console.log(`Found ${courseQuestions.length} total questions for course ${courseId}`);

                if (courseQuestions.length > 0) {
                    console.log("Question chapters distribution:");

                    // Thống kê số lượng câu hỏi theo từng chương
                    const chapterCounts = {};
                    courseQuestions.forEach(q => {
                        if (!chapterCounts[q.chapter_id]) {
                            chapterCounts[q.chapter_id] = 0;
                        }
                        chapterCounts[q.chapter_id]++;
                    });

                    console.log("Questions per chapter:", JSON.stringify(chapterCounts));
                    console.log("First question sample:", JSON.stringify(courseQuestions[0]));
                }

                allQuestions = courseQuestions;

                if (courseQuestions.length === 0) {
                    console.log("No questions found with direct query, trying alternative approach");

                    // Lấy tất cả chapter_id của khóa học
                    const [chapters] = await db.execute(
                        'SELECT id FROM chapters WHERE course_id = ?', [courseId]
                    );

                    console.log(`Found ${chapters.length} chapters for course ${courseId}`);

                    if (chapters.length === 0) {
                        return res.status(400).json({
                            message: 'Không tìm thấy chương nào trong khóa học',
                            details: `Khóa học ${courseId} không có chương nào`
                        });
                    }

                    // Lấy câu hỏi từ từng chương một
                    for (const chapter of chapters) {
                        const [chapterQuestions] = await db.execute(
                            'SELECT * FROM questions WHERE chapter_id = ?', [chapter.id]
                        );

                        console.log(`Found ${chapterQuestions.length} questions for chapter ${chapter.id}`);
                        allQuestions = [...allQuestions, ...chapterQuestions];
                    }
                }
            } catch (finalExamError) {
                console.error("Error fetching questions for final exam:", finalExamError);
                return res.status(500).json({
                    message: 'Lỗi khi lấy câu hỏi cho bài kiểm tra cuối khóa',
                    details: finalExamError.message
                });
            }
        }

        // Kiểm tra xem có đủ câu hỏi không
        if (allQuestions.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy câu hỏi nào phù hợp' });
        }

        if (allQuestions.length < exam.total_questions) {
            console.log(`Warning: Not enough questions. Found ${allQuestions.length}, needed ${exam.total_questions}`);
        }

        // Chọn ngẫu nhiên các câu hỏi cho bài kiểm tra
        let selectedQuestions = [];
        
        if (allQuestions.length <= exam.total_questions) {
            // Nếu không đủ câu hỏi, lấy tất cả
            selectedQuestions = allQuestions;
        } else {
            // Lấy ngẫu nhiên số lượng câu hỏi cần thiết
            // Trộn mảng câu hỏi
            for (let i = allQuestions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
            }
            
            // Chọn số lượng cần thiết
            selectedQuestions = allQuestions.slice(0, exam.total_questions);
        }

        console.log(`Selected ${selectedQuestions.length} questions for the exam`);

        // Thêm các câu hỏi đã chọn vào bảng question_test
        for (const question of selectedQuestions) {
            await db.execute(
                'INSERT INTO question_test (user_exam_id, question_id) VALUES (?, ?)',
                [userExamId, question.id]
            );
        }

        // Phân phối câu hỏi từ nhiều chương (nếu là bài kiểm tra cuối khóa)
        if (!chapterId) {
            // Ghi log phân phối câu hỏi theo chương
            const distribution = {};
            selectedQuestions.forEach(q => {
                if (!distribution[q.chapter_id]) {
                    distribution[q.chapter_id] = 0;
                }
                distribution[q.chapter_id]++;
            });
            console.log("Question distribution in final exam:", JSON.stringify(distribution));
        }

        res.status(201).json({
            id: userExamId,
            exam_id,
            questions_count: selectedQuestions.length,
            message: 'Tạo bài kiểm tra thành công'
        });
    } catch (error) {
        console.error("Error in createUserExam:", error);
        res.status(500).json({
            message: 'Lỗi khi tạo bài kiểm tra',
            details: error.message
        });
    }
};

// Get questions for a specific user exam
exports.getUserExamQuestions = async(req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Verify this user exam belongs to the current user
        const [userExams] = await db.execute(
            'SELECT * FROM user_exam WHERE id = ? AND user_id = ?', [id, userId]
        );

        if (!userExams || userExams.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy bài kiểm tra' });
        }

        // Get questions from question_test
        const [questions] = await db.execute(`
      SELECT q.* FROM questions q
      JOIN question_test qt ON q.id = qt.question_id
      WHERE qt.user_exam_id = ?
      ORDER BY qt.id
    `, [id]);

        res.json(questions);
    } catch (error) {
        console.error('Error in getUserExamQuestions:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// Submit a user exam
exports.submitUserExam = async(req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { answers, score } = req.body;

        // Verify this user exam belongs to the current user
        const [userExams] = await db.execute(
            'SELECT * FROM user_exam WHERE id = ? AND user_id = ?', [id, userId]
        );

        if (!userExams || userExams.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy bài kiểm tra' });
        }

        // Update user_exam with score
        await db.execute(
            'UPDATE user_exam SET score = ?, completed_at = NOW(), updated_at = NOW() WHERE id = ?', [score, id]
        );

        // Could also store individual answers if needed

        res.json({ message: 'Đã nộp bài kiểm tra thành công' });
    } catch (error) {
        console.error('Error in submitUserExam:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// Get all exam results for a user
exports.getUserExamResults = async(req, res) => {
    try {
        const userId = req.user.id;
        const { course_id } = req.query;

        let query = `
      SELECT ue.*, e.title as exam_title, e.chapter_id, c.title as course_title
      FROM user_exam ue
      JOIN exams e ON ue.exam_id = e.id
      JOIN courses c ON e.course_id = c.id
      WHERE ue.user_id = ?
    `;

        let params = [userId];

        if (course_id) {
            query += ' AND e.course_id = ?';
            params.push(course_id);
        }

        query += ' ORDER BY ue.created_at DESC';

        const [results] = await db.execute(query, params);

        res.json(results);
    } catch (error) {
        console.error('Error in getUserExamResults:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// ADMIN: Get all exams for admin
exports.getAdminExams = async(req, res) => {
    try {
        // Check admin role 
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }

        const { course_id } = req.query;

        let query = 'SELECT * FROM exams';
        let params = [];

        if (course_id) {
            query += ' WHERE course_id = ?';
            params.push(course_id);
        }

        query += ' ORDER BY created_at DESC';

        const [exams] = await db.execute(query, params);

        res.json(exams);
    } catch (error) {
        console.error('Error in getAdminExams:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// ADMIN: Create a new exam
exports.createExam = async(req, res) => {
    try {
        // Check admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền thực hiện hành động này' });
        }

        const { course_id, chapter_id, title, time_limit, total_questions } = req.body;

        if (!course_id || !title || !time_limit || !total_questions) {
            return res.status(400).json({ message: 'Thiếu thông tin bài thi' });
        }

        // Verify course exists
        const [courses] = await db.execute('SELECT * FROM courses WHERE id = ?', [course_id]);
        if (courses.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy khóa học' });
        }

        // If chapter_id is provided, verify chapter exists
        if (chapter_id) {
            const [chapters] = await db.execute('SELECT * FROM chapters WHERE id = ? AND course_id = ?', [chapter_id, course_id]);
            if (chapters.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy chương trong khóa học này' });
            }
        }

        // Sửa lỗi: chapter_id có thể NULL nếu là bài thi cuối khóa
        let query = 'INSERT INTO exams (course_id, chapter_id, title, time_limit, total_questions, created_at) VALUES (?, ?, ?, ?, ?, NOW())';
        let params = [course_id, chapter_id ? chapter_id : null, title, time_limit, total_questions];
        
        // Create exam
        const [result] = await db.execute(query, params);

        res.status(201).json({
            id: result.insertId,
            course_id,
            chapter_id: chapter_id ? chapter_id : null,
            title,
            time_limit,
            total_questions,
            message: 'Tạo bài thi thành công'
        });
    } catch (error) {
        console.error('Error in createExam:', error);
        res.status(500).json({ message: 'Lỗi máy chủ', details: error.message });
    }
};

// ADMIN: Update an exam
exports.updateExam = async(req, res) => {
    try {
        // Check admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền thực hiện hành động này' });
        }

        const { id } = req.params;
        const { course_id, chapter_id, title, time_limit, total_questions } = req.body;

        if (!title || !time_limit || !total_questions) {
            return res.status(400).json({ message: 'Thiếu thông tin bài thi' });
        }

        // Verify exam exists
        const [exams] = await db.execute('SELECT * FROM exams WHERE id = ?', [id]);
        if (exams.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy bài thi' });
        }

        // Update exam
        await db.execute(
            'UPDATE exams SET course_id = ?, chapter_id = ?, title = ?, time_limit = ?, total_questions = ?, updated_at = NOW() WHERE id = ?',
            [course_id, chapter_id, title, time_limit, total_questions, id]
        );

        res.json({
            id,
            course_id,
            chapter_id,
            title,
            time_limit,
            total_questions,
            message: 'Cập nhật bài thi thành công'
        });
    } catch (error) {
        console.error('Error in updateExam:', error);
        res.status(500).json({ message: 'Lỗi máy chủ', details: error.message });
    }
};

// ADMIN: Delete an exam
exports.deleteExam = async(req, res) => {
    try {
        // Check admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền thực hiện hành động này' });
        }

        const { id } = req.params;

        // Verify exam exists
        const [exams] = await db.execute('SELECT * FROM exams WHERE id = ?', [id]);
        if (exams.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy bài thi' });
        }

        // Delete related user_exam entries (this will cascade delete question_test entries)
        await db.execute('DELETE FROM user_exam WHERE exam_id = ?', [id]);

        // Delete exam
        await db.execute('DELETE FROM exams WHERE id = ?', [id]);

        res.json({
            id,
            message: 'Xóa bài thi thành công'
        });
    } catch (error) {
        console.error('Error in deleteExam:', error);
        res.status(500).json({ message: 'Lỗi máy chủ', details: error.message });
    }
};

// ADMIN: Get all exam results
exports.getAdminExamResults = async(req, res) => {
    try {
        // Check admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }

        const { course_id } = req.query;

        let query = `
        SELECT ue.*, e.title as exam_title, e.chapter_id, 
               c.title as course_title, u.full_name as user_name, u.email as user_email
        FROM user_exam ue
        JOIN exams e ON ue.exam_id = e.id
        JOIN courses c ON e.course_id = c.id
        JOIN users u ON ue.user_id = u.id
        `;

        let params = [];

        if (course_id) {
            query += ' WHERE e.course_id = ?';
            params.push(course_id);
        }

        query += ' ORDER BY ue.created_at DESC';

        const [results] = await db.execute(query, params);

        res.json(results);
    } catch (error) {
        console.error('Error in getAdminExamResults:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};