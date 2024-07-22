
# Simple Forum

A lightweight forum application with client-side routing and a Node.js MySQL backend.

## Features

- Client-side routing using vanilla JavaScript
- Responsive design with HTML5 and CSS3
- Node.js backend with Express.js
- MySQL database for data storage
- Image upload support for threads
- Commenting system
- Create new threads
- View all threads and individual thread pages

## Frontend Structure

- `public/index.html`: Main HTML file
- `public/styles.css`: CSS stylesheet
- `public/app.js`: Main JavaScript file for routing and initialization
- `public/home.js`: Renders the home page with thread list
- `public/thread.js`: Renders individual thread pages
- `public/create-thread.js`: Handles thread creation

## Backend Structure

- `server.js`: Main Node.js server file
- `router.js`: Express.js route handlers
- Database connection and queries are integrated into `server.js`

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up MySQL database with the following configuration:
   - Host: localhost
   - User: root
   - Password: 
   - Database: forum_db
   - Port: 3307
4. Run the server: `node server.js`
5. Access the forum at `http://localhost:3000`

## API Endpoints

- `GET /api/threads`: Fetch all threads
- `GET /api/threads/:threadId`: Fetch a specific thread with its comments
- `POST /api/threads`: Create a new thread (supports image upload)
- `POST /api/threads/:threadId/comments`: Add a comment to a thread

## Database Schema

### Threads Table
- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- title (VARCHAR(255))
- content (TEXT)
- image (VARCHAR(255))
- created_at (TIMESTAMP)

### Comments Table
- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- thread_id (INT, FOREIGN KEY referencing threads.id)
- content (TEXT)
- created_at (TIMESTAMP)

## Client-Side Routing

The application uses client-side routing to navigate between different views:
- `/`: Home page with thread list
- `/thread/:id`: Individual thread page
- `/create-thread`: Create new thread page

