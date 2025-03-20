const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'I-love-pancakes-with-chocolate-and-banans';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

const generateToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN, algorithm: "HS256" });
};

const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
}

module.exports = { generateToken, verifyToken };