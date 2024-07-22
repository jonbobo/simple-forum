export async function renderThread(app, threadId) {
    app.innerHTML = `
        <div class="container">
            <h1 id="thread-title"></h1>
            <div id="thread-content"></div>
            <div id="comments"></div>
            <div id="new-comment-form">
                <div id="comment-container">
                    <div id="comment-content" contenteditable="true" data-placeholder="Add a comment..."></div>
                    <button id="submit-comment">Submit</button>
                </div>
            </div>
            <p><a href="/">Back to Home</a></p>
        </div>
    `;

    const threadTitle = document.getElementById('thread-title');
    const threadContent = document.getElementById('thread-content');
    const comments = document.getElementById('comments');
    const commentContent = document.getElementById('comment-content');
    const submitComment = document.getElementById('submit-comment');

    async function fetchThread() {
        const response = await fetch(`/api/threads/${threadId}`);
        const thread = await response.json();
        threadTitle.textContent = thread.title;
        threadContent.innerHTML = `
            <p>${thread.content}</p>
            ${thread.image ? `<img src="${thread.image}" alt="Thread image" class="thread-image">` : ''}
        `;
        comments.innerHTML = thread.comments.map(comment => `
            <div class="comment">
                <p>${comment.content}</p>
                <small>${new Date(comment.created_at).toLocaleString()}</small>
            </div>
        `).join('');
    }

    submitComment.addEventListener('click', async () => {
        const content = commentContent.textContent.trim();
        if (content) {
            await fetch(`/api/threads/${threadId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });
            commentContent.textContent = '';
            await fetchThread();
        }
    });

    await fetchThread();
}