import { IsAlphanumeric, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  title: string;

  @IsAlphanumeric()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  owner: number;
}
