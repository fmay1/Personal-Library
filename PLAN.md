# PLAN.md

**What I'm building:** A personal library/inventory tracker — add, view, edit, delete, and search items in a collection, with data stored in a real database accessed through a backend server.

**What this project is meant to teach me:** Splitting an app into a frontend and backend that talk over HTTP, and storing data in a real database instead of browser storage.

**Explicit constraints:** Single user, no accounts or login; no external APIs (e.g. fetching book covers); no image uploads; keep the stack to Node.js, Express, and SQLite — nothing else without checking in first.

---

## 1. Overview

- **App name:** Personal Library Tracker
- **One-sentence description:** A personal library tracker where you can add, view, edit, delete, and search books in your collection.
- **Concept(s) this reinforces:** Splitting an app into a frontend (HTML/CSS/JS) and a backend (Express + SQLite) that communicate over HTTP, and storing data in a real database instead of browser storage.

## 2. Learning Boundary

This project should primarily teach:

- How a frontend communicates with a backend over HTTP using `fetch()`
- How Express routes handle different HTTP methods (GET, POST, PUT, DELETE) for CRUD operations
- How SQLite stores data in a file and how it is queried from Node.js
- How parameterized SQL queries prevent SQL injection
- How static files are served by the same Express server that handles API requests

Things the AI should avoid introducing unless I explicitly approve them:

- ORMs (e.g., Sequelize, Prisma) — we'll use raw SQL to understand how databases actually work
- Authentication / login / user accounts — this is single-user, no accounts needed
- Environment variables (.env files) — config values can live in code for now
- Package managers beyond npm (e.g., yarn, pnpm) — we'll stick with npm
- Build tools / bundlers (e.g., Webpack, Vite, Babel) — no transpilation needed for this stack
- TypeScript — plain JavaScript to keep things straightforward
- WebSockets / real-time features — HTTP requests are sufficient
- Background workers / queues — not needed for MVP
- Dependency injection / complex design patterns — simple, explicit code is better here
- Docker / containerization — runs locally on your machine only

## 3. Core Features (MVP)

1. **Add books** — enter details about a book and save it to the database
2. **View all books** — see a table of everything in the collection, visible on page load below the add form
3. **Edit books** — modify an existing entry inline in the table
4. **Delete books** — remove an item from the collection (with confirmation)
5. **Search/filter books** — find books by typing in a search box that filters across title, author, and category

## 4. Data Model

