import { Task } from 'src/database/entities/task.entity';
import { mockedUsersList } from './users.mock';

const [theUser] = mockedUsersList;

export const mockedTasksList: Task[] = [
  {
    id: 1,
    title: 'My Task 1',
    description: undefined,
    isComplete: false,
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-05-01'),
    owner: theUser,
  },
  {
    id: 2,
    title: 'My Task 2',
    description: 'A short description to not be lost',
    isComplete: false,
    createdAt: new Date('2024-05-02'),
    updatedAt: new Date('2024-05-02'),
    owner: theUser,
  },
  {
    id: 2,
    title: 'My Task 3',
    description: '',
    isComplete: true,
    createdAt: new Date('2024-05-03'),
    updatedAt: new Date('2024-05-03'),
    owner: theUser,
  },
];
