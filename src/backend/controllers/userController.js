const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function for handling errors
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

exports.register = catchAsync(async (req, res) => {
  console.log('👤 Đang xử lý đăng ký người dùng mới:', req.body.email);
  const { email, password, full_name, phone_number, school } = req.body;
  
  console.log('🔍 Kiểm tra email đã tồn tại:', email);
  const [existingUser] = await pool.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  
  if (existingUser.length > 0) {
    console.log('❌ Email đã tồn tại:', email);
    return res.status(400).json({
      success: false,
      message: 'Email này đã được đăng ký'
    });
  }
  
  console.log('🔐 Đang mã hoá mật khẩu...');
  const hashedPassword = await bcrypt.hash(password, 12);
  
  console.log('💾 Đang lưu thông tin người dùng mới vào CSDL...');
  await pool.query(
    'INSERT INTO users (email, password, full_name, phone_number, school) VALUES (?, ?, ?, ?, ?)',
    [email, hashedPassword, full_name, phone_number, school || null]
  );
  
  console.log('✅ Đăng ký thành công:', email);
  res.status(201).json({
    success: true,
    message: 'Đăng ký thành công'
  });
});

exports.login = catchAsync(async (req, res) => {
  console.log('🔑 Đang xử lý đăng nhập:', req.body.email);
  const { email, password } = req.body;
  
  if (!email || !password) {
    console.log('❌ Thiếu email hoặc mật khẩu');
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp email và mật khẩu'
    });
  }
  
  console.log('🔍 Đang tìm kiếm người dùng trong CSDL:', email);
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  
  const user = rows[0];
  
  if (!user) {
    console.log('❌ Không tìm thấy người dùng:', email);
    return res.status(401).json({
      success: false,
      message: 'Email hoặc mật khẩu không chính xác'
    });
  }

  console.log('🔐 Đang kiểm tra mật khẩu...');
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    console.log('❌ Mật khẩu không chính xác:', email);
    return res.status(401).json({
      success: false,
      message: 'Email hoặc mật khẩu không chính xác'
    });
  }
  
  if (user.status !== 'active') {
    console.log('❌ Tài khoản không hoạt động:', email);
    return res.status(401).json({
      success: false,
      message: 'Tài khoản của bạn đã bị khoá hoặc chưa kích hoạt'
    });
  }
  
  console.log('🎟️ Đang tạo token...');
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
  
  user.password = undefined;
  
  console.log('✅ Đăng nhập thành công:', email);
  res.status(200).json({
    success: true,
    token,
    user
  });
});

exports.logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Đăng xuất thành công'
  });
};

exports.getMe = catchAsync(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, email, full_name, phone_number, school, role, status FROM users WHERE id = ?',
    [req.user.id]
  );
  
  const user = rows[0];
  
  res.status(200).json({
    success: true,
    data: user
  });
});

exports.updateDetails = catchAsync(async (req, res) => {
  const { full_name, phone_number, school } = req.body;
  
  await pool.query(
    'UPDATE users SET full_name = ?, phone_number = ?, school = ? WHERE id = ?',
    [full_name, phone_number, school, req.user.id]
  );
  
  res.status(200).json({
    success: true,
    message: 'Cập nhật thông tin thành công'
  });
});

exports.updatePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE id = ?',
    [req.user.id]
  );
  
  const user = rows[0];
  
  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return res.status(401).json({
      success: false,
      message: 'Mật khẩu hiện tại không chính xác'
    });
  }
  
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  
  await pool.query(
    'UPDATE users SET password = ? WHERE id = ?',
    [hashedPassword, req.user.id]
  );
  
  res.status(200).json({
    success: true,
    message: 'Đổi mật khẩu thành công'
  });
});
