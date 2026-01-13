import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('data').createTable('experience', (table) => {
    table.increments('id').primary();
    table.uuid('uuid').notNullable().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('role').notNullable();
    table.string('company').notNullable();
    table.date('start_date').notNullable();
    table.date('end_date').nullable();
    table.jsonb('description').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.raw(`
    CREATE INDEX idx_experience_start_date ON data.experience(start_date);
    CREATE UNIQUE INDEX idx_experience_uuid ON data.experience(uuid);
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('data').dropTableIfExists('experience');
}

