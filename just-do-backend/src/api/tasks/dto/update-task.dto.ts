import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @ApiProperty({ required: false, maxLength: 150 })
  title?: string;

  @IsString()
  @ApiProperty({ required: false, maxLength: 1024 })
  description?: string;

  @IsBoolean()
  @ApiProperty({ required: false })
  isCompleted?: boolean;
}
