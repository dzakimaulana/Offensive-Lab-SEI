const db = require('../config/database');

const getAllBooks = async (req, res) => {
    const limit = 10;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const offset = (page - 1) * limit;
    const search = req.query.search?.trim() || "";

    try {
        const booksQuery = db("books")
            .select("id", "title", "cover_image", "author", "year");

        if (search) {
            booksQuery.where((builder) => {
                builder
                    .where("title", "like", `%${search}%`)
                    .orWhere("author", "like", `%${search}%`);
            });
        }

        const books = await booksQuery.limit(limit).offset(offset);

        if (req.xhr) {
            return res.json({ success: true, books, search, page });
        }

        return res.status(200).render("user/catalog", { books, search, page, username: req.user.username });
    } catch (error) {
        return res.status(500).render("user/catalog", { books: null, search, page, username: req.user.username, error: "Error retrieving books" });
    }
};

module.exports = { getAllBooks };
