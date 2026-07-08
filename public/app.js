document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle logic
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButton(savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
  });

  function updateThemeButton(theme) {
    themeToggle.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
  }

  const form = document.getElementById('book-form');
  const booksBody = document.getElementById('books-body');
  const noBooksMessage = document.getElementById('no-books-message');
  const searchInput = document.getElementById('search-input');
  const noSearchResultsMessage = document.getElementById('no-search-results-message');
  const sortSelect = document.getElementById('sort-select');

  let allBooks = [];
  let currentSort = 'date-desc';

  // Fetch books when the page loads
  loadBooks();

  // Search/Filter functionality
  searchInput.addEventListener('input', () => {
    renderBooks();
  });

  // Sort functionality
  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderBooks();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const title = formData.get('title').trim();

    // Check for duplicates before submitting
    try {
      const res = await fetch('/api/books');
      if (res.ok) {
        const books = await res.json();
        const isDuplicate = books.some(b => b.title.toLowerCase() === title.toLowerCase());
        if (isDuplicate && !confirm('You already have a book with this title. Add it anyway?')) {
          return;
        }
      }
    } catch (err) {
      console.error('Could not check for duplicates:', err);
    }

    const bookData = {
      title: title,
      author: formData.get('author'),
      status: formData.get('status'),
      category: formData.get('category'),
      notes: formData.get('notes'),
      rating: formData.get('rating') || null
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
      allBooks.push(newBook);
      renderBooks();
      renderSummary();
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

        // Remove from local array and re-render
        allBooks = allBooks.filter(b => b.id != id);
        renderBooks();
        renderSummary();
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
          let value = cell.textContent;
          
          // For rating, use the data attribute instead of text content
          if (field === 'rating') {
            value = cell.dataset.rating || '';
          }
          
          let input;
          
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
              <option value="" ${value === '' ? 'selected' : ''}>Not rated</option>
              <option value="1" ${value === '1' ? 'selected' : ''}>⭐</option>
              <option value="2" ${value === '2' ? 'selected' : ''}>⭐⭐</option>
              <option value="3" ${value === '3' ? 'selected' : ''}>⭐⭐⭐</option>
              <option value="4" ${value === '4' ? 'selected' : ''}>⭐⭐⭐⭐</option>
              <option value="5" ${value === '5' ? 'selected' : ''}>⭐⭐⭐⭐⭐</option>
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
          
          updatedData[field] = input.value;
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
          
          // Update local array and re-render
          const bookIndex = allBooks.findIndex(b => b.id == id);
          if (bookIndex !== -1) {
            Object.assign(allBooks[bookIndex], updatedData);
          }
          renderBooks();
          renderSummary();
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
      
      allBooks = await response.json();
      renderBooks();
      renderSummary();
    } catch (error) {
      console.error('Error loading books:', error);
    }
  }

  function renderBooks() {
    const term = searchInput.value.toLowerCase();
    let filtered = allBooks.filter(book => {
      const title = (book.title || '').toLowerCase();
      const author = (book.author || '').toLowerCase();
      const category = (book.category || '').toLowerCase();
      return title.includes(term) || author.includes(term) || category.includes(term);
    });

    // Sort the filtered books
    filtered.sort((a, b) => {
      if (currentSort === 'title-asc') return (a.title || '').localeCompare(b.title || '');
      if (currentSort === 'title-desc') return (b.title || '').localeCompare(a.title || '');
      if (currentSort === 'date-asc') return new Date(a.created_at) - new Date(b.created_at);
      if (currentSort === 'date-desc') return new Date(b.created_at) - new Date(a.created_at);
      if (currentSort === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
      if (currentSort === 'rating-asc') return (a.rating || 0) - (b.rating || 0);
      return 0;
    });

    booksBody.innerHTML = '';
    if (filtered.length === 0) {
      noBooksMessage.style.display = term === '' ? 'block' : 'none';
      noSearchResultsMessage.style.display = term !== '' ? 'block' : 'none';
    } else {
      noBooksMessage.style.display = 'none';
      noSearchResultsMessage.style.display = 'none';
      filtered.forEach(book => addBookToTable(book));
    }
  }

  function renderSummary() {
    const total = allBooks.length;
    const reading = allBooks.filter(b => b.status === 'reading').length;
    const read = allBooks.filter(b => b.status === 'read').length;
    const wantToRead = allBooks.filter(b => b.status === 'want to read').length;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-reading').textContent = reading;
    document.getElementById('stat-read').textContent = read;
    document.getElementById('stat-want-to-read').textContent = wantToRead;
  }

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
      <td class="editable" data-field="rating" data-rating="${book.rating || ''}">${ratingStars(book.rating)}</td>
      <td>${new Date(book.created_at).toLocaleDateString()}</td>
      <td>
        <button class="edit-btn" data-id="${book.id}">Edit</button>
        <button class="delete-btn" data-id="${book.id}">Delete</button>
      </td>
    `;
    booksBody.appendChild(row);
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
