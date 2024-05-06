import { Inject, Injectable } from '@nestjs/common';

import { APP_CONSTANTS } from 'src/constants';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordService } from './password/password.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(APP_CONSTANTS.providers.UserRepository)
    private userRepository: Repository<User>,
    private passwordService: PasswordService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;
    const hashedPwd = await this.passwordService.hashPassword(password);
    const user = this.userRepository.create({ username, password: hashedPwd });
    return this.userRepository.save(user);
  }

  async findAll(options?: Partial<User>) {
    return this.userRepository.findBy(options ?? {});
  }

  async findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update({ id }, updateUserDto);
  }

  async remove(id: number) {
    return this.userRepository.delete({ id });
  }
}
