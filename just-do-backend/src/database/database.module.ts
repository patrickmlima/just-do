import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

import { DBConfig } from 'src/config/db.config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dbConfig = configService.get<DBConfig>('database');

        const typeOrmOptions: TypeOrmModuleOptions = {
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
          synchronize: false,
        };

        return typeOrmOptions;
      },
    }),
  ],
  exports: [],
})
export class DatabaseModule {}
