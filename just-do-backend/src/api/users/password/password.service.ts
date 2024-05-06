import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private saltRounds = 10;

  async hashPassword(plainTextPwd: string) {
    return bcrypt.hash(plainTextPwd, this.saltRounds);
  }

  async doesPassowrdMatch(providedPwd: string, storedHash: string) {
    return bcrypt.compare(providedPwd, storedHash);
  }
}
