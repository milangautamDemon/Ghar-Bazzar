import { Request } from "express";
import { validationResult } from "express-validator";
import { Result } from "express-validator";
import { ValidationError } from "express-validator";
import { CustomError } from "./customError";

export const payloadValidator = (req: Request) => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors = errors.array().map((obj: ValidationError) => {
      const { msg } = obj;
      return { msg };
    });

    throw new CustomError(validationErrors[0].msg, 400);
  }
  return;
};
