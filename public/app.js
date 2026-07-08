document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('book-form');
  const booksBody = document.getElementById('books-body');
  const noBooksMessage = document.getElementById('no-books-message');
  const searchInput = document.getElementById('search-input');
  const noSearchResultsMessage = document.getElementById('no-search-results-message');

  // Fetch books when the page loads
  loadBooks();

  // Search/Filter functionality
  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const rows = booksBody.querySelectorAll('tr');
    let visibleCount = 0;

    rows.forEach(row => {
      const title = row.querySelector('[data-field="title"]').textContent.toLowerCase();
      const author = row.querySelector('[data-field="author"]').textContent.toLowerCase();
      const category = row.querySelector('[data-field="category"]').textContent.toLowerCase();

      if (title.includes(term) || author.includes(term) || category.includes(term)) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    if (term === '') {
      noSearchResultsMessage.style.display = 'none';
      noBooksMessage.style.display = booksBody.children.length === 0 ? 'block' : 'none';
    } else {
      noBooksMessage.style.display = 'none';
      noSearchResultsMessage.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const bookData = {
      title: formData.get('title'),
      author: formData.get('author'),
      status: formData.get('status'),
      category: formData.get('category'),
      notes: formData.get('notes')
    };

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to add book');
      }

      const newBook = await response.json();
      addBookToTable(newBook, true); // Prepend new book to top
      form.reset();
    } catch (error) {
      console.error('Error adding book:', error);
      alert(error.message);
    }
  });

  // Handle delete and edit/save button clicks using event delegation
  booksBody.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const id = e.target.dataset.id;
      if (!confirm('Are you sure you want to delete this book?')) return;

      try {
        const response = await fetch(`/api/books/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to delete book');
        }

        // Remove the row from the table
        e.target.closest('tr').remove();

        // Check if table is empty to show the message
        if (booksBody.children.length === 0) {
          noBooksMessage.style.display = 'block';
        }
      } catch (error) {
        console.error('Error deleting book:', error);
        alert(error.message);
      }
    }

    if (e.target.classList.contains('edit-btn') || e.target.classList.contains('save-btn')) {
      const btn = e.target;
      const row = btn.closest('tr');
      
      if (btn.classList.contains('edit-btn')) {
        // Switch to edit mode
        btn.textContent = 'Save';
        btn.classList.remove('edit-btn');
        btn.classList.add('save-btn');
        
        const cells = row.querySelectorAll('.editable');
        cells.forEach(cell => {
          const field = cell.dataset.field;
          const value = cell.textContent;
          let input;
          
          if (field === 'status') {
            input = document.createElement('select');
            input.innerHTML = `
              <option value="want to read" ${value === 'want to read' ? 'selected' : ''}>Want to Read</option>
              <option value="reading" ${value === 'reading' ? 'selected' : ''}>Reading</option>
              <option value="read" ${value === 'read' ? 'selected' : ''}>Read</option>
            `;
          } else if (field === 'notes') {
            input = document.createElement('textarea');
            input.rows = 3;
            input.value = value;
          } else {
            input = document.createElement('input');
            input.type = 'text';
            input.value = value;
          }
          
          input.dataset.field = field;
          cell.innerHTML = '';
          cell.appendChild(input);
        });
      } else {
        // Save mode
        btn.textContent = 'Edit';
        btn.classList.remove('save-btn');
        btn.classList.add('edit-btn');
        
        const id = row.dataset.id;
        const cells = row.querySelectorAll('.editable');
        const updatedData = {};
        
        cells.forEach(cell => {
          const input = cell.querySelector('input, select, textarea');
          updatedData[input.dataset.field] = input.value;
          // Revert to text
          cell.textContent = input.value;
        });
        
        try {
          const response = await fetch(`/api/books/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to update book');
          }
        } catch (error) {
          console.error('Error updating book:', error);
          alert(error.message);
        }
      }
    }
  });

  async function loadBooks() {
    try {
      const response = await fetch('/api/books');
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      
      const books = await response.json();
      booksBody.innerHTML = ''; // Clear existing rows
      
      if (books.length === 0) {
        noBooksMessage.style.display = 'block';
      } else {
        noBooksMessage.style.display = 'none';
        books.forEach(book => addBookToTable(book));
      }
    } catch (error) {
      console.error('Error loading books:', error);
    }
  }

  function addBookToTable(book, prepend = false) {
    const row = document.createElement('tr');
    row.dataset.id = book.id;
    row.innerHTML = `
      <td class="editable" data-field="title">${escapeHtml(book.title)}</td>
      <td class="editable" data-field="author">${escapeHtml(book.author || '')}</td>
      <td class="editable" data-field="status">${escapeHtml(book.status)}</td>
      <td class="editable" data-field="category">${escapeHtml(book.category || '')}</td>
      <td class="editable" data-field="notes">${escapeHtml(book.notes || '')}</td>
      <td>${new Date(book.created_at).toLocaleDateString()}</td>
      <td>
        <button class="edit-btn" data-id="${book.id}">Edit</button>
        <button class="delete-btn" data-id="${book.id}">Delete</button>
      </td>
    `;
    if (prepend) {
      booksBody.insertBefore(row, booksBody.firstChild);
    } else {
      booksBody.appendChild(row);
    }
    noBooksMessage.style.display = 'none';
  }

  function escapeHtml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
