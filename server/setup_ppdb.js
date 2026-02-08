import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: 'root',
    password: '',
    database: 'sma1gebog'
};

async function createTable() {
    try {
        console.log('Connecting to database...');
        const connection = await mysql.createConnection(dbConfig);

        console.log('Creating table if not exists...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS ppdb_content (
                id INT AUTO_INCREMENT PRIMARY KEY,
                section_key VARCHAR(50) NOT NULL UNIQUE,
                content JSON,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        console.log('Checking for existing data...');
        // Insert default data if empty
        const [rows] = await connection.execute('SELECT * FROM ppdb_content');
        if (rows.length === 0) {
            console.log('Inserting default data...');

            const defaultTimeline = [
                { phase: 'Pendaftaran', date: '1 - 15 Juni 2026' },
                { phase: 'Seleksi Administrasi', date: '16 - 18 Juni 2026' },
                { phase: 'Pengumuman Hasil', date: '20 Juni 2026' },
                { phase: 'Daftar Ulang', date: '21 - 25 Juni 2026' }
            ];

            const defaultRequirements = [
                'Fotocopy Ijazah/SKHUN yang dilegalisir (2 lembar)',
                'Fotocopy Akta Kelahiran (2 lembar)',
                'Fotocopy Kartu Keluarga (2 lembar)',
                'Pas foto berwarna ukuran 3x4 (4 lembar)',
                'Fotocopy Kartu NISN',
                'Surat Keterangan Sehat dari Dokter',
                'Surat Keterangan Kelakuan Baik dari Sekolah'
            ];

            const defaultContact = {
                phone: '(0291) 123456',
                email: 'ppdb@sman1gebog.sch.id',
                hours: '08:00 - 15:00 WIB'
            };

            await connection.execute('INSERT INTO ppdb_content (section_key, content) VALUES (?, ?)', ['timeline', JSON.stringify(defaultTimeline)]);
            await connection.execute('INSERT INTO ppdb_content (section_key, content) VALUES (?, ?)', ['requirements', JSON.stringify(defaultRequirements)]);
            await connection.execute('INSERT INTO ppdb_content (section_key, content) VALUES (?, ?)', ['contact', JSON.stringify(defaultContact)]);

            console.log('Default PPDB content inserted successfully');
        } else {
            console.log('PPDB content already exists, skipping insertion');
        }

        await connection.end();
        console.log('Done.');
    } catch (error) {
        console.error('Error in setup_ppdb:', error);
        process.exit(1);
    }
}

createTable();
