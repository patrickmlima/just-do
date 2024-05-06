import { DataSource } from 'typeorm';

import { APP_CONSTANTS } from 'src/constants';
import { Task } from 'src/database/entities/task.entity';

export const taskProviders = [
  {
    provide: APP_CONSTANTS.providers.TaskRepository,
    inject: [APP_CONSTANTS.providers.DataSource],
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Task),
  },
];
