const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// Helper function for handling errors
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      console.error('❌ LỖI:', error.message);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra, vui lòng thử lại sau',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    });
  };
};

// Thêm log chi tiết hơn để kiểm tra lỗi
exports.register = catchAsync(async (req, res, next) => {
  console.log('👤 Đang xử lý đăng ký người dùng mới:', req.body.email);
  console.log('📦 Dữ liệu nhận được:', JSON.stringify(req.body));
  const { email, password, full_name, phone_number, school } = req.body;

  if (!email || !password || !full_name) {
    console.log('❌ Dữ liệu đầu vào không hợp lệ');
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc'
    });
  }

  try {
    console.log('🔍 Kiểm tra email đã tồn tại:', email);
    const [existingUser] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    console.log('✅ Kết quả kiểm tra:', existingUser.length > 0 ? 'Email đã tồn tại' : 'Email chưa được sử dụng');

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
    const [result] = await pool.query(
      'INSERT INTO users (email, password, full_name, phone_number, school, status, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, full_name, phone_number, school || null, 'active', 'user']
    );

    console.log('✅ Kết quả thêm người dùng:', result);
    console.log('✅ Đăng ký thành công, user ID:', result.insertId);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      userId: result.insertId
    });
  } catch (error) {
    console.error('❌ LỖI ĐĂNG KÝ:', error.message);
    console.error('Chi tiết lỗi:', error.stack);
    // Thêm thông báo lỗi chi tiết hơn
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại sau.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

exports.login = catchAsync(async (req, res, next) => {
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
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
  
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  
  user.password = undefined;
  
  res.cookie('token', token, cookieOptions);
  res.status(200).json({
    success: true,
    token,
    user
  });
});

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

exports.getMe = catchAsync(async (req, res, next) => {
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

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE id = ?',
    [req.user.id]
  );
  
  const user = rows[0];
  
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  
  if (!isMatch) {
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
