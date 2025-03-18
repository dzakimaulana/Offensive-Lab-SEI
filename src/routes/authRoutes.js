const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const { isAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(isAuth);

router.get('/login', login);
router.get('/register', register);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;