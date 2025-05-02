const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    static async create(userData) {
        try {
            const { email, password, full_name, phone_number, school } = userData;
            
            console.log('=== Creating User ===');
            console.log('User data:', {
                email,
                full_name,
                phone_number,
                school
            });

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log('Password hashed successfully');

            // SQL query
            const sql = `
                INSERT INTO users 
                (email, password, full_name, phone_number, school, status, role) 
                VALUES (?, ?, ?, ?, ?, 'active', 'user')
            `;
            const values = [email, hashedPassword, full_name, phone_number, school];
            
            console.log('Executing SQL query:', sql);
            console.log('Query values:', values);

            const [result] = await db.execute(sql, values);
            
            console.log('Database response:', result);
            console.log('User created with ID:', result.insertId);
            
            return result.insertId;
        } catch (error) {
            console.error('Error in User.create:', error);
            if (error.code === 'ER_NO_SUCH_TABLE') {
                throw new Error('Bảng users chưa được tạo trong database');
            }
            throw error;
        }
    }

    static async findByEmail(email) {
        try {
            console.log('=== Finding User by Email ===');
            console.log('Email:', email);

            const [rows] = await db.execute(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );

            console.log('Database response:', rows.length ? 'User found' : 'User not found');
            return rows[0];
        } catch (error) {
            console.error('Error in User.findByEmail:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            // Giảm log khi gọi hàm này thường xuyên (chỉ log trong chế độ debug)
            const isDebug = process.env.DEBUG_MODE === 'true';
            
            if (isDebug) {
                console.log('=== Finding User by ID ===');
                console.log('ID:', id);
            }

            const [rows] = await db.execute(
                'SELECT * FROM users WHERE id = ?',
                [id]
            );
            
            // Chỉ log nếu không tìm thấy user hoặc trong chế độ debug
            if (rows.length === 0 || isDebug) {
                console.log('Database response:', rows.length ? 'User found' : 'User not found');
            }
            
            return rows[0];
        } catch (error) {
            console.error('Error in User.findById:', error);
            throw error;
        }
    }

    static async updateStatus(id, status) {
        try {
            console.log('=== Updating User Status ===');
            console.log('ID:', id);
            console.log('New status:', status);

            await db.execute(
                'UPDATE users SET status = ? WHERE id = ?',
                [status, id]
            );

            console.log('Status updated successfully');
        } catch (error) {
            console.error('Error in User.updateStatus:', error);
            throw error;
        }
    }
}

module.exports = User; 