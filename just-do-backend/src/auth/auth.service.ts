import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { PasswordService } from 'src/api/users/password/password.service';
import { UsersService } from 'src/api/users/users.service';
import { User } from 'src/database/entities/user.entity';
import { AccessTokenPayload } from 'src/shared/types/auth.types';

@Injectable()
export class AuthService {
  private accessTokenType = 'Bearer';
  constructor(
    private readonly userService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    try {
      const user = await this.userService.findByUsername(username);

      const isPasswordCorrect = await this.passwordService.doesPassowrdMatch(
        password,
        user.password,
      );

      if (isPasswordCorrect) {
        return user;
      }
    } catch (err) {
      // do nothing
    }

    return null;
  }

  async issueToken(user: User) {
    const payload = {
      sub: user.id,
      username: user.username,
    };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1 day' }),
    };
  }

  isTokenValid(token: string | undefined) {
    try {
      this.jwtService.verify(token);
      return true;
    } catch (err) {
      return false;
    }
  }

  getTokenPayload(token: string) {
    return this.jwtService.decode<AccessTokenPayload>(token);
  }

  getTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === this.accessTokenType ? token : undefined;
  }

  getTokenPayloadFromHeader(request: Request): AccessTokenPayload | undefined {
    const token = this.getTokenFromHeader(request);
    if (token) {
      return this.getTokenPayload(token);
    }
    return undefined;
  }
}
