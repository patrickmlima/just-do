export type Range = { min?: number; max?: number };

export type InputLengthRange = Record<string, Range>;

export type ApplicationInputsRange = {
  username: Range;
  userPassword: Range;
  taskTitle: Range;
  taskDescription: Range;
};

export type InputPatterns = {
  username: string;
};

export type AppConstants = {
  inputsLengthRange: ApplicationInputsRange;
  inputsPatterns: InputPatterns;
};
