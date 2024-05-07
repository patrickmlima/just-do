import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;
  const textPassword = 'justatestpassword';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash a password', async () => {
    const hashedPwd = await service.hashPassword(textPassword);
    expect(hashedPwd).toBeDefined();
    expect(hashedPwd?.length).toBeGreaterThan(textPassword.length);
  });

  it('should correctly match a password hash', async () => {
    const hashedPwd = await service.hashPassword(textPassword);
    const otherTextPassword = textPassword.split('').join(''); // new string with same content
    const passwordMatch = await service.doesPassowrdMatch(
      otherTextPassword,
      hashedPwd,
    );

    expect(passwordMatch).toBeTruthy();
  });

  it('should correctly unmatch a password hash', async () => {
    const hashedPwd = await service.hashPassword(textPassword);
    const plainTextPwd = 'justawrongpassword';
    const passwordMatch = await service.doesPassowrdMatch(
      plainTextPwd,
      hashedPwd,
    );

    expect(passwordMatch).toBeFalsy();
  });
});
