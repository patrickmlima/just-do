import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from 'src/database/entities/user.entity';
import { APP_CONSTANTS } from 'src/constants';

@Injectable()
export class UsersService {
  constructor(
    @Inject(APP_CONSTANTS.providers.UserRepository)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;
    return this.userRepository.create({ username, password });
  }

  findAll(options?: Partial<User>) {
    return this.userRepository.findBy(options ?? {});
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update({ id }, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete({ id });
  }
}
