import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength, Validate } from 'class-validator';

import { APP_CONSTANTS } from 'src/shared/constants';
import { IsValidUsername } from '../validators/username.validator';

const { inputsLengthRange, inputsPatterns } = APP_CONSTANTS;

export class CreateUserDto {
  @ApiProperty({
    required: true,
    minLength: inputsLengthRange.username.min,
    maxLength: inputsLengthRange.username.max,
    pattern: inputsPatterns.username,
  })
  @IsNotEmpty()
  @MinLength(inputsLengthRange.username.min)
  @MaxLength(inputsLengthRange.username.max)
  @Validate(IsValidUsername)
  username: string;

  @ApiProperty({
    required: true,
    minLength: inputsLengthRange.userPassword.min,
  })
  @IsNotEmpty()
  @MinLength(inputsLengthRange.userPassword.min)
  password: string;
}
