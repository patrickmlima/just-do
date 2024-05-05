import { registerAs } from '@nestjs/config';

export type AppConfig = {
  appHost: string;
  appPort: string;
};

export default registerAs<AppConfig>('application', () => ({
  appHost: process.env.APP_HOST,
  appPort: process.env.APP_PORT,
}));
