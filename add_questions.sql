-- Thêm câu hỏi cho chương 2 (Giới thiệu về STM32)
INSERT INTO questions (chapter_id, question_text, option_a, option_b, option_c, option_d, correct_answer) 
VALUES (2, 'Để đọc trạng thái nút nhấn, bạn cần cấu hình GPIO là?', 'Input Pull-up', 'Output Push-pull', 'Analog', 'Input Floating', 'A');

INSERT INTO questions (chapter_id, question_text, option_a, option_b, option_c, option_d, correct_answer) 
VALUES (2, 'Chế độ nào sau đây không phải là chế độ hoạt động của GPIO trên STM32?', 'Input Pull-down', 'Output Open-drain', 'Bidirectional', 'Analog', 'C');

INSERT INTO questions (chapter_id, question_text, option_a, option_b, option_c, option_d, correct_answer) 
VALUES (2, 'Để cấu hình chân GPIO là đầu vào có điện trở kéo lên, cần sử dụng hàm nào trong HAL?', 'GPIO_MODE_INPUT | GPIO_PULLUP', 'GPIO_MODE_OUTPUT_PP', 'GPIO_MODE_AF_PP', 'GPIO_MODE_ANALOG', 'A');

INSERT INTO questions (chapter_id, question_text, option_a, option_b, option_c, option_d, correct_answer) 
VALUES (2, 'Tốc độ tối đa của GPIO trên STM32F4 là bao nhiêu?', '84MHz', '50MHz', '100MHz', '168MHz', 'C');

INSERT INTO questions (chapter_id, question_text, option_a, option_b, option_c, option_d, correct_answer) 
VALUES (2, 'Để đọc giá trị đầu vào từ GPIO, hàm nào được sử dụng?', 'HAL_GPIO_ReadPin()', 'HAL_GPIO_WritePin()', 'HAL_GPIO_TogglePin()', 'HAL_GPIO_Init()', 'A');

-- Thêm câu hỏi cho chương 3 (Lập trình GPIO)
INSERT INTO questions (chapter_id, question_text, option_a, option_b, option_c, option_d, correct_answer) 
VALUES (3, 'Tần số PWM phụ thuộc vào yếu tố nào?', 'Cấu hình prescaler và period', 'Điện áp nguồn', 'Tốc độ CPU', 'RAM của vi điều khiển', 'A');

INSERT INTO questions (chapter_id, question_text, option_a, option_b, option_c, option_d, correct_answer) 
VALUES (3, 'Timer đếm lên đến giá trị nào thì tạo ra sự kiện update?', 'Auto-reload value', 'Prescaler value', 'Counter value', 'Compare value', 'A');

INSERT INTO questions (chapter_id, question_text, option_a, option_b, option_c, option_d, correct_answer) 
VALUES (3, 'PWM mode nào tạo ra tín hiệu active high?', 'TIM_OCMODE_PWM1', 'TIM_OCMODE_PWM2', 'TIM_OCMODE_ACTIVE', 'TIM_OCMODE_INACTIVE', 'A');

INSERT INTO questions (chapter_id, question_text, option_a, option_b, option_c, option_d, correct_answer) 
VALUES (3, 'Để tạo ra tần số PWM 1kHz với timer clock 84MHz, giá trị prescaler và period có thể là?', '84-1, 1000-1', '42-1, 2000-1', '840-1, 100-1', 'Tất cả đáp án trên', 'D');

INSERT INTO questions (chapter_id, question_text, option_a, option_b, option_c, option_d, correct_answer) 
VALUES (3, 'Duty cycle (%) của PWM được tính bằng công thức nào?', 'CCR/ARR * 100%', 'ARR/CCR * 100%', 'PSC/ARR * 100%', 'CCR/PSC * 100%', 'A'); 