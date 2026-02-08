const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sma1gebog',
};

async function checkTable() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        const [rows] = await connection.query("SHOW TABLES LIKE 'school_staff'");
        if (rows.length > 0) {
            console.log('Table school_staff exists.');
            const [columns] = await connection.query("DESCRIBE school_staff");
            console.log('Columns:', columns.map(c => c.Field));
        } else {
            console.log('Table school_staff does NOT exist.');
        }

    } catch (error) {
        console.error('Error checking table:', error);
    } finally {
        if (connection) await connection.end();
    }
}

checkTable();
