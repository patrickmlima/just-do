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
  description?: String;
  ownerId: number;

  constructor(title: string, ownerId: number, description?: string) {
    this.title = title;
    this.description = description;
    this.ownerId = ownerId;
  }
}

export class TaskPatchDto {
  title?: string;
  description?: String;
  ownerId?: number;
  isCompleted?: boolean;

  constructor(
    title: string,
    ownerId: number,
    isCompleted: boolean,
    description?: string,
  ) {
    this.title = title;
    this.description = description;
    this.ownerId = ownerId;
    this.isCompleted = isCompleted;
  }
}
