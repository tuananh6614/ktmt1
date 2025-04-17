const express = require('express');
const cors = require('cors');
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

// Routes
app.post('/api/register', authController.register);
app.post('/api/login', authController.login);

// Protected route example
app.get('/api/profile', auth, (req, res) => {
    console.log('Accessing profile for user:', req.user.id);
    res.json({
        user: {
            id: req.user.id,
            email: req.user.email,
            full_name: req.user.full_name,
            role: req.user.role
        }
    });
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