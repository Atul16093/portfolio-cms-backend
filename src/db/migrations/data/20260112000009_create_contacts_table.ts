import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('data').createTable('contacts', (table) => {
    table.increments('id').primary();
    table.uuid('uuid').notNullable().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.text('message').notNullable();
    table.string('status').defaultTo('new');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.raw(`
    CREATE INDEX idx_contacts_status ON data.contacts(status);
    CREATE INDEX idx_contacts_created_at ON data.contacts(created_at);
    CREATE UNIQUE INDEX idx_contacts_uuid ON data.contacts(uuid);
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('data').dropTableIfExists('contacts');
}

