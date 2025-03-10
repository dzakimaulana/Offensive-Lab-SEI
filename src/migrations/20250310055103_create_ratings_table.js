/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("ratings", (table) => {
        table.increments("id").primary();
        table.integer("id_user").unsigned().notNullable()
            .references("id").inTable("users").onDelete("CASCADE");
        table.integer("id_book").unsigned().notNullable()
            .references("id").inTable("books").onDelete("CASCADE");
        table.integer("rating").notNullable();
        table.unique(["id_user", "id_book"]);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('ratings');
};
