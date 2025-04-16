
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
  const { email, password, full_name, phone_number, school } = req.body;
  
  const [existingUser] = await pool.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  
  if (existingUser.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Email này đã được đăng ký'
    });
  }
  
  const hashedPassword = await bcrypt.hash(password, 12);
  
  await pool.query(
    'INSERT INTO users (email, password, full_name, phone_number, school) VALUES (?, ?, ?, ?, ?)',
    [email, hashedPassword, full_name, phone_number, school || null]
  );
  
  res.status(201).json({
    success: true,
    message: 'Đăng ký thành công'
  });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp email và mật khẩu'
    });
  }
  
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
  
  if (user.status !== 'active') {
    return res.status(401).json({
      success: false,
      message: 'Tài khoản của bạn đã bị khoá hoặc chưa kích hoạt'
    });
  }
  
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
  
  user.password = undefined;
  
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
