# PROGRESS.md

## Current State
Step 10 completed: Duplicate warning implemented. Users are warned if they try to add a book with a title that already exists, and can choose to proceed or cancel.

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
- [x] 10. Duplicate warning
- [ ] 11. Error handling & polish

## Step 10: Duplicate warning
- Added client-side duplicate checking in `public/app.js` before submitting the add book form.
- Fetches the current list of books, compares the new title (case-insensitive) against existing titles.
- If a match is found, shows a `confirm()` dialog: "You already have a book with this title. Add it anyway?"
- If the user cancels, submission is aborted. If they confirm, it proceeds normally.
