export async function renderHome(app) {
    app.innerHTML = `
      <div class="container">
          <h1>Simple Forum</h1>
          <div id="thread-list"></div>
          <a href="/create-thread" class="button">Create New Thread</a>
      </div>
  `;

    const threadList = document.getElementById('thread-list');

    async function fetchThreads() {
        const response = await fetch('/api/threads');
        const threads = await response.json();
        threadList.innerHTML = `
          <ul class="thread-list">
              ${threads.map(thread => `
                  <li class="thread-item">
                      <a href="/thread/${thread.id}" class="thread-title">${thread.title}</a>
                      <small>${new Date(thread.created_at).toLocaleString()}</small>
                  </li>
              `).join('')}
          </ul>
      `;
    }

    await fetchThreads();
}