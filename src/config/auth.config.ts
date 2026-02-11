import { registerAs } from '@nestjs/config';
import dotenv from 'dotenv';
dotenv.config();
console.log('JWT_ACCESS_TOKEN_SECRET', process.env.JWT_ACCESS_TOKEN_SECRET);
console.log('JWT_REFRESH_TOKEN_SECRET', process.env.JWT_REFRESH_TOKEN_SECRET);
console.log('JWT_ACCESS_TOKEN_EXPIRES_IN', process.env.JWT_ACCESS_TOKEN_EXPIRES_IN);
console.log('JWT_REFRESH_TOKEN_EXPIRES_IN', process.env.JWT_REFRESH_TOKEN_EXPIRES_IN);
export default registerAs('auth', () => ({
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET || 'your-access-token-secret-change-in-production',
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET || 'your-refresh-token-secret-change-in-production',
    accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '2h',
    refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d',
  },
}));

