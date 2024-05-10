import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { routes } from './routes';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, TasksModule, RouterModule.register(routes)],
  providers: [],
  exports: [UsersModule, TasksModule],
})
export class ApiModule {}
