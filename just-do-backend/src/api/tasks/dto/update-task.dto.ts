import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

import { APP_CONSTANTS } from 'src/shared/constants';

const { inputsLengthRange } = APP_CONSTANTS;

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MaxLength(inputsLengthRange.taskTitle.max, { always: false })
  @ApiProperty({ required: false, maxLength: inputsLengthRange.taskTitle.max })
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(inputsLengthRange.taskDescription.max)
  @ApiProperty({
    required: false,
    maxLength: inputsLengthRange.taskDescription.max,
  })
  description?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  isComplete?: boolean;
}
