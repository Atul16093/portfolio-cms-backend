import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('data').createTable('project_tech_stack', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('project_id').notNullable();
    table.uuid('tech_stack_id').notNullable();
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
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('data').dropTableIfExists('project_tech_stack');
}

