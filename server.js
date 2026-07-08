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

// Database migration: add rating column if it doesn't exist
const currentTableInfo = db.prepare("PRAGMA table_info(books)").all();
const hasRatingColumn = currentTableInfo.some(col => col.name === 'rating');

if (!hasRatingColumn) {
  // Step 1: Rename the existing table
  db.exec('ALTER TABLE books RENAME TO books_old');

  // Step 2: Create the new table with the rating column
  db.exec(`
    CREATE TABLE books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT,
      status TEXT DEFAULT 'want to read',
      category TEXT,
      notes TEXT,
      rating INTEGER CHECK(rating >= 1 AND rating <= 5),
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Step 3: Copy all data from the old table (rating will be NULL for existing books)
  db.exec(`
    INSERT INTO books (id, title, author, status, category, notes, created_at)
    SELECT id, title, author, status, category, notes, created_at
    FROM books_old
  `);

  // Step 4: Drop the old table
  db.exec('DROP TABLE books_old');

  console.log('Database migration: added rating column.');
}

console.log('Database initialized successfully.');

// Parse incoming JSON request bodies
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Explicitly serve the frontend on the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Add a new book
app.post('/api/books', (req, res) => {
  const { title, author, status, category, notes } = req.body;
  
  try {
    const stmt = db.prepare(
      'INSERT INTO books (title, author, status, category, notes, rating) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const result = stmt.run(title, author, status, category, notes, req.body.rating || null);
    
    // Fetch the newly inserted book to return all fields including created_at
    const newBook = db.prepare('SELECT * FROM books WHERE id = ?').get(Number(result.lastInsertRowid));
    res.status(201).json(newBook);
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ error: 'Failed to add book' });
  }
});

// List all books
app.get('/api/books', (req, res) => {
  try {
    const books = db.prepare('SELECT * FROM books ORDER BY created_at DESC').all();
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Update a book
app.put('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, status, category, notes } = req.body;
  
  try {
    const stmt = db.prepare(
      'UPDATE books SET title = ?, author = ?, status = ?, category = ?, notes = ?, rating = ? WHERE id = ?'
    );
    const result = stmt.run(title, author, status, category, notes, req.body.rating || null, Number(id));
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    const updatedBook = db.prepare('SELECT * FROM books WHERE id = ?').get(Number(id));
    res.json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// Delete a book
app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;
  try {
    const stmt = db.prepare('DELETE FROM books WHERE id = ?');
    const result = stmt.run(Number(id));
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
