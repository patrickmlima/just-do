import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';

import { ApiModule } from './api/api.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import appConfig from './config/app.config';
import dbConfig from './config/db.config';
import { DatabaseModule } from './database/database.module';
import { SharedModule } from './shared/shared.module';

const nodeEnv = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(
        'environments',
        `.env.${nodeEnv ?? 'development'}`,
      ),
      load: [appConfig, dbConfig],
    }),
    DatabaseModule,
    AuthModule,
    ApiModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
