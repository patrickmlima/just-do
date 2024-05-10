import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { UserAuthDto } from './dto/userAuth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Post('login')
  async login(@Body() userLogin: UserAuthDto, @Res() response: Response) {
    const { username, password } = userLogin;
    const user = await this.authService.validateUser(username, password);
    if (user) {
      const tokenResponse = await this.authService.issueToken(user);
      return response.status(HttpStatus.OK).send(tokenResponse);
    }

    throw new UnauthorizedException('User credentials are wrong');
  }
}
