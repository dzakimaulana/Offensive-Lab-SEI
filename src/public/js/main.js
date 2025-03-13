// You can add any client-side JavaScript here if needed

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search");
    const bookList = document.getElementById("book-list");
    const books = Array.from(bookList.getElementsByTagName("li"));

    searchInput.addEventListener("input", function () {
        const searchTerm = searchInput.value.toLowerCase();

        books.forEach(book => {
            const text = book.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                book.style.display = "block";
            } else {
                book.style.display = "none";
            }
        });
    });
});
