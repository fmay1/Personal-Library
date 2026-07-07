# LESSONS.md

┌─────────────────────────────────────┐
│  YOUR COMPUTER                     │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  BROWSER (Chrome/Firefox)     │  │
│  │  └─ app.js runs HERE          │  │
│  │     (has access to:           │  │
│  │      - HTML elements          │  │
│  │      - user clicks            │  │
│  │      - fetch() to make HTTP   │  │
│  │      requests)                │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  NODE.JS PROCESS              │  │
│  │  └─ server.js runs HERE       │  │
│  │     (has access to:           │  │
│  │      - file system            │  │
│  │      - SQLite database        │  │
│  │      - HTTP server            │  │
│  │      - Express routing)       │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Browser (Frontend)                         │
│  ┌───────────┬──────────┬────────────────┐  │
│  │ index.html│ style.css│ app.js         │  │
│  │ (structure│ (looks)  │ (logic + HTTP  │  │
│  │  + form   │          │  requests)     │  │
│  └───────────┴──────────┴────────────────┘  │
└──────────────┬──────────────────────────────┘
               │ HTTP (fetch)
               ▼
┌─────────────────────────────────────────────┐
│  Node.js Server (Backend)                   │
│  ┌──────────────────────────────────────┐   │
│  │ server.js                            │   │
│  │  ├─ Express (routing + static files) │   │
│  │  └─ better-sqlite3 (database queries)│   │
│  └──────────────────────────────────────┘   │
└──────────────┬──────────────────────────────┘
               ▼
┌─────────────────────────────────────────────┐
│  library.db (SQLite file on disk)           │
│  ┌──────────────────────────────────────┐   │
│  │ books table                          │   │
│  │ id | title | author | status | ...   │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘


Lessons learned while building the Personal Library Tracker.

---

## Part 1: `server.js` (The Backend)

This is the brain of the app. It does three things:

**a) Sets up Express** — Express is a lightweight framework that makes it easy to define routes (URLs that respond to requests). Think of it as a mail sorter: when a request comes in, Express looks at the URL and HTTP method and sends it to the right handler function.

**b) Initializes SQLite** — On startup, `server.js` creates (or opens) the `library.db` file and runs a `CREATE TABLE IF NOT EXISTS books (...)` command. This ensures the database and table exist before any requests arrive. If the file doesn't exist yet, SQLite creates it. If it already exists, nothing happens.

**c) Defines API routes** — These are the endpoints that `app.js` will call:

| Method | URL | What it does |
|--------|-----|-------------|
| GET | `/api/books` | Returns all books as JSON |
| POST | `/api/books` | Adds a new book (with title validation) |
| PUT | `/api/books/:id` | Updates an existing book |
| DELETE | `/api/books/:id` | Removes a book |

**d) Serves static files** — Express also serves `public/index.html`, `public/style.css`, and `public/app.js` so the browser can load them.

---

## Part 2: `public/index.html` (The Page Structure)

This is the single HTML page the user sees. It contains:

- A `<form>` with inputs for title, author, status (dropdown), category, and notes
- A `<table>` that will display all books (initially empty or with a "no books yet" message)
- A search `<input>` above the table
- A `<script src="app.js">` tag to load the frontend logic

This is intentionally simple — no frameworks, no build step. Just plain HTML.

---

## Part 3: `public/style.css` (The Styling)

Basic CSS to make the page readable and organized. It handles layout (form on top, table below), spacing, button styles, error message styling, etc. Nothing fancy — just functional.

---

## Part 4: `public/app.js` (The Frontend Logic)

This is where all the user interaction happens. Here's what it does:

**On page load:**
- Sends a `GET /api/books` request to populate the table with all existing books

**When the form is submitted:**
- Prevents the default form submission (which would reload the page)
- Validates that the title field is not empty
- Checks if a book with the same title already exists (by looking at the current list or making an API call)
- If it's a duplicate, shows a warning dialog: "You already have this book. Add anyway?"
- Sends a `POST /api/books` request with the form data as JSON
- On success, appends the new book to the table

