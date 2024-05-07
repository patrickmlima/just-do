import { AppConstants } from './types/config.types';

export const APP_CONSTANTS: AppConstants = {
  inputsLengthRange: {
    username: { min: 1, max: 100 },
    userPassword: { min: 6 },
    taskTitle: { min: 1, max: 150 },
    taskDescription: { min: 0, max: 1024 },
  },
  inputsPatterns: {
    username: '^(?!.*[.]{2})[a-zA-Z_][a-zA-Z0-9_.]*$',
  },
};
