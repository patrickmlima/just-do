import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { DataSource } from 'typeorm';

import type { DBConfig } from 'src/config/db.config';
import { APP_CONSTANTS } from 'src/constants';

export const databaseProviders = [
  {
    provide: APP_CONSTANTS.providers.DataSource,
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
        entities: [path.resolve(__dirname, 'entities', '**.entity{.ts,.js}')],
        migrations: [path.resolve(__dirname, 'migrations', '**{.ts,.js}')],
        migrationsTableName: 'justdo_migrations',
        migrationsRun: true,
      });

      return dataSource.initialize();
    },
  },
];
