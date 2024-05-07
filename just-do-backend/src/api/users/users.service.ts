import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, FindOptionsWhere, Repository } from 'typeorm';

import { User } from 'src/database/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordService } from './password/password.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
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
    const options: FindOptionsWhere<User> = { id };
    return this.userRepository.findOneByOrFail(options);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const options: FindOptionsWhere<User> = { id };
    const result = await this.userRepository.update(options, updateUserDto);
    if (result.affected > 0) {
      return this.userRepository.findOneBy(options);
    }
    throw new EntityNotFoundError(User, options);
  }

  async remove(id: number) {
    const options: FindOptionsWhere<User> = { id };
    const result = await this.userRepository.delete(options);
    if (result.affected === 0) {
      throw new EntityNotFoundError(User, options);
    }
  }
}
