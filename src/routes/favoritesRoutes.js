const express = require("express");
const router = express.Router();
const db = require("../config/database");

// Menampilkan daftar buku favorit user yang login
router.get("/favorites", (req, res) => {
  const userId = req.session.user?.id; // Pastikan session user tersedia

  if (!userId) {
    return res.redirect("/login");
  }

  const sql = `
    SELECT favorites.id AS favorite_id, books.title, books.author, books.year
    FROM favorites
    JOIN books ON favorites.book_id = books.id
    WHERE favorites.user_id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching favorites:", err);
      return res.status(500).send("Gagal mengambil daftar favorit.");
    }
    res.render("favorites", { favorites: results });
  });
});

// Menambahkan buku ke daftar favorit
router.post("/favorites/add", (req, res) => {
  const { book_id } = req.body;
  const userId = req.session.user?.id;

  if (!userId) {
    return res.status(401).send("Anda harus login terlebih dahulu.");
  }

  // Cek apakah buku sudah ada di favorit user
  const checkSql = "SELECT * FROM favorites WHERE user_id = ? AND book_id = ?";
  db.query(checkSql, [userId, book_id], (err, results) => {
    if (err) {
      console.error("Error checking favorite:", err);
      return res.status(500).send("Gagal menambahkan ke favorit.");
    }
    if (results.length > 0) {
      return res.redirect("/favorites"); // Buku sudah ada di favorit
    }

    // Tambah ke favorit jika belum ada
    const insertSql = "INSERT INTO favorites (user_id, book_id) VALUES (?, ?)";
    db.query(insertSql, [userId, book_id], (err, result) => {
      if (err) {
        console.error("Error inserting favorite:", err);
        return res.status(500).send("Gagal menambahkan ke favorit.");
      }
      res.redirect("/favorites");
    });
  });
});

// Menghapus buku dari daftar favorit
router.post("/favorites/remove/:id", (req, res) => {
  const favoriteId = req.params.id;
  const userId = req.session.user?.id;

  if (!userId) {
    return res.status(401).send("Anda harus login terlebih dahulu.");
  }

  const sql = "DELETE FROM favorites WHERE id = ? AND user_id = ?";
  db.query(sql, [favoriteId, userId], (err, result) => {
    if (err) {
      console.error("Error removing favorite:", err);
      return res.status(500).send("Gagal menghapus dari favorit.");
    }
    res.redirect("/favorites");
  });
});

module.exports = router;
