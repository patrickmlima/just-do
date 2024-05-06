import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: true, maxLength: 100, pattern: '\\w+[\\-\\_\\w]+' })
  @IsNotEmpty()
  @MaxLength(100)
  username: string;

  @ApiProperty({ required: true, minLength: 6 })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
