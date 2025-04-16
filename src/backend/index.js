
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*', // Cho phép tất cả các origin trong môi trường phát triển
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Middleware để log request
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.url}`);
  console.log('📦 Request body:', req.body);
  next();
});

// Routes
app.use('/api/users', userRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('DT&KTMT1 Backend API is running');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ SERVER ERROR:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Lỗi máy chủ',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});
