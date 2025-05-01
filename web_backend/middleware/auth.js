const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new Error('Người dùng không tồn tại');
        }

        if (user.status !== 'active') {
            throw new Error('Tài khoản đã bị khóa');
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        if (error.message === 'Tài khoản đã bị khóa') {
            res.status(403).json({ error: 'Tài khoản đã bị khóa' });
        } else {
            res.status(401).json({ error: 'Vui lòng xác thực' });
        }
    }
};

module.exports = auth; 