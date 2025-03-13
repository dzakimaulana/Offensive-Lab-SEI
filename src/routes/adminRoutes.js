const express = require("express");
const router = express.Router();
const db = require("../config/database");

// Tambah Buku
router.post("/books/add", (req, res) => {
  const { title, author, year } = req.body;
  if (!title || !author || !year) {
    return res.redirect("/dashboard");
  }

  const sql = "INSERT INTO books (title, author, year) VALUES (?, ?, ?)";
  db.query(sql, [title, author, year], (err, result) => {
    if (err) {
      console.error("Error inserting book:", err);
      return res.status(500).send("Database error.");
    }
    res.redirect("/dashboard");
  });
});

// Hapus Buku
router.post("/books/delete/:id", (req, res) => {
  const bookId = req.params.id;
  const sql = "DELETE FROM books WHERE id = ?";

  db.query(sql, [bookId], (err, result) => {
    if (err) {
      console.error("Error deleting book:", err);
      return res.status(500).send("Database error.");
    }
    res.redirect("/dashboard");
  });
});

module.exports = router;
