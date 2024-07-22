const express = require('express');
const router = express.Router();

module.exports = (db, upload) => {
    router.get('/threads', async (req, res) => {
        try {
            const [threads] = await db.execute('SELECT id, title, created_at, image FROM threads ORDER BY created_at DESC');
            res.json(threads);
        } catch (error) {
            console.error('Error fetching threads:', error);
            res.status(500).json({ error: 'Error fetching threads' });
        }
    });

    router.get('/threads/:threadId', async (req, res) => {
        const threadId = req.params.threadId;
        try {
            const [threads] = await db.execute('SELECT * FROM threads WHERE id = ?', [threadId]);

            if (threads.length === 0) {
                res.status(404).json({ error: 'Thread not found' });
                return;
            }

            const thread = threads[0];
            const [comments] = await db.execute('SELECT * FROM comments WHERE thread_id = ? ORDER BY created_at ASC', [threadId]);

            thread.comments = comments;
            res.json(thread);
        } catch (error) {
            console.error('Error fetching thread:', error);
            res.status(500).json({ error: 'Error fetching thread' });
        }
    });

    router.post('/threads', upload.single('image'), async (req, res) => {
        console.log('Received thread creation request:', req.body);
        const { title, content } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        console.log('Image path:', imagePath);

        try {
            const [result] = await db.execute('INSERT INTO threads (title, content, image) VALUES (?, ?, ?)', [title, content, imagePath]);
            console.log('Thread created successfully:', result);
            res.status(201).json({ id: result.insertId, title, content, image: imagePath });
        } catch (error) {
            console.error('Error creating thread:', error);
            res.status(500).json({ error: `Error creating thread: ${error.message}` });
        }
    });

    router.post('/threads/:threadId/comments', async (req, res) => {
        const { threadId } = req.params;
        const { content } = req.body;
        try {
            const [result] = await db.execute('INSERT INTO comments (thread_id, content) VALUES (?, ?)', [threadId, content]);
            res.status(201).json({ id: result.insertId, thread_id: threadId, content });
        } catch (error) {
            console.error('Error creating comment:', error);
            res.status(500).json({ error: 'Error creating comment' });
        }
    });

    return router;
};