const db = require('../config/database');

const getAllBooks = async (req, res) => {
    const limit = 10;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const offset = (page - 1) * limit;

    try {
        const books = await db("books")
            .select("books.id", "books.title", "books.cover_image")
            .leftJoin("ratings", "books.id", "ratings.id_book")
            .groupBy("books.id", "books.title", "books.cover_image") // Include cover_image in GROUP BY
            .select(
                db.raw("COALESCE(AVG(ratings.rating), 0) AS average_rating"),
                db.raw("COUNT(ratings.rating) AS total_ratings")
            )
            .limit(limit)
            .offset(offset);

        if (books.length === 0) { // Corrected from favorite.length to books.length
            return res.status(200).json({
                success: true,
                message: "No books available",
                books: [],
            });
        }

        res.status(200).json({ success: true, books });
    } catch (error) {
        console.error("Error retrieving books:", error);
        res.status(500).json({ success: false, error: "Failed to retrieve all books" });
    }
};

const getBookById = async (req, res) => {
    const { id } = req.params;

    try {
        const book = await db("books")
            .where("books.id", id)
            .leftJoin("ratings", "books.id", "ratings.id_book")
            .select(
                "books.id",
                "books.title",
                "books.author",
                "books.description",
                "books.cover_image",
                db.raw("COALESCE(AVG(ratings.rating), 0) as average_rating"),
                db.raw("COUNT(ratings.id) as rating_count")
            )
            .groupBy("books.id", "books.title", "books.author", "books.description", "books.cover_image")
            .first(); // Ensures we return a single object, not an array
        
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        res.status(200).json({ success: true, book });
    } catch (error) {
        console.error("Error retrieving book:", error);
        res.status(500).json({ success: false, error: "Failed to retrieve book" });
    }
};

const rateBook = async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, error: "Rating must be between 1 and 5" });
    }
    
    try {
        
        // Check if the user exists
        const userExists = await db("users").where({ id: userId }).first();
        if (!userExists) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Check if the book exists
        const bookExists = await db("books").where({ id }).first();
        if (!bookExists) {
            return res.status(404).json({ success: false, error: "Book not found" });
        }

        const existingRating = await db("ratings")
            .where({ id_user: userId, id_book: id })
            .first();
        
        if (existingRating) {
            await db("ratings")
                .where({ id_user: userId, id_book: id })
                .update({ rating });
        } else {
            await db("ratings").insert({ id_user: userId, id_book: id, rating });
        }

        res.status(201).json({
            success: true,
            message: "Rating submitted successfully",
        });
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ success: false, error: "Failed to submit rating" });
    }
};


const addToFavorites = async (req, res) => {
    const userId = req.user.id;
    const { bookId } = req.params;

    try {
        const bookExist = await db("books").where({ id: bookId }).first();
        if (!bookExist) return res.status(404).json({ error: "Book not found" });

        // --------
        const duplicate = await db("favorites")
            .where({ user_id: userId, book_id: bookId })
            .first();
        if (duplicate)
        return res.status(400).json({ error: "Book already added to Favorite" });

        await db("favorites").insert({ user_id: userId, book_id: bookId });
        res.status(201).json({ success: true, message: "Book added to Favorite" });
    } catch (error) {
        res.status(500).json({ error: "Failed to add to Favorite" });
    }
};

const getFavorites = async (req, res) => {
    const userId = req.user.id;
    const limit = 10;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const offset = (page - 1) * limit;

    try {
        const favorites = await db("favorites")
            .where({ user_id: userId })
            .join("books", "favorites.book_id", "books.id")
            .select("books.id", "books.title", "books.author")
            .limit(limit)
            .offset(offset);

        if (favorites.length === 0) {
        return res.status(200).json({
            success: true,
            message: "Favorite is empty",
            favorites: [],
        });
    }
        res.status(200).json({ success: true, favorites: favorites });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve favorite" });
    }
};

const removeFromFavorites = async (req, res) => {
    const userId = req.user.id;
    const { bookId } = req.params;

    try {
        const deleted = await db("favorites")
            .where({ user_id: userId, book_id: bookId })
            .del();

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Book not found in favorites",
            });
        }

        res.status(200).json({
            success: true,
            message: "Book removed from favorites",
        });
    } catch (error) {
        res.status(500).json({ success: false, error: "Failed to remove favorite" });
    }
};

module.exports = {
    getAllBooks,
    getBookById,
    rateBook,
    addToFavorites, 
    getFavorites,
    removeFromFavorites
};
