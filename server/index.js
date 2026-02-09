import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Test DB Connection and Create Tables
app.get('/api/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        res.json({ message: 'Database Connected Successfully!', solution: rows[0].solution });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ error: 'Database connection failed', details: error.message });
    }
});

// Ensure school_staff and extracurriculars table exists
(async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS school_staff (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                nip VARCHAR(50),
                position ENUM('Guru', 'Staff') NOT NULL,
                subject VARCHAR(100),
                photo VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Table school_staff ensured.');

        await db.query(`
            CREATE TABLE IF NOT EXISTS extracurriculars (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category ENUM('Wajib', 'Pilihan', 'Akademik', 'Non-Akademik') DEFAULT 'Pilihan',
                description TEXT,
                schedule VARCHAR(255),
                image VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Table extracurriculars ensured.');

    } catch (error) {
        console.error('Error creating tables:', error);
    }
})();

// Login Endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = rows[0];

        // Simple password check (plaintext)
        if (password !== user.password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Login successful
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// NEWS API

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Generic Upload Endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
});

// NEWS API

// Get all news
app.get('/api/news', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM news ORDER BY date DESC, created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

// Get news by ID
app.get('/api/news/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM news WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'News not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching news detail:', error);
        res.status(500).json({ error: 'Failed to fetch news detail' });
    }
});

// Add new news with image upload
app.post('/api/news', upload.single('image'), async (req, res) => {
    const { title, content, category, date } = req.body;
    // Construct image URL if file uploaded
    const image = req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : null;

    try {
        const [result] = await db.query(
            'INSERT INTO news (title, content, category, image, date) VALUES (?, ?, ?, ?, ?)',
            [title, content, category, image, date]
        );
        res.json({ message: 'News added successfully', id: result.insertId, image });
    } catch (error) {
        console.error('Error adding news:', error);
        res.status(500).json({ error: 'Failed to add news' });
    }
});

// Update news
app.put('/api/news/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, content, category, date } = req.body;

    // Check if new image uploaded
    let imageUpdateSql = '';
    let params = [title, content, category, date];

    if (req.file) {
        const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
        imageUpdateSql = ', image = ?';
        params.push(imageUrl);
    }

    params.push(id);

    try {
        await db.query(
            `UPDATE news SET title = ?, content = ?, category = ?, date = ? ${imageUpdateSql} WHERE id = ?`,
            params
        );
        res.json({ message: 'News updated successfully' });
    } catch (error) {
        console.error('Error updating news:', error);
        res.status(500).json({ error: 'Failed to update news' });
    }
});

// Delete news
app.delete('/api/news/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM news WHERE id = ?', [id]);
        res.json({ message: 'News deleted successfully' });
    } catch (error) {
        console.error('Error deleting news:', error);
        res.status(500).json({ error: 'Failed to delete news' });
    }
});

// PPDB API

// Get all PPDB content
app.get('/api/ppdb', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM ppdb_content');
        const content = {};
        rows.forEach(row => {
            let rowContent = row.content;
            if (typeof rowContent === 'string') {
                try {
                    rowContent = JSON.parse(rowContent);
                } catch (e) {
                    console.error('Error parsing PPDB content JSON:', e);
                    rowContent = {}; // Fallback
                }
            }
            content[row.section_key] = rowContent;
        });
        res.json(content);
    } catch (error) {
        console.error('Error fetching PPDB content:', error);
        res.status(500).json({ error: 'Failed to fetch PPDB content' });
    }
});

// Update PPDB content
app.put('/api/ppdb', async (req, res) => {
    const { timeline, requirements, contact } = req.body;

    try {
        if (timeline) {
            await db.query('UPDATE ppdb_content SET content = ? WHERE section_key = ?', [JSON.stringify(timeline), 'timeline']);
        }
        if (requirements) {
            await db.query('UPDATE ppdb_content SET content = ? WHERE section_key = ?', [JSON.stringify(requirements), 'requirements']);
        }
        if (contact) {
            await db.query('UPDATE ppdb_content SET content = ? WHERE section_key = ?', [JSON.stringify(contact), 'contact']);
        }
        res.json({ message: 'PPDB content updated successfully' });
    } catch (error) {
        console.error('Error updating PPDB content:', error);
        res.status(500).json({ error: 'Failed to update PPDB content' });
    }
});

// Profile API

// Get all Profile content
app.get('/api/profile', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM profile_content');
        const content = {};
        rows.forEach(row => {
            let rowContent = row.content;
            if (typeof rowContent === 'string') {
                try {
                    rowContent = JSON.parse(rowContent);
                } catch (e) {
                    console.error('Error parsing Profile content JSON:', e);
                    rowContent = {}; // Fallback
                }
            }
            content[row.section_key] = rowContent;
        });
        res.json(content);
    } catch (error) {
        console.error('Error fetching Profile content:', error);
        res.status(500).json({ error: 'Failed to fetch Profile content' });
    }
});

// Update Profile content
app.put('/api/profile', async (req, res) => {
    const { visi_misi, sejarah, struktur_organisasi, kepala_sekolah, osis, struktur_kurikulum, program_unggulan } = req.body;
    console.log('Received profile update:', req.body); // Debug log

    try {
        if (visi_misi) {
            await db.query('UPDATE profile_content SET content = ? WHERE section_key = ?', [JSON.stringify(visi_misi), 'visi_misi']);
        }
        if (sejarah) {
            await db.query('UPDATE profile_content SET content = ? WHERE section_key = ?', [JSON.stringify(sejarah), 'sejarah']);
        }
        if (struktur_organisasi) {
            const [rows] = await db.query('SELECT 1 FROM profile_content WHERE section_key = ?', ['struktur_organisasi']);
            if (rows.length > 0) {
                await db.query('UPDATE profile_content SET content = ? WHERE section_key = ?', [JSON.stringify(struktur_organisasi), 'struktur_organisasi']);
            } else {
                await db.query('INSERT INTO profile_content (section_key, content) VALUES (?, ?)', ['struktur_organisasi', JSON.stringify(struktur_organisasi)]);
            }
        }
        if (kepala_sekolah) {
            const [rows] = await db.query('SELECT 1 FROM profile_content WHERE section_key = ?', ['kepala_sekolah']);
            if (rows.length > 0) {
                await db.query('UPDATE profile_content SET content = ? WHERE section_key = ?', [JSON.stringify(kepala_sekolah), 'kepala_sekolah']);
            } else {
                await db.query('INSERT INTO profile_content (section_key, content) VALUES (?, ?)', ['kepala_sekolah', JSON.stringify(kepala_sekolah)]);
            }
        }
        if (osis) {
            const [rows] = await db.query('SELECT 1 FROM profile_content WHERE section_key = ?', ['osis']);
            if (rows.length > 0) {
                await db.query('UPDATE profile_content SET content = ? WHERE section_key = ?', [JSON.stringify(osis), 'osis']);
            } else {
                await db.query('INSERT INTO profile_content (section_key, content) VALUES (?, ?)', ['osis', JSON.stringify(osis)]);
            }
        }
        if (struktur_kurikulum) {
            console.log('Updating struktur_kurikulum:', struktur_kurikulum);
            const [rows] = await db.query('SELECT 1 FROM profile_content WHERE section_key = ?', ['struktur_kurikulum']);
            if (rows.length > 0) {
                await db.query('UPDATE profile_content SET content = ? WHERE section_key = ?', [JSON.stringify(struktur_kurikulum), 'struktur_kurikulum']);
            } else {
                await db.query('INSERT INTO profile_content (section_key, content) VALUES (?, ?)', ['struktur_kurikulum', JSON.stringify(struktur_kurikulum)]);
            }
        }
        if (program_unggulan) {
            console.log('Updating program_unggulan:', program_unggulan);
            const [rows] = await db.query('SELECT 1 FROM profile_content WHERE section_key = ?', ['program_unggulan']);
            if (rows.length > 0) {
                await db.query('UPDATE profile_content SET content = ? WHERE section_key = ?', [JSON.stringify(program_unggulan), 'program_unggulan']);
            } else {
                await db.query('INSERT INTO profile_content (section_key, content) VALUES (?, ?)', ['program_unggulan', JSON.stringify(program_unggulan)]);
            }
        }
        res.json({ message: 'Profile content updated successfully' });
    } catch (error) {
        console.error('Error updating Profile content:', error);
        res.status(500).json({ error: 'Failed to update Profile content' });
    }
});

// STAFF API

// Get all staff
app.get('/api/staff', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM school_staff ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ error: 'Failed to fetch staff' });
    }
});

// Add new staff
app.post('/api/staff', upload.single('photo'), async (req, res) => {
    const { name, nip, position, subject } = req.body;
    // Handle photo URL if uploaded
    const photoUrl = req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : null;

    try {
        const [result] = await db.query(
            'INSERT INTO school_staff (name, nip, position, subject, photo) VALUES (?, ?, ?, ?, ?)',
            [name, nip, position, subject, photoUrl]
        );
        res.status(201).json({ id: result.insertId, name, nip, position, subject, photo: photoUrl });
    } catch (error) {
        console.error('Error adding staff:', error);
        res.status(500).json({ error: 'Failed to add staff' });
    }
});

// Update staff
app.put('/api/staff/:id', upload.single('photo'), async (req, res) => {
    const { id } = req.params;
    const { name, nip, position, subject } = req.body;

    try {
        // If a new photo is uploaded, update it. Otherwise keep existing.
        let query = 'UPDATE school_staff SET name = ?, nip = ?, position = ?, subject = ?';
        let params = [name, nip, position, subject];

        if (req.file) {
            const photoUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
            query += ', photo = ?';
            params.push(photoUrl);
        }

        query += ' WHERE id = ?';
        params.push(id);

        await db.query(query, params);
        res.json({ message: 'Staff updated successfully' });
    } catch (error) {
        console.error('Error updating staff:', error);
        res.status(500).json({ error: 'Failed to update staff' });
    }
});

// Delete staff
app.delete('/api/staff/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM school_staff WHERE id = ?', [id]);
        res.json({ message: 'Staff deleted successfully' });
    } catch (error) {
        console.error('Error deleting staff:', error);
        res.status(500).json({ error: 'Failed to delete staff' });
    }
});

// Facilities API
app.get('/api/facilities', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM facilities ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching facilities:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/facilities', upload.single('image'), async (req, res) => {
    const { name, description, category } = req.body;
    const image = req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : null;
    try {
        const [result] = await db.query(
            'INSERT INTO facilities (name, description, category, image) VALUES (?, ?, ?, ?)',
            [name, description, category, image]
        );
        res.status(201).json({ id: result.insertId, name, description, category, image });
    } catch (error) {
        console.error('Error adding facility:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/facilities/:id', upload.single('image'), async (req, res) => {
    const { name, description, category } = req.body;
    const image = req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : undefined;

    try {
        let query = 'UPDATE facilities SET name = ?, description = ?, category = ?';
        const params = [name, description, category];

        if (image) {
            query += ', image = ?';
            params.push(image);
        }

        query += ' WHERE id = ?';
        params.push(req.params.id);

        await db.query(query, params);
        res.json({ message: 'Facility updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/facilities/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM facilities WHERE id = ?', [req.params.id]);
        res.json({ message: 'Facility deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GALLERY API

// Get all photos
app.get('/api/gallery/photos', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM gallery_photos ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching gallery:', error);
        res.status(500).json({ error: 'Failed to fetch gallery' });
    }
});

// Add new photo
app.post('/api/gallery/photos', upload.single('image'), async (req, res) => {
    const { title, description, category } = req.body;
    const image = req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : null;

    if (!image) {
        return res.status(400).json({ error: 'Image is required' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO gallery_photos (title, description, category, image_url) VALUES (?, ?, ?, ?)',
            [title, description, category, image]
        );
        res.status(201).json({ id: result.insertId, title, description, category, image_url: image });
    } catch (error) {
        console.error('Error adding photo:', error);
        res.status(500).json({ error: 'Failed to add photo' });
    }
});

// Delete photo
app.delete('/api/gallery/photos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM gallery_photos WHERE id = ?', [id]);
        res.json({ message: 'Photo deleted successfully' });
    } catch (error) {
        console.error('Error deleting photo:', error);
        res.status(500).json({ error: 'Failed to delete photo' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// EXTRACURRICULAR API

// Get all extracurriculars
app.get('/api/extracurriculars', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM extracurriculars ORDER BY name ASC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching extracurriculars:', error);
        res.status(500).json({ error: 'Failed to fetch extracurriculars' });
    }
});

// Add new extracurricular
app.post('/api/extracurriculars', upload.single('image'), async (req, res) => {
    const { name, category, description, schedule } = req.body;
    const image = req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : null;

    try {
        const [result] = await db.query(
            'INSERT INTO extracurriculars (name, category, description, schedule, image) VALUES (?, ?, ?, ?, ?)',
            [name, category, description, schedule, image]
        );
        res.status(201).json({ id: result.insertId, name, category, description, schedule, image });
    } catch (error) {
        console.error('Error adding extracurricular:', error);
        res.status(500).json({ error: 'Failed to add extracurricular' });
    }
});

// Update extracurricular
app.put('/api/extracurriculars/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, category, description, schedule } = req.body;

    try {
        let query = 'UPDATE extracurriculars SET name = ?, category = ?, description = ?, schedule = ?';
        let params = [name, category, description, schedule];

        if (req.file) {
            const image = `http://localhost:${PORT}/uploads/${req.file.filename}`;
            query += ', image = ?';
            params.push(image);
        }

        query += ' WHERE id = ?';
        params.push(id);

        await db.query(query, params);
        res.json({ message: 'Extracurricular updated successfully' });
    } catch (error) {
        console.error('Error updating extracurricular:', error);
        res.status(500).json({ error: 'Failed to update extracurricular' });
    }
});

// Delete extracurricular
app.delete('/api/extracurriculars/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM extracurriculars WHERE id = ?', [id]);
        res.json({ message: 'Extracurricular deleted successfully' });
    } catch (error) {
        console.error('Error deleting extracurricular:', error);
        res.status(500).json({ error: 'Failed to delete extracurricular' });
    }
});
