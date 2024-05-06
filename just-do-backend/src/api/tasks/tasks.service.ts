import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { APP_CONSTANTS } from 'src/constants';
import { Task } from 'src/database/entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @Inject(APP_CONSTANTS.providers.TaskRepository)
    private readonly taskRepository: Repository<Task>,
  ) {}

  create(createTaskDto: CreateTaskDto) {
    const taskData = {
      ...createTaskDto,
      owner: {
        id: createTaskDto.owner,
      },
    };
    const task = this.taskRepository.create(taskData);
    return this.taskRepository.save(task);
  }

  findAll() {
    return this.taskRepository.findAndCount();
  }

  findOne(id: number) {
    return this.taskRepository.findOneByOrFail({ id });
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return this.taskRepository.update({ id }, updateTaskDto);
  }

  remove(id: number) {
    return this.taskRepository.delete({ id });
  }
}
