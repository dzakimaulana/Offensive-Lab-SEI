const { decrypt } = require("../utils/aes");
const { verifyToken } = require("../utils/auth");

const isAuth = (req, res, next) => {
    const aesToken = req.cookies.token;
    const isAuthPage = req.path.startsWith("/login") || req.path.startsWith("/register");

    if (!aesToken) {
        return isAuthPage ? next() : res.redirect("/login");
    }

    try {
        const token = decrypt(aesToken);
        const decode = verifyToken(token);
        req.user = decode;
        next();
    } catch (error) {
        res.clearCookie("token");
        return res.redirect("/login");
    }
};

const attachUser = (req, res, next) => {
    res.locals.user = req.user || null;
    next();
};

module.exports = { isAuth, attachUser };