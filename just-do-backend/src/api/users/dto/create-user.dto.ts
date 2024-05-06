import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ required: true, maxLength: 100, pattern: '\\w+[\\-\\_\\w]+' })
  username: string;

  @ApiProperty({ required: true })
  password: string;
}
