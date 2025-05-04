const jwt = require('jsonwebtoken');
const User = require('../models/user');
const db = require('../config/database');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error('Token không được cung cấp');
        }

        // Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Auth middleware - decoded token:', decoded);

        // Lấy dữ liệu người dùng trực tiếp từ database để đảm bảo luôn có dữ liệu mới nhất
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE id = ?',
            [decoded.id]
        );

        if (!rows || rows.length === 0) {
            console.log('Auth middleware - user not found:', decoded.id);
            throw new Error('Người dùng không tồn tại');
        }

        const user = rows[0];
        console.log('Auth middleware - loaded user:', user.id, user.email);

        if (user.status !== 'active') {
            console.log('Auth middleware - inactive account:', user.id, user.status);
            throw new Error('Tài khoản đã bị khóa');
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        if (error.message === 'Tài khoản đã bị khóa') {
            res.status(403).json({ error: 'Tài khoản đã bị khóa' });
        } else if (error.message === 'jwt expired') {
            res.status(401).json({ error: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại' });
        } else if (error.message.includes('jwt')) {
            res.status(401).json({ error: 'Token không hợp lệ, vui lòng đăng nhập lại' });
        } else {
            res.status(401).json({ error: 'Vui lòng xác thực' });
        }
    }
};

module.exports = auth; 