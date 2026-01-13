/**
 * Script to create an admin user in the database
 * Usage: npm run create-admin <email> <password>
 * Example: npm run create-admin admin@example.com MySecurePassword123
 */

import * as bcrypt from 'bcrypt';
import knex, { Knex } from 'knex';
import knexConfig from '../db/knexfile';

// Get email and password from command line arguments
const email = process.argv[2];
const password = process.argv[3];

/**
 * Validates email and password inputs from command line
 */
function validateInputs(): void {
  if (!email || !password) {
    console.error('Error: Email and password are required');
    console.log('Usage: npm run create-admin <email> <password>');
    console.log('Example: npm run create-admin admin@example.com MySecurePassword123');
    process.exit(1);
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error('Error: Invalid email format');
    process.exit(1);
  }

  // Validate password length (minimum 6 characters)
  if (password.length < 6) {
    console.error('Error: Password must be at least 6 characters long');
    process.exit(1);
  }
}

/**
 * Creates admin user in the database
 */
async function createAdminUser(): Promise<void> {
  validateInputs();

  // Get environment and initialize Knex connection
  const env = (process.env.NODE_ENV || 'development') as keyof typeof knexConfig;
  const db: Knex = knex(knexConfig[env]);

  try {
    // Check if user already exists
    const existingUser = await db('data.users').where({ email }).first();

    if (existingUser) {
      console.error(`Error: User with email ${email} already exists`);
      process.exit(1);
    }

    // Hash password using bcrypt (10 salt rounds)
    console.log('Hashing password...');
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert admin user
    console.log(`Creating admin user with email: ${email}`);
    const [user] = await db('data.users')
      .insert({
        email,
        password_hash: passwordHash,
        role: 'admin',
        is_active: true,
      })
      .returning(['id', 'email', 'role', 'is_active']);

    console.log('\n✅ Admin user created successfully!');
    console.log('User details:');
    console.log(`  ID: ${user.id}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  Active: ${user.is_active}`);
    console.log('\nYou can now login using these credentials.');
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await db.destroy();
  }
}

// Run the script
createAdminUser();

