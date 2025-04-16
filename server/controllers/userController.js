
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// Helper function for handling errors
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

exports.register = catchAsync(async (req, res, next) => {
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

// Đăng nhập
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  
  // Kiểm tra email và password đã được cung cấp chưa
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp email và mật khẩu'
    });
  }
  
  // Kiểm tra người dùng có tồn tại không
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  
  const user = rows[0];
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({
      success: false,
      message: 'Email hoặc mật khẩu không chính xác'
    });
  }
  
  // Kiểm tra trạng thái tài khoản
  if (user.status !== 'active') {
    return res.status(401).json({
      success: false,
      message: 'Tài khoản của bạn đã bị khoá hoặc chưa kích hoạt'
    });
  }
  
  // Tạo token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
  
  // Lưu token vào cookie
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  
  // Remove password from output
  user.password = undefined;
  
  res.cookie('token', token, cookieOptions);
  res.status(200).json({
    success: true,
    token,
    user
  });
});

// Đăng xuất
exports.logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  
  res.status(200).json({
    success: true,
    message: 'Đăng xuất thành công'
  });
};

// Lấy thông tin người dùng hiện tại
exports.getMe = catchAsync(async (req, res, next) => {
  // Người dùng đã được xác thực qua middleware protect
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

// Cập nhật thông tin người dùng
exports.updateDetails = catchAsync(async (req, res, next) => {
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

// Đổi mật khẩu
exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  
  // Lấy thông tin người dùng
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE id = ?',
    [req.user.id]
  );
  
  const user = rows[0];
  
  // Kiểm tra mật khẩu hiện tại
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Mật khẩu hiện tại không chính xác'
    });
  }
  
  // Mã hoá mật khẩu mới
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  
  // Cập nhật mật khẩu
  await pool.query(
    'UPDATE users SET password = ? WHERE id = ?',
    [hashedPassword, req.user.id]
  );
  
  res.status(200).json({
    success: true,
    message: 'Đổi mật khẩu thành công'
  });
});

