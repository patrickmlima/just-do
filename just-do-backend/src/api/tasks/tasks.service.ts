import { Injectable } from '@nestjs/common';
import { EntityNotFoundError, FindOptionsWhere, Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../../database/entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const taskData = {
      ...createTaskDto,
      owner: {
        id: createTaskDto.owner,
      },
    };
    const task = this.taskRepository.create(taskData);
    return this.taskRepository.save(task);
  }

  async findAll() {
    return this.taskRepository.findAndCount();
  }

  async findOne(id: number) {
    return this.taskRepository.findOneByOrFail({ id });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const options = { id };
    const result = await this.taskRepository.update(options, updateTaskDto);
    if (result.affected === 0) {
      throw new EntityNotFoundError(Task, options);
    }
    return this.taskRepository.findOneBy(options);
  }

  async remove(id: number) {
    const options: FindOptionsWhere<Task> = { id };
    const result = await this.taskRepository.delete(options);
    if (result.affected === 0) {
      throw new EntityNotFoundError(Task, options);
    }
  }
}
