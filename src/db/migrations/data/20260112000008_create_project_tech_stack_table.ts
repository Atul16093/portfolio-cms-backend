import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('data').createTable('project_tech_stack', (table) => {
    table.increments('id').primary();
    table.uuid('uuid').notNullable().defaultTo(knex.raw('gen_random_uuid()'));
    table.integer('project_id').notNullable();
    table.integer('tech_stack_id').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table
      .foreign('project_id')
      .references('id')
      .inTable('data.projects')
      .onDelete('CASCADE');

    table
      .foreign('tech_stack_id')
      .references('id')
      .inTable('data.tech_stack')
      .onDelete('CASCADE');
  });

  await knex.raw(`
    CREATE UNIQUE INDEX idx_project_tech_stack_project_tech ON data.project_tech_stack(project_id, tech_stack_id);
    CREATE UNIQUE INDEX idx_project_tech_stack_uuid ON data.project_tech_stack(uuid);
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('data').dropTableIfExists('project_tech_stack');
}

