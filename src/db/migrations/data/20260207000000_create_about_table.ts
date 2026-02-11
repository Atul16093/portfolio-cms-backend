import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('data').createTable('about', (table) => {
    table.increments('id').primary();
    table.uuid('uuid').unique().notNullable().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('title').notNullable();
    table.string('short_intro').nullable();
    table.jsonb('description').nullable(); // array of paragraphs
    table.integer('years_of_experience').nullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);

    table.index(['is_active']);
    table.index(['uuid']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('data').dropTable('about');
}
