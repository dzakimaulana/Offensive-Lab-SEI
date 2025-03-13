<<<<<<< HEAD
const express = require("express");
=======
const express = require('express');
const { getAllBooks, getBookById, rateBook, 
    addToFavorites, getFavorites, removeFromFavorites } = require('../controllers/userController');
const { isAuth } = require('../middlewares/authMiddleware');

>>>>>>> 0366d647c52ea06e25ae7d501dabb20f6a686036
const router = express.Router();
const db = require("../config/database");

<<<<<<< HEAD
// Middleware untuk memastikan user sudah login
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect("/");
}
=======
router.use(isAuth);

router.get('/books', getAllBooks);
router.get('/books/:id', getBookById);
router.post('/books/:id/rate', rateBook);

router.post('/favorites/:id', addToFavorites);
router.get('/favorites', getFavorites);
router.delete('/favorites/:id', removeFromFavorites);
>>>>>>> 0366d647c52ea06e25ae7d501dabb20f6a686036

// 📖 Lihat Daftar Buku
router.get("/books", isAuthenticated, (req, res) => {
  db.query("SELECT * FROM books", (err, books) => {
    if (err) throw err;
    res.render("userDashboard", { user: req.session.user, books });
  });
});

// ⭐ Tambah ke Favorit
router.post("/favorites", isAuthenticated, (req, res) => {
  const userId = req.session.user.id;
  const bookId = req.body.book_id;

  db.query(
    "INSERT INTO favorites (user_id, book_id) VALUES (?, ?)",
    [userId, bookId],
    (err) => {
      if (err) {
        console.error("Error menambah favorit:", err);
        return res
          .status(500)
          .json({ success: false, message: "Gagal menambahkan ke favorit" });
      }
      res.json({ success: true, message: "Buku ditambahkan ke favorit!" });
    }
  );
});

module.exports = router;
