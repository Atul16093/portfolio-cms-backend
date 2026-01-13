import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create schema if it doesn't exist
  await knex.raw('CREATE SCHEMA IF NOT EXISTS data');
  // Enable UUID extension
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP SCHEMA IF EXISTS data CASCADE');
  await knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp"');
}

