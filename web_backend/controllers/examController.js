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

        const [exams] = await db.execute(query, params);

        if (!exams || exams.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy bài kiểm tra' });
        }

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

                // Ghi log chi tiết về các câu hỏi tìm thấy
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
                    // Thử cách khác: lấy từng chương một
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

        console.log(`Total available questions: ${allQuestions.length}`);

        if (allQuestions.length === 0) {
            return res.status(400).json({
                message: 'Không có câu hỏi nào cho bài kiểm tra này',
                details: chapterId ?
                    `Chương ${chapterId} không có câu hỏi nào` : `Khóa học ${courseId} không có câu hỏi nào`
            });
        }

        // Chọn ngẫu nhiên các câu hỏi (tối đa theo config hoặc tất cả nếu ít hơn)
        const actualQuestionCount = Math.min(allQuestions.length, exam.total_questions);
        console.log(`Will select ${actualQuestionCount} questions from ${allQuestions.length} available`);

        // Shuffle và chọn câu hỏi
        const shuffledQuestions = [...allQuestions]
            .sort(() => 0.5 - Math.random())
            .slice(0, actualQuestionCount);

        console.log(`Actually selected ${shuffledQuestions.length} questions`);

        if (shuffledQuestions.length === 0) {
            return res.status(400).json({ message: 'Không thể chọn câu hỏi cho bài kiểm tra' });
        }

        // Add selected questions to question_test one by one
        let successfulInserts = 0;

        for (const question of shuffledQuestions) {
            try {
                console.log(`Adding question ${question.id} to test ${userExamId}`);
                await db.execute(
                    'INSERT INTO question_test (question_id, user_exam_id, created_at) VALUES (?, ?, NOW())', [question.id, userExamId]
                );
                successfulInserts++;
            } catch (insertErr) {
                console.error(`Error inserting question ${question.id}:`, insertErr.message);
                // Continue with next question
            }
        }

        console.log(`Successfully added ${successfulInserts} out of ${shuffledQuestions.length} questions`);
        console.log("=== CREATE USER EXAM COMPLETED ===\n");

        if (successfulInserts === 0) {
            // If no questions were added, delete the user exam and return error
            await db.execute('DELETE FROM user_exam WHERE id = ?', [userExamId]);
            return res.status(500).json({
                message: 'Lỗi khi thêm câu hỏi vào bài kiểm tra',
                details: 'Không thể thêm bất kỳ câu hỏi nào'
            });
        }

        res.status(201).json({
            id: userExamId,
            exam_id,
            user_id: userId,
            attempt_count: 1,
            question_count: successfulInserts
        });
    } catch (error) {
        console.error('Error in createUserExam:', error);
        res.status(500).json({
            message: 'Lỗi máy chủ khi tạo bài kiểm tra',
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