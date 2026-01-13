import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('data').createTable('site_config', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('hero_title').notNullable();
    table.string('hero_subtitle').nullable();
    table.text('hero_description').nullable();
    table.string('primary_cta').nullable();
    table.string('secondary_cta').nullable();
    table.text('about_text').nullable();
    table.string('footer_text').nullable();
    table.jsonb('social_links').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('data').dropTableIfExists('site_config');
}

