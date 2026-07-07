const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'library.db');

// Initialize SQLite database
const db = new Database(DB_PATH);

// Create books table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT,
    status TEXT DEFAULT 'want to read',
    category TEXT,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

console.log('Database initialized successfully.');

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Explicitly serve the frontend on the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
