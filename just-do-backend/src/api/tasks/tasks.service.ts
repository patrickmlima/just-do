import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

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
    return this.taskRepository.update({ id }, updateTaskDto);
  }

  async remove(id: number) {
    return this.taskRepository.delete({ id });
  }
}
