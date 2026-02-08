const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sma1gebog',
};

async function setupStaffTable() {
    let connection;
    try {
        console.log('Connecting to database...');
        try {
            connection = await mysql.createConnection(dbConfig);
        } catch (err) {
            console.error('Connection failed:', err.message);
            // Try connecting without database to check if it exists
            const { database, ...configNoDb } = dbConfig;
            connection = await mysql.createConnection(configNoDb);
            await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
            await connection.changeUser({ database: dbConfig.database });
        }

        console.log('Connected.');

        // Create school_staff table
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS school_staff (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                nip VARCHAR(50),
                position ENUM('Guru', 'Staff') NOT NULL,
                subject VARCHAR(100),
                photo VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await connection.query(createTableQuery);
        console.log('school_staff table ensured.');

        // Verify table
        const [rows] = await connection.query("SHOW TABLES LIKE 'school_staff'");
        if (rows.length > 0) {
            console.log('SUCCESS: Table school_staff exists.');
        } else {
            console.error('ERROR: Table school_staff was NOT created.');
        }

    } catch (error) {
        console.error('Error in setup:', error);
    } finally {
        if (connection) await connection.end();
    }
}

setupStaffTable();
