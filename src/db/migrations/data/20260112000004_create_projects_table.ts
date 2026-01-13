import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('data').createTable('projects', (table) => {
    table.increments('id').primary();
    table.uuid('uuid').notNullable().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('title').notNullable();
    table.string('slug').notNullable().unique();
    table.text('summary').nullable();
    table.boolean('is_featured').defaultTo(false);
    table.string('status').defaultTo('active');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.raw(`
    CREATE UNIQUE INDEX idx_projects_slug ON data.projects(slug);
    CREATE INDEX idx_projects_is_featured ON data.projects(is_featured);
    CREATE UNIQUE INDEX idx_projects_uuid ON data.projects(uuid);
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('data').dropTableIfExists('projects');
}

