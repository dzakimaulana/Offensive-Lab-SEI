/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("books", (table) => {
        table.increments("id").primary();
        table.string("title", 255).notNullable();
        table.string("author", 255).notNullable();
        table.integer("year").notNullable();
        table.text("description").nullable();
        table.string("cover_image", 255).notNullable();
    }).then(() => {
        return knex.schema.raw("ALTER TABLE books ADD FULLTEXT INDEX books_fulltext_index (title, author)");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.raw("ALTER TABLE books DROP INDEX books_fulltext_index")
        .then(() => knex.schema.dropTable("books"));
};
