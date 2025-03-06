const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

const generateToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

module.exports = { generateToken };