import { Routes } from '@nestjs/core';

import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';

export const routes: Routes = [
  { path: '/api', module: UsersModule },
  { path: '/api', module: TasksModule },
];
