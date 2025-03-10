const db = require('../config/database');
const { encrypt } = require('../utils/aes');
const { generateToken } = require('../utils/auth')
const { hashPassword, comparePassword } = require('../utils/hash');

const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await db('users').where({ username }).first();
        if (user) return res.status(404).json({ error: 'User already used' });

        const hashedPassword = await hashPassword(password);
        await db('users').insert({ username, password: hashedPassword });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register user' });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await db('users').where({ username }).first();
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = generateToken(user);
        const aesToken = encrypt(token);

        res.cookie("token", aesToken, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 1000,
        });
        res.json({ message: 'Login successful', token: aesToken });
    } catch (error) {
        res.status(500).json({ error: 'Failed to login' });
    }
};

const addWishlist = async (req, res) => {
  const { userId } = req.params;
  const { bookId } = req.body;

  try {
    const userExist = await db("users").where({ id: userId }).first();
    if (!userExist) return res.status(404).json({ error: "User not found" });

    const bookExist = await db("books").where({ id: bookId }).first();
    if (!bookExist) return res.status(404).json({ error: "Book not found" });

    const duplicate = await db("wishlists")
      .where({ user_id: userId, book_id: bookId })
      .first();
    if (duplicate)
      return res.status(400).json({ error: "Book already added to Wishlist" });

    await db("wishlists").insert({ user_id: userId, book_id: bookId });
    res.json({ success: true, message: "Book added to Wishlist" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add to Wishlist" });
  }
};

const viewWishlist = async (req, res) => {
  const { userId } = req.params;
  const limit = 10;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const offset = (page - 1) * limit;

  try {
    const userExist = await db("users").where({ id: userId }).first();
    if (!userExist) return res.status(404).json({ error: "User not found" });

    const wishlist = await db("wishlists")
      .where({ user_id: userId })
      .join("books", "wishlists.book_id", "books.id")
      .select("books.id", "books.title", "books.author")
      .limit(limit)
      .offset(offset);

    if (wishlist.length === 0) {
      return res.json({
        success: true,
        message: "Wishlist is empty",
        wishlist: [],
      });
    }

    res.json({ success: true, wishlist });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve wishlist" });
  }
};

const rating = async (req, res) => {
  const { bookId } = req.params;

  try {
    const result = await db("ratings")
      .where({ book_id: bookId })
      .avg("rating as averageRating")
      .first();

    if (!result || result.averageRating === null) {
      return res.json({
        success: true,
        stars: "☆☆☆☆☆",
        averageRating: 0,
        message: "No ratings yet",
      });
    }

    const rating = Math.min(
      5,
      Math.max(0, parseFloat(result.averageRating.toFixed(1)))
    );
    const fullStars = "★".repeat(Math.floor(rating));
    const halfStar = rating % 1 !== 0 ? "☆" : "";
    const emptyStars = "☆".repeat(5 - Math.ceil(rating));

    res.json({
      success: true,
      stars: fullStars + halfStar + emptyStars,
      averageRating: rating,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve book rating" });
  }
};

const katalog = async (req, res) => {

    try {
        res.status(200).json({ message: 'Get Data' });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

module.exports = { register, login, katalog };
