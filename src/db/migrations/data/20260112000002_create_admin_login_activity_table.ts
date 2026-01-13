import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('data').createTable('admin_login_activity', (table) => {
    table.increments('id').primary();
    table.uuid('uuid').notNullable().defaultTo(knex.raw('gen_random_uuid()'));
    table.integer('admin_user_id').notNullable();
    table.string('session_id').notNullable().unique();
    table.text('access_token').notNullable();
    table.text('refresh_token').notNullable();
    table.timestamp('access_token_expires_at').notNullable();
    table.timestamp('refresh_token_expires_at').notNullable();
    table.string('ip_address').nullable();
    table.text('user_agent').nullable();
    table.jsonb('device_info').nullable();
    table.boolean('is_revoked').defaultTo(false);
    table.timestamp('revoked_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table
      .foreign('admin_user_id')
      .references('id')
      .inTable('data.users')
      .onDelete('CASCADE');
  });

  await knex.raw(`
    CREATE INDEX idx_admin_login_activity_admin_user_id ON data.admin_login_activity(admin_user_id);
    CREATE UNIQUE INDEX idx_admin_login_activity_session_id ON data.admin_login_activity(session_id);
    CREATE INDEX idx_admin_login_activity_is_revoked ON data.admin_login_activity(is_revoked);
    CREATE INDEX idx_admin_login_activity_refresh_token_expires_at ON data.admin_login_activity(refresh_token_expires_at);
    CREATE UNIQUE INDEX idx_admin_login_activity_uuid ON data.admin_login_activity(uuid);
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('data').dropTableIfExists('admin_login_activity');
}

