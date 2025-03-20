const home = async (req, res) => {
    if (req.method === "GET") {
        return res.render('index', { error: null });
    }
};

const about = async (req, res) => {
    if (req.method === "GET") {
        res.render('pages/about', { error: null });
    }
};

const contact = async (req, res) => {
    if (req.method === "GET") {
        res.render('pages/contact', { error: null });
    }
};

module.exports = { home, about, contact }