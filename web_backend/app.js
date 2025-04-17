const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./config/database');
require('dotenv').config();

const authController = require('./controllers/authController');
const auth = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log('\n=== New Request ===');
    console.log(`Time: ${new Date().toLocaleString()}`);
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('==================\n');
    next();
});

// Auth routes
app.post('/api/register', authController.register);
app.post('/api/login', authController.login);

// Protected routes
app.get('/api/profile', auth, async (req, res) => {
    try {
        const user = req.user;
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Lỗi khi lấy thông tin profile' });
    }
});

app.put('/api/profile/update', auth, async (req, res) => {
    try {
        const { full_name } = req.body;
        if (!full_name) {
            return res.status(400).json({ error: 'Tên không được để trống' });
        }

        console.log('Updating profile for user:', req.user.id);
        console.log('New name:', full_name);

        const [result] = await db.execute(
            'UPDATE users SET full_name = ? WHERE id = ?',
            [full_name, req.user.id]
        );

        console.log('Update result:', result);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }

        res.json({ 
            message: 'Cập nhật thành công',
            user: {
                ...req.user,
                full_name
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Lỗi khi cập nhật thông tin' });
    }
});

app.put('/api/profile/change-password', auth, async (req, res) => {
    try {
        const { current_password, new_password } = req.body;
        
        if (!current_password || !new_password) {
            return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin' });
        }

        console.log('Changing password for user:', req.user.id);

        // Kiểm tra mật khẩu hiện tại
        const isMatch = await bcrypt.compare(current_password, req.user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Mật khẩu hiện tại không đúng' });
        }

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(new_password, 10);

        // Cập nhật mật khẩu
        const [result] = await db.execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, req.user.id]
        );

        console.log('Password update result:', result);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }

        res.json({ message: 'Đổi mật khẩu thành công' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Lỗi khi đổi mật khẩu' });
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error('\n=== Error ===');
    console.error('Error stack:', err.stack);
    console.error('==================\n');
    res.status(500).json({ error: 'Lỗi server', details: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('\n=== Server Started ===');
    console.log(`Server đang chạy trên port ${PORT}`);
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('=====================\n');
});
