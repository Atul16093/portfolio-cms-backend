import { registerAs } from '@nestjs/config';
import dotenv from 'dotenv';
dotenv.config();
export default registerAs('database', () => ({

  url: process.env.DATABASE_URL,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'portfolio_db',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
}));