import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityNotFoundError,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { Task } from '../../database/entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, ownerId: number) {
    const taskData = {
      ...createTaskDto,
      owner: {
        id: ownerId,
      },
    };
    const task = this.taskRepository.create(taskData);
    return this.taskRepository.save(task);
  }

  async findAll(whereOptions?: FindManyOptions<Task>) {
    return this.taskRepository.findAndCount(whereOptions);
  }

  async findOne(id: number, ownerId: number) {
    return this.taskRepository.findOneByOrFail({ id, owner: { id: ownerId } });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, ownerId: number) {
    const options = { id, owner: { id: ownerId } };
    const result = await this.taskRepository.update(options, updateTaskDto);
    if (result.affected === 0) {
      throw new EntityNotFoundError(Task, options);
    }
    return this.taskRepository.findOneBy(options);
  }

  async remove(id: number, ownerId: number) {
    const options: FindOptionsWhere<Task> = { id, owner: { id: ownerId } };
    const result = await this.taskRepository.delete(options);
    if (result.affected === 0) {
      throw new EntityNotFoundError(Task, options);
    }
  }
}
