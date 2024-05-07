import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, MaxLength } from 'class-validator';

import { APP_CONSTANTS } from 'src/shared/constants';

const { inputsLengthRange } = APP_CONSTANTS;

export class UpdateTaskDto {
  @IsString()
  @MaxLength(inputsLengthRange.taskTitle.max)
  @ApiProperty({ required: false, maxLength: inputsLengthRange.taskTitle.max })
  title?: string;

  @IsString()
  @MaxLength(inputsLengthRange.taskDescription.max)
  @ApiProperty({
    required: false,
    maxLength: inputsLengthRange.taskDescription.max,
  })
  description?: string;

  @IsBoolean()
  @ApiProperty({ required: false })
  isCompleted?: boolean;
}
