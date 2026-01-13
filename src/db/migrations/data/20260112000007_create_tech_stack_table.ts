import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('data').createTable('tech_stack', (table) => {
    table.increments('id').primary();
    table.uuid('uuid').notNullable().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('category').notNullable();
    table.integer('priority').defaultTo(0);
    table.string('icon_url').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.raw(`
    CREATE INDEX idx_tech_stack_category_priority ON data.tech_stack(category, priority);
    CREATE UNIQUE INDEX idx_tech_stack_uuid ON data.tech_stack(uuid);
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('data').dropTableIfExists('tech_stack');
}

