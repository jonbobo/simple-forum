// router.js
const express = require('express');
const router = express.Router();

module.exports = (db, upload) => {
    // GET all threads
    router.get('/threads', async (req, res) => {
        try {
            const [threads] = await db.query('SELECT id, title, created_at, image FROM threads ORDER BY created_at DESC');
            res.json(threads);
        } catch (error) {
            console.error('Error fetching threads:', error);
            res.status(500).json({ error: 'Error fetching threads' });
        }
    });

    // GET a specific thread with its comments
    router.get('/threads/:threadId', async (req, res) => {
        const threadId = req.params.threadId;
        try {
            const [threads] = await db.query('SELECT * FROM threads WHERE id = ?', [threadId]);

            if (threads.length === 0) {
                return res.status(404).json({ error: 'Thread not found' });
            }

            const thread = threads[0];
            const [comments] = await db.query('SELECT * FROM comments WHERE thread_id = ? ORDER BY created_at ASC', [threadId]);

            thread.comments = comments;
            res.json(thread);
        } catch (error) {
            console.error('Error fetching thread:', error);
            res.status(500).json({ error: 'Error fetching thread' });
        }
    });

    // POST a new thread
    router.post('/threads', upload.single('image'), async (req, res) => {
        const { title, content } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        try {
            const [result] = await db.query('INSERT INTO threads (title, content, image) VALUES (?, ?, ?)', [title, content, imagePath]);
            res.status(201).json({ id: result.insertId, title, content, image: imagePath });
        } catch (error) {
            console.error('Error creating thread:', error);
            res.status(500).json({ error: `Error creating thread: ${error.message}` });
        }
    });

    // POST a new comment
    router.post('/threads/:threadId/comments', async (req, res) => {
        const { threadId } = req.params;
        const { content } = req.body;
        try {
            const [result] = await db.query('INSERT INTO comments (thread_id, content) VALUES (?, ?)', [threadId, content]);
            res.status(201).json({ id: result.insertId, thread_id: threadId, content });
        } catch (error) {
            console.error('Error creating comment:', error);
            res.status(500).json({ error: 'Error creating comment' });
        }
    });

    return router;
};