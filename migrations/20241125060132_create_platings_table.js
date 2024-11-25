/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('platings', (table) => {
    table.increments('id').primary();
    table.text('ingredients').notNullable();
    table.text('garnishes').notNullable();
    table.text('sauces').notNullable();
    table.string('plate_style', 255).notNullable();
    table.string('plating_style', 255).notNullable();
    table.string('image_url', 1000).notNullable();
    table.timestamps(true, true); 
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('platings');
}