const home = async (req, res) => {
    if (req.method === "GET") {
        return res.render('index', { error: null, userToken: req.user ? true : false }); // Render EJS login page
    }
};

const about = async (req, res) => {
    if (req.method === "GET") {
        res.render('pages/about', { error: null, userToken: req.user ? true : false }); // Render EJS login page
    }
};

const contact = async (req, res) => {
    if (req.method === "GET") {
        res.render('pages/contact', { error: null, userToken: req.user ? true : false }); // Render EJS login page
    }
};

module.exports = { home, about, contact }