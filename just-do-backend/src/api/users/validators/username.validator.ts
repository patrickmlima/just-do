/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { APP_CONSTANTS } from 'src/shared/constants';

@ValidatorConstraint({ name: 'isValidUsername', async: false })
export class IsValidUsername implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    const pattern = APP_CONSTANTS.inputsPatterns.username;
    const rgx = new RegExp(pattern);

    return typeof value === 'string' && rgx.test(value);
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    return 'Username must begin with a letter or underscore and then, must only contains letters, numbers, underscores and non-consecutive dots';
  }
}
