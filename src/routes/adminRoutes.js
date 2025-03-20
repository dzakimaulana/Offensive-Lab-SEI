const express = require('express');
const { isAuth, isAdmin } = require('../middlewares/authMiddleware');
const { addBook, editBook, deleteBook, dashboardAdmin, checkMySQL } = require('../controllers/adminController');
const upload = require('../config/multerConfig');

const router = express.Router();

router.use(isAuth, isAdmin);
router.get('/', dashboardAdmin)
router.get('/books/add', addBook);
router.post('/books/add', upload.single("imageUpload"), addBook);
router.get('/books/:id/edit', editBook);
router.post('/books/:id/edit', upload.single("imageUpload"), editBook);
router.post('/books/:id/delete', deleteBook);
router.post('/check-mysql', checkMySQL);

module.exports = router;