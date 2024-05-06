import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ maxLength: 100, pattern: '\\w+[\\-\\_\\w]+' })
  @IsNotEmpty()
  @MaxLength(100)
  username?: string;
}
