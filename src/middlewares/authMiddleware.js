const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    const isAuthPage = req.path.startsWith("/login") || req.path.startsWith("/register");

    if (!token) {
        return isAuthPage ? next() : res.redirect("/login");
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        return isAuthPage ? res.redirect("/dashboard") : next();
    } catch (error) {
        res.clearCookie("token");
        return res.redirect("/login");
    }
};

const attachUser = (req, res, next) => {
    res.locals.user = req.user || null;
    next();
};

module.exports = { verifyToken, attachUser };