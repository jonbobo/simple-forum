const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const createRouter = require('./router');
const dotenv = require('dotenv');


dotenv.config({ path: path.join(__dirname, '..', '.env') });
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

const upload = multer({ dest: path.join(__dirname, '..', 'public', 'uploads') });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

async function initializeDatabase() {
    try {
        const db = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL database');

        // Create threads table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS threads (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                image VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Check if image column exists, if not, add it
        const [columns] = await db.execute('SHOW COLUMNS FROM threads');
        const imageColumnExists = columns.some(column => column.Field === 'image');
        if (!imageColumnExists) {
            await db.execute('ALTER TABLE threads ADD COLUMN image VARCHAR(255)');
            console.log('Image column added to threads table');
        }

        // Create comments table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS comments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                thread_id INT NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (thread_id) REFERENCES threads(id)
            )
        `);

        // Set up the router after the database connection is established
        const router = createRouter(db, upload);
        app.use('/api', router);

        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
        });

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });

    } catch (error) {
        console.error('Database initialization error:', error);
        process.exit(1);
    }
}

initializeDatabase().catch(error => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
});