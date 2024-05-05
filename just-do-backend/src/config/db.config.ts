import { registerAs } from '@nestjs/config';

export type DBConfig = {
  dbHost: string;
  dbUser: string;
  dbPassword: string;
  dbPort: number;
  dbName: string;
};

export default registerAs<DBConfig>('database', () => ({
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbPort: parseInt(process.env.DB_PORT, 10),
  dbName: process.env.DB_NAME,
}));
