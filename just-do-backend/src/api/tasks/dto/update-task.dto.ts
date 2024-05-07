import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @ApiProperty({ maxLength: 150 })
  title?: string;

  @IsString()
  @ApiProperty({ maxLength: 1024 })
  description?: string;

  @IsBoolean()
  @ApiProperty()
  isCompleted?: boolean;
}
