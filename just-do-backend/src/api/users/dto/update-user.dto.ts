import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({ required: false, maxLength: 100, pattern: '\\w+[\\-\\_\\w]+' })
  username?: string;
}
