const { decrypt } = require("../utils/aes");
const { verifyToken } = require("../utils/auth");

const isAuth = (req, res, next) => {
    const aesToken = req.cookies?.token;
    const isAuthPage = ["/login", "/register"].some(path => req.path.startsWith(path));

    if (!aesToken) {
        return isAuthPage ? next() : res.redirect("/login");
    }

    try {
        const token = decrypt(aesToken);
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Authentication Error:", error.message);
        res.clearCookie("token");
        return res.redirect("/login");
    }
};


const attachUser = (req, res, next) => {
    res.locals.user = req.user || null;
    next();
};

module.exports = { isAuth, attachUser };