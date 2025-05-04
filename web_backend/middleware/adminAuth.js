const jwt = require('jsonwebtoken');
const User = require('../models/user');
const db = require('../config/database');

const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            console.log('AdminAuth middleware - no token provided');
            throw new Error('Token không được cung cấp');
        }

        // Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('AdminAuth middleware - decoded token:', decoded);

        // Lấy dữ liệu admin trực tiếp từ database
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE id = ?',
            [decoded.id]
        );

        if (!rows || rows.length === 0) {
            console.log('AdminAuth middleware - user not found:', decoded.id);
            throw new Error('Không tìm thấy người dùng');
        }

        const user = rows[0];
        console.log('AdminAuth middleware - loaded user:', user.id, user.email, 'role:', user.role);

        if (user.status !== 'active' || user.role !== 'admin') {
            console.log('AdminAuth middleware - unauthorized access attempt:', user.id, user.role, user.status);
            throw new Error('Không phải là admin hoặc tài khoản không hoạt động');
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        console.error('AdminAuth middleware error:', error.message);
        if (error.message === 'jwt expired') {
            res.status(401).json({ error: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại' });
        } else {
            res.status(401).json({ error: 'Không có quyền truy cập admin' });
        }
    }
};

module.exports = adminAuth; 