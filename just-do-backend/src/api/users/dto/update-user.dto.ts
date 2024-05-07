import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, MaxLength, MinLength, Validate } from 'class-validator';
import { APP_CONSTANTS } from 'src/shared/constants';
import { IsValidUsername } from '../validators/username.validator';

const { inputsLengthRange } = APP_CONSTANTS;

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    required: true,
    minLength: inputsLengthRange.username.min,
    maxLength: inputsLengthRange.username.max,
    pattern: '^(?![._-])[a-zA-Z0-9_.-]+$',
  })
  @IsNotEmpty()
  @MinLength(inputsLengthRange.username.min)
  @MaxLength(inputsLengthRange.username.max)
  @Validate(IsValidUsername)
  username?: string;
}
