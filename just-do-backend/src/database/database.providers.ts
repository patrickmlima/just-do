import { ConfigService } from '@nestjs/config';
import path from 'path';
import { DataSource } from 'typeorm';
import type { DBConfig } from 'src/config/db.config';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dbConfig = configService.get<DBConfig>('database');
      const dataSource = new DataSource({
        type: 'postgres',
        host: dbConfig.dbHost,
        port: dbConfig.dbPort,
        username: dbConfig.dbUser,
        password: dbConfig.dbPassword,
        database: dbConfig.dbName,
        entities: [path.join(__dirname, 'entities', '**.entity{.ts,.js}')],
        migrations: [path.join(__dirname, 'migrations', '**.entity{.ts,.js}')],
        migrationsTableName: 'justdo_migrations',
      });

      return dataSource.initialize();
    },
  },
];
