import { Test, TestingModule } from '@nestjs/testing';

import { PasswordService } from './password/password.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [UsersService, PasswordService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to list users', async () => {
    const users = await service.findAll();
    expect(users).toHaveLength(0);
  });
});
