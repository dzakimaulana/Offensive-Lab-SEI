const db = require('../config/database');
const { generateToken } = require('../utils/auth')
const { hashPassword, comparePassword } = require('../utils/hash');

const register = async (req, res) => {
    if (req.method === "GET") {
        return res.render("auth/register", { error: null,
            userToken: req.user ? true : false }); // Render EJS login page
    }

    const { username, password } = req.body;

    try {
        const user = await db('users').where({ username }).first();
        if (user) return res.status(404).render("auth/register", { error: 'User already used' });

        const hashedPassword = await hashPassword(password);
        await db('users').insert({ username: username, password: hashedPassword, role: 'user' });

        res.status(201).redirect("/login");
    } catch (error) {
        res.status(500).render("auth/register", { error: "Internal Server Error" });;
    }
};

const login = async (req, res) => {
    if (req.method === "GET") {
        return res.render("auth/login", { error: null,
            userToken: req.user ? true : false }); // Render EJS login page
    }
    const { username, password } = req.body;

    try {
        const user = await db('users').where({ username }).first();
        if (!user) return res.status(404).render("auth/login", { error: 'Invalid Credentials', userToken: req.user ? true : false });

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) return res.status(401).render("auth/login", { error: 'Invalid Credentials', userToken: req.user ? true : false });

        const token = generateToken(user);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 60 * 60 * 1000,
        });
        return res.status(200).redirect("/books");
    } catch (error) {
        return res.status(500).render("auth/login", { error: 'Internal Server Error' });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).redirect("/");
    } catch (error) {
        return res.status(500).render("/", { error: "Internal Server Error" });
    }
};

module.exports = { register, login, logout }