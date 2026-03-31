import { CustomError } from "@utils/customError";
import { responseToClient, serverError } from "@utils/response";
import { Response } from "express";

export const errorHandler = (error: Error, res: Response) => {
  if (error instanceof CustomError) {
    return responseToClient(res, false, error.statusCode, error.message);
  } else {
    return serverError(res);
  }
};
