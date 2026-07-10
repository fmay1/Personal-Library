# PROGRESS.md

## Current State
Step 14 (Error handling & polish) implemented. Added a non-blocking error banner that appears on network/API failures and auto-hides after 5 seconds. Replaced blocking `alert()` calls with the banner for better UX. Verified empty table correctly shows "No books in your collection yet" message. Added server-side validation for `POST /api/books` and `PUT /api/books/:id`. Client-side validation isn't a security or data-integrity boundary, so the server needed to enforce its own stated rules independently of the browser. Specifically, it now rejects requests with missing/whitespace-only titles (400) and validates that ratings, if provided, are integers between 1 and 5 (400).

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
- [x] 11. Client-side sorting
- [x] 12. Summary card
- [x] 13. Star rating
- [x] 14. Error handling & polish

## Visual Redesign Progress
- [x] Step 1: Base styles — fonts, colors, page layout
- [x] Step 2: Form styling — inputs, labels, spacing
- [x] Step 3: Button styling — primary, edit, delete
- [x] Step 4: Table styling — header, rows, hover (refined with card-style rows)
- [x] Step 5: Search input styling
- [x] Step 6: Form card container + empty messages
- [x] Dark Mode: CSS variables, toggle button, localStorage persistence

## Step 1: Base styles (Visual Redesign)
- Updated `body` with a modern system font stack, `#f5f5f5` background, `#1f1f1f` text color, and `1.6` line height.
- Styled `h1` with `28px` size, `600` weight, and `24px` bottom margin.
- Added `h2` styling with `18px` size, `500` weight, `#444` color, and `16px` bottom margin.
- Preserved all existing layout properties (`max-width`, `margin`, `padding`) to maintain current page structure.

## Step 2: Form styling (Visual Redesign)
- Added `.form-group` with `margin-bottom: 16px` for consistent spacing between fields.
- Styled `label` to be block-level, `14px`, `500` weight, `#444` color, with `6px` bottom margin.
- Styled `input[type="text"]`, `select`, and `textarea` with `100%` width, `10px 12px` padding, `#d1d5db` border, `6px` border-radius, `14px` font size, and `#fff` background.
- Added focus states for inputs with `#4f46e5` border and a subtle purple box-shadow.
- Styled `#title-error` with `#ef4444` color, `13px` font size, and `4px` top margin.

## Step 3: Button styling (Visual Redesign)
- Styled `#book-form button[type="submit"]` as a solid purple button (`#4f46e5`) with white text, `10px 20px` padding, and `6px` border-radius. Added hover state (`#4338ca`).
- Styled `.edit-btn` as an outlined purple button with transparent background, `5px 12px` padding, and `4px` border-radius. Hover inverts to solid purple.
- Styled `.delete-btn` as an outlined red button (`#ef4444`) with transparent background, `5px 12px` padding, and `4px` border-radius. Hover inverts to solid red.
- Preserved generic `button` cursor and margin for fallback, but specific classes override as needed.

## Step 4: Table styling (Visual Redesign)
- Updated `table` to use `border-collapse: separate`, `border-spacing: 0 8px`, and `background: transparent` to create vertical gaps between rows.
- Styled `th` with transparent background, `600` weight, `13px` uppercase text, `#6b7280` color, `12px 16px` padding, and a `2px` bottom border.
- Styled `td` with `12px 16px` padding, `#fff` background, `box-shadow: 0 1px 2px rgba(0,0,0,0.05)`, and removed bottom borders.
- Added `border-radius: 6px` to `td:first-child` (left edges) and `td:last-child` (right edges) for a clean card appearance.
- Updated `tr:hover td` to change background to `#f9fafb` for row highlighting.

## Step 5: Search input styling (Visual Redesign)
- Styled `#search-input` with `100%` width, `10px 14px` padding, `#d1d5db` border, `6px` border-radius, `14px` font size, `inherit` font family, and `#fff` background to match form inputs.
- Added `#search-input:focus` with `outline: none`, `#4f46e5` border, and purple box-shadow for consistent focus state.
- Updated `.search-container` with `margin-top: 24px` and `margin-bottom: 16px` for better vertical spacing around the search box.

## Step 6: Form card container + empty messages (Visual Redesign)
- Styled `#book-form` as a white card with `24px` padding, `8px` border-radius, and a subtle `box-shadow`. Added `margin-bottom: 24px` to separate it from the search container.
- Updated `.empty-message` to use `#9ca3af` color, `14px` font size, `24px` top margin, and `italic` font style for a softer, more polished empty state.
- Refined `.editable input`, `.editable select`, `.editable textarea` with `6px 8px` padding, `#d1d5db` border, `4px` border-radius, and `13px` font size to fit cleanly inside table cells during inline editing.
- Updated `body` to `max-width: 1000px` and `padding: 24px` for a slightly more spacious layout.

## Dark Mode Implementation
- Introduced CSS custom properties (`:root` and `[data-theme="dark"]`) to manage all color values centrally.
- Added a toggle button in the header that switches the `data-theme` attribute on `<html>`.
- Persisted user preference in `localStorage` so the theme survives page reloads.
- Added smooth `transition` properties to `body`, inputs, and cards for a polished switch effect.
- Updated placeholder text and `<option>` elements to respect theme variables.

## Step 14: Error Handling & Polish
- Added a non-blocking error banner (`#error-banner`) to `index.html` that displays at the top of the page on network or API failures.
- Created a `showError(message)` helper in `app.js` that displays the banner and automatically hides it after 5 seconds, clearing any previous timeouts to prevent flickering.
- Replaced all blocking `alert()` calls in `app.js` with `showError()` for a smoother user experience.
- Updated `loadBooks()` to show a clear "Couldn't connect to server" message if the initial fetch fails, so users aren't left wondering why the table is empty.
- Verified existing empty-state logic in `renderBooks()` correctly shows "No books in your collection yet" when appropriate.
- Added CSS styling for the error banner with light/dark mode support using existing CSS variables.
