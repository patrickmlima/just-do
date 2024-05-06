import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { PasswordService } from './password/password.service';
import { userProviders } from './user.providers';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [...userProviders, UsersService, PasswordService],
})
export class UsersModule {}
