
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', '*'], // Thêm cụ thể origin của frontend và wildcard
  credentials: true, // Cho phép gửi cookies từ browser
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(cookieParser());

// Log middleware để kiểm tra request chi tiết
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.originalUrl}`);
  console.log('📦 Headers:', req.headers);
  console.log('📦 Request body:', req.body);
  
  // Add CORS headers to every response
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle OPTIONS method
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Routes
app.use('/api/users', userRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('DT&KTMT1 Backend API is running');
});

// Test route để kiểm tra kết nối
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working properly',
    timestamp: new Date()
  });
});

// Error handler middleware
app.use(errorHandler);

// Error handler for 404 - Not found
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🔗 API endpoint: http://localhost:${PORT}/api/users`);
});
