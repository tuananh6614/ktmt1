
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Middleware bảo vệ các routes, yêu cầu đăng nhập
exports.protect = async (req, res, next) => {
  let token;
  
  // Lấy token từ header hoặc cookie
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Bạn cần đăng nhập để truy cập'
    });
  }
  
  try {
    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Kiểm tra người dùng có tồn tại không
    const [rows] = await pool.query(
      'SELECT id, email, role, status FROM users WHERE id = ?',
      [decoded.id]
    );
    
    const currentUser = rows[0];
    
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'Người dùng không tồn tại'
      });
    }
    
    // Kiểm tra trạng thái tài khoản
    if (currentUser.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản của bạn đã bị khoá hoặc chưa kích hoạt'
      });
    }
    
    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
  }
};

// Middleware kiểm tra vai trò
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền truy cập vào route này'
      });
    }
    next();
  };
};
