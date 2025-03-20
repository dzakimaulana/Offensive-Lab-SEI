const db = require('../config/database');
const { decryptCiphertext } = require('../utils/aes');
const { generateToken } = require('../utils/auth')
const { hashPassword, comparePassword } = require('../utils/hash');

const register = async (req, res, next) => {
    if (req.method === "GET") {
        return res.render("auth/register", { error: null });
    }

    if (req.method === "POST") {
        const { username, password } = req.body;

        try {
            const user = await db('users').where({ username }).first();
            if (user) return res.status(404).render("auth/register", { error: 'User already used' });

            const hashedPassword = await hashPassword(password);
            await db('users').insert({ username: username, password: hashedPassword, role: 'user' });

            return res.status(201).redirect("/login");
        } catch (error) {
            return next(error);
        }
    }
};

const login = async (req, res, next) => {
    if (req.method === "GET") {
        return res.render("auth/login", { error: null });
    }

    if (req.method === "POST") {
        const { username, password } = req.body;

        try {
            const user = await db('users').where({ username }).first();
            if (!user) return res.status(404).render("auth/login", { error: 'Invalid Credentials' });

            const decryptedPassword = await decryptCiphertext(password);

            if (typeof decryptedPassword !== 'string') {
                return res.status(404).render("auth/login", { error: `${decryptedPassword}` });
            }

            const isMatch = await comparePassword(decryptedPassword, user.password);
            if (!isMatch) return res.status(401).render("auth/login", { error: 'Invalid Credentials' });

            const token = generateToken(user);

            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "Lax",
                maxAge: 60 * 60 * 1000,
            });
            if (user.role === 'admin') {
                return res.redirect("/admin");
            }
            return res.redirect("/user/books");
        } catch (error) {
            return next(new Error(`${error.message}`));
        }
    }
};

const logout = async (req, res, next) => {
    try {
        res.clearCookie("token");
        return res.redirect("/");
    } catch (error) {
        return next(error);
    }
};

module.exports = { register, login, logout };