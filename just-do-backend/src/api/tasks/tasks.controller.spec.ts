import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { EntityNotFoundError, Repository } from 'typeorm';

import { Task } from 'src/database/entities/task.entity';
import { mockedTasksList } from '../../../test/mocks/tasks.mock';
import { mockedUsersList } from '../../../test/mocks/users.mock';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;
  let app: INestApplication;
  const URI = '/tasks';

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
        ConfigService,
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);

    app = module.createNestApplication();
    const configService = app.get(ConfigService);

    await app.listen(configService.get('application')?.port);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should list tasks', async () => {
    const listSpy = jest
      .spyOn(TasksService.prototype, 'findAll')
      .mockImplementation(() =>
        Promise.resolve([mockedTasksList, mockedTasksList.length]),
      );

    const response = await request(app.getHttpServer()).get(URI);

    const expectedData = JSON.parse(JSON.stringify(mockedTasksList));
    const actualData = response.body?.data;

    expect(listSpy).toHaveBeenCalled();
    expect(response.status).toBe(HttpStatus.OK);
    expect(actualData).toHaveLength(expectedData.length);
    expect(actualData).toStrictEqual(expectedData);
  });

  it('should create a task', async () => {
    const createDto: CreateTaskDto = {
      title: 'firsttask',
      description: 'this is a short description',
      owner: 1,
    };

    const [onwer] = mockedUsersList;

    const createSpy = jest
      .spyOn(TasksService.prototype, 'create')
      .mockResolvedValue({
        id: 1,
        title: createDto.title,
        description: createDto.description,
        createdAt: new Date(),
        updatedAt: new Date(),
        isComplete: false,
        owner: {
          id: createDto.owner,
          ...onwer,
        },
      });

    const response = await request(app.getHttpServer())
      .post(URI)
      .send(createDto);

    expect(createSpy).toHaveBeenCalled();
    expect(response.status).toBe(HttpStatus.CREATED);
  });

  it('should get a task', async () => {
    const [theTask] = mockedTasksList;

    const findOneSpy = jest
      .spyOn(TasksService.prototype, 'findOne')
      .mockImplementation((id) =>
        Promise.resolve(mockedTasksList.find((task) => task.id === id)),
      );

    const response = await request(app.getHttpServer()).get(
      `${URI}/${theTask.id}`,
    );

    expect(findOneSpy).toHaveBeenCalled();
    expect(response.status).toBe(HttpStatus.OK);

    const expectedData = JSON.parse(JSON.stringify(theTask));
    const acualData = response.body;
    expect(acualData).toStrictEqual(expectedData);
  });

  it('should get error when finding a non-existent task', async () => {
    const findOneSpy = jest
      .spyOn(TasksService.prototype, 'findOne')
      .mockImplementation((id) => {
        const task = mockedTasksList.find((task) => task.id === id);
        return new Promise((resolve, reject) => {
          if (!task) {
            return reject(new EntityNotFoundError(Task, { id }));
          }
          resolve(task);
        });
      });

    const response = await request(app.getHttpServer()).get(`${URI}/${112}`);

    expect(findOneSpy).toHaveBeenCalled();
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('should delete a task', async () => {
    const [theTask] = mockedTasksList;

    const findOneSpy = jest
      .spyOn(TasksService.prototype, 'remove')
      .mockImplementation((id) => {
        const task = mockedTasksList.find((task) => task.id === id);
        return new Promise((resolve, reject) => {
          if (!task) {
            return reject(new EntityNotFoundError(Task, { id }));
          }
          resolve();
        });
      });

    const response = await request(app.getHttpServer()).delete(
      `${URI}/${theTask.id}`,
    );

    expect(findOneSpy).toHaveBeenCalled();
    expect(response.status).toBe(HttpStatus.OK);
  });

  it('should get error when deleting a non-nexistent task', async () => {
    const findOneSpy = jest
      .spyOn(TasksService.prototype, 'remove')
      .mockImplementation((id) => {
        const task = mockedTasksList.find((task) => task.id === id);
        return new Promise((resolve, reject) => {
          if (!task) {
            return reject(new EntityNotFoundError(Task, { id }));
          }
          resolve();
        });
      });

    const response = await request(app.getHttpServer()).delete(`${URI}/${123}`);

    expect(findOneSpy).toHaveBeenCalled();
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
  });
});
