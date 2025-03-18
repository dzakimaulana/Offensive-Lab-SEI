// adminController.js
const db = require('../config/database');

const dashboardAdmin = async (req, res) => {
    try {
        const books = await db("books")
            .select("id", "title", "author", "year", "cover_image")
            .orderBy("year", "desc");

        // Check if request is AJAX
        if (req.xhr) {
            return res.json({ success: true, books });
        }

        res.render("admin/dashboard", { books, userToken: req.user ? true : false });
    } catch (error) {
        console.error("Dashboard Error:", error.message);
        return res.status(500).json({ success: false, error: "Failed to load admin dashboard" });
    }
};


// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await db('users').select('id', 'username', 'role');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

// Add a new book
const addBook = async (req, res) => {
    // Handle GET request (render the add-book form)
    if (req.method === "GET") {
        return res.render("admin/addBook", {
            error: null,
            userToken: req.user ? true : false, // Pass user authentication status
        });
    }

    // Handle POST request (process the form submission)
    if (req.method === "POST") {
        const { title, author, description, year } = req.body;
        const cover_image = req.file ? "/images/" + req.file.filename : null;

        console.log(title, author, description, year, cover_image);

        // Validate required fields
        if (!title || !author || !year || !cover_image) {
            return res.status(400).render("admin/addBook", {
                error: "Title, author, year, and cover image are required",
                userToken: req.user ? true : false,
            });
        }

        try {
            // Insert the new book into the database
            await db("books").insert({
                title,
                author,
                year,
                description: description || null, // Set description to null if not provided
                cover_image, // Store the uploaded file name
            });

            // Redirect to the admin dashboard with a success message
            return res.status(201).redirect("/admin");
        } catch (error) {
            console.error("Error adding book:", error);

            // Handle specific database errors
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).render("admin/addBook", {
                    error: "A book with the same title and author already exists",
                    userToken: req.user ? true : false,
                });
            }

            // Generic error response
            return res.status(500).render("admin/addBook", {
                error: "Failed to add book",
                userToken: req.user ? true : false,
            });
        }
    }

    // Handle unsupported HTTP methods
    return res.status(405).render("error", { error: "Method not allowed" });
};


const editBook = async (req, res) => {
    if (req.method === "GET") {
        try {
            const book = await db('books').where({ id: req.params.id }).first();
            if (!book) {
                return res.status(404).render("admin/editBook", { error: "Book not found", 
                    userToken: req.user ? true : false,
                    book: null });
            }
            res.render('admin/editBook', { book, 
                userToken: req.user ? true : false, 
                error: null });
        } catch (error) {
            console.error("Error fetching book:", error);
            res.status(500).render("admin/editBook", { userToken: req.user ? true : false, 
                error: "Failed to load book", book: null });
        }
    }

    if (req.method === "POST") {
        const { id } = req.params;
        const { title, author, year, description } = req.body;

        try {
            let cover_image = null;

            // If a new file is uploaded, update the cover_image field
            if (req.file) {
                cover_image = req.file.filename;
            }

            const updatedData = {
                title,
                author,
                year,
                description
            };

            if (cover_image) {
                updatedData.cover_image = cover_image;
            }

            const updatedRows = await db('books').where({ id }).update(updatedData);
            if (updatedRows === 0) {
                return res.status(404).render("admin/editBook", { error: "Book not found", book: null });
            }

            res.redirect("/admin");
        } catch (error) {
            console.error("Error updating book:", error);
            res.status(500).render("admin/editBook", { error: "Failed to update book", book: null });
        }
    }
};

// Delete a book
const deleteBook = async (req, res) => {
    const { id } = req.params;

    // Ensure the ID is valid
    if (!id || isNaN(id)) {
        return res.status(400).redirect("/admin");
    }

    try {
        const deletedRows = await db("books").where({ id }).del();

        if (deletedRows === 0) {
            return res.status(404).redirect("/admin");
        }

        res.status(200).redirect("/admin");
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).redirect("/admin");
    }
};

module.exports = { dashboardAdmin, getAllUsers, addBook, editBook, deleteBook };