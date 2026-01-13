import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET || 'your-access-token-secret-change-in-production',
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET || 'your-refresh-token-secret-change-in-production',
    accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '15m',
    refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d',
  },
}));

