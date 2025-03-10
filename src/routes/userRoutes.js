const express = require('express');
const { register, login, katalog } = require('../controllers/userController');
const { isAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/katalog', isAuth, katalog);
router.get('/', async (req, res) => {
    try {
        if (res.headersSent) return;
        return res.status(200).json({ message: 'Hello' });
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

module.exports = router;