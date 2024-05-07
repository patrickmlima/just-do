import { User } from 'src/database/entities/user.entity';

export const mockedUsersList: User[] = [
  {
    id: 1,
    username: 'firssuer',
    password: 'itshouldbehashedhere',
    createdAt: new Date(),
    updatedAt: new Date(),
    tasks: [],
  },
  {
    id: 2,
    username: 'otheruser',
    password: 'itshouldbehashedhere',
    createdAt: new Date(),
    updatedAt: new Date(),
    tasks: [],
  },
];
