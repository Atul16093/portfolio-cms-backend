import { registerAs } from '@nestjs/config';
import dotenv from 'dotenv';
dotenv.config();

export default registerAs('mail', () => ({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.MAIL_PORT || '587', 10),
  user: process.env.MAIL_USER,
  pass: process.env.MAIL_PASS,
  from: process.env.MAIL_FROM || 'no-reply@example.com',
  to: process.env.MAIL_TO || 'admin@example.com', // The admin email needed to shoot to me
}));