- **Entity name:** Book
  - **Purpose:** Represents one book in the personal collection
  - **Fields:**
    - `id` (integer, auto-incrementing primary key)
    - `title` (text, required — the book's title)
    - `author` (text — the author's name)
    - `status` (text, dropdown: "reading", "read", "want to read")
    - `category` (text, free text — e.g., fiction, non-fiction, science)
    - `notes` (text, optional — personal notes about the book)
    - `created_at` (text — timestamp of when the entry was created)
  - **Relationships:** none
  - **Validation rules:** title cannot be empty

## 5. Assumptions

- Single user, no accounts or login needed
- Desktop browser only (Chrome/Firefox/etc.), not mobile-first
- Runs locally on your machine (no deployment or hosting)
- English language only
- The app runs entirely in one browser tab
- Everything runs as a single Node.js process on one port

## 6. Storage & Persistence

- **Where data lives:** SQLite database file on the server side, accessed through an Express backend
- **Mechanism:** Database file named `library.db` in the project root; table named `books` with columns matching the fields from Section 4 (id, title, author, status, category, notes, created_at)

## 7. Architecture

**Files/modules and their responsibilities:**

1. **`server.js`** — Express server that:
   - Serves the frontend HTML file as a static asset
   - Provides API endpoints (routes) for CRUD operations on books
   - Initializes the SQLite database and creates the `books` table if it doesn't exist

2. **`public/index.html`** — The frontend page with:
   - A form to add a new book
   - A table/list showing all books
   - Edit and Delete buttons for each row
   - A search/filter input
   - Embedded `<script>` tag referencing `app.js`

3. **`public/style.css`** — Basic styling for the page

4. **`public/app.js`** — Frontend JavaScript that handles:
   - Form submission (add book)
   - Fetching and displaying the book list from the API
   - Edit and delete button handlers
   - Search/filter logic on the client side

**Data flow:** User interacts with `app.js` → `app.js` sends HTTP requests to Express routes in `server.js` → `server.js` queries SQLite database → results sent back as JSON → `app.js` updates the page. Everything runs in one Node process on one port.

## 8. Tech Stack

1. **Node.js** — JavaScript runtime to run the server
2. **Express** — HTTP framework for routing API endpoints and serving static files
3. **better-sqlite3** — Synchronous SQLite library for Node.js; keeps code simple (no async/await needed for DB calls) and runs directly on a file
4. **HTML / CSS / JavaScript** — Frontend, served as static files by Express

## 9. Key User Flows

**Flow 1: Add a book**
1. User opens the app in their browser (e.g., `http://localhost:3000`)
2. Sees an empty form at the top with fields for: title (required), author, status (dropdown: "reading"/"read"/"want to read"), category (text), notes (optional text area)
3. Fills in the form and clicks "Add Book"
4. If title is empty, an error message appears next to the title field and submission is blocked
5. If a book with the same title already exists, a warning dialog appears: "You already have a book with this title. Add it anyway?" with "Add" and "Cancel" buttons
6. The book appears in the table below the form

**Flow 2: View all books**
1. On page load (or after adding a book), the user sees a table directly below the add form listing all books
2. Each row shows: title, author, status, category, notes, created_at
3. If there are no books, the table shows "No books in your collection yet"

**Flow 3: Edit a book**
1. User clicks the "Edit" button on a book row
2. That row transforms into an inline form with all fields pre-filled
3. User modifies fields and clicks "Save"
4. The updated book appears in the table; if title is empty, submission is blocked

**Flow 4: Delete a book**
1. User clicks the "Delete" button on a book row
2. A confirmation dialog appears ("Are you sure you want to delete this book?") with "OK" and "Cancel"
3. If confirmed, the book is removed from the table
4. If cancelled, nothing changes

**Flow 5: Search/filter books**
1. There is a search input field above the table
2. As the user types, the table filters in real-time to show only books matching the search text (searches across title, author, and category)
3. Clearing the search shows all books again
4. If no books match, the table shows "No books match your search"

## 10. Edge Cases & Error Handling

- **Empty title on add/edit:** show an error message next to the title field, don't submit
- **Duplicate book titles:** show a warning dialog with a choice to proceed or cancel before adding
- **Very long text in fields:** no max length enforced now; browser input handles it gracefully
- **Special characters in title/author/notes:** handled by parameterized SQL queries (no SQL injection risk)
- **Deleting a book:** confirmation dialog before deletion to prevent accidents
- **Server crashes or database file missing on first run:** server creates the database and table automatically on startup
- **Network error / server unavailable:** show a simple error message to the user (e.g., "Couldn't connect to server")
- **Searching with no matches:** table shows "No books match your search"

## 11. Simplicity Rules

- Use the fewest moving parts that solve the problem — one Node process, one port, four files
- Avoid introducing new libraries beyond the agreed stack (Node.js, Express, better-sqlite3)
- Avoid abstractions before they're needed (no utility modules, no class patterns, no complex component architecture)
- Prefer explicit, readable code over clever code
- Client-side search/filter rather than server-side pagination or complex querying
- Inline editing in the table row rather than a separate edit page

## 12. Out of Scope (For This Build)

Things explicitly NOT being built in this version:

- User accounts / authentication / login
- Book cover images or file uploads
- Integration with external APIs (e.g., fetching book data from Google Books, Open Library)
- Exporting/importing data (CSV, JSON, etc.)
- Mobile responsiveness / mobile-first design
- Real-time collaboration or multi-user support
- Tags or multiple categories per book

## 13. Future Ideas

Interesting ideas that came up while planning but aren't decisions:

- Rating system (e.g., star rating)
- Pagination for large collections
- Exporting/importing data (CSV, JSON)
- Book cover images
- Integration with external APIs (Google Books, Open Library) to auto-fill book details
- Tags or multiple categories per book
- Reading progress tracking (e.g., current page / total pages)

## 14. Build Order

Milestone-sized steps, layered from simplest to most complex:

1. **Project structure & dependencies** — Initialize npm project, install Express and better-sqlite3, create `server.js`, `public/index.html`, `public/app.js`, `public/style.css`, add a start script in `package.json`
2. **Database setup** — In `server.js`, initialize the SQLite database file (`library.db`), create the `books` table with all fields (id, title, author, status, category, notes, created_at) if it doesn't exist
3. **Serve frontend** — Configure Express to serve static files from the `public/` folder; verify the HTML page loads in the browser at `http://localhost:3000`
4. **Add book API endpoint** — POST `/api/books` route that inserts a new book into the database with title validation (title cannot be empty)
5. **Add book form (frontend)** — HTML form with all fields, client-side validation for required title, JavaScript to send POST request and update the table
6. **List books API endpoint** — GET `/api/books` route that returns all books as JSON; display them in a table on page load below the add form
7. **Delete book API endpoint + button** — DELETE `/api/books/:id` route with confirmation dialog on the frontend before deletion
8. **Edit book API endpoint + inline editing** — PUT `/api/books/:id` route, click Edit to transform row into editable form, Save to send PUT request
9. **Search/filter** — Client-side search input that filters the displayed table in real-time by title, author, or category
10. **Duplicate warning** — On add, check if a book with the same title already exists; show a confirmation dialog before proceeding
11. **Client-side sorting** — Add sort controls (buttons or dropdown) to sort the table by date added (newest/oldest) or alphabetically by title (A-Z/Z-A); sorting happens in JavaScript on the in-memory array after data arrives from the API, consistent with the client-side search/filter approach
12. **Summary card** — Add a card that displays the total number of books and a breakdown by status (read, reading, want to read). Purely client-side — no new API endpoints needed.
13. **Error handling & polish** — Handle server errors gracefully (e.g., "Couldn't connect to server"), ensure empty table shows "no books yet" message

### Step 12: Summary Card — Detailed Implementation

**Goal:** Show a summary card with the total number of books and a breakdown by status (read, reading, want to read).

**Why:** Gives an at-a-glance view of the collection without having to scan the table.

**Files to change:** `public/index.html`, `public/style.css`, `public/app.js`

**HTML (`public/index.html`):**
- Add a `<div class="summary-card">` element between the closing `</form>` tag of the book form and the `.controls-container` (the search/sort bar).
- Inside the summary card, add a `<h2>` with the text "Collection Summary".
- Below the heading, add a `<div class="summary-stats">` containing four `<div class="stat-item">` elements:
  - Each stat item has a `<span class="stat-count">` (the number, initially `0`) and a `<span class="stat-label">` (the label).
  - Labels: "Total", "Reading", "Read", "Want to Read".

**CSS (`public/style.css`):**
- Style `.summary-card` to match the existing card aesthetic: use `--card-bg` for background, `--shadow` for box-shadow, `8px` border-radius, `24px` padding, and `margin-bottom: 24px`.
- Style `.summary-card h2` with a slightly smaller size (`16px`) and `margin-bottom: 16px`.
- Style `.summary-stats` as a flex row with `gap: 24px` and `justify-content: space-around`.
- Style `.stat-item` as a flex column with `align-items: center` and `flex: 1`.
- Style `.stat-count` with a large, bold font (`28px`, `700` weight) using the accent color (`--accent`).
- Style `.stat-label` with a smaller, muted font (`13px`, `#6b7280` color, `text-transform: uppercase`, `500` weight).
- Ensure all colors use CSS custom properties so dark mode works automatically.

**JavaScript (`public/app.js`):**
- Create a `renderSummary()` function that:
  - Takes `allBooks` as its data source (the full collection, not the filtered view).
  - Computes four counts: total (`allBooks.length`), reading, read, and want to read (using `filter` + `length` on the status field).
  - Updates the `.stat-count` elements in the DOM with these values.
- Call `renderSummary()` from the same places where the table is refreshed:
  - After `loadBooks()` completes on page load.
  - After successfully adding a book.
  - After successfully editing a book.
  - After successfully deleting a book.

**No server changes needed.** The `allBooks` array already contains the `status` field for every book, so all counting happens in the browser.

## 15. Open Questions

Questions intentionally left unresolved because they don't block the first implementation:

- Whether to add server-side search/filter later (client-side is fine for now)
- Whether to support multiple categories per book (single category for MVP)
- Whether to add a "last updated" timestamp alongside `created_at`

## 16. Decisions Log

Notes on judgment calls made during this planning conversation:

- **better-sqlite3 over sql.js** — chosen for better performance and wider use; synchronous API keeps code simpler (no async/await for DB calls)
- **Client-side search/filter** — simpler than server-side, sufficient for a single-user app with a small collection
- **Inline editing in the table row** — rather than a separate edit page; fewer moving parts
- **Duplicate detection by title only** — not title + author; same title triggers a warning dialog with a choice to proceed or cancel
- **Single Node process on one port** — Express serves both static files and API endpoints; no separate frontend server needed

## 17. Success Criteria

How I'll know this is actually done and working, beyond "it looks right":

- The app starts with `npm start` and loads at `http://localhost:3000`
- A user can add a book with all fields, and it appears in the table below
- A user can edit an existing book's fields and see the changes reflected immediately
- A user can delete a book (with confirmation) and it disappears from the table
- A user can search/filter the table by typing in a search box
- Duplicate titles trigger a warning dialog before adding
- Empty title input prevents submission with a clear error message
- The database file persists between server restarts (data is not lost)

## 18. Acceptance Tests

A concrete checklist to run through by hand once it's built:

- [ ] Run `npm start`, open `http://localhost:3000` — page loads with an empty table showing "No books in your collection yet"
- [ ] Fill out the add form with all fields and click "Add Book" — book appears in the table below
- [ ] Leave the title field empty and try to submit — error message appears, book is not added
- [ ] Click "Edit" on a book row — row becomes editable with pre-filled values
- [ ] Change a field and click "Save" — changes are reflected in the table
- [ ] Click "Delete" on a book row — confirmation dialog appears; confirm — book is removed
- [ ] Cancel the delete confirmation — book remains in the table
- [ ] Type in the search box — table filters to show only matching books
- [ ] Clear the search box — all books reappear
- [ ] Try adding a book with a title that already exists — warning dialog appears; choose "Cancel" — book is not added
- [ ] Choose "Add" on the duplicate warning — book is added with a note that it's a duplicate
- [ ] Stop the server, restart it — all previously added books are still in the table

## 19. What I Should Be Able to Explain Afterward

By the end of this project, I should be able to explain, in my own words:

- How a frontend (HTML/CSS/JS) communicates with a backend (Express) over HTTP using `fetch()`
- How Express routes handle different HTTP methods (GET, POST, PUT, DELETE) for CRUD operations
- How SQLite stores data in a file and how better-sqlite3 queries it from Node.js
- How parameterized SQL queries prevent SQL injection
- How static files are served by the same Express server that handles API requests
