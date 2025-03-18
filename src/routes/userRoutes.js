const express = require('express');
const { getAllBooks, getBookById, rateBook, 
    addToFavorites, getFavorites, removeFromFavorites } = require('../controllers/userController');
const { isAuth, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(isAuth);

router.get('/books', getAllBooks);
router.get('/books/:id', getBookById);
router.post('/books/:id/rate', rateBook);

router.post('/favorites/:id', addToFavorites);
router.get('/favorites', getFavorites);
router.delete('/favorites/:id', removeFromFavorites);

module.exports = router;