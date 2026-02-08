import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sma1gebog',
};

async function setupExtraTable() {
    let connection;
    try {
        console.log('Connecting to database...');
        try {
            connection = await mysql.createConnection(dbConfig);
        } catch (err) {
            console.error('Connection failed:', err.message);
            const { database, ...configNoDb } = dbConfig;
            connection = await mysql.createConnection(configNoDb);
            await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
            await connection.changeUser({ database: dbConfig.database });
        }

        console.log('Connected.');

        // Create extracurriculars table
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS extracurriculars (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category ENUM('Wajib', 'Pilihan', 'Akademik', 'Non-Akademik') DEFAULT 'Pilihan',
                description TEXT,
                schedule VARCHAR(255),
                image VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await connection.query(createTableQuery);
        console.log('Table extracurriculars ensured.');

    } catch (error) {
        console.error('Error in setup:', error);
    } finally {
        if (connection) await connection.end();
    }
}

setupExtraTable();
