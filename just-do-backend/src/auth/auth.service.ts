import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PasswordService } from 'src/api/users/password/password.service';
import { UsersService } from 'src/api/users/users.service';
import { User } from 'src/database/entities/user.entity';

@Injectable()
export class AuthService {
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
}
