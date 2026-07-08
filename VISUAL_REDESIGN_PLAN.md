# VISUAL_REDESIGN_PLAN.md

**Goal:** Redesign `public/style.css` to give the app a modern, polished look inspired by Linear's clean aesthetic — good typography, subtle color accents, polished form inputs, clean table with hover effects, and nice buttons.

**Scope:** Only `public/style.css` changes. No HTML or JavaScript changes. All existing class names and selectors are preserved.

**Accent color:** `#4f46e5` (indigo/purple)

---

## Steps

### Step 1: Base styles — fonts, colors, page layout

**What changes:** Set a modern font stack, a background color, a text color, and overall page spacing.

**CSS to add/update:**
- `body`: `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;`, `background-color: #f5f5f5`, `color: #1f1f1f`, `line-height: 1.6`
- `h1`: `font-size: 28px`, `font-weight: 600`, `color: #1f1f1f`, `margin-bottom: 24px`
- `h2`: `font-size: 18px`, `font-weight: 500`, `color: #444`, `margin-bottom: 16px`

**Verify:** Run `npm start`, check that the page loads with the new font and colors. Everything should still work.

---

### Step 2: Form styling — inputs, labels, spacing

**What changes:** Make the form inputs look polished with proper borders, padding, and focus states.

**CSS to add/update:**
- `.form-group`: `margin-bottom: 16px`
- `label`: `display: block`, `font-size: 14px`, `font-weight: 500`, `color: #444`, `margin-bottom: 6px`
- `input[type="text"]`, `select`, `textarea`: `width: 100%`, `padding: 10px 12px`, `border: 1px solid #d1d5db`, `border-radius: 6px`, `font-size: 14px`, `font-family: inherit`, `box-sizing: border-box`, `background-color: #fff`
- `input[type="text"]:focus`, `select:focus`, `textarea:focus`: `outline: none`, `border-color: #4f46e5`, `box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1)`
- `#title-error`: `color: #ef4444`, `font-size: 13px`, `margin-top: 4px`, `display: inline-block`

**Verify:** Fill out the form — inputs should look clean, and clicking into a field should show a purple focus ring.

---

### Step 3: Button styling — primary, edit, delete

**What changes:** Give buttons distinct styles — primary (Add Book), secondary (Edit), and danger (Delete).

**CSS to add/update:**
- `#book-form button[type="submit"]`: `background-color: #4f46e5`, `color: #fff`, `padding: 10px 20px`, `border: none`, `border-radius: 6px`, `font-size: 14px`, `font-weight: 500`, `cursor: pointer`, `margin-top: 8px`
- `#book-form button[type="submit"]:hover`: `background-color: #4338ca`
- `.edit-btn`: `background-color: transparent`, `color: #4f46e5`, `border: 1px solid #4f46e5`, `padding: 5px 12px`, `border-radius: 4px`, `font-size: 13px`, `cursor: pointer`
- `.edit-btn:hover`: `background-color: #4f46e5`, `color: #fff`
- `.delete-btn`: `background-color: transparent`, `color: #ef4444`, `border: 1px solid #ef4444`, `padding: 5px 12px`, `border-radius: 4px`, `font-size: 13px`, `cursor: pointer`
- `.delete-btn:hover`: `background-color: #ef4444`, `color: #fff`

**Verify:** The "Add Book" button should be solid purple, Edit should be a purple outline, Delete should be a red outline. Hover states should invert colors.

---

### Step 4: Table styling — header, rows, hover

**What changes:** Make the table look clean with a nice header, proper spacing, and row hover effects.

**CSS to add/update:**
- `table`: `width: 100%`, `border-collapse: separate`, `border-spacing: 0`, `margin-top: 24px`, `background: #fff`, `border-radius: 8px`, `overflow: hidden`, `box-shadow: 0 1px 3px rgba(0,0,0,0.1)`
- `th`: `background-color: #f9fafb`, `font-weight: 600`, `font-size: 13px`, `text-transform: uppercase`, `letter-spacing: 0.05em`, `color: #6b7280`, `padding: 12px 16px`, `border-bottom: 2px solid #e5e7eb`, `text-align: left`
- `td`: `padding: 12px 16px`, `border-bottom: 1px solid #f3f4f6`, `font-size: 14px`, `color: #374151`
- `tr:hover`: `background-color: #f9fafb`
- Remove the old `th, td { border: 1px solid #ddd }` style (the new borders replace it)

**Verify:** The table should look like a clean card with a subtle shadow, uppercase gray headers, and rows that highlight on hover.

---

### Step 5: Search input styling

**What changes:** Make the search box match the form input style.

**CSS to add/update:**
- `#search-input`: `width: 100%`, `padding: 10px 14px`, `border: 1px solid #d1d5db`, `border-radius: 6px`, `font-size: 14px`, `font-family: inherit`, `box-sizing: border-box`, `background-color: #fff`
- `#search-input:focus`: `outline: none`, `border-color: #4f46e5`, `box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1)`
- `.search-container`: `margin-top: 24px`, `margin-bottom: 16px`

**Verify:** The search box should look consistent with the form inputs, with the same purple focus ring.

---

### Step 6: Form card container + empty messages

**What changes:** Wrap the form visually in a card and polish the empty state messages.

**CSS to add/update:**
- `#book-form`: `background: #fff`, `padding: 24px`, `border-radius: 8px`, `box-shadow: 0 1px 3px rgba(0,0,0,0.1)`
- `.empty-message`: `text-align: center`, `color: #9ca3af`, `font-size: 14px`, `margin-top: 24px`, `font-style: italic`
- `.editable input`, `.editable select`, `.editable textarea`: `width: 100%`, `padding: 6px 8px`, `border: 1px solid #d1d5db`, `border-radius: 4px`, `font-size: 13px`, `font-family: inherit`, `box-sizing: border-box`
- `body`: `margin: 0`, `padding: 24px`, `max-width: 1000px`, `margin-left: auto`, `margin-right: auto`

**Verify:** The form should look like a white card on the gray background. The "No books" message should look subtle and centered.

---

## Relevant Files

- **`public/style.css`** — The only file that changes, updated incrementally across 6 steps.
- **`public/index.html`** — Read-only reference for understanding element structure and class names.
- **`public/app.js`** — Read-only reference for understanding dynamically generated elements (`.edit-btn`, `.delete-btn`, `.editable`).

## Verification

- After each step: run `npm start`, open `http://localhost:3000`, verify the visual change looks correct and all functionality still works.
- After all 6 steps: run through the full acceptance test checklist from PLAN.md Section 18.

## Decisions

- 6 small steps, not one big rewrite — each step is one visual concept, easy for the model to handle and for you to understand.
- Purple accent color (#4f46e5) — modern, professional indigo. Easy to change later.
- No HTML/JS changes — pure CSS only.
- Light theme only — no dark mode.
- No CSS framework — writing CSS by hand is the learning goal.
- Status badges deferred — would require JS changes to wrap status in `<span>`.