**When Edit is clicked on a row:**
- Transforms that table row into editable inputs (pre-filled with current values)
- Changes the "Edit" button to "Save"

**When Save is clicked:**
- Validates the title is not empty
- Sends a `PUT /api/books/:id` request with the updated data
- Reverts the row back to display mode

**When Delete is clicked on a row:**
- Shows a confirmation dialog: "Are you sure?"
- If confirmed, sends a `DELETE /api/books/:id` request
- Removes the row from the table

**When the user types in the search box:**
- Filters the visible rows in real-time by checking if the search text matches any part of title, author, or category
- Hides non-matching rows; shows matching ones

---

## Part 5: SQLite (`library.db`)

SQLite is a file-based database. Unlike MySQL or PostgreSQL, it doesn't run as a separate server — it's just a file on disk that you query directly. This makes it perfect for this project because:

- No separate database installation needed
- The data persists between server restarts (it's saved to the file)
- It's lightweight and fast for small-scale apps

The `books` table has these columns:

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PRIMARY KEY | Auto-incrementing, unique identifier |
| title | TEXT | Required, cannot be empty |
| author | TEXT | Free text |
| status | TEXT | One of: "reading", "read", "want to read" |
| category | TEXT | Free text |
| notes | TEXT | Optional |
| created_at | TEXT | ISO timestamp when the book was added |

---

## 1. Why Two JavaScript Files? (app.js vs server.js)

**They run in completely different environments that cannot share code:**

- **`app.js`** runs in the **browser**. It has access to HTML elements, user clicks, and `fetch()` to make HTTP requests. It cannot read files from disk or talk to a database directly.
- **`server.js`** runs in **Node.js**. It has access to the file system, SQLite database, and HTTP server. It cannot manipulate HTML elements or respond to user clicks.

They communicate over HTTP — the same protocol your browser uses to load any website.

---

## 2. How Frontend and Backend Communicate

When `app.js` needs data from the database, it sends an HTTP request:

```javascript
// In app.js (browser)
const response = await fetch('/api/books', {
  method: 'POST',
  body: JSON.stringify(bookData)
});
```

This request travels to `server.js` (Node.js), which queries SQLite and sends back a JSON response. The HTTP request is the **bridge** between the two environments.

---

## 3. What Is `/api/books`?

`/api/books` is a **URL path** (a destination address). It's the address that `app.js` sends requests to, and Express in `server.js` is listening for requests at that address.

The `/api/` prefix is just a naming convention to separate API endpoints from regular pages:
- `GET /` → serves the HTML page
- `GET /api/books` → returns all books as JSON
- `POST /api/books` → adds a new book
- `PUT /api/books/1` → updates book with id=1
- `DELETE /api/books/1` → deletes book with id=1

---

## 4. How Express Works

Express is a library that `server.js` imports and uses. **You tell Express what to do**, not the other way around.

**Two phases:**

1. **Setup time** (when server starts): `server.js` tells Express which URLs to watch and which functions to run for each URL
2. **Request time** (when user clicks): Express receives the request, looks up which function matches, and runs it

```javascript
// Setup time - you define the route and handler
app.post('/api/books', (req, res) => {
  // This is YOUR function (the handler)
  // Express will call it when a POST request arrives
  const { title, author } = req.body;
  db.prepare('INSERT INTO books ...').run(title, author);
  res.json(newBook);
});
```

---

## 5. What Is a Handler Function?

A **handler function** is the function you write that handles a request. "Handler" and "function" are the same thing — "handler" just describes what it does.

In `app.post('/api/books', yourFunction)`:
- `app.post()` is Express's function to register a route
- `'/api/books'` is the URL to watch
- `yourFunction` (the handler) is **your code** that does the actual work (database queries, validation, response)

---

## 6. Is Express Necessary?

No — Node.js has a built-in `http` module. But Express saves you from writing boilerplate:

**Without Express:** You manually parse URLs, check methods with `if/else` chains, parse JSON bodies, read files, set response headers

**With Express:** Express handles routing, parsing, static files, and response formatting — you just write the application logic

Express isn't about speed — it's about **writing less code to do the same thing**.

---

## 7. How to Observe HTTP Requests in DevTools

**Open DevTools:** Press `F12` or right-click → "Inspect"

**Network tab:** Shows every HTTP request the browser makes
- Check "Preserve log" so requests don't disappear on refresh
- Type `/api` in the filter bar to show only API requests
- Click a request to see details:
  - **Headers** → HTTP method (GET/POST/PUT/DELETE), status code
  - **Payload** → JSON data sent in the request body
  - **Response** → JSON data the server sent back

**Console tab:** Shows `console.log()` output and errors

**Example flow to watch:**
1. Refresh page → see GET `/api/books` request
2. Add a book → see POST `/api/books` request with payload
3. Edit a book → see PUT `/api/books/:id` request
4. Delete a book → see DELETE `/api/books/:id` request

---

## 8. HTML Validation Happens Before JavaScript

The `required` attribute on an input field is a built-in HTML feature. When the browser sees it, it **blocks the form from submitting** if the field is empty — before any JavaScript runs.

```html
<input type="text" id="title" name="title" required>
```

This means:
1. User clicks "Add Book" with empty title
2. Browser blocks the submission silently
3. `app.js` never runs, so no HTTP request is sent
4. No error appears in the console

To see server-side validation in action, you'd need to remove `required` so the form actually submits.

---

## 9. Parameterized Queries Prevent SQL Injection

Instead of concatenating user input directly into SQL strings (which is vulnerable to SQL injection attacks), use placeholders like `?` that SQLite safely escapes:

```javascript
// Safe - parameterized query
db.prepare('INSERT INTO books (title, author) VALUES (?, ?)').run(title, author)

// Dangerous - string concatenation (DON'T DO THIS)
db.exec(`INSERT INTO books (title) VALUES ('${title}')`)
```

---

## 10. The Complete Data Flow

When a user adds a book:

1. User fills out form in browser and clicks "Add Book"
2. `app.js` intercepts the submit event, prevents page reload, validates title
3. `app.js` sends `POST /api/books` with form data as JSON
4. Express receives the request at the `/api/books` route
5. Express calls your handler function in `server.js`
6. Handler validates title, runs `INSERT INTO books ...` with parameterized query
7. SQLite writes data to `library.db` file on disk
8. SQLite returns the new row's id
9. Handler sends back JSON response with the created book
10. `app.js` receives the response and appends a new row to the table

The same pattern applies for GET (list), PUT (edit), and DELETE — just different HTTP methods and different SQL queries.

---

## 11. Single Process, Single Port

Everything runs in one Node.js process on one port (3000):
- GET requests to `/` serve the HTML file
- GET requests to `/app.js` serve the JavaScript file
- POST/PUT/DELETE requests to `/api/books/*` handle the API
- No separate frontend server, no build step, no bundler

---

## 12. Synchronous vs Asynchronous Database Calls

`better-sqlite3` is **synchronous**, meaning database calls block the code until they finish. This keeps code simpler because we don't need `async/await` for DB operations. Express handles concurrent requests by running each in its own thread internally.

---

## Quick Reference: HTTP Methods

| Method | Purpose | Your Route | SQL Query |
|--------|---------|------------|-----------|
| GET | Read data | `app.get('/api/books', ...)` | `SELECT * FROM books` |
| POST | Create data | `app.post('/api/books', ...)` | `INSERT INTO books ...` |
| PUT | Update data | `app.put('/api/books/:id', ...)` | `UPDATE books SET ...` |
| DELETE | Remove data | `app.delete('/api/books/:id', ...)` | `DELETE FROM books WHERE ...` |
