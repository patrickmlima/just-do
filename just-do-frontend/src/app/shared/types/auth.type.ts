export type LoginResponse = {
  access_token: string;
};

export type TokenPayload = {
  sub: string;
  username: string;
};
