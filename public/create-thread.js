export function renderCreateThread(app) {
    app.innerHTML = `
        <div class="container">
            <h1>Create New Thread</h1>
            <form id="new-thread-form">
                <input type="text" id="thread-title" name="title" placeholder="Thread Title" required>
                <textarea id="thread-content" name="content" placeholder="Thread Content" required></textarea>
                <input type="file" id="thread-image" name="image" accept="image/*">
                <button type="submit">Create Thread</button>
            </form>
            <p><a href="/">Back to Home</a></p>
        </div>
    `;

    const newThreadForm = document.getElementById('new-thread-form');

    newThreadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(newThreadForm);

        try {
            const response = await fetch('/api/threads', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Thread created:', result);
                window.location.href = '/';
            } else {
                const errorData = await response.json();
                console.error('Failed to create thread:', errorData);
                alert(`Failed to create thread: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });
}