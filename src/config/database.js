const knex = require("knex");
const knexConfig = require("./knexfile");

const db = knex(knexConfig);

db.raw("SELECT 1")
    .then(() => console.log("✅ Connected to MySQL"))
    .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
    });

module.exports = db;