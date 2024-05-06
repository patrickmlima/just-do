import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
@ApiTags('Tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
