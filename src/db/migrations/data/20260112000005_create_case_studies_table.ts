import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('data').createTable('case_studies', (table) => {
    table.increments('id').primary();
    table.uuid('uuid').notNullable().defaultTo(knex.raw('gen_random_uuid()'));
    table.integer('project_id').notNullable();
    table.text('problem').nullable();
    table.text('challenges').nullable();
    table.text('architecture').nullable();
    table.text('decisions').nullable();
    table.text('tradeoffs').nullable();
    table.text('improvements').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table
      .foreign('project_id')
      .references('id')
      .inTable('data.projects')
      .onDelete('CASCADE');
  });

  await knex.raw(`
    CREATE UNIQUE INDEX idx_case_studies_project_id ON data.case_studies(project_id);
    CREATE UNIQUE INDEX idx_case_studies_uuid ON data.case_studies(uuid);
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('data').dropTableIfExists('case_studies');
}

