
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// Helper function for handling errors
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      console.error('❌ LỖI:', error.message);
      console.error('❌ STACK:', error.stack);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra, vui lòng thử lại sau',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    });
  };
};

exports.register = catchAsync(async (req, res, next) => {
  console.log('👤 Đang xử lý đăng ký người dùng mới:', req.body.email);
  console.log('📦 Dữ liệu nhận được:', JSON.stringify(req.body));
  
  // Kiểm tra dữ liệu đầu vào
  const { email, password, full_name, phone_number, school } = req.body;

  if (!email || !password || !full_name) {
    console.log('❌ Dữ liệu đầu vào không hợp lệ');
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc: email, mật khẩu và họ tên'
    });
  }

  console.log('🔍 Kiểm tra email đã tồn tại:', email);
  
  try {
    // Kiểm tra email đã tồn tại chưa
    const [existingUser] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    console.log('🔍 Kết quả kiểm tra email:', existingUser.length > 0 ? 'Email đã tồn tại' : 'Email chưa được sử dụng');

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email này đã được đăng ký'
      });
    }
    
    // Mã hoá mật khẩu
    console.log('🔐 Đang mã hoá mật khẩu...');
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('✅ Mã hoá mật khẩu thành công');

    // Lưu thông tin vào cơ sở dữ liệu
    console.log('💾 Đang lưu thông tin người dùng mới vào CSDL...');
    const [result] = await pool.query(
      'INSERT INTO users (email, password, full_name, phone_number, school, status, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, full_name, phone_number || null, school || null, 'active', 'user']
    );

    console.log('✅ Đăng ký thành công, user ID:', result.insertId);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      userId: result.insertId
    });
  } catch (error) {
    console.error('❌ LỖI KHI XỬ LÝ ĐĂNG KÝ:', error.message);
    console.error('Chi tiết lỗi:', error.stack);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Email này đã được đăng ký'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi trong quá trình đăng ký',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  
  console.log('🔄 Xử lý đăng nhập cho email:', email);
  
  if (!email || !password) {
    console.log('❌ Thiếu thông tin đăng nhập');
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp email và mật khẩu'
    });
  }
  
  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    const user = rows[0];
    console.log('🔍 Tìm thấy user:', user ? 'Có' : 'Không');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác'
      });
    }
    
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    
    if (!isPasswordCorrect) {
      console.log('❌ Mật khẩu không chính xác');
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác'
      });
    }
    
    if (user.status !== 'active') {
      console.log('❌ Tài khoản không hoạt động:', user.status);
      return res.status(401).json({
        success: false,
        message: 'Tài khoản của bạn đã bị khoá hoặc chưa kích hoạt'
      });
    }
    
    // Tạo JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'dtktmt1_secret_key',
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );
    
    // Xoá mật khẩu trước khi gửi về client
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    
    // Gửi response
    console.log('✅ Đăng nhập thành công, đã tạo token');
    
    res.status(200).json({
      success: true,
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('❌ Lỗi đăng nhập:', error.message);
    throw error;
  }
});

// Các export khác giữ nguyên
exports.logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Đăng xuất thành công'
  });
};

exports.getMe = catchAsync(async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, email, full_name, phone_number, school, role, status FROM users WHERE id = ?',
      [req.user.id]
    );
    
    const user = rows[0];
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin người dùng'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('❌ Lỗi lấy thông tin người dùng:', error.message);
    throw error;
  }
});

exports.updateDetails = catchAsync(async (req, res, next) => {
  const { full_name, phone_number, school } = req.body;
  
  try {
    await pool.query(
      'UPDATE users SET full_name = ?, phone_number = ?, school = ? WHERE id = ?',
      [full_name, phone_number, school, req.user.id]
    );
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin thành công'
    });
  } catch (error) {
    console.error('❌ Lỗi cập nhật thông tin người dùng:', error.message);
    throw error;
  }
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp đầy đủ mật khẩu hiện tại và mật khẩu mới'
    });
  }
  
  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [req.user.id]
    );
    
    const user = rows[0];
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin người dùng'
      });
    }
    
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
  } catch (error) {
    console.error('❌ Lỗi đổi mật khẩu:', error.message);
    throw error;
  }
});
