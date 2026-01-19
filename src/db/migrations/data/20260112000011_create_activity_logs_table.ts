import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('data').createTable('activity_logs', (table) => {
    table.increments('id').primary();
    table.uuid('uuid').notNullable().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('activity_type').notNullable();
    table.text('message').notNullable();
    table.string('entity_type').nullable(); // e.g., 'project', 'contact', 'session'
    table.integer('entity_id').nullable(); // ID of the related entity
    table.string('entity_label').nullable(); // Human-readable label (e.g., project title)
    table.integer('admin_user_id').nullable(); // Admin who performed the action (if applicable)
    table.jsonb('metadata').nullable(); // Additional context data
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.raw(`
    CREATE INDEX idx_act2ivity_logs_activity_type ON data.activity_logs(activity_type);
    CREATE INDEX idx_activity_logs_entity_type ON data.activity_logs(entity_type);
    CREATE INDEX idx_activity_logs_created_at ON data.activity_logs(created_at DESC);
    CREATE INDEX idx_activity_logs_admin_user_id ON data.activity_logs(admin_user_id);
    CREATE UNIQUE INDEX idx_activity_logs_uuid ON data.activity_logs(uuid);
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('data').dropTableIfExists('activity_logs');
}
