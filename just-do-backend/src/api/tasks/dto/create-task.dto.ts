import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { APP_CONSTANTS } from 'src/shared/constants';

const { inputsLengthRange } = APP_CONSTANTS;

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(inputsLengthRange.taskTitle.min)
  @MaxLength(inputsLengthRange.taskTitle.max)
  @ApiProperty({
    required: true,
    minLength: inputsLengthRange.taskTitle.min,
    maxLength: inputsLengthRange.taskTitle.max,
  })
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(inputsLengthRange.taskDescription.max)
  @ApiProperty({
    required: false,
    maxLength: inputsLengthRange.taskDescription.max,
  })
  description: string;
}
