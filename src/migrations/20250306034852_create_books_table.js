/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("books", (table) => {
        table.increments("id").primary();
        table.string("title", 255).notNullable();
        table.string("author", 255).notNullable();
        table.text("description").nullable();
        table.string("cover_image", 255).notNullable();
    });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('books');
};
