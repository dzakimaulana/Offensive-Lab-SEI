const db = require('../config/database');
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { decryptCiphertext } = require('../utils/aes');

const dashboardAdmin = async (req, res, next) => {
    if (req.method === "GET") {
        try {
            const books = await db("books")
                .select("id", "title", "author", "year", "cover_image")
                .orderBy("year", "desc");
    
            if (req.xhr) {
                return res.json({ success: true, books });
            }
    
            return res.render("admin/dashboard", { books, username: req.user.username, mysqlStatus: null });
        } catch (error) {
            return next(error);
        }
    }
};

const addBook = async (req, res, next) => {
    if (req.method === "GET") {
        return res.render("admin/addBook", { error: null, username: req.user.username });
    }

    if (req.method === "POST") {
        const { title, author, description, year } = req.body;
        const cover_image = req.file ? "/images/" + req.file.filename : null;

        console.log(title, author, description, year, cover_image);

        if (!title || !author || !year || !cover_image) {
            return res.status(400).render("admin/addBook", {
                error: "Title, author, year, and cover image are required",
                userToken: req.user ? true : false,
            });
        }

        try {
            await db("books").insert({
                title,
                author,
                year,
                description: description || null,
                cover_image,
            });

            return res.status(201).redirect("/admin");
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                const duplicateError = new Error("A book with the same title and author already exists");
                duplicateError.status = 409;
                return next(duplicateError);
            }
            return next(error);
        }
    }
};


const editBook = async (req, res, next) => {
    if (req.method === "GET") {
        try {
            const book = await db('books').where({ id: req.params.id }).first();
            if (!book) {
                return res.status(400).render("admin/editBook", { error: "Book not found", book: null, username: req.user.username });
            }
            return res.render('admin/editBook', { book, error: null, username: req.user.username });
        } catch (error) {
            return next(error);
        }
    }

    if (req.method === "POST") {
        const { id } = req.params;
        const { title, author, year, description } = req.body;

        try {
            let cover_image = null;

            if (req.file) {
                cover_image = req.file.filename;
            }

            const updatedData = { title, author, year, description };

            if (cover_image) {
                updatedData.cover_image = cover_image;
            }

            const updatedRows = await db('books').where({ id }).update(updatedData);
            if (updatedRows === 0) {
                return res.status(404).render("admin/editBook", { error: "Book not found", book: null });
            }

            return res.redirect("/admin");
        } catch (error) {
            return next(error);
        }
    }
};

const deleteBook = async (req, res, next) => {
    const id = parseInt(req.params.id, 10);

    if (!id || isNaN(id)) {
        return res.status(400).redirect("/admin");
    }

    try {
        const book = await db("books").where({ id }).first();

        if (!book) {
            return res.status(400).render("admin/dashboard", { 
                error: "Book not found", 
                username: req.user.username 
            });
        }

        if (book.cover_image) {
            const imagePath = path.join(__dirname, "..", "public", book.cover_image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // Delete the file
            }
        }

        await db("books").where({ id }).del();

        return res.redirect("/admin");
    } catch (error) {
        return next(error);
    }
};

function recursiveMerge(target, source) {
    for (let key in source) {
        if (typeof source[key] === "object" && source[key] !== null) {
            if (!target[key]) target[key] = {};
            recursiveMerge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
}

const checkMySQL = async (req, res, next) => {
    let config = { command: "nc -zv db 3306 2>&1 || echo 'Connection Failed'" };
    // Add decode

    recursiveMerge(config, req.body);

    exec(config.command, (error, stdout, stderr) => {
        if (error) {
            next(error);
        }
        return res.status(200).render("admin/dashboard", { 
            books: null, 
            mysqlStatus: `${stdout}`, 
            username: req.user.username 
        });
    });
};

const viewFile = async (req, res, next) => {
    try {
        const filePathEnc = req.query.file;
        const file = decryptCiphertext(filePathEnc);
        const filePath = path.join(__dirname, "views", file);

        return res.sendFile(filePath);
    } catch (error) {
        return next(error);
    }
};

module.exports = { dashboardAdmin, addBook, editBook, deleteBook, checkMySQL, viewFile };