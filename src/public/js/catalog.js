document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search");
    searchInput.addEventListener("input", debounce(fetchBooks, 300));
});

async function fetchBooks() {
    const searchQuery = document.getElementById("search").value.trim();
    const newUrl = searchQuery ? `/books?search=${encodeURIComponent(searchQuery)}` : "/books";
    history.pushState(null, "", newUrl);

    try {
        const response = await fetch(newUrl, { headers: { "X-Requested-With": "XMLHttpRequest" } });
        if (!response.ok) throw new Error("Failed to fetch books");

        const data = await response.json();
        updateBookList(data.books);
    } catch (error) {
        console.error("Error fetching books:", error);
        document.getElementById("book-list").innerHTML = "<p>Error loading books.</p>";
    }
}

function updateBookList(books) {
    const bookList = document.getElementById("book-list");
    bookList.innerHTML = books.length
        ? books.map(book => `
            <li class="book-item">
                <img src="${book.cover_image || '/images/default-book-cover.jpg'}" 
                    alt="${book.title || 'Unknown Title'} Cover" class="book-cover">
                <div class="book-details">
                    <strong>${book.title || 'Unknown Title'}</strong>
                    <p><em>by ${book.author || 'Unknown Author'}</em></p>
                    <p><small>Published in ${book.year || 'Unknown Year'}</small></p>
                    <p>⭐ ${book.average_rating || '0.0'} ( ${book.total_ratings || '0'} ratings )</p>
                </div>
            </li>
        `).join("")
        : "<p>No books found.</p>";
}

// Debounce function to limit API calls
function debounce(func, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}
