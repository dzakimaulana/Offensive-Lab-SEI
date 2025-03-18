const express = require('express');
const { isAuth, isAdmin } = require('../middlewares/authMiddleware');
const { getAllUsers, addBook, editBook, deleteBook, dashboardAdmin } = require('../controllers/adminController');
const upload = require('../config/multerConfig');

const router = express.Router();

router.use(isAuth, isAdmin);
router.get('/books/add', addBook);
router.post('/books/add', upload.single("cover_image"), addBook);
router.get('/books/:id/edit', editBook);
router.post('/books/:id/edit', upload.single("cover_image"), editBook);
router.get('/', dashboardAdmin)
router.get('/users', getAllUsers);
router.post('/books/:id/delete', deleteBook);

module.exports = router;