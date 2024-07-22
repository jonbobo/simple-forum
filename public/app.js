import { renderHome } from './home.js';
import { renderThread } from './thread.js';
import { renderCreateThread } from './create-thread.js';

const app = document.getElementById('app');



async function router() {
    const path = window.location.pathname;
    try {
        if (path === '/') {
            await renderHome(app);
        } else if (path.startsWith('/thread/')) {
            const threadId = path.split('/')[2];
            await renderThread(app, threadId);
        } else if (path === '/create-thread') {
            await renderCreateThread(app);
        } else {
            app.innerHTML = '<h1>404 - Page Not Found</h1>';
        }
        console.log('Routing completed successfully');
    } catch (error) {
        console.error('Error during routing:', error);
    }
}

document.body.addEventListener('click', async (e) => {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('/')) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        history.pushState(null, '', href);
        await router();
    }
});

window.addEventListener('popstate', async (event) => {
    await router();
});

document.addEventListener('DOMContentLoaded', async () => {

    await router();

});