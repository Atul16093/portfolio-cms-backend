import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';

/**
 * Seed file to create a default admin user
 * 
 * To use this seed file:
 * 1. Set ADMIN_EMAIL and ADMIN_PASSWORD environment variables
 * 2. Run: npm run seed:run
 * 
 * Example:
 * ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=SecurePass123 npm run seed:run
 */

export async function seed(knex: Knex): Promise<void> {
  // Get admin credentials from environment variables
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin123!';

  // Check if admin user already exists
  const existingUser = await knex('data.users').where({ email }).first();

  if (existingUser) {
    console.log(`Admin user with email ${email} already exists. Skipping seed.`);
    return;
  }

  // Hash password using bcrypt (10 salt rounds)
  const passwordHash = await bcrypt.hash(password, 10);

  // Insert admin user
  await knex('data.users').insert({
    email,
    password_hash: passwordHash,
    role: 'admin',
    is_active: true,
  });

  console.log(`✅ Admin user created successfully with email: ${email}`);
}

