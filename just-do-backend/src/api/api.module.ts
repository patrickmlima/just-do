import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { routes } from './routes';

@Module({
  imports: [UsersModule, TasksModule, RouterModule.register(routes)],
  exports: [UsersModule, TasksModule],
})
export class ApiModule {}
