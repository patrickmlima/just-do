import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true, maxLength: 150 })
  title: string;

  @IsString()
  @ApiProperty({ maxLength: 1024 })
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ minimum: 1 })
  owner: number;
}
