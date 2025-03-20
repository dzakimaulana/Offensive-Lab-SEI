const express = require('express');
const { getAllBooks } = require('../controllers/userController');
const { isAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(isAuth);

router.get('/books', getAllBooks);

module.exports = router;