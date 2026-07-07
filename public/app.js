document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('book-form');
  const booksBody = document.getElementById('books-body');
  const noBooksMessage = document.getElementById('no-books-message');

  // Fetch books when the page loads
  loadBooks();

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
        throw new Error('Failed to add book');
      }

      const newBook = await response.json();
      addBookToTable(newBook);
      form.reset();
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Failed to add book. Please try again.');
    }
  });

  // Handle delete button clicks using event delegation
  booksBody.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const id = e.target.dataset.id;
      if (!confirm('Are you sure you want to delete this book?')) return;

      try {
        const response = await fetch(`/api/books/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Failed to delete book');
        }

        // Remove the row from the table
        e.target.closest('tr').remove();

        // Check if table is empty to show the message
        if (booksBody.children.length === 0) {
          noBooksMessage.style.display = 'block';
        }
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('Failed to delete book. Please try again.');
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

  function addBookToTable(book) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${escapeHtml(book.title)}</td>
      <td>${escapeHtml(book.author || '')}</td>
      <td>${escapeHtml(book.status)}</td>
      <td>${escapeHtml(book.category || '')}</td>
      <td>${escapeHtml(book.notes || '')}</td>
      <td>${new Date(book.created_at).toLocaleDateString()}</td>
      <td>
        <button class="delete-btn" data-id="${book.id}">Delete</button>
      </td>
    `;
    booksBody.appendChild(row);
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
