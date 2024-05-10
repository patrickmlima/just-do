import { User } from './user.type';

export type Task = {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  owner: Partial<User>;
};

export class TaskCreateDto {
  title: string;
  description?: string | null;

  constructor(title: string = '', description?: string | null) {
    this.title = title;
    this.description = description;
  }
}

export class TaskPatchDto {
  title?: string;
  description?: String;
  isCompleted?: boolean;

  constructor(title?: string, isCompleted?: boolean, description?: string) {
    this.title = title;
    this.description = description;
    this.isCompleted = isCompleted;
  }
}
