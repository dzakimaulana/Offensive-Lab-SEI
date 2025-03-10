/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("books", (table) => {
        table.increments("id").primary();
        table.string("name", 255).notNullable();
        table.text("description").notNullable();
        table.double("rating").notNullable().defaultTo(0);
    });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('books');
};
