import { DataSource } from 'typeorm';

import { APP_CONSTANTS } from 'src/constants';
import { User } from 'src/database/entities/user.entity';

export const userProviders = [
  {
    provide: APP_CONSTANTS.providers.UserRepository,
    inject: [APP_CONSTANTS.providers.DataSource],
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
  },
];
