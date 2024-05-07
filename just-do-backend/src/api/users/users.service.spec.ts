import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  EntityNotFoundError,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';

import { User } from 'src/database/entities/user.entity';
import { mockedUsersList } from '../../../test/mocks/users.mock';
import { PasswordService } from './password/password.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const findOneOrFailImplementation = async (
    where: FindOptionsWhere<User> | FindOptionsWhere<User>[],
  ) => {
    const { id } = (where ?? {}) as FindOptionsWhere<User>;
    const foundUser = mockedUsersList.find((user) => user.id === id);
    return new Promise<User>((resolve, reject) =>
      foundUser
        ? resolve(foundUser)
        : reject(new EntityNotFoundError(User, where)),
    );
  };

  const updateOneImplementation = (criteria: any) => {
    const { id } = criteria;
    const foundUser = mockedUsersList.find((user) => user.id === id);
    return new Promise<UpdateResult>((resolve) => {
      return resolve({
        affected: foundUser ? 1 : 0,
        raw: '',
        generatedMaps: [],
      });
    });
  };

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

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to list users', async () => {
    mockedUsersList;
    const findAllSpy = jest
      .spyOn(repository, 'findBy')
      .mockResolvedValue(mockedUsersList);
    const users = await service.findAll();

    expect(findAllSpy).toHaveBeenCalled();
    expect(users).toHaveLength(mockedUsersList.length);
  });

  it('should be able to get a single user', async () => {
    const [expectedUser] = mockedUsersList;
    const findOneSpy = jest
      .spyOn(repository, 'findOneByOrFail')
      .mockImplementation(findOneOrFailImplementation);

    const actualUser = await service.findOne(expectedUser.id);

    expect(findOneSpy).toHaveBeenCalled();
    expect(actualUser).toBe(expectedUser);
  });

  it('should throw exception when user is not found', async () => {
    const findOneSpy = jest
      .spyOn(repository, 'findOneByOrFail')
      .mockImplementation(findOneOrFailImplementation);

    try {
      await service.findOne(111);
      expect(findOneSpy).toThrow(EntityNotFoundError);
    } catch (err) {
      // just to show error on console
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
      .mockImplementation(updateOneImplementation);

    const findAfterUpdateSpy = jest
      .spyOn(repository, 'findOneBy')
      .mockImplementation((criteria: any) => {
        const user = mockedUsersList.find((user) => user.id === criteria.id);
        const selectUser = { ...user, ...patchData };
        delete selectUser.password;
        return Promise.resolve(selectUser);
      });

    const actualUser = await service.update(theUser.id, patchData);

    expect(updateSpy).toHaveBeenCalled();
    expect(findAfterUpdateSpy).toHaveBeenCalled();
    expect(actualUser).toStrictEqual(expectedUser);
  });

  it('should get exception updating inexistent user', async () => {
    const patchData = { username: 'onlynew' };

    const updateSpy = jest
      .spyOn(repository, 'update')
      .mockImplementation(updateOneImplementation);

    try {
      await service.update(123, patchData);
    } catch (err) {
      expect(err).toBeInstanceOf(EntityNotFoundError);
    }

    expect(updateSpy).toHaveBeenCalled();
  });

  it('should be able to delete a user', async () => {
    const deleteSpy = jest.spyOn(repository, 'delete').mockImplementation(() =>
      Promise.resolve({
        affected: 1,
        generatedMaps: [],
        raw: '',
      } as UpdateResult),
    );

    try {
      await service.remove(1);
    } catch (err) {
      // nothing to do
    }

    expect(deleteSpy).toHaveBeenCalled();
  });

  it('should throw exception when deleting inexistent user', async () => {
    const deleteSpy = jest.spyOn(repository, 'delete').mockImplementation(() =>
      Promise.resolve({
        affected: 0,
        generatedMaps: [],
        raw: '',
      } as UpdateResult),
    );

    try {
      await service.remove(111);
    } catch (err) {
      expect(err).toBeInstanceOf(EntityNotFoundError);
    }

    expect(deleteSpy).toHaveBeenCalled();
  });
});
