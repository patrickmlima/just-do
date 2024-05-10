import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { UserAuthDto } from './dto/userAuth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Post('login')
  async login(@Body() userLogin: UserAuthDto) {
    const { username, password } = userLogin;
    const user = await this.authService.validateUser(username, password);
    if (user) {
      const tokenResponse = await this.authService.issueToken(user);
      return tokenResponse;
    }
  }
}
