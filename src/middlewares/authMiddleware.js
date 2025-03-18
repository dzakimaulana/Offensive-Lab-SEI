const { verifyToken } = require("../utils/auth");

const isAuth = (req, res, next) => {
    const token = req.cookies?.token;
    const isAuthPage = ["/login", "/register"].includes(req.path);

    if (!token) {
        return isAuthPage ? next() : res.redirect("/login"); // No token → Allow auth pages, otherwise redirect to login
    }

    try {
        const data = verifyToken(token);
        req.user = data;

        if (isAuthPage) {
            return res.redirect("/books"); // Prevent logged-in users from accessing auth pages
        }

        next(); // Proceed to requested route
    } catch (error) {
        console.error("Authentication Error:", error.message);
        res.clearCookie("token");
        return res.redirect("/login");
    }
};

const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        // Redirect non-admin users trying to access admin routes
        return res.redirect("/books");
    }

    next(); // Proceed for admin users
};



const attachUser = (req, res, next) => {
    res.locals.user = req.user || null;
    next();
};

module.exports = { isAuth, isAdmin, attachUser };