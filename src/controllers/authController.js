const db = require('../config/database');
const { encrypt } = require('../utils/aes');
const { generateToken } = require('../utils/auth')
const { hashPassword, comparePassword } = require('../utils/hash');

const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await db('users').where({ username }).first();
        if (user) return res.status(404).json({ error: 'User already used' });

        const hashedPassword = await hashPassword(password);
        await db('users').insert({ username: username, password: hashedPassword, role: 'user' });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register user' });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await db('users').where({ username }).first();
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = generateToken(user);
        const aesToken = encrypt(token);

        res.cookie("token", aesToken, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 1000,
        });
        res.json({ message: 'Login successful', token: aesToken });
    } catch (error) {
        res.status(500).json({ error: 'Failed to login' });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Logout failed" });
    }
};

module.exports = { register, login, logout }