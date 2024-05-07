import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
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
import { APIDataResponse } from 'src/shared/responses/api-data-response';
import { Task } from 'src/database/entities/task.entity';
import { Response } from 'express';
import { EntityNotFoundError } from 'typeorm';

@Controller('tasks')
@ApiTags('Tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Res() response: Response,
  ) {
    try {
      const task = await this.tasksService.create(createTaskDto);
      response.status(HttpStatus.CREATED).send(new APIDataResponse<Task>(task));
    } catch (err) {
      throw new HttpException(
        err?.message ?? err?.detail,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  async findAll() {
    try {
      const [list] = await this.tasksService.findAll();
      return new APIDataResponse<Task[]>(list);
    } catch (err: any) {
      throw new HttpException(err?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  async findOne(@Param('id') id: string) {
    try {
      const task = await this.tasksService.findOne(+id);
      return task;
    } catch (err) {
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

      if (err instanceof EntityNotFoundError) {
        statusCode = HttpStatus.NOT_FOUND;
      }

      throw new HttpException(err?.message, statusCode);
    }
  }

  @Patch(':id')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    try {
      const updatedTask = await this.tasksService.update(+id, updateTaskDto);
      return updatedTask;
    } catch (err) {
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

      if (err instanceof EntityNotFoundError) {
        statusCode = HttpStatus.NOT_FOUND;
      }

      throw new HttpException(err?.message, statusCode);
    }
  }

  @Delete(':id')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  async remove(@Param('id') id: string) {
    try {
      await this.tasksService.remove(+id);
    } catch (err) {
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

      if (err instanceof EntityNotFoundError) {
        statusCode = HttpStatus.NOT_FOUND;
      }

      throw new HttpException(err?.message, statusCode);
    }
  }
}
