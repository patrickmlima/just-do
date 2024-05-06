import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
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
import { Response } from 'express';

import { User } from 'src/database/entities/user.entity';
import { APIDataResponse } from 'src/shared/responses/api-data-response';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private logger = new Logger(UsersController.name);

  @Post()
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
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
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
