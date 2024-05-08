import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PasswordService } from 'src/api/users/password/password.service';
import { UsersService } from 'src/api/users/users.service';
import { User } from 'src/database/entities/user.entity';
import { mockedUsersList } from '../../test/mocks/users.mock';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'justas3cr3tf0rt3sts' })],
      providers: [
        AuthService,
        UsersService,
        PasswordService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should correclty authenticate user', async () => {
    const [theUser] = mockedUsersList;
    jest
      .spyOn(UsersService.prototype, 'findByUsername')
      .mockResolvedValue(theUser);

    jest
      .spyOn(PasswordService.prototype, 'doesPassowrdMatch')
      .mockImplementation((...args) => {
        const [providedPwd] = args;
        return Promise.resolve(theUser.password === providedPwd);
      });

    const { username, password } = theUser;
    const user = await service.validateUser(username, password);

    expect(user).toBeTruthy();
  });

  it('should not authenticate user with wrong password', async () => {
    const [theUser] = mockedUsersList;

    jest
      .spyOn(UsersService.prototype, 'findByUsername')
      .mockResolvedValue({ ...theUser, password: 'somerandompwd' });

    jest
      .spyOn(PasswordService.prototype, 'doesPassowrdMatch')
      .mockImplementation((...args) => {
        const [, storedHash] = args;
        return Promise.resolve(theUser.password === storedHash);
      });

    const { username, password } = theUser;
    const user = await service.validateUser(username, password);

    expect(user).toBeNull();
  });

  it('should issue a jwt token with valid user', async () => {
    const [theUser] = mockedUsersList;

    const issuedToken = await service.issueToken(theUser);

    expect(issuedToken).toBeTruthy();
    expect(issuedToken.access_token?.length).toBeGreaterThanOrEqual(1);
  });
});
