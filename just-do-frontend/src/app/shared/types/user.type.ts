export type User = {
  id: number;
  username: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserLogin = {
  username: string;
  password: string;
};
