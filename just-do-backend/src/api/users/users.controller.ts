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
import { Response } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from 'src/database/entities/user.entity';
import { APIDataResponse } from 'src/shared/responses/api-data-response';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Public } from 'src/shared/decorators/public-request.decorator';

@Controller('users')
@ApiTags('Users')
@ApiUnauthorizedResponse()
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  @Public()
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    try {
      await this.usersService.create(createUserDto);
      response.status(HttpStatus.CREATED);
      response.send();
    } catch (err: any) {
      let errorData = {
        message: err?.message,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      };
      if (err.detail?.includes('already exists')) {
        errorData = {
          message: `User with username '${createUserDto.username}' already exists.`,
          code: HttpStatus.BAD_REQUEST,
        };
      }
      throw new HttpException(errorData.message, errorData.code);
    }
  }

  @Get()
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async findAll(@Res() response: Response) {
    const list = await this.usersService.findAll();
    const apiResponse = new APIDataResponse<User[]>(list);
    response.status(HttpStatus.OK).send(apiResponse);
  }

  @Get(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiBearerAuth('bearerAuth')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOne(+id);
      return user;
    } catch (err) {
      let message = err?.message ?? err?.detail;
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

      if (err instanceof EntityNotFoundError) {
        message = `User ${id} not found`;
        statusCode = HttpStatus.NOT_FOUND;
      }
      throw new HttpException(message, statusCode);
    }
  }

  @Patch(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiBearerAuth('bearerAuth')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.usersService.update(+id, updateUserDto);
      return user;
    } catch (err) {
      let message = err?.message ?? err?.detail;
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

      if (err instanceof EntityNotFoundError) {
        message = `User ${id} not found`;
        statusCode = HttpStatus.NOT_FOUND;
      }

      if (err instanceof QueryFailedError) {
        message = `Could not update user ${id}: ${err.message}`;
        statusCode = HttpStatus.BAD_REQUEST;
      }

      throw new HttpException(message, statusCode);
    }
  }

  @Delete(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiBearerAuth('bearerAuth')
  async remove(@Param('id') id: string) {
    try {
      await this.usersService.remove(+id);
    } catch (err) {
      const excData = {
        message: err?.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };

      if (err instanceof EntityNotFoundError) {
        excData.message = `User ${id} not found`;
        excData.statusCode = HttpStatus.NOT_FOUND;
      }
      throw new HttpException(excData.message, excData.statusCode);
    }
  }
}
