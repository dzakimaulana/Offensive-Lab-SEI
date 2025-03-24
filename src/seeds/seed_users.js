const { hashPassword } = require("../utils/hash");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    { id: 1, username: 'fury', password: await hashPassword('bang udah bang'), role: 'admin' },
    { id: 2, username: 'cecil', password: await hashPassword('CecilCegil'), role: 'user' }
  ]);
};
