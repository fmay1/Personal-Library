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

**Flow 6: Rate a book**
1. When adding a new book, the user sees a "Rating" field with a dropdown containing "Not rated" and star options (⭐ through ⭐⭐⭐⭐⭐)
2. The user selects a rating (1-5 stars) or leaves it as "Not rated"
3. The rating is stored as an integer (1-5) in the SQLite database; "Not rated" means NULL
4. In the table, rated books display their star count (e.g., ⭐⭐⭐ for a 3-star rating); unrated books show a blank cell
5. When editing a book inline, the rating cell becomes a select dropdown with the same options
6. The user can change the rating at any time via inline editing
7. The sort dropdown includes "Rating (Highest)" and "Rating (Lowest)" options; unrated books sort to the bottom for "Highest" and to the top for "Lowest"

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
13. **Star rating** — Add a 1-5 star rating field to books. Stored as an integer (1-5) in SQLite, nullable. Displayed as Unicode star characters (⭐) in the table. Editable via inline cell editing with a select dropdown. Unrated books show blank. Includes sort-by-rating options in the sort dropdown.
14. **Error handling & polish** — Handle server errors gracefully (e.g., "Couldn't connect to server"), ensure empty table shows "no books yet" message

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

### Step 13: Star Rating — Detailed Implementation

**Goal:** Add a 1-5 star rating field to books. Stored as an integer (1-5) in SQLite, nullable. Displayed as Unicode star characters (⭐) in the table. Editable via inline cell editing with a select dropdown. Unrated books show blank. Includes sort-by-rating options in the sort dropdown.

**Why:** Gives users a quick way to rate their favorite books and sort their collection by rating.

**Files to change:** `server.js`, `public/index.html`, `public/app.js`

---

#### 1. Database Migration (`server.js`)

SQLite's `ALTER TABLE` only supports `ADD COLUMN` — it cannot add `CHECK` constraints or modify columns after creation. The safe approach is a table-rename migration:

```javascript
// After the existing CREATE TABLE IF NOT EXISTS block, add:
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
```

**Key points:**
- `PRAGMA table_info(books)` returns an array of column objects; we check if `name === 'rating'` exists.
- The `CHECK(rating >= 1 AND rating <= 5)` constraint ensures only valid ratings are stored.
- Existing books get `rating = NULL` (not rated).

---

#### 2. Backend API Updates (`server.js`)

**POST `/api/books`** — Add `rating` to the INSERT statement:

```javascript
// OLD:
const stmt = db.prepare(
  'INSERT INTO books (title, author, status, category, notes) VALUES (?, ?, ?, ?, ?)'
);
const result = stmt.run(title, author, status, category, notes);

// NEW:
const stmt = db.prepare(
  'INSERT INTO books (title, author, status, category, notes, rating) VALUES (?, ?, ?, ?, ?, ?)'
);
const result = stmt.run(title, author, status, category, notes, req.body.rating || null);
```

**PUT `/api/books/:id`** — Add `rating` to the UPDATE statement:

```javascript
// OLD:
const stmt = db.prepare(
  'UPDATE books SET title = ?, author = ?, status = ?, category = ?, notes = ? WHERE id = ?'
);
const result = stmt.run(title, author, status, category, notes, Number(id));

// NEW:
const stmt = db.prepare(
  'UPDATE books SET title = ?, author = ?, status = ?, category = ?, notes = ?, rating = ? WHERE id = ?'
);
const result = stmt.run(title, author, status, category, notes, req.body.rating || null, Number(id));
```

**Key points:**
- `req.body.rating || null` handles the case where rating is not sent (defaults to NULL).
- The `GET /api/books` endpoint does NOT need changes — it already returns all columns including `rating`.

---

#### 3. Frontend — Add Form (`public/index.html`)

Add a rating field to the "Add a Book" form, after the "Notes" field and before the submit button:

```html
<div class="form-group">
  <label for="rating">Rating</label>
  <select id="rating" name="rating">
    <option value="">Not rated</option>
    <option value="1">⭐ (1 star)</option>
    <option value="2">⭐⭐ (2 stars)</option>
    <option value="3">⭐⭐⭐ (3 stars)</option>
    <option value="4">⭐⭐⭐⭐ (4 stars)</option>
    <option value="5">⭐⭐⭐⭐⭐ (5 stars)</option>
  </select>
</div>
```

**Key points:**
- The "Not rated" option has an empty `value` so it maps to `null` when sent to the backend.
- The `id="rating"` is used in `app.js` to get the form value.

---

#### 4. Frontend — Table Header (`public/index.html`)

Add a "Rating" column header to the table:

```html
<th>Rating</th>
```

Insert it between the "Notes" and "Added" columns in the `<thead>`.

---

#### 5. Frontend — Rendering (`public/app.js`)

**5a. Add rating to form data collection:**

In the form submit handler, add the rating to `bookData`:

