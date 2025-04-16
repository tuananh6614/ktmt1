
const mysql = require('mysql2/promise');

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
        )
      `);
      console.log('✅ Đã tạo bảng users thành công');
    } else {
      console.log('✅ Bảng users đã tồn tại');
    }
    
    conn.release();
  } catch (err) {
    console.error('❌ Error connecting to database:', err);
  }
})();

module.exports = pool;
