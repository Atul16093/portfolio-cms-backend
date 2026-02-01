import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('data').alterTable('tech_stack', (table) => {
    table.boolean('is_visible').defaultTo(true).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('data').alterTable('tech_stack', (table) => {
    table.dropColumn('is_visible');
  });
}
