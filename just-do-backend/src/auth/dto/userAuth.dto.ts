import { ApiProperty } from '@nestjs/swagger';

export class UserAuthDto {
  @ApiProperty({ required: true })
  username: string;

  @ApiProperty({ required: true })
  password: string;
}
