import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  EntityNotFoundError,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';

import { mockedTasksList } from '../../../test/mocks/tasks.mock';
import { Task } from '../../database/entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';
import { User } from 'src/database/entities/user.entity';

const findOneOrFailImplementation = async (
  where: FindOptionsWhere<Task> | FindOptionsWhere<Task>[],
) => {
  const whereCasted = (where ?? {}) as FindOptionsWhere<Task>;

  const { id } = whereCasted;
  const owner: Partial<User> = whereCasted?.owner as User;

  const foundItem = mockedTasksList.find(
    (item) => item.id === id && item.owner.id === owner?.id,
  );
  return new Promise<Task>((resolve, reject) =>
    foundItem
      ? resolve(foundItem)
      : reject(new EntityNotFoundError(Task, where)),
  );
};

const updateOneImplementation = (criteria: any) => {
  const { id, owner } = criteria;

  const foundItem = mockedTasksList.find(
    (item) => item.id === id && item.owner.id === owner.id,
  );
  return new Promise<UpdateResult>((resolve) => {
    return resolve({
      affected: foundItem ? 1 : 0,
      raw: '',
      generatedMaps: [],
    });
  });
};

describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<Task>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to list tasks', async () => {
    mockedTasksList;
    const findAllSpy = jest
      .spyOn(repository, 'findAndCount')
      .mockResolvedValue([mockedTasksList, mockedTasksList.length]);
    const [tasks] = await service.findAll();

    expect(findAllSpy).toHaveBeenCalled();
    expect(tasks).toHaveLength(mockedTasksList.length);
  });

  it('should be able to get a single task', async () => {
    const [expectedTask] = mockedTasksList;
    const findOneSpy = jest
      .spyOn(repository, 'findOneByOrFail')
      .mockImplementation(findOneOrFailImplementation);

    const actualUser = await service.findOne(
      expectedTask.id,
      expectedTask.owner.id,
    );

    expect(findOneSpy).toHaveBeenCalled();
    expect(actualUser).toBe(expectedTask);
  });

  it('should throw exception when task is not found', async () => {
    const findOneSpy = jest
      .spyOn(repository, 'findOneByOrFail')
      .mockImplementation(findOneOrFailImplementation);

    const nonExistentTaskId = 111;
    const someUserId = 111;

    try {
      await service.findOne(nonExistentTaskId, someUserId);
      expect(findOneSpy).toThrow(EntityNotFoundError);
    } catch (err) {
      // just to show error on console
    }

    expect(findOneSpy).toHaveBeenCalled();
  });

  it('should be able to update a task', async () => {
    const [theTask] = mockedTasksList;
    const patchData: UpdateTaskDto = { title: 'After edition' };
    const expectedTask = { ...theTask, ...patchData };

    const updateSpy = jest
      .spyOn(repository, 'update')
      .mockImplementation(updateOneImplementation);

    const findAfterUpdateSpy = jest
      .spyOn(repository, 'findOneBy')
      .mockImplementation((criteria: any) => {
        const task = mockedTasksList.find((task) => task.id === criteria.id);
        const selected = { ...task, ...patchData };
        return Promise.resolve(selected);
      });

    const actualUser = await service.update(
      theTask.id,
      patchData,
      theTask.owner.id,
    );

    expect(updateSpy).toHaveBeenCalled();
    expect(findAfterUpdateSpy).toHaveBeenCalled();
    expect(actualUser).toStrictEqual(expectedTask);
  });

  it('should get exception updating inexistent task', async () => {
    const patchData: UpdateTaskDto = { title: 'will fail here' };

    const updateSpy = jest
      .spyOn(repository, 'update')
      .mockImplementation(updateOneImplementation);

    const nonExistentTaskId = 123;
    const someUserId = 111;

    try {
      await service.update(nonExistentTaskId, patchData, someUserId);
    } catch (err) {
      expect(err).toBeInstanceOf(EntityNotFoundError);
    }

    expect(updateSpy).toHaveBeenCalled();
  });

  it('should be able to delete a task', async () => {
    const [theTask] = mockedTasksList;
    const deleteSpy = jest.spyOn(repository, 'delete').mockImplementation(() =>
      Promise.resolve({
        affected: 1,
        generatedMaps: [],
        raw: '',
      } as UpdateResult),
    );

    try {
      await service.remove(theTask.id, theTask.owner.id);
    } catch (err) {
      // nothing to do
    }

    expect(deleteSpy).toHaveBeenCalled();
  });

  it('should throw exception when deleting inexistent task', async () => {
    const deleteSpy = jest.spyOn(repository, 'delete').mockImplementation(() =>
      Promise.resolve({
        affected: 0,
        generatedMaps: [],
        raw: '',
      } as UpdateResult),
    );

    const nonExistentTaskId = 111;
    const someUserId = 111;

    try {
      await service.remove(nonExistentTaskId, someUserId);
    } catch (err) {
      expect(err).toBeInstanceOf(EntityNotFoundError);
    }

    expect(deleteSpy).toHaveBeenCalled();
  });
});
