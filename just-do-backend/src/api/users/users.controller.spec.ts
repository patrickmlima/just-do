import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { EntityNotFoundError, Repository } from 'typeorm';

import { User } from 'src/database/entities/user.entity';
import { mockedUsersList } from '../../../test/mocks/users.mock';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordService } from './password/password.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        PasswordService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        ConfigService,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);

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

  it('should list users', async () => {
    const listSpy = jest
      .spyOn(UsersService.prototype, 'findAll')
      .mockImplementation(() => Promise.resolve(mockedUsersList));

    const response = await request(app.getHttpServer()).get('/users');

    const expectedData = JSON.parse(JSON.stringify(mockedUsersList));
    const actualData = response.body?.data;

    expect(listSpy).toHaveBeenCalled();
    expect(response.status).toBe(HttpStatus.OK);
    expect(actualData).toHaveLength(expectedData.length);
    expect(actualData).toStrictEqual(expectedData);
  });

  it('should create a user', async () => {
    const createUser: CreateUserDto = {
      username: 'newuser',
      password: 'simplepassword',
    };

    const createSpy = jest
      .spyOn(UsersService.prototype, 'create')
      .mockResolvedValue({
        id: 1,
        username: CreateUserDto.name,
        password: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        tasks: [],
      });

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(createUser);

    expect(createSpy).toHaveBeenCalled();
    expect(response.status).toBe(HttpStatus.CREATED);
  });

  it('should get a user', async () => {
    const [theUser] = mockedUsersList;

    const findOneSpy = jest
      .spyOn(UsersService.prototype, 'findOne')
      .mockImplementation((id) =>
        Promise.resolve(mockedUsersList.find((user) => user.id === id)),
      );

    const response = await request(app.getHttpServer()).get(
      `/users/${theUser.id}`,
    );

    expect(findOneSpy).toHaveBeenCalled();
    expect(response.status).toBe(HttpStatus.OK);

    const expectedData = JSON.parse(JSON.stringify(theUser));
    const acualData = response.body;
    expect(acualData).toStrictEqual(expectedData);
  });

  it('should get error when finding a non-existent user', async () => {
    const findOneSpy = jest
      .spyOn(UsersService.prototype, 'findOne')
      .mockImplementation((id) => {
        const user = mockedUsersList.find((user) => user.id === id);
        return new Promise((resolve, reject) => {
          if (!user) {
            return reject(new EntityNotFoundError(User, { id }));
          }
          resolve(user);
        });
      });

    const response = await request(app.getHttpServer()).get(`/users/${112}`);

    expect(findOneSpy).toHaveBeenCalled();
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('should delete a user', async () => {
    const [theUser] = mockedUsersList;

    const findOneSpy = jest
      .spyOn(UsersService.prototype, 'remove')
      .mockImplementation((id) => {
        const user = mockedUsersList.find((user) => user.id === id);
        return new Promise((resolve, reject) => {
          if (!user) {
            return reject(new EntityNotFoundError(User, { id }));
          }
          resolve();
        });
      });

    const response = await request(app.getHttpServer()).delete(
      `/users/${theUser.id}`,
    );

    expect(findOneSpy).toHaveBeenCalled();
    expect(response.status).toBe(HttpStatus.OK);
  });

  it('should get error when deleting a non-nexistent user', async () => {
    const findOneSpy = jest
      .spyOn(UsersService.prototype, 'remove')
      .mockImplementation((id) => {
        const user = mockedUsersList.find((user) => user.id === id);
        return new Promise((resolve, reject) => {
          if (!user) {
            return reject(new EntityNotFoundError(User, { id }));
          }
          resolve();
        });
      });

    const response = await request(app.getHttpServer()).delete(`/users/${123}`);

    expect(findOneSpy).toHaveBeenCalled();
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
  });
});
