const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const port = 3000;
const multer = require("multer");
const path = require("path");

// Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(morgan("dev")); // Log HTTP requests

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 60 * 1000 }, // 30 minutes
  })
);

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "book_catalogue",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

// Middleware: Check if User is Admin
function isAdmin(req, res, next) {
  if (!req.session.userId) return res.redirect("/");

  db.query(
    "SELECT role FROM users WHERE id = ?",
    [req.session.userId],
    (err, results) => {
      if (err) return next(err);
      if (results[0]?.role !== "admin") return res.redirect("/dashboard");
      next();
    }
  );
}

// Routes
// Home Route
app.get("/", (req, res) => res.render("login", { message: null }));

// Register Route
app.get("/register", (req, res) => res.render("register", { message: null }));

app.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.render("register", { message: errors.array()[0].msg });

    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, 'user')",
      [username, hashedPassword],
      (err) => {
        if (err) {
          console.error("Error registering user:", err.message);
          return res.render("register", {
            message: "Username already exists!",
          });
        }
        res.redirect("/");
      }
    );
  }
);

// Login Route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) return next(err);

      if (
        results.length === 0 ||
        !bcrypt.compareSync(password, results[0].password)
      ) {
        return res.render("login", {
          message: "Invalid username or password!",
        });
      }

      req.session.userId = results[0].id;
      res.redirect("/dashboard");
    }
  );
});

// Dashboard Route
app.get("/dashboard", (req, res, next) => {
  if (!req.session.userId) return res.redirect("/");

  db.query(
    "SELECT role FROM users WHERE id = ?",
    [req.session.userId],
    (err, results) => {
      if (err) return next(err);

      const userRole = results[0]?.role;

      db.query(
        "SELECT id, title, author, description, year, image_url FROM books",
        (err, books) => {
          if (err) return next(err);

          const bookIds = books.map((book) => book.id);
          const placeholders = bookIds.map(() => "?").join(",");
          const ratingsQuery = `
        SELECT 
          book_id,
          AVG(rating) AS avg_rating,
          MAX(CASE WHEN user_id = ? THEN rating END) AS user_rating
        FROM ratings
        WHERE book_id IN (${placeholders})
        GROUP BY book_id
      `;

          db.query(
            ratingsQuery,
            [req.session.userId, ...bookIds],
            (err, ratings) => {
              if (err) return next(err);

              const ratingsMap = {};
              ratings.forEach((rating) => {
                ratingsMap[rating.book_id] = {
                  avgRating: parseFloat(rating.avg_rating?.toFixed(1)) || "N/A",
                  userRating: rating.user_rating || null,
                };
              });

              books.forEach((book) => {
                book.ratings = ratingsMap[book.id] || {
                  avgRating: "N/A",
                  userRating: null,
                };
              });

              res.render(
                userRole === "admin" ? "admin-dashboard" : "user-dashboard",
                { books, query: req.query }
              );
            }
          );
        }
      );
    }
  );
});

// Add to Favorites Route
app.post("/add-to-favorites", (req, res, next) => {
  const { bookId } = req.body;

  if (!req.session.userId) return res.redirect("/");

  db.query(
    "SELECT * FROM favorites WHERE user_id = ? AND book_id = ?",
    [req.session.userId, bookId],
    (err, results) => {
      if (err) return next(err);

      if (results.length > 0)
        return res.redirect("/dashboard?error=already_favorited");

      db.query(
        "INSERT INTO favorites (user_id, book_id) VALUES (?, ?)",
        [req.session.userId, bookId],
        (err) => {
          if (err && err.code === "ER_DUP_ENTRY")
            return res.redirect("/dashboard?error=already_favorited");
          if (err) return next(err);

          res.redirect("/favorites");
        }
      );
    }
  );
});

// Favorites Route
app.get("/favorites", (req, res, next) => {
  if (!req.session.userId) return res.redirect("/");

  const query = `
    SELECT b.id, b.title, b.author, b.description, b.year
    FROM favorites f
    JOIN books b ON f.book_id = b.id
    WHERE f.user_id = ?
  `;

  db.query(query, [req.session.userId], (err, favorites) => {
    if (err) return next(err);
    res.render("favorites", { favorites });
  });
});

// Delete Favorite Route
app.post("/delete-favorite", (req, res, next) => {
  const { bookId } = req.body;

  if (!req.session.userId) return res.redirect("/");

  db.query(
    "DELETE FROM favorites WHERE user_id = ? AND book_id = ?",
    [req.session.userId, bookId],
    (err) => {
      if (err) return next(err);
      res.redirect("/favorites");
    }
  );
});

// Admin Add Book Route
app.get("/admin/add-book", isAdmin, (req, res) =>
  res.render("add-book", { message: null })
);

app.post(
  "/admin/add-book",
  isAdmin,
  upload.single("image"),
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("author").notEmpty().withMessage("Author is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("year").isInt({ min: 0 }).withMessage("Year must be a valid number"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.render("add-book", { message: errors.array()[0].msg });

    const { title, author, description, year } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    db.query(
      "INSERT INTO books (title, author, description, year, image_url) VALUES (?, ?, ?, ?, ?)",
      [title, author, description, year, imageUrl],
      (err) => {
        if (err) {
          console.error("Error adding book:", err.message);
          return res.render("add-book", { message: "Failed to add book." });
        }
        res.redirect("/dashboard");
      }
    );
  }
);

// Admin Delete Book Route
app.post("/admin/delete-book", isAdmin, (req, res, next) => {
  const { bookId } = req.body;

  db.query("DELETE FROM books WHERE id = ?", [bookId], (err) => {
    if (err) return next(err);
    res.redirect("/dashboard");
  });
});

// Logout Route
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// Rate Book Route
app.post("/rate-book", (req, res, next) => {
  const { bookId, rating } = req.body;

  if (!req.session.userId) return res.redirect("/");

  if (rating < 1 || rating > 5) {
    return res
      .status(400)
      .send("Invalid rating value. Must be between 1 and 5.");
  }

  db.query(
    "INSERT INTO ratings (user_id, book_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?",
    [req.session.userId, bookId, rating, rating],
    (err) => {
      if (err) return next(err);
      res.redirect("/dashboard");
    }
  );
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).send("Something went wrong!");
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
