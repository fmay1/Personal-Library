# PROGRESS.md

## Current State
Step 9 completed: Client-side search and filter implemented. Users can filter books by title, author, or category in real-time.

## Build Order Progress
- [x] 1. Project structure & dependencies
- [x] 2. Database setup
- [x] 3. Serve frontend
- [x] 4. Add book API endpoint
- [x] 5. Add book form (frontend)
- [x] 6. List books API endpoint
- [x] 7. Delete book API endpoint + button
- [x] 8. Edit book API endpoint + inline editing
- [x] 9. Search/filter
- [ ] 10. Duplicate warning
- [ ] 11. Error handling & polish

## Step 9: Search/filter
- Added a search input field above the books table in `public/index.html`.
- Styled the search box in `public/style.css`.
- Implemented real-time client-side filtering in `public/app.js` that hides/shows table rows based on matches in the title, author, and category fields.
- Added a "No books match your search" message that appears when the filter yields zero results.
