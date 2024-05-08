import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { routes } from './routes';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Module({
  imports: [UsersModule, TasksModule, RouterModule.register(routes)],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
  ],
  exports: [UsersModule, TasksModule],
})
export class ApiModule {}
