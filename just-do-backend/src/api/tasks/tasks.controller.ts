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
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { EntityNotFoundError } from 'typeorm';

import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Task } from 'src/database/entities/task.entity';
import { APIDataResponse } from 'src/shared/responses/api-data-response';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
@ApiTags('Tasks')
@ApiUnauthorizedResponse()
@ApiBearerAuth('bearerAuth')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  async create(
    @Req() request: Request,
    @Body() createTaskDto: CreateTaskDto,
    @Res() response: Response,
  ) {
    try {
      const payload = this.authService.getTokenPayloadFromHeader(request);
      const ownerId = parseInt(payload?.sub, 10);
      const task = await this.tasksService.create(createTaskDto, ownerId);
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
  async findAll(@Req() request: Request) {
    try {
      const payload = this.authService.getTokenPayloadFromHeader(request);
      const ownerId = parseInt(payload?.sub, 10);

      const [list] = await this.tasksService.findAll({
        where: { owner: { id: ownerId } },
        order: { createdAt: 'DESC', title: 'ASC' },
      });
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
  async findOne(@Req() request: Request, @Param('id') id: number) {
    try {
      const payload = this.authService.getTokenPayloadFromHeader(request);
      const ownerId = parseInt(payload?.sub, 10);

      const task = await this.tasksService.findOne(id, ownerId);
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
  async update(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    try {
      const payload = this.authService.getTokenPayloadFromHeader(request);
      const ownerId = parseInt(payload?.sub, 10);

      const updatedTask = await this.tasksService.update(
        id,
        updateTaskDto,
        ownerId,
      );
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
  async remove(@Param('id') id: number, @Req() request: Request) {
    try {
      const payload = this.authService.getTokenPayloadFromHeader(request);
      const ownerId = parseInt(payload?.sub, 10);

      await this.tasksService.remove(id, ownerId);
    } catch (err) {
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

      if (err instanceof EntityNotFoundError) {
        statusCode = HttpStatus.NOT_FOUND;
      }

      throw new HttpException(err?.message, statusCode);
    }
  }
}
