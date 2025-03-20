const { verifyToken } = require("../utils/auth");

const isAuth = (req, res, next) => {
    const token = req.cookies?.token;
    const isAuthPage = ["/login", "/register"].includes(req.path);

    if (!token) {
        return isAuthPage ? next() : res.redirect("/login");
    }

    try {
        req.user = verifyToken(token);
        if (isAuthPage) {
            if (req.user.role === "admin") {
                return res.redirect("/admin")
            }
            return res.redirect("/user/books")
        }
        next();
    } catch (error) {
        console.error("Authentication Error:", error.message);
        res.clearCookie("token");
        return res.redirect("/login");
    }
};

const restrictAccess = (req, res, next) => {
    const { user } = req;

    if (!user) {
        return res.redirect("/login");
    }

    if (req.originalUrl.startsWith("/admin") && user.role !== "admin") {
        return res.status(404).render("error", { statusCode: 404, message: "Page Not Found" });
    }

    if (req.originalUrl.startsWith("/user") && user.role === "admin") {
        return res.status(404).render("error", { statusCode: 404, message: "Page Not Found" });
    }

    next();
};


module.exports = { isAuth, restrictAccess };