```javascript
const bookData = {
  title: title,
  author: formData.get('author'),
  status: formData.get('status'),
  category: formData.get('category'),
  notes: formData.get('notes'),
  rating: formData.get('rating') || null
};
```

**5b. Add rating column to `addBookToTable()`:**

In the `addBookToTable` function, add a new `<td>` for rating between the Notes and Added columns:

```javascript
function addBookToTable(book) {
  const row = document.createElement('tr');
  row.dataset.id = book.id;

  // Helper: convert rating integer to star string
  const ratingStars = (rating) => {
    if (!rating) return '';
    return '⭐'.repeat(rating);
  };

  row.innerHTML = `
    <td class="editable" data-field="title">${escapeHtml(book.title)}</td>
    <td class="editable" data-field="author">${escapeHtml(book.author || '')}</td>
    <td class="editable" data-field="status">${escapeHtml(book.status)}</td>
    <td class="editable" data-field="category">${escapeHtml(book.category || '')}</td>
    <td class="editable" data-field="notes">${escapeHtml(book.notes || '')}</td>
    <td class="editable" data-field="rating">${ratingStars(book.rating)}</td>
    <td>${new Date(book.created_at).toLocaleDateString()}</td>
    <td>
      <button class="edit-btn" data-id="${book.id}">Edit</button>
      <button class="delete-btn" data-id="${book.id}">Delete</button>
    </td>
  `;
  booksBody.appendChild(row);
}
```

**Key points:**
- `ratingStars()` returns an empty string for `null`/`undefined` ratings (blank cell).
- The rating `<td>` has `class="editable"` and `data-field="rating"` so the existing inline-edit logic handles it.

**5c. Handle rating in inline edit mode:**

In the edit/save handler, the existing logic already handles different field types. We need to add a case for the `rating` field in the edit-mode cell creation:

```javascript
// In the edit-btn handler, inside the cells.forEach loop:
if (field === 'status') {
  input = document.createElement('select');
  input.innerHTML = `
    <option value="want to read" ${value === 'want to read' ? 'selected' : ''}>Want to Read</option>
    <option value="reading" ${value === 'reading' ? 'selected' : ''}>Reading</option>
    <option value="read" ${value === 'read' ? 'selected' : ''}>Read</option>
  `;
} else if (field === 'rating') {
  input = document.createElement('select');
  input.innerHTML = `
    <option value="">Not rated</option>
    <option value="1" ${value === '1' ? 'selected' : ''}>⭐</option>
    <option value="2" ${value === '2' ? 'selected' : ''}>⭐⭐</option>
    <option value="3" ${value === '3' ? 'selected' : ''}>⭐⭐⭐</option>
    <option value="4" ${value === '4' ? 'selected' : ''}>⭐⭐⭐⭐</option>
    <option value="5" ${value === '5' ? 'selected' : ''}>⭐⭐⭐⭐⭐</option>
  `;
} else if (field === 'notes') {
  // ... existing notes handling ...
} else {
  // ... existing text input handling ...
}
```

**Key points:**
- The `value` here is the current text content of the cell (e.g., `"⭐⭐⭐"` or `""`).
- We compare `value === '3'` etc. — but wait, the cell displays stars, not numbers. We need to handle this carefully.

**Important fix for rating edit logic:** Since the cell displays stars (e.g., `"⭐⭐⭐"`) but we need to store the number (`3`), we need to store the numeric rating in the `data-field` or use a different approach. The simplest fix: in `addBookToTable()`, store the numeric rating as the cell text and convert to stars only for display:

```javascript
// In addBookToTable(), use a span for display:
<td class="editable" data-field="rating" data-rating="${book.rating || ''}">
  ${ratingStars(book.rating)}
</td>
```

Then in the edit handler, read the numeric value from `data-rating` instead of `textContent`:

```javascript
} else if (field === 'rating') {
  const cell = cells[i];
  const currentRating = cell.dataset.rating || '';
  input = document.createElement('select');
  input.innerHTML = `
    <option value="" ${currentRating === '' ? 'selected' : ''}>Not rated</option>
    <option value="1" ${currentRating === '1' ? 'selected' : ''}>⭐</option>
    <option value="2" ${currentRating === '2' ? 'selected' : ''}>⭐⭐</option>
    <option value="3" ${currentRating === '3' ? 'selected' : ''}>⭐⭐⭐</option>
    <option value="4" ${currentRating === '4' ? 'selected' : ''}>⭐⭐⭐⭐</option>
    <option value="5" ${currentRating === '5' ? 'selected' : ''}>⭐⭐⭐⭐⭐</option>
  `;
  // After creating the select, replace the cell content
  cell.innerHTML = '';
  cell.appendChild(input);
  // Store the numeric value for save
  input.dataset.field = field;
  input.dataset.rating = currentRating;
```

Actually, this is getting complex. Let me simplify: **use a hidden data attribute approach.**

