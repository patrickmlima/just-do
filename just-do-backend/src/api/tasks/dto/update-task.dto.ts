import { IsAlphanumeric, IsBoolean } from 'class-validator';

export class UpdateTaskDto {
  @IsAlphanumeric()
  title: string;

  @IsAlphanumeric()
  description: string;

  @IsBoolean()
  isCompleted: boolean;
}
