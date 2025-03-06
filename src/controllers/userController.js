const db = require('../config/database');
const { generateToken } = require('../utils/auth')
const { hashPassword, comparePassword } = require('../utils/hash');

const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await hashPassword(password);
        await db('users').insert({ username, password: hashedPassword });

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
        res.json({ message: 'Login successful', token: token });
    } catch (error) {
        res.status(500).json({ error: 'Failed to login' });
    }
};

module.exports = { register, login };