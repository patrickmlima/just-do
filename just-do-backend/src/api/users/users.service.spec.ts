import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';

import { User } from 'src/database/entities/user.entity';
import { MockDbImplementation } from '../../../test/mocks/db-operations';
import { mockedUsersList } from '../../../test/mocks/users.mock';
import { PasswordService } from './password/password.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;
  let mockedDbOperations: MockDbImplementation<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        UsersService,
        PasswordService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  beforeEach(async () => {
    mockedDbOperations = new MockDbImplementation<User>(mockedUsersList, User);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to list users', async () => {
    const findAllSpy = jest
      .spyOn(repository, 'findBy')
      .mockImplementation(() => mockedDbOperations.findAll());

    const users = await service.findAll();

    expect(findAllSpy).toHaveBeenCalled();
    expect(users).toHaveLength(mockedUsersList.length);
  });

  it('should be able to get a single user', async () => {
    const [theUser] = mockedUsersList;
    const expectedUser = {
      ...theUser,
    };
    delete expectedUser.password;

    const findOneSpy = jest
      .spyOn(repository, 'findOneByOrFail')
      .mockImplementation((...args) =>
        mockedDbOperations.findOneOrFail(...args),
      );

    const actualUser = await service.findOne(expectedUser.id);

    expect(findOneSpy).toHaveBeenCalled();
    expect(actualUser).toStrictEqual(expectedUser);
  });

  it('should throw exception when user is not found', async () => {
    const findOneSpy = jest
      .spyOn(repository, 'findOneByOrFail')
      .mockImplementation((...args) =>
        mockedDbOperations.findOneOrFail(...args),
      );

    try {
      await service.findOne(111);
      expect(findOneSpy).toThrow(EntityNotFoundError);
    } catch (err) {
      // just to hide error on console
    }

    expect(findOneSpy).toHaveBeenCalled();
  });

  it('should be able to update a user', async () => {
    const [theUser] = mockedUsersList;
    const patchData = { username: 'onlynew' };
    const expectedUser = { ...theUser, ...patchData };
    delete expectedUser.password;

    const updateSpy = jest
      .spyOn(repository, 'update')
      .mockImplementation((...args) => mockedDbOperations.updateOne(...args));

    const findAfterUpdateSpy = jest
      .spyOn(repository, 'findOneBy')
      .mockImplementation((...args) =>
        mockedDbOperations.findOneOrFail(...args),
      );

    const actualUser = await service.update(theUser.id, patchData);

    expect(updateSpy).toHaveBeenCalled();
    expect(findAfterUpdateSpy).toHaveBeenCalled();
    expect(actualUser).toStrictEqual(expectedUser);
  });

  it('should get exception updating inexistent user', async () => {
    const patchData = { username: 'onlynew' };

    const updateSpy = jest
      .spyOn(repository, 'update')
      .mockImplementation((...args) => mockedDbOperations.updateOne(...args));

    try {
      await service.update(123, patchData);
    } catch (err) {
      expect(err).toBeInstanceOf(EntityNotFoundError);
    }

    expect(updateSpy).toHaveBeenCalled();
  });

  it('should be able to delete a user', async () => {
    const deleteSpy = jest
      .spyOn(repository, 'delete')
      .mockImplementation((...args) => mockedDbOperations.delete(...args));

    try {
      await service.remove(1);
    } catch (err) {
      // nothing to do
    }

    expect(deleteSpy).toHaveBeenCalled();
  });

  it('should throw exception when deleting inexistent user', async () => {
    const deleteSpy = jest
      .spyOn(repository, 'delete')
      .mockImplementation((...args) => mockedDbOperations.delete(...args));

    try {
      await service.remove(111);
    } catch (err) {
      expect(err).toBeInstanceOf(EntityNotFoundError);
    }

    expect(deleteSpy).toHaveBeenCalled();
  });
});
