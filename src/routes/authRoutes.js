<<<<<<< HEAD
const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise"); // Gunakan promise
const router = express.Router();

// Koneksi Database (Gunakan createPool agar lebih optimal)
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root", // Sesuaikan dengan password MySQL kamu
  database: "katalog_buku",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Middleware: Cek apakah user sudah login
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect("/login");
}

// 🌟 Halaman Login
router.get("/login", (req, res) => {
  res.render("auth/login", { error: null });
});

// 🔐 Proses Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [users] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    if (users.length === 0) {
      return res.render("auth/login", {
        error: "Username atau password salah!",
      });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.render("auth/login", {
        error: "Username atau password salah!",
      });
    }

    // Simpan sesi user
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    res.redirect("/dashboard"); // 🔥 Redirect ke Dashboard setelah login
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Terjadi kesalahan pada server.");
  }
});

// 🔐 Halaman Register (✅ Sudah diperbaiki)
router.get("/register", (req, res) => {
  res.render("auth/register", { error: null });
});

// 🔐 Proses Register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [users] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    if (users.length > 0) {
      return res.render("auth/register", {
        error: "Username sudah digunakan!",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, 'user')",
      [username, hashedPassword]
    );

    res.redirect("/login");
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send("Terjadi kesalahan pada server.");
  }
});

// 🏠 Halaman Dashboard (hanya untuk user yang sudah login)
router.get("/dashboard", isAuthenticated, async (req, res) => {
  try {
    const [books] = await db.query("SELECT * FROM books"); // Menggunakan await
    res.render("admin/dashboard", {
      user: req.session.user,
      books: books || [],
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Terjadi kesalahan pada server.");
  }
});

// 🔓 Logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;
=======
const express = require('express');
const { register, login, logout } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
>>>>>>> 0366d647c52ea06e25ae7d501dabb20f6a686036
