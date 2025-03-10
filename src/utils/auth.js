const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'apaansih';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

const generateToken = (user) => {
    return jwt.sign({ role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN, algorithm: "HS256" });
};

const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
}

module.exports = { generateToken, verifyToken };