const express = require('express');
const { home, about, contact } = require('../controllers/mainController');

const router = express.Router();

router.get('/', home);
router.get('/about', about);
router.get('/contact', contact);

module.exports = router;