**Simpler approach:** In `addBookToTable()`, store the numeric rating in a `data-rating` attribute on the `<td>`:

```javascript
<td class="editable" data-field="rating" data-rating="${book.rating || ''}">
  ${ratingStars(book.rating)}
</td>
```

In the edit handler, for the `rating` field specifically, read from `data-rating` instead of `textContent`:

```javascript
cells.forEach(cell => {
  const field = cell.dataset.field;
  let value = cell.textContent;

  // For rating, use the data attribute instead of text content
  if (field === 'rating') {
    value = cell.dataset.rating || '';
  }

  // ... then create the select with the correct value ...
});
```

In the save handler, for the `rating` field, write the numeric value back to both `data-rating` and the cell text:

```javascript
cells.forEach(cell => {
  const input = cell.querySelector('input, select, textarea');
  const field = input.dataset.field;
  let displayValue = input.value;

  if (field === 'rating') {
    // Store numeric value in data attribute
    cell.dataset.rating = input.value || '';
    // Display stars in cell text
    cell.textContent = input.value ? '⭐'.repeat(parseInt(input.value)) : '';
  } else {
    cell.textContent = input.value;
  }
});
```

This keeps the edit/save logic working with numeric values while displaying stars.

**5d. Add sort-by-rating options:**

In `public/index.html`, add two new options to the sort dropdown:

```html
<option value="rating-desc">Rating (Highest)</option>
<option value="rating-asc">Rating (Lowest)</option>
```

In `public/app.js`, update the `renderBooks()` sort logic:

```javascript
filtered.sort((a, b) => {
  if (currentSort === 'title-asc') return (a.title || '').localeCompare(b.title || '');
  if (currentSort === 'title-desc') return (b.title || '').localeCompare(a.title || '');
  if (currentSort === 'date-asc') return new Date(a.created_at) - new Date(b.created_at);
  if (currentSort === 'date-desc') return new Date(b.created_at) - new Date(a.created_at);
  if (currentSort === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
  if (currentSort === 'rating-asc') return (a.rating || 0) - (b.rating || 0);
  return 0;
});
```

**Key points:**
- `(b.rating || 0)` treats NULL ratings as 0, so unrated books sort to the bottom for "Highest" and to the top for "Lowest".
- No new API endpoints needed — sorting happens client-side, consistent with existing sort behavior.

---

#### 6. CSS Styling (`public/style.css`) — Optional

The star characters render fine with default font sizing, but you may want to make them slightly larger for visibility:

```css
td[data-field="rating"] {
  font-size: 18px;
  text-align: center;
  min-width: 60px;
}
```

This centers the stars and gives the column enough width. The CSS custom properties already handle dark mode automatically since the star characters are Unicode and don't inherit text color issues.

---

#### 7. Summary of Changes

| File | Changes |
|------|---------|
| `server.js` | Add migration block (PRAGMA check + table rename), update POST and PUT SQL statements to include `rating` |
| `public/index.html` | Add rating `<select>` to form, add "Rating" `<th>` to table, add two sort options |
| `public/app.js` | Add `rating` to form data, add `ratingStars()` helper, add rating `<td>` to `addBookToTable()`, handle rating in edit/save logic, add rating sort cases |
| `public/style.css` | Optional: center and size star characters in the rating column |

---

#### 8. Verification Steps

1. **Restart the server** — `node server.js` should log "Database migration: added rating column."
2. **Add a book with a rating** — Select "⭐⭐⭐ (3 stars)" in the form, submit. The table should show `⭐⭐⭐` in the Rating column.
3. **Add a book without a rating** — Leave the rating as "Not rated", submit. The Rating column should be blank.
4. **Edit a book's rating** — Click Edit on a rated book, change the rating via the select dropdown, click Save. The stars should update.
5. **Sort by rating** — Select "Rating (Highest)" from the sort dropdown. Books with 5 stars should appear first, unrated books at the bottom.
6. **Existing books** — Any books already in the database should display as blank in the Rating column (they have no rating).
7. **Database persistence** — Stop the server, restart it. All ratings should still be there.

---

#### 9. Edge Cases

- **Existing books without ratings:** They get `rating = NULL` after migration. The `ratingStars()` function returns `''` for NULL, so the cell is blank.
- **Sorting with mixed ratings:** NULL ratings are treated as 0 in sort comparisons, so they sort to the bottom (highest) or top (lowest).
- **Rating value validation:** The SQLite `CHECK` constraint prevents invalid values. If somehow an invalid value is sent, the database will reject it and the server returns a 500 error.
- **Edit mode with unrated book:** The select dropdown shows "Not rated" as selected when `data-rating` is empty.

## 17. Open Questions

Questions intentionally left unresolved because they don't block the first implementation:

- Whether to add server-side search/filter later (client-side is fine for now)
- Whether to support multiple categories per book (single category for MVP)
- Whether to add a "last updated" timestamp alongside `created_at`

## 18. Decisions Log

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
