
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
  origin: '*', // Cho phép tất cả các origin trong môi trường phát triển
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(cookieParser());

// Log middleware để kiểm tra request
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.originalUrl}`);
  console.log('📦 Request body:', req.body);
  next();
});

// Routes
app.use('/api/users', userRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('DT&KTMT1 Backend API is running');
});

// Error handler middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🔗 API endpoint: http://localhost:${PORT}/api/users`);
});

