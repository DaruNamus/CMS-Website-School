import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function init() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
        });

        const dbName = process.env.DB_NAME || 'sma1gebog';

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        console.log(`Database '${dbName}' checked/created.`);

        await connection.changeUser({ database: dbName });

        await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('Users table checked/created.');

        // Seed admin
        const [rows] = await connection.query('SELECT * FROM users WHERE username = ?', ['admin']);
        if (rows.length === 0) {
            await connection.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['admin', 'admin123', 'admin']);
            console.log('Admin user seeded (admin/admin123).');
        } else {
            console.log('Admin user already exists.');
        }

        await connection.query(`
      CREATE TABLE IF NOT EXISTS news (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        image VARCHAR(255),
        date DATE DEFAULT (CURRENT_DATE),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('News table checked/created.');

        await connection.end();
    } catch (err) {
        console.error('Initialization error:', err);
        process.exit(1);
    }
}

init();
