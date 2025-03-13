const path = require("path");
// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  client: "mysql2",
  connection: {
      host: "127.0.0.1",
      port: 3306,
      user: "root",
      password: "root",
      database: "sei",
  },
  migrations: {
      directory: path.join(__dirname, "../migrations"),
  },
  seeds: {
    directory: path.join(__dirname, "../seeds"),
  }
};
