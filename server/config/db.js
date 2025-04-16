
const mysql = require('mysql2/promise');

// Hiển thị thông tin kết nối chi tiết
console.log('🔌 Thông tin kết nối CSDL:', {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dbktmt1'
});

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dbktmt1',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Database connection established');
    
    // Kiểm tra bảng users đã tồn tại chưa
    const [rows] = await conn.query(`
      SELECT COUNT(*) as tableExists 
      FROM information_schema.tables 
      WHERE table_schema = ? AND table_name = 'users'
    `, [process.env.DB_NAME || 'dbktmt1']);
    
    if (rows[0].tableExists === 0) {
      console.log('⚠️ Bảng users chưa tồn tại. Đang tạo bảng...');
      await conn.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          full_name VARCHAR(255) NOT NULL,
          phone_number VARCHAR(20),
          school VARCHAR(255),
          role ENUM('admin', 'user') DEFAULT 'user',
          status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      console.log('✅ Đã tạo bảng users thành công');
      
      // Thêm người dùng admin mặc định
      const hashedPassword = require('bcryptjs').hashSync('admin123', 12);
      try {
        await conn.query(`
          INSERT INTO users (email, password, full_name, role, status)
          VALUES (?, ?, ?, ?, ?)
        `, ['admin@dtktmt1.edu.vn', hashedPassword, 'Admin', 'admin', 'active']);
        console.log('✅ Đã tạo tài khoản admin mặc định');
      } catch (error) {
        console.log('⚠️ Không thể tạo tài khoản admin mặc định:', error.message);
      }
    } else {
      console.log('✅ Bảng users đã tồn tại');
      
      // Kiểm tra cấu trúc bảng users
      const [columns] = await conn.query(`
        SHOW COLUMNS FROM users
      `);
      console.log('📊 Cấu trúc bảng users:', columns.map(c => `${c.Field} (${c.Type})`).join(', '));
    }
    
    conn.release();
  } catch (err) {
    console.error('❌ Error connecting to database:', err);
    console.error('Vui lòng kiểm tra thông tin kết nối CSDL trong file .env');
  }
})();

module.exports = pool;
