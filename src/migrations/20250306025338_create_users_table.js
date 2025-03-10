/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    return knex.schema.createTable("users", (table) => {
        table.increments("id").primary();
        table.string("username", 255).notNullable().unique();
        table.string("password", 255).notNullable();
        table.string("role").notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
