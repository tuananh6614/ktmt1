const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
    try {
        const { email, password, full_name, phone_number, school } = req.body;

        // Debug log
        console.log('=== Register Request ===');
        console.log('Request body:', req.body);

        if (!email || !password || !full_name || !phone_number) {
            console.log('Missing required fields');
            return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
        }

        // Kiểm tra email đã tồn tại
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            console.log('Email already exists:', email);
            return res.status(400).json({ error: 'Email đã tồn tại' });
        }

        // Tạo user mới
        try {
            const userId = await User.create({
                email,
                password,
                full_name,
                phone_number,
                school: school || ''
            });

            console.log('User created successfully:', {
                userId,
                email,
                full_name,
                phone_number,
                school
            });

            // Tạo token cho user mới đăng ký
            const token = jwt.sign(
                { id: userId },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({ 
                message: 'Đăng ký thành công', 
                token,
                user: {
                    id: userId,
                    email,
                    full_name,
                    phone_number,
                    school
                }
            });
        } catch (dbError) {
            console.error('Database error during user creation:', dbError);
            throw dbError;
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            error: 'Lỗi đăng ký', 
            details: error.message 
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('=== Login Request ===');
        console.log('Login attempt for email:', email);

        if (!email || !password) {
            return res.status(400).json({ error: 'Vui lòng nhập email và mật khẩu' });
        }

        // Tìm user theo email
        const user = await User.findByEmail(email);
        if (!user) {
            console.log('User not found:', email);
            return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch for user:', email);
            return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
        }

        // Kiểm tra trạng thái tài khoản
        if (user.status !== 'active') {
            console.log('User account is not active:', email);
            return res.status(403).json({ error: 'Tài khoản đã bị khóa' });
        }

        // Tạo token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Login successful for user:', email);
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            error: 'Lỗi đăng nhập',
            details: error.message 
        });
    }
};

module.exports = {
    register,
    login
}; 