import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('data').alterTable('experience', (table) => {
    table.integer('order_index').defaultTo(0).notNullable();
    table.boolean('is_visible').defaultTo(true).notNullable();
  });

  // Create index on order_index for efficient sorting
  await knex.raw(`
    CREATE INDEX idx_experience_order_index ON data.experience(order_index);
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('data').alterTable('experience', (table) => {
    table.dropColumn('order_index');
    table.dropColumn('is_visible');
  });
}
