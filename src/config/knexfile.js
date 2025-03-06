require('dotenv').config();
const path = require("path");

module.exports = {
    client: "mysql2",
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    },
    migrations: {
        directory: '/src/migrations',
        tableName: 'knex_migrations',
    },
    seeds: {
        directory: '/src/seeds',
    },
};
