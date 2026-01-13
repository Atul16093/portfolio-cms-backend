import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Add new hash columns and last_used_at (nullable initially)
  await knex.schema.withSchema('data').alterTable('admin_login_activity', (table) => {
    table.text('access_token_hash').nullable();
    table.text('refresh_token_hash').nullable();
    table.timestamp('last_used_at').nullable();
  });

  // For existing records: set last_used_at = created_at, and set placeholder values for hash columns
  // Note: We can't migrate old tokens, so we set empty strings and mark sessions as revoked
  await knex('data.admin_login_activity')
    .whereNull('access_token_hash')
    .update({ 
      last_used_at: knex.raw('COALESCE(last_used_at, created_at)'),
      access_token_hash: '',
      refresh_token_hash: '',
      is_revoked: true,
      revoked_at: knex.fn.now(),
    });

  // Drop old token columns
  await knex.schema.withSchema('data').alterTable('admin_login_activity', (table) => {
    table.dropColumn('access_token');
    table.dropColumn('refresh_token');
  });

  // Make hash columns not nullable (now safe since all rows have values)
  await knex.raw(`
    ALTER TABLE data.admin_login_activity 
    ALTER COLUMN access_token_hash SET NOT NULL,
    ALTER COLUMN refresh_token_hash SET NOT NULL;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('data').alterTable('admin_login_activity', (table) => {
    table.dropColumn('access_token_hash');
    table.dropColumn('refresh_token_hash');
    table.dropColumn('last_used_at');
    table.text('access_token').notNullable();
    table.text('refresh_token').notNullable();
  });
}
