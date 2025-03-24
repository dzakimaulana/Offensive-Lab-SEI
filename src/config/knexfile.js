const path = require("path");
// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  client: "mysql2",
  connection: {
      host: process.env.DB_HOST || "127.0.0.1",
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "root",
      database: process.env.DB_NAME || "books_catalog",
  },
  migrations: {
      directory: path.join(__dirname, "../migrations"),
  },
  seeds: {
    directory: path.join(__dirname, "../seeds"),
  }
};
