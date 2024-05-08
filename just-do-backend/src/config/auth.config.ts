import { registerAs } from '@nestjs/config';

export type AuthConfig = {
  jwtSecret: string;
  jwtExpirationTimeInSeconds: number;
};

export default registerAs<AuthConfig>('auth', () => ({
  jwtSecret: process.env.JWT_SECRET_KEY,
  jwtExpirationTimeInSeconds: parseInt(
    process.env.JWT_EXPIRATION_IN_SECONDS ?? '0',
    10,
  ),
}));
