/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  const exists = await knex.schema.hasTable('platings');
  if (!exists) {
  return knex.schema.createTable('platings', (table) => {
    table.increments('id').primary();
    table.text('ingredients').notNullable();
    table.text('garnishes').notNullable();
    table.text('sauces').notNullable();
    table.string('plate_style', 255).notNullable();
    table.string('plating_style', 255).notNullable();
    table.string('image_url', 1000).notNullable();
    table.string('local_image_path', 1000).nullable(); 
    table.timestamps(true, true); 
  });
}
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('platings');
}