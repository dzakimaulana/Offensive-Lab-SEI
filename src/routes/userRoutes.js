const express = require('express');
const { getAllBooks } = require('../controllers/userController');
const { isAuth, restrictAccess } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(isAuth, restrictAccess);

router.get('/books', getAllBooks);

module.exports = router